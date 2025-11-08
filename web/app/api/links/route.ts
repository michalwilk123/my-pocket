import { NextRequest, NextResponse } from "next/server";

import { createClientWithAuth } from "@/lib/supabase/api";
import { Database } from "@/lib/supabase/database.types";
import { createDB } from "@/lib/db";

interface CreateLinkBody {
  title: string;
  url: string;
  note: string;
  tags: string[];
}

interface ValidatedRequest {
  title: string;
  url: string;
  note: string;
  trimmedTags: string[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function parseAndValidateRequest(request: NextRequest): Promise<ValidatedRequest> {
  // NOTE: I should use zod :)
  let body: CreateLinkBody;
  
  try {
    body = await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }

  if (!body.title || !body.url) {
    throw new Error("Title and URL are required");
  }

  const trimmedTags = (body.tags || [])
    .map(t => t.trim())
    .filter(t => t.length > 0);

  return {
    title: body.title,
    url: body.url,
    note: body.note || "",
    trimmedTags,
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: "Missing authorization header" },
      { status: 401, headers: corsHeaders }
    );
  }

  let validatedData: ValidatedRequest;
  try {
    validatedData = await parseAndValidateRequest(request);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Validation failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400, headers: corsHeaders }
    );
  }

  const supabase = createClientWithAuth(authHeader);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Invalid or expired authorization token" },
      { status: 401, headers: corsHeaders }
    );
  }

  const userId = user.id;
  const db = createDB(supabase);

  const insertData: Database["public"]["Tables"]["mypocket_link"]["Insert"] = {
    user_id: userId,
    title: validatedData.title,
    url: validatedData.url,
    note: validatedData.note,
    image: "",
  };

  const link = await db.links.mutate.insert(insertData);

  if (validatedData.trimmedTags.length > 0) {
    const tagsToUpsert = validatedData.trimmedTags.map(label => ({
      user_id: userId,
      label,
    }));

    await db.tags.mutate.upsert(tagsToUpsert, 'user_id,label');

    const allUserTags = await db.tags.query.selectByUserId(userId);
    const tagMap = new Map(allUserTags.map(t => [t.label, t.id]));

    const tagIds = validatedData.trimmedTags
      .map(label => tagMap.get(label))
      .filter((id): id is string => id !== undefined);

    const linkTagInserts = tagIds.map(tagId => ({
      link_id: link.id,
      tag_id: tagId,
    }));

    await db.links.mutate.upsertLinkTags(linkTagInserts, 'link_id,tag_id');
  }

  return NextResponse.json({
    success: true,
    link,
  }, {
    headers: corsHeaders,
  });
}
