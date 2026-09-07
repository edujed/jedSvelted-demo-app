# demo-app

Aplicação de demonstração para a biblioteca [`@edujed/jedsvelted-ui`](https://github.com/edujed/jedSvelted-ui).

Mostra na prática como usar os componentes da lib em um app Svelte 5 real: layout com navegação, tabelas interativas com CRUD, painéis de detalhamento (consulta/edição/exclusão), busca/filtro, abas, deep-linking e roteamento hash.

> **English version:** [README.md](./README.md)

## 📦 Stack

- [Svelte 5](https://svelte.dev/) (runes: `$state`, `$derived`, `$effect`, `$props`)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vitejs.dev/)
- [`@edujed/jedsvelted-ui`](https://github.com/edujed/jedSvelted-ui) (consumida via workspace local)

## 🚀 Rodando

```bash
# instalar dependências (monorepo com workspaces)
npm install

# desenvolvimento (HMR)
npm run dev

# build de produção
npm run build

# type-check
npm run check
```

> A lib `@edujed/jedsvelted-ui` é resolvida pelo workspace local (`node_modules/@edujed/jedsvelted-ui` → symlink para `../jedsvelted-ui`). Se você alterar a lib, rode `npm run build` dentro de `jedsvelted-ui/` antes de testar.

## 🗂 Estrutura

```
demo-app/
├── src/
│   ├── main.ts                  # bootstrap (mount do App)
│   ├── app.css                  # estilos globais + temas
│   ├── App.svelte               # rotas + Layout
│   ├── i18n/
│   │   ├── index.ts             # t() do demo — mescla mensagens do demo + lib
│   │   └── locales/             # traduções específicas do demo (en, pt-BR)
│   ├── pages/
│   │   ├── HomePage.svelte      # página inicial (demo do FileTree)
│   │   ├── department/
│   │   │   ├── DepartmentPage.svelte    # lista de departamentos (tabela + busca)
│   │   │   └── DepartmentDetail.svelte  # painel de detalhe (3 modos)
│   │   └── user/
│   │       ├── UserPage.svelte          # lista de usuários (tabela + busca)
│   │       ├── UserDetail.svelte        # painel de detalhe (3 modos + abas)
│   │       └── UserPermissions.svelte   # CRUD aninhado (permissões por usuário)
│   └── services/
│       ├── user.service.ts      # usuários mock + atividade + funções de filtro
│       ├── department.service.ts# departamentos mock + funções de filtro
│       ├── permission.service.ts# permissões mock (por usuário)
│       └── tree.service.ts      # árvore de arquivos de exemplo
├── vite.config.ts               # plugin svelte + acesso à lib vizinha
└── package.json
```

## 🧩 O que é demonstrado

### 1. Layout + navegação (`App.svelte`)

O `Layout` da lib recebe o `router` e renderiza navbar/sidenav. As rotas são registradas no `HashRouter` com **títulos reativos ao locale** (getters re-resolvem quando o idioma muda):

```svelte
<script lang="ts">
  import { Layout, HashRouter, type RouteState } from "@edujed/jedsvelted-ui/router";
  import { initTheme } from "@edujed/jedsvelted-ui/theme";
  import { initI18n } from "@edujed/jedsvelted-ui/i18n";
  import { t } from "./i18n";

  initTheme();
  initI18n();

  const routes = [
    { pattern: "/", moduleName: "home", title: () => t("home"), icon: "🏠", showInMenu: true },
    { pattern: "/departments", moduleName: "departments", title: () => t("departments"), icon: "🏢", showInMenu: true },
    { pattern: "/departments/:id", moduleName: "departments", title: () => t("department"), icon: "🏢", showInMenu: false },
    { pattern: "/users", moduleName: "users", title: () => t("users"), icon: "👥", showInMenu: true },
    { pattern: "/users/:id", moduleName: "users", title: () => t("user"), icon: "👤", showInMenu: false },
    { pattern: "/users/:id/*", moduleName: "users", title: () => t("user"), icon: "👤", showInMenu: false }, // deep-link: /users/3/permissions/27
  ];

  const router = new HashRouter();
  for (const r of routes) {
    router.add(r.pattern, () => {}, { moduleName: r.moduleName, title: r.title, icon: r.icon, showInMenu: r.showInMenu });
  }
  router.init();

  let routeState: RouteState = $state(router.getState());
  router.addRouterListener(() => { routeState = router.getState() });

  // Deriva o ID do usuário da rota atual (ex.: /users/3 → id=3)
  let currentUserId = $derived(routeState?.routeParams?.id ? Number(routeState.routeParams.id) : undefined);
</script>

<Layout {router}>
  {#if routeState?.moduleName === "users"}
    <UserPage role="-" autoOpenId={currentUserId} activeTab={currentTab} permissionId={currentPermissionId} onPermissionNotFound={handleRecordNotFound} onRecordNotFound={handleRecordNotFound} />
  {:else if routeState?.moduleName === "departments"}
    <DepartmentPage autoOpenId={currentDepartmentId} onRecordNotFound={handleRecordNotFound} />
  {:else}
    <HomePage />
  {/if}
</Layout>
```

### 2. Página com tabela + busca (`UserPage.svelte`)

`PageShell` organiza a página em 3 regiões: `filter` (busca), `content` (tabela) e `detailContent` (painel lateral). A página é a **dona única dos dados + toast** via `createHandleDetail`:

```svelte
<script lang="ts">
  import { createHandleDetail, type ActionEvent } from "@edujed/jedsvelted-ui/actions";
  import { toast } from "@edujed/jedsvelted-ui/info";

  // Handler CRUD unificado — muta a lista de origem e dispara o toast padronizado.
  const { handleDetailAction } = createHandleDetail<User>({
    dataRef: { data: UserList },
    toast,
    itemName: () => t("user", undefined, locale),
    displayFields: ["name"],
  });

  // Contrato de evento único vindo do UserDetail: (action, item).
  const handleUserAction = (action: ActionEvent, item: User) => {
    handleDetailAction(action, item);
    pageShell?.closeDetail();
  };
</script>

<PageShell title={t("user", undefined, locale)} onSearch={handleSearch} onClear={handleClear} bind:filterOpen>
  {#snippet filter(pageState)}
    <SelectField label={t("role", undefined, locale)} bind:value={role} options={roleOptions} colSpan={1} />
    <SelectField label={t("status", undefined, locale)} bind:value={status} options={statusOptions} colSpan={1} />
    <EditField label={t("search", undefined, locale)} bind:value={searchTerm} colSpan={2} />
  {/snippet}

  {#snippet content(shell)}
    <Table
      id="tblUsers"
      caption={t("users", undefined, locale)}
      data={filteredUsers}
      rowKey="id"
      csvFileName="users.csv"
      columns={columns}
      actions={[
        { title: t("view", undefined, locale), icon: "eye", onClick: (row) => shell.show(row) },
        { title: t("edit", undefined, locale), icon: "edit", onClick: (row) => shell.edit(row) },
        { title: t("delete", undefined, locale), icon: "trash", onClick: (row) => shell.deleteRow(row) },
      ]}
      onAdd={() => shell.edit({ role: "X", login: "", name: "" })}
    />
  {/snippet}

  {#snippet detailContent(shell)}
    <UserDetail
      user={shell.selectedItem as User | undefined}
      action={shell.detailAction}
      {activeTab}
      {permissionId}
      onClose={() => shell.close()}
      onAction={handleUserAction}
      onPermissionNotFound={handlePermissionNotFound}
    />
  {/snippet}
</PageShell>
```

### 3. Painel de detalhe com 3 modos (`UserDetail.svelte`)

`DetailShell` gerencia o estado do painel (modo, item selecionado, form). O conteúdo muda conforme o `action`:

| Modo     | Exibido                                       | Ações           |
| -------- | --------------------------------------------- | --------------- |
| `detail` | Grid de dados + abas (permissões / atividade) | —               |
| `edit`   | Formulário com `EditField`/`SelectField`      | Save / Cancel   |
| `delete` | Grid de dados + mensagem de confirmação       | Delete / Cancel |

```svelte
<DetailShell item={user} mode={action} entityName={t("user", undefined, locale)} {onClose}>
  {#snippet children(shell, isMode)}
    {@const cancel = () => shell.onCancel()}
    {#if isMode("detail")}
      <Panel title={t("basicInfo", undefined, locale)} iconName="user">
        <InfoGrid items={userFields} />
      </Panel>
      <!-- Abas: permissões (CRUD aninhado) + log de atividade -->
      <Tabs tabs={[{ value: "permissions", label: t("permissions", undefined, locale) }, { value: "activity", label: t("activity", undefined, locale) }]} bind:activeTab>
        {#snippet tabContent(tabValue)}
          {#if tabValue === "permissions" && user?.id}
            <UserPermissions id={user.id} inline {permissionId} {onPermissionNotFound} />
          {:else if tabValue === "activity"}
            <!-- lista de atividade -->
          {/if}
        {/snippet}
      </Tabs>
    {:else if isMode("edit")}
      <Panel title={user?.id ? t("editUserTitle", undefined, locale) : t("newUser", undefined, locale)} iconName="edit">
        <!-- campos do formulário -->
        <Button variant="primary" icon="check" onclick={handleSave}>{t("save", undefined, locale)}</Button>
        <Button variant="secondary" icon="x" onclick={cancel}>{t("cancel", undefined, locale)}</Button>
      </Panel>
    {:else if isMode("delete")}
      <Panel title={t("deleteUserTitle", undefined, locale)} iconName="trash">
        <InfoGrid items={userFields} />
        <!-- mensagem de confirmação -->
        <Button variant="danger" icon="trash" onclick={handleDelete}>{t("delete", undefined, locale)}</Button>
        <Button variant="secondary" icon="x" onclick={cancel}>{t("cancel", undefined, locale)}</Button>
      </Panel>
    {/if}
  {/snippet}
</DetailShell>
```

### 4. CRUD aninhado (`UserPermissions.svelte`)

A aba de permissões embute um `CrudPanel` completo **dentro** do painel de detalhe — uma tabela com seu próprio form/consulta/exclusão, movida pelo mesmo contrato `createHandleDetail`. A ref de dados usa um **getter** para manter o array `$state` reativo:

```svelte
<script lang="ts">
  import { CrudPanel } from "@edujed/jedsvelted-ui/container";
  import { createHandleDetail } from "@edujed/jedsvelted-ui/actions";

  let rawPermissions = $state<Permission[]>([]);

  // Carrega as permissões mockadas sempre que o id do usuário muda.
  $effect(() => {
    getPermissionsByUser(id).then((result) => { rawPermissions = result; });
  });

  // Getter mantém o array $state reativo dentro do handler.
  const { handleDetailAction } = createHandleDetail<Permission>({
    dataRef: { get data() { return rawPermissions; } },
    toast,
    itemName: () => t("permissions", undefined, locale),
    displayFields: ["module", "action"],
  });
</script>

<CrudPanel
  title={t("permissions", undefined, locale)}
  csvFileName="permissions.csv"
  {inline}
  {columns}
  data={translatedPermissions}
  onAction={(action, item) => { if (action === "delete") handleDetailAction("delete", item); }}
  renderView={viewContent}
  autoOpenId={permissionId}
  onAutoOpenError={onPermissionNotFound}
>
  {#snippet renderForm(onComplete)}
    <!-- campos do formulário -->
    <FormActions onSave={() => handleSave(onComplete)} onCancel={() => { resetForm(); onComplete(); }} />
  {/snippet}
</CrudPanel>
```

### 5. Roteamento ↔ painel (deep-linking)

A navegação entre `/users` e `/users/:id` abre/fecha o painel automaticamente via `$effect` no `UserPage`. Deep-links para recursos aninhados (`/users/3/permissions/27`) abrem o painel **e** o registro específico:

```ts
$effect(() => {
  if (!pageShell) return;
  if (autoOpenId === lastAutoOpenId) return;
  const prevAutoOpenId = lastAutoOpenId;
  lastAutoOpenId = autoOpenId;

  if (autoOpenId && autoOpenId > 0) {
    const users = getUserById(autoOpenId);
    if (users.length > 0) {
      // Deep-link: mostra o registro na tabela e recolhe o painel de filtro.
      filteredUsers = users;
      filterOpen = false;
      pageShell.closeDetail();
      pageShell.showDetail(users[0]);
    } else {
      // Deep-link para usuário inexistente — "modo seguro": mostra a lista
      // completa (painel aberto) e notifica via toast.
      filteredUsers = UserList;
      filterOpen = true;
      pageShell.closeDetail();
      onRecordNotFound?.(autoOpenId);
    }
  } else if (prevAutoOpenId && prevAutoOpenId > 0) {
    // Saindo de uma rota /users/:id: fecha o painel e reseta os filtros.
    pageShell.closeDetail();
    searchTerm = "";
    role = "-";
    status = "-";
    filterOpen = true;
  }
});
```

### 6. i18n (mensagens do demo + lib)

O demo app traz seu próprio `t()` que **mescla** mensagens específicas do demo com as genéricas da lib — as chaves do demo têm prioridade, as da lib são o fallback:

```ts
// src/i18n/index.ts
import { localeStore, t as libT, type Locale } from "@edujed/jedsvelted-ui/i18n";
import en from "./locales/en";
import ptBR from "./locales/pt-BR";

export function t(key, params?, locale?: Locale): string {
  const currentLocale = locale ?? get(localeStore);
  const demoTemplate = DEMO_LOCALES[currentLocale][key];
  if (demoTemplate !== undefined) {
    return params ? demoTemplate.replace(/\{(\w+)\}/g, ...) : demoTemplate;
  }
  return libT(key, params); // fallback para as mensagens genéricas da lib
}
```

Uso nos componentes (reativo — re-renderiza quando o locale muda):

```svelte
<script lang="ts">
  import { localeStore } from "@edujed/jedsvelted-ui/i18n";
  import { t } from "../i18n";
  let locale = $derived($localeStore);
</script>

<h1>{t("users", undefined, locale)}</h1>
```

### 7. Página inicial (`HomePage.svelte`)

Demonstra o `FileTree` (expandir/recolher, seleção de arquivos, callback de visualização) e o `Message` (variantes: success/info/warning):

```svelte
<PageShell title={t("home", undefined, locale)}>
  {#snippet content()}
    <Panel title={t("fileTree", undefined, locale)} iconName="tree">
      {#each sampleTree as node}
        <FileTree {node} toggleFile={handleToggleFile} onViewFile={handleViewFile} {selectedFiles} />
      {/each}
      <Message variant="info" title={t("selectedFiles", undefined, locale)}>
        {selectedFiles.length > 0 ? selectedFiles.join(", ") : "—"}
      </Message>
    </Panel>
  {/snippet}
</PageShell>
```

## 📋 Checklist de funcionalidades

- [x] Dois módulos CRUD completos (usuários, departamentos) com tabela + painel de detalhe
- [x] CRUD aninhado (permissões por usuário) dentro do painel de detalhe
- [x] Tabela com ordenação, filtro por coluna e export CSV
- [x] Busca por nome/login + filtro por role/status
- [x] Ações por linha: View / Edit / Delete
- [x] Botão "Add" cria novo registro (modo edição)
- [x] Painel lateral abre/fecha com transição
- [x] Navegação por rota (`#/users/3` → painel abre com o usuário 3)
- [x] Deep-linking para registros aninhados (`#/users/3/permissions/27`)
- [x] "Modo seguro" para registros inexistentes (toast + lista completa)
- [x] Abas no painel de detalhe (permissões / atividade)
- [x] Fechar painel via chevron ou Cancel
- [x] Temas (light/dark) via `initTheme()`
- [x] i18n (en/pt-BR) — mensagens do demo + lib mescladas, reativas ao locale
- [x] Componente `Button` centralizado (variantes + ícones do registro de ícones da lib)

## 🛠 Desenvolvimento local

```bash
# type-check
npm run check

# build
npm run build

# preview do build
npm run preview
```

## 🌐 Live Demo

> Para abrir a Live Demo deste app:
> [![Live Demo](https://shields.io)](https://edujed.github.io/jedSvelted-demo-app/)

## 📄 License

[GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)
