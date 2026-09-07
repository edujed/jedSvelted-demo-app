# demo-app

Demo application for the [`@edujed/jedsvelted-ui`](https://github.com/edujed/jedSvelted-ui) library.

Shows in practice how to use the library's components in a real Svelte 5 app: layout with navigation, interactive tables with CRUD, detail panels (view/edit/delete), search/filter, tabs, deep-linking, and hash routing.

> **Versão em português:** [README-PT-BR.md](./README-PT-BR.md)

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
│   ├── i18n/
│   │   ├── index.ts             # demo t() — merges demo + lib messages
│   │   └── locales/             # demo-specific translations (en, pt-BR)
│   ├── pages/
│   │   ├── HomePage.svelte      # home page (FileTree demo)
│   │   ├── department/
│   │   │   ├── DepartmentPage.svelte    # department list (table + search)
│   │   │   └── DepartmentDetail.svelte  # detail panel (3 modes)
│   │   └── user/
│   │       ├── UserPage.svelte          # user list (table + search)
│   │       ├── UserDetail.svelte        # detail panel (3 modes + tabs)
│   │       └── UserPermissions.svelte   # nested CRUD (permissions per user)
│   └── services/
│       ├── user.service.ts      # mock users + activity + filter functions
│       ├── department.service.ts# mock departments + filter functions
│       ├── permission.service.ts# mock permissions (per user)
│       └── tree.service.ts      # sample file tree
├── vite.config.ts               # svelte plugin + access to sibling lib
└── package.json
```

## 🧩 What's demonstrated

### 1. Layout + navigation (`App.svelte`)

The library's `Layout` receives the `router` and renders navbar/sidenav. Routes are registered in the `HashRouter` with **locale-reactive titles** (getters re-resolve on locale change):

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

  // Derives the user ID from the current route (e.g.: /users/3 → id=3)
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

### 2. Page with table + search (`UserPage.svelte`)

`PageShell` organizes the page into 3 regions: `filter` (search), `content` (table), and `detailContent` (side panel). The page is the **single owner of data + toast** via `createHandleDetail`:

```svelte
<script lang="ts">
  import { createHandleDetail, type ActionEvent } from "@edujed/jedsvelted-ui/actions";
  import { toast } from "@edujed/jedsvelted-ui/info";

  // Unified CRUD handler — mutates the source list and fires the standardized toast.
  const { handleDetailAction } = createHandleDetail<User>({
    dataRef: { data: UserList },
    toast,
    itemName: () => t("user", undefined, locale),
    displayFields: ["name"],
  });

  // Single event contract from UserDetail: (action, item).
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

### 3. Detail panel with 3 modes (`UserDetail.svelte`)

`DetailShell` manages the panel state (mode, selected item, form). The content changes based on the `action`:

| Mode     | Displayed                                 | Actions         |
| -------- | ----------------------------------------- | --------------- |
| `detail` | Info grid + tabs (permissions / activity) | —               |
| `edit`   | Form with `EditField`/`SelectField`       | Save / Cancel   |
| `delete` | Info grid + confirmation message          | Delete / Cancel |

```svelte
<DetailShell item={user} mode={action} entityName={t("user", undefined, locale)} {onClose}>
  {#snippet children(shell, isMode)}
    {@const cancel = () => shell.onCancel()}
    {#if isMode("detail")}
      <Panel title={t("basicInfo", undefined, locale)} iconName="user">
        <InfoGrid items={userFields} />
      </Panel>
      <!-- Tabs: permissions (nested CRUD) + activity log -->
      <Tabs tabs={[{ value: "permissions", label: t("permissions", undefined, locale) }, { value: "activity", label: t("activity", undefined, locale) }]} bind:activeTab>
        {#snippet tabContent(tabValue)}
          {#if tabValue === "permissions" && user?.id}
            <UserPermissions id={user.id} inline {permissionId} {onPermissionNotFound} />
          {:else if tabValue === "activity"}
            <!-- activity list -->
          {/if}
        {/snippet}
      </Tabs>
    {:else if isMode("edit")}
      <Panel title={user?.id ? t("editUserTitle", undefined, locale) : t("newUser", undefined, locale)} iconName="edit">
        <!-- form fields -->
        <Button variant="primary" icon="check" onclick={handleSave}>{t("save", undefined, locale)}</Button>
        <Button variant="secondary" icon="x" onclick={cancel}>{t("cancel", undefined, locale)}</Button>
      </Panel>
    {:else if isMode("delete")}
      <Panel title={t("deleteUserTitle", undefined, locale)} iconName="trash">
        <InfoGrid items={userFields} />
        <!-- confirmation message -->
        <Button variant="danger" icon="trash" onclick={handleDelete}>{t("delete", undefined, locale)}</Button>
        <Button variant="secondary" icon="x" onclick={cancel}>{t("cancel", undefined, locale)}</Button>
      </Panel>
    {/if}
  {/snippet}
</DetailShell>
```

### 4. Nested CRUD (`UserPermissions.svelte`)

The permissions tab embeds a full `CrudPanel` **inside** the detail panel — a table with its own form/view/delete, driven by the same `createHandleDetail` contract. The data ref uses a **getter** so the `$state` array stays reactive:

```svelte
<script lang="ts">
  import { CrudPanel } from "@edujed/jedsvelted-ui/container";
  import { createHandleDetail } from "@edujed/jedsvelted-ui/actions";

  let rawPermissions = $state<Permission[]>([]);

  // Loads the mocked permissions whenever the user id changes.
  $effect(() => {
    getPermissionsByUser(id).then((result) => { rawPermissions = result; });
  });

  // Getter keeps the $state array reactive inside the handler.
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
    <!-- form fields -->
    <FormActions onSave={() => handleSave(onComplete)} onCancel={() => { resetForm(); onComplete(); }} />
  {/snippet}
</CrudPanel>
```

### 5. Routing ↔ panel (deep-linking)

Navigation between `/users` and `/users/:id` automatically opens/closes the panel via `$effect` in `UserPage`. Deep-links to nested resources (`/users/3/permissions/27`) open the panel **and** the specific record:

```ts
$effect(() => {
  if (!pageShell) return;
  if (autoOpenId === lastAutoOpenId) return;
  const prevAutoOpenId = lastAutoOpenId;
  lastAutoOpenId = autoOpenId;

  if (autoOpenId && autoOpenId > 0) {
    const users = getUserById(autoOpenId);
    if (users.length > 0) {
      // Deep-link: show the record in the table and collapse the filter panel.
      filteredUsers = users;
      filterOpen = false;
      pageShell.closeDetail();
      pageShell.showDetail(users[0]);
    } else {
      // Deep-link to a non-existent user — "safe mode": show the full
      // list (panel open) and notify via toast.
      filteredUsers = UserList;
      filterOpen = true;
      pageShell.closeDetail();
      onRecordNotFound?.(autoOpenId);
    }
  } else if (prevAutoOpenId && prevAutoOpenId > 0) {
    // Leaving a /users/:id route: close the panel and reset the filters.
    pageShell.closeDetail();
    searchTerm = "";
    role = "-";
    status = "-";
    filterOpen = true;
  }
});
```

### 6. i18n (demo + lib messages)

The demo app ships its own `t()` that **merges** demo-specific messages with the library's generic ones — demo keys win, lib keys fall through:

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
  return libT(key, params); // fall through to the lib's generic messages
}
```

Usage in components (reactive — re-renders on locale change):

```svelte
<script lang="ts">
  import { localeStore } from "@edujed/jedsvelted-ui/i18n";
  import { t } from "../i18n";
  let locale = $derived($localeStore);
</script>

<h1>{t("users", undefined, locale)}</h1>
```

### 7. Home page (`HomePage.svelte`)

Demonstrates `FileTree` (expand/collapse, file selection, view callback) and `Message` (variants: success/info/warning):

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

## 📋 Feature checklist

- [x] Two full CRUD modules (users, departments) with table + detail panel
- [x] Nested CRUD (permissions per user) inside the detail panel
- [x] Table with sorting, column filtering, and CSV export
- [x] Search by name/login + filter by role/status
- [x] Row actions: View / Edit / Delete
- [x] "Add" button creates a new record (edit mode)
- [x] Side panel opens/closes with transition
- [x] Route navigation (`#/users/3` → panel opens with user 3)
- [x] Deep-linking to nested records (`#/users/3/permissions/27`)
- [x] "Safe mode" for non-existent records (toast + full list)
- [x] Tabs in the detail panel (permissions / activity)
- [x] Close panel via chevron or Cancel
- [x] Themes (light/dark) via `initTheme()`
- [x] i18n (en/pt-BR) — demo + lib messages merged, reactive to locale
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

## 🌐 Live Demo

> To open a Live Demo for this app:
> [![Live Demo](https://shields.io)](https://edujed.github.io/jedSvelted-demo-app/)

## 📄 License

[GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)
