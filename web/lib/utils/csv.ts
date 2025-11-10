export type CsvLinkRow = {
  title: string;
  url: string;
  time_added: number;
  tags: string[];
  status: string;
};

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      fields.push(currentField);
      currentField = "";
    } else {
      currentField += char;
    }
  }

  fields.push(currentField);
  return fields;
}

type CsvFormat = "pocket" | "instapaper";

function detectCsvFormat(content: string): CsvFormat {
  const lines = content.split("\n").filter((line) => line.trim().length > 0);
  const headerLine = lines[0].toLowerCase().trim();

  if (headerLine.startsWith("url,title")) {
    return "instapaper";
  }

  return "pocket";
}

function parsePocketFormat(lines: string[]): CsvLinkRow[] {
  const dataLines = lines.slice(1);
  const rows: CsvLinkRow[] = [];

  for (const line of dataLines) {
    const fields = parseCsvLine(line);

    if (fields.length < 5) {
      continue;
    }

    const title = fields[0].trim();
    const url = fields[1].trim();
    const timeAddedStr = fields[2].trim();
    const tagsStr = fields[3].trim();
    const status = fields[4].trim();

    if (!url) {
      continue;
    }

    const timeAdded = parseInt(timeAddedStr, 10);
    const finalTimeAdded = isNaN(timeAdded)
      ? Math.floor(Date.now() / 1000)
      : timeAdded;

    const tags = tagsStr.length > 0
      ? tagsStr.split("|").map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    rows.push({
      title: title || url,
      url,
      time_added: finalTimeAdded,
      tags,
      status,
    });
  }

  return rows;
}

function parseInstapaperFormat(lines: string[]): CsvLinkRow[] {
  const dataLines = lines.slice(1);
  const rows: CsvLinkRow[] = [];

  for (const line of dataLines) {
    const fields = parseCsvLine(line);

    if (fields.length < 6) {
      continue;
    }

    const url = fields[0].trim();
    const title = fields[1].trim() || url;
    const timestampStr = fields[4].trim();

    if (!url) {
      continue;
    }

    const timeAdded = parseInt(timestampStr, 10);
    const finalTimeAdded = isNaN(timeAdded)
      ? Math.floor(Date.now() / 1000)
      : timeAdded;

    const tagsStr = fields[5].trim();
    let tags: string[] = [];

    if (tagsStr && tagsStr !== "[]") {
      const content = tagsStr.replace(/^\[|\]$/g, "").trim();
      if (content) {
        tags = content
          .split(",")
          .map((t) => t.trim().replace(/^["']|["']$/g, ""))
          .filter((t) => t.length > 0);
      }
    }

    rows.push({
      title,
      url,
      time_added: finalTimeAdded,
      tags,
      status: "unread",
    });
  }

  return rows;
}

export function parseCsvContent(content: string): CsvLinkRow[] {
  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return [];
  }

  const format = detectCsvFormat(content);

  if (format === "instapaper") {
    return parseInstapaperFormat(lines);
  }

  return parsePocketFormat(lines);
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function generateCsvContent(rows: CsvLinkRow[]): string {
  const lines: string[] = ["title,url,time_added,tags,status"];

  for (const row of rows) {
    const fields = [
      escapeCsvField(row.title),
      escapeCsvField(row.url),
      row.time_added.toString(),
      row.tags.join("|"),
      row.status,
    ];

    lines.push(fields.join(","));
  }

  return lines.join("\n");
}
