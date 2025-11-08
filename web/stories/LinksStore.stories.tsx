import { useEffect } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs";

import { useLinksStore, useTagsStore } from "@/store";

function LinksStoreDemo() {
  const {
    links,
    addLink,
    removeLink,
    updateLink,
    addTagToLink,
    removeTagFromLink,
  } = useLinksStore();
  const { tags, addTag } = useTagsStore();

  useEffect(() => {
    addTag("javascript");
    addTag("typescript");
    addTag("react");

    addLink({
      title: "Next.js Documentation",
      url: "https://nextjs.org/docs",
      note: "Comprehensive guide to Next.js features",
      tagIds: [],
      image: "https://via.placeholder.com/150",
    });
    addLink({
      title: "React Docs",
      url: "https://react.dev",
      note: "Official React documentation",
      tagIds: [],
      image: "https://via.placeholder.com/150",
    });
  }, [addLink, addTag]);

  const handleAddLink = () => {
    const title = prompt("Enter link title:");
    const url = prompt("Enter URL:");
    if (title && url) {
      addLink({
        title,
        url,
        note: "",
        tagIds: [],
        image: "",
      });
    }
  };

  const handleUpdateLink = (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;

    const title = prompt("Enter new title:", link.title);
    const url = prompt("Enter new URL:", link.url);
    if (title && url) {
      updateLink(id, {
        title,
        url,
        note: link.note,
        image: link.image,
      });
    }
  };

  const handleAddTag = (linkId: string) => {
    if (tags.length === 0) {
      alert("No tags available. Create tags first.");
      return;
    }

    const tagId = tags[0].id;
    addTagToLink(linkId, tagId);
  };

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Links Store Demo
      </h2>

      <button
        onClick={handleAddLink}
        className="mb-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Add Link
      </button>

      <div className="space-y-3">
        {links.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No links yet. Click Add Link.
          </p>
        )}
        {links.map((link) => (
          <div
            key={link.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              {link.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{link.url}</p>

            <div className="mt-2 flex flex-wrap gap-1">
              {link.tags.map((tag) => {
                const fullTag = tags.find((t) => t.id === tag.id);
                return (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2 py-0.5 text-xs"
                  >
                    #{fullTag?.label || "unknown"}
                    <button
                      onClick={() => removeTagFromLink(link.id, tag.id)}
                      className="text-destructive hover:text-destructive/70"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleUpdateLink(link.id)}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-primary/10"
              >
                Edit
              </button>
              <button
                onClick={() => handleAddTag(link.id)}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-primary/10"
              >
                Add Tag
              </button>
              <button
                onClick={() => removeLink(link.id)}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          Store State:
        </h3>
        <pre className="max-h-60 overflow-auto text-xs text-muted-foreground">
          {JSON.stringify({ links, tags }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

const meta = {
  title: "MyPocket/Stores/LinksStore",
  component: LinksStoreDemo,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LinksStoreDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};
