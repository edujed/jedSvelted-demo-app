<script lang="ts">
  import { PageShell } from "@edujed/jedsvelted-ui/pages";
  import { FileTree, type FileNode } from "@edujed/jedsvelted-ui/ui";
  import { localeStore } from "@edujed/jedsvelted-ui/i18n";
  import { t } from "../i18n";

  let locale = $derived($localeStore);

  // Sample data — mirrors the shape returned by the Personal-AI-Assistent API.
  const sampleTree: FileNode[] = [
    { name: "package.json", path: "package.json", is_dir: false },
    { name: "tsconfig.json", path: "tsconfig.json", is_dir: false },
    {
      name: "src",
      path: "src",
      is_dir: true,
      children: [
        { name: "App.svelte", path: "src/App.svelte", is_dir: false },
        { name: "main.ts", path: "src/main.ts", is_dir: false },
        {
          name: "pages",
          path: "src/pages",
          is_dir: true,
          children: [
            {
              name: "About.svelte",
              path: "src/pages/About.svelte",
              is_dir: false,
            },
            {
              name: "Home.svelte",
              path: "src/pages/Home.svelte",
              is_dir: false,
            },
          ],
        },
        {
          name: "stores",
          path: "src/stores",
          is_dir: true,
          children: [
            {
              name: "theme.store.ts",
              path: "src/stores/theme.store.ts",
              is_dir: false,
            },
          ],
        },
      ],
    },
    {
      name: "docs",
      path: "docs",
      is_dir: true,
      children: [
        { name: "README.md", path: "docs/README.md", is_dir: false },
        { name: "guide.md", path: "docs/guide.md", is_dir: false },
      ],
    },
  ];

  let selectedFiles = $state<string[]>([]);
  let viewedFile = $state<{ path: string; name: string } | null>(null);

  function handleToggleFile(path: string) {
    selectedFiles = selectedFiles.includes(path)
      ? selectedFiles.filter((f) => f !== path)
      : [...selectedFiles, path];
  }

  function handleViewFile(path: string, name: string) {
    viewedFile = { path, name };
  }
</script>

<PageShell title={t("fileTree", undefined, locale)}>
  {#snippet content()}
    <div class="filetree-demo">
      <div class="tree-wrapper">
        {#each sampleTree as node}
          <FileTree
            {node}
            toggleFile={handleToggleFile}
            onViewFile={handleViewFile}
            {selectedFiles}
          />
        {/each}
      </div>

      <div class="demo-status">
        <p>
          <strong>{t("selectedFiles", undefined, locale)}:</strong>
          {selectedFiles.length > 0 ? selectedFiles.join(", ") : "—"}
        </p>
        {#if viewedFile}
          <p>
            <strong>{t("viewedFile", undefined, locale)}:</strong>
            {viewedFile.path}
          </p>
        {/if}
      </div>
    </div>
  {/snippet}
</PageShell>

<style>
  .filetree-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .tree-wrapper {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    background: var(--color-card-bg);
  }

  .demo-status {
    font-size: var(--font-size-sm);
    color: var(--color-on-surface);
  }

  .demo-status p {
    margin: var(--spacing-xxs) 0;
  }
</style>
