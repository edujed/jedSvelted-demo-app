# demo-app

Demo application for the [`@edujed/jedsvelted-ui`](https://github.com/edujed/jedSvelted-ui) library.

Shows in practice how to use the library's components in a real Svelte 5 app: layout with navigation, interactive table with CRUD, detail panel (view/edit/delete), search/filter, and hash routing.

## 📦 Stack

- [Svelte 5](https://svelte.dev/) (runes: `$state`, `$derived`, `$effect`, `$props`)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vitejs.dev/)
- [`@edujed/jedsvelted-ui`](https://github.com/edujed/jedSvelted-ui) (consumed via local workspace)

## 🚀 Getting started

```bash
# install dependencies (monorepo with workspaces)
npm install

# development (HMR)
npm run dev

# production build
npm run build

# type-check
npm run check
```

> The `@edujed/jedsvelted-ui` library is resolved via the local workspace (`node_modules/@edujed/jedsvelted-ui` → symlink to `../jedsvelted-ui`). If you modify the library, run `npm run build` inside `jedsvelted-ui/` before testing.

## 🗂 Project structure

```
demo-app/
├── src/
│   ├── main.ts                  # bootstrap (mount App)
│   ├── app.css                  # global styles + themes
│   ├── App.svelte               # routes + Layout
│   ├── pages/
│   │   ├── HomePage.svelte      # home page
│   │   └── user/
│   │       ├── UserPage.svelte  # user list (table + search)
│   │       └── UserDetail.svelte# detail panel (3 modes)
│   └── services/
│       └── user.service.ts      # mock data + filter functions
├── vite.config.ts               # svelte plugin + access to sibling lib
└── package.json
```

## 🧩 What's demonstrated

### 1. Layout + navigation (`App.svelte`)

The library's `Layout` receives the `router` and renders navbar/sidenav. Routes are registered in the `HashRouter`:

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

### 2. Page with table + search (`UserPage.svelte`)

`PageShell` organizes the page into 3 regions: `filter` (search), `content` (table), and `detailContent` (side panel).

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

### 3. Detail panel with 3 modes (`UserDetail.svelte`)

`DetailShell` manages the panel state (mode, selected item, form). The content changes based on the `action`:

| Mode     | Displayed                           | Actions         |
| -------- | ----------------------------------- | --------------- |
| `detail` | Data grid (read-only)               | —               |
| `edit`   | Form with `EditField`/`SelectField` | Save / Cancel   |
| `delete` | Data + confirmation message         | Delete / Cancel |

```svelte
<script lang="ts">
  import { Button } from "@edujed/jedsvelted-ui/ui";
</script>

<DetailShell item={user} mode={action} entityName="User" {onClose}>
  {#snippet children(shell, isMode)}
    {#if isMode("detail")}
      <Panel title="Basic info" iconName="user">
        <!-- data grid -->
      </Panel>
    {:else if isMode("edit")}
      <Panel title={user?.id ? "Edit user" : "New user"} iconName="edit">
        <EditField label="Login" bind:value={formLogin} />
        <SelectField label="Role" bind:value={formRole} options={RoleList} />
        <Button variant="primary" icon="check" onclick={handleSave}>Save</Button>
        <Button variant="secondary" icon="x" onclick={shell.onCancel}>Cancel</Button>
      </Panel>
    {:else if isMode("delete")}
      <Panel title="Delete user" iconName="trash">
        <!-- data + confirmation -->
        <Button variant="danger" icon="trash" onclick={handleDelete}>Delete</Button>
        <Button variant="secondary" icon="x" onclick={shell.onCancel}>Cancel</Button>
      </Panel>
    {/if}
  {/snippet}
</DetailShell>
```

### 4. Routing ↔ panel

Navigation between `/users` and `/users/:id` automatically opens/closes the panel via `$effect` in `UserPage`:

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

## 📋 Feature checklist

- [x] Table with sorting, column filtering, and CSV export
- [x] Search by name/login + filter by role
- [x] Row actions: View / Edit / Delete
- [x] "Add" button creates a new record (edit mode)
- [x] Side panel opens/closes with transition
- [x] Route navigation (`#/users/3` → panel opens with user 3)
- [x] Close panel via chevron or Cancel
- [x] Themes (light/dark) via `initTheme()`
- [x] Centralized `Button` component (variants + icons from the library's icon registry)

## 🛠 Local development

```bash
# type-check
npm run check

# build
npm run build

# preview the build
npm run preview
```

## for a Live Demo:

To open a Live Demo, click here: [![Live Demo](https://shields.io)](https://raw.githubusercontent.com/edujed/jedSvelted-demo-app/refs/heads/gh-pages/index.html)

## 📄 License

[GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)
