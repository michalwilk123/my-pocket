import { useEffect } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs";

import { useTagsStore } from "@/store";

function TagsStoreDemo() {
  const { tags, addTag, removeTag, updateTag } = useTagsStore();

  useEffect(() => {
    addTag("javascript");
    addTag("typescript");
    addTag("react");
  }, [addTag]);

  const handleAdd = () => {
    const label = prompt("Enter tag label:");
    if (label) {
      addTag(label);
    }
  };

  const handleUpdate = (id: string) => {
    const label = prompt("Enter new label:");
    if (label) {
      updateTag(id, label);
    }
  };

  return (
    <div className="p-8">
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Tags Store Demo
      </h2>

      <button
        onClick={handleAdd}
        className="mb-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Add Tag
      </button>

      <div className="space-y-2">
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tags yet. Click Add Tag.
          </p>
        )}
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-2 rounded-lg border border-border bg-card p-3"
          >
            <span className="flex-1 text-sm font-medium text-foreground">
              #{tag.label}
            </span>
            <button
              onClick={() => handleUpdate(tag.id)}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-primary/10"
            >
              Edit
            </button>
            <button
              onClick={() => removeTag(tag.id)}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">
          Store State:
        </h3>
        <pre className="text-xs text-muted-foreground">
          {JSON.stringify({ tags }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

const meta = {
  title: "MyPocket/Stores/TagsStore",
  component: TagsStoreDemo,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TagsStoreDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};
