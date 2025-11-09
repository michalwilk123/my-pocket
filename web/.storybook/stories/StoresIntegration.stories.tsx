import { useEffect } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs";

import { Modal, TagGroup } from "@/components";
import { useLinksStore, useModalStore, useTagsStore } from "@/store";

function StoresIntegrationDemo() {
  const { tags, addTag, removeTag } = useTagsStore();
  const { links, addLink, removeLink } = useLinksStore();
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    addTag("javascript");
    addTag("typescript");
    addTag("nextjs");
    addTag("react");

    const jsTagId = tags.find((t) => t.label === "javascript")?.id;
    const tsTagId = tags.find((t) => t.label === "typescript")?.id;

    if (jsTagId) {
      addLink({
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        note: "Resources for developers, by developers",
        tagIds: [jsTagId],
        image: "",
      });
    }

    if (tsTagId) {
      addLink({
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook",
        note: "Complete guide to TypeScript",
        tagIds: [tsTagId],
        image: "",
      });
    }
  }, [addTag, addLink, tags]);

  const handleOpenAddLinkModal = () => {
    const AddLinkForm = () => {
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const url = formData.get("url") as string;
        const note = formData.get("note") as string;

        if (title && url) {
          addLink({
            title,
            url,
            note,
            tagIds: [],
            image: "",
          });
          closeModal();
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-xl font-bold text-foreground">Add Link</h2>

          <input
            name="title"
            type="text"
            placeholder="Title"
            required
            className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          />

          <input
            name="url"
            type="url"
            placeholder="URL"
            required
            className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          />

          <textarea
            name="note"
            placeholder="Note text"
            className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            rows={3}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Add Link
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    };

    openModal(<AddLinkForm />, { closeOnBackdropClick: false });
  };

  const handleOpenAddTagModal = () => {
    const AddTagForm = () => {
      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const label = formData.get("label") as string;

        if (label) {
          addTag(label);
          closeModal();
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-xl font-bold text-foreground">Add Tag</h2>

          <input
            name="label"
            type="text"
            placeholder="Tag label"
            required
            className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Add Tag
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    };

    openModal(<AddTagForm />);
  };

  const handleConfirmDelete = (id: string, type: "link" | "tag") => {
    const ConfirmDialog = () => (
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          Confirm Delete
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Are you sure you want to delete this {type}?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (type === "link") {
                removeLink(id);
              } else {
                removeTag(id);
              }
              closeModal();
            }}
            className="flex-1 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"
          >
            Delete
          </button>
          <button
            onClick={closeModal}
            className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    );

    openModal(<ConfirmDialog />, {
      closeOnBackdropClick: false,
      closeOnEscape: true,
    });
  };

  const handleTagClick = (linkId: string, _tagId: string) => {
    const ConfirmDialog = () => (
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">Remove Tag</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Remove this tag from the link?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              removeLink(linkId);
              closeModal();
            }}
            className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Remove
          </button>
          <button
            onClick={closeModal}
            className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    );

    openModal(<ConfirmDialog />);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">
        Stores Integration Demo
      </h1>

      <div className="mb-8 flex gap-3">
        <button
          onClick={handleOpenAddLinkModal}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Add Link
        </button>
        <button
          onClick={handleOpenAddTagModal}
          className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground"
        >
          Add Tag
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Links ({links.length})
          </h2>
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {link.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{link.url}</p>
                {link.note && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {link.note}
                  </p>
                )}

                <div className="mt-3">
                  <TagGroup
                    tags={
                      link.tags
                        .map((t) => tags.find((tag) => tag.id === t.id))
                        .filter(Boolean) as typeof tags
                    }
                    maxRows={2}
                    variant="primary"
                    onTagClick={(tagId) => handleTagClick(link.id, tagId)}
                  />
                </div>

                <button
                  onClick={() => handleConfirmDelete(link.id, "link")}
                  className="mt-3 rounded-full border border-border px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  Delete Link
                </button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-sm text-muted-foreground">No links yet.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Tags ({tags.length})
          </h2>
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
              >
                <span className="text-sm font-medium text-foreground">
                  #{tag.label}
                </span>
                <button
                  onClick={() => handleConfirmDelete(tag.id, "tag")}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  Delete
                </button>
              </div>
            ))}
            {tags.length === 0 && (
              <p className="text-sm text-muted-foreground">No tags yet.</p>
            )}
          </div>
        </div>
      </div>

      <ModalRenderer />
    </div>
  );
}

function ModalRenderer() {
  const { isOpen, content, config, closeModal } = useModalStore();

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      showCloseButton={config.showCloseButton}
      closeOnBackdropClick={config.closeOnBackdropClick}
      closeOnEscape={config.closeOnEscape}
    >
      {content}
    </Modal>
  );
}

const meta = {
  title: "MyPocket/Stores/Integration",
  component: StoresIntegrationDemo,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StoresIntegrationDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullDemo: Story = {};
