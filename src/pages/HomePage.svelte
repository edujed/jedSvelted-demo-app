<script lang="ts">
  import { PageShell } from "@edujed/jedsvelted-ui/pages";
</script>

<PageShell title="Home">
  {#snippet content()}
    <h3>Welcome</h3>
    <div class="home-content">
      <p><strong>params:</strong> {"{"}{"}"}</p>
      <p><strong>path:</strong> '/'</p>
      <p><strong>title:</strong> 'Home'</p>
      <div class="status-indicator">Página Home</div>
    </div>
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

  .status-indicator {
    border-left: 4px solid #f59e0b;
    padding-left: 1rem;
    margin-top: 1rem;
    color: var(--text-muted);
  }
</style>
