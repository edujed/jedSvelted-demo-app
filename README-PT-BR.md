# demo-app

Aplicação de demonstração para a biblioteca [`@edujed/jedsvelted-ui`](https://github.com/edujed/jedSvelted-ui).

Mostra na prática como usar os componentes da lib em um app Svelte 5 real: layout com navegação, tabela interativa com CRUD, painel de detalhamento (consulta/edição/exclusão), busca/filtro e roteamento hash.

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
│   ├── pages/
│   │   ├── HomePage.svelte      # página inicial
│   │   └── user/
│   │       ├── UserPage.svelte  # lista de usuários (tabela + busca)
│   │       └── UserDetail.svelte# painel de detalhe (3 modos)
│   └── services/
│       └── user.service.ts      # dados mock + funções de filtro
├── vite.config.ts               # plugin svelte + acesso à lib vizinha
└── package.json
```

## 🧩 O que é demonstrado

### 1. Layout + navegação (`App.svelte`)

O `Layout` da lib recebe o `router` e renderiza navbar/sidenav. As rotas são registradas no `HashRouter`:

```svelte
<script lang="ts">
  import { Layout } from "@edujed/jedsvelted-ui/container";
  import { HashRouter } from "@edujed/jedsvelted-ui/router";

  const router = new HashRouter();
  router.add("/users", () => {}, { moduleName: "users", title: "Users", icon: "👥", showInMenu: true });
  router.add("/users/:id", () => {}, { moduleName: "users", title: "User by id", icon: "👤", showInMenu: false });
  router.init();

  let routeState: RouteState = $state(router.getState());
  router.addRouterListener(() => { routeState = router.getState() });

  let currentUserId = $derived(routeState?.routeParams?.id ? Number(routeState.routeParams.id) : undefined);
</script>

<Layout {router}>
  {#if routeState?.moduleName === "users"}
    <UserPage role="-" autoOpenId={currentUserId} />
  {:else}
    <HomePage />
  {/if}
</Layout>
```

### 2. Página com tabela + busca (`UserPage.svelte`)

`PageShell` organiza a página em 3 regiões: `filter` (busca), `content` (tabela) e `detailContent` (painel lateral).

```svelte
<PageShell title="User" {onSearch} {onClear}>
  {#snippet filter(pageState)}
    <SelectField label="Role" bind:value={role} options={RoleList.map(r => ({...r}))} colSpan={1} />
    <EditField label="Search" bind:value={searchTerm} colSpan={2} />
  {/snippet}

  {#snippet content(shell)}
    <Table
      data={filteredUsers}
      rowKey="id"
      columns={colunas}
      actions={[
        { title: "View",   icon: "eye",   onClick: (row) => shell.show(row) },
        { title: "Edit",   icon: "edit",  onClick: (row) => shell.edit(row) },
        { title: "Delete", icon: "trash", onClick: (row) => shell.deleteRow(row) },
      ]}
      onAdd={() => shell.edit({ role: "X", login: "", name: "" })}
    />
  {/snippet}

  {#snippet detailContent(shell)}
    <UserDetail
      user={shell.selectedItem as User | undefined}
      action={shell.detailAction}
      onClose={shell.close}
      {onSave}
      {onDelete}
    />
  {/snippet}
</PageShell>
```

### 3. Painel de detalhe com 3 modos (`UserDetail.svelte`)

`DetailShell` gerencia o estado do painel (modo, item selecionado, form). O conteúdo muda conforme o `action`:

| Modo      | Exibido                              | Ações          |
| --------- | ------------------------------------ | -------------- |
| `detail`  | Grid de dados (somente leitura)      | —              |
| `edit`    | Formulário com `EditField`/`SelectField` | Save / Cancel |
| `delete`  | Dados + mensagem de confirmação      | Delete / Cancel|

```svelte
<DetailShell item={user} mode={action} entityName="User" {onClose}>
  {#snippet children(shell, isMode)}
    {#if isMode("detail")}
      <Panel title="Basic info" iconName="user">
        <!-- grid de dados -->
      </Panel>
    {:else if isMode("edit")}
      <Panel title={user?.id ? "Edit user" : "New user"} iconName="edit">
        <EditField label="Login" bind:value={formLogin} />
        <SelectField label="Role" bind:value={formRole} options={RoleList} />
        <button onclick={handleSave}>Save</button>
        <button onclick={shell.onCancel}>Cancel</button>
      </Panel>
    {:else if isMode("delete")}
      <Panel title="Delete user" iconName="trash">
        <!-- dados + confirmação -->
        <button onclick={handleDelete}>Delete</button>
        <button onclick={shell.onCancel}>Cancel</button>
      </Panel>
    {/if}
  {/snippet}
</DetailShell>
```

### 4. Roteamento ↔ painel

A navegação entre `/users` e `/users/:id` abre/fecha o painel automaticamente via `$effect` no `UserPage`:

```ts
$effect(() => {
  if (!pageShell) return;
  if (autoOpenId === lastAutoOpenId) return;
  lastAutoOpenId = autoOpenId;

  if (autoOpenId && autoOpenId > 0) {
    const users = getUserById(autoOpenId);
    if (users.length > 0) pageShell.showDetail(users[0]);
  } else if (lastAutoOpenId > 0) {
    pageShell.closeDetail();
  }
});
```

## 📋 Checklist de funcionalidades

- [x] Tabela com ordenação, filtro por coluna e export CSV
- [x] Busca por nome/login + filtro por role
- [x] Ações por linha: View / Edit / Delete
- [x] Botão "Add" cria novo registro (modo edição)
- [x] Painel lateral abre/fecha com transição
- [x] Navegação por rota (`#/users/3` → painel abre com o usuário 3)
- [x] Fechar painel via chevron ou Cancel
- [x] Temas (light/dark) via `initTheme()`

## 🛠 Desenvolvimento local

```bash
# type-check
npm run check

# build
npm run build

# preview do build
npm run preview
```

## 📄 License

[GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)
