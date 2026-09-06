<script lang="ts">
  import { PageShell } from "@edujed/jedsvelted-ui/pages";
  import { localeStore } from "@edujed/jedsvelted-ui/i18n";
  import { t } from "../i18n";
  import { FileTree } from "@edujed/jedsvelted-ui/ui";
  import { sampleTree } from "../services/tree.service";
  import { Panel } from "@edujed/jedsvelted-ui/container";
  import { Message } from "@edujed/jedsvelted-ui/info";

  let locale = $derived($localeStore);

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

<PageShell title={t("home", undefined, locale)}>
  {#snippet content()}
    <Panel title={t("home", undefined, locale)}>
      <Message variant="success">{t("homePage", undefined, locale)}</Message>
      <div class="home-content">
        <p><strong>params:</strong> {"{"}{"}"}</p>
        <p><strong>path:</strong> '/'</p>
        <p><strong>title:</strong> 'Home'</p>
      </div>
    </Panel>

    <Panel title={t("fileTree", undefined, locale)} iconName="tree">
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
          <Message variant="info" title={t("selectedFiles", undefined, locale)}>
            {selectedFiles.length > 0 ? selectedFiles.join(", ") : "—"}
          </Message>
          {#if viewedFile}
            <Message variant="warning" title={t("viewedFile", undefined, locale)}>
              {viewedFile.path}
            </Message>
          {/if}
        </div>
    </Panel>
  {/snippet}
</PageShell>

<style>
  .home-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    flex-direction: column;
    gap: 0.5rem;
  }

  .tree-wrapper {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    background: var(--color-card-bg);
  }

  .demo-status {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }
</style>
