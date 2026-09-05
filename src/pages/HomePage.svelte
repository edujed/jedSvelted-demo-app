<script lang="ts">
  import { PageShell } from "@edujed/jedsvelted-ui/pages";
  import { localeStore } from "@edujed/jedsvelted-ui/i18n";
  import { t } from "../i18n";

  let locale = $derived($localeStore);
</script>

<PageShell title={t('home', undefined, locale)}>
  {#snippet content()}
    <h3>{t('welcome', undefined, locale)}</h3>
    <div class="home-content">
      <p><strong>params:</strong> {"{"}{"}"}</p>
      <p><strong>path:</strong> '/'</p>
      <p><strong>title:</strong> 'Home'</p>
      <div class="status-indicator">{t('homePage', undefined, locale)}</div>
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
