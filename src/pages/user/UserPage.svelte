<script lang="ts">
	import { SelectField } from "@edujed/jedsvelted-ui/forms";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { PageShell } from "@edujed/jedsvelted-ui/pages";
	import UserDetail from "./UserDetail.svelte";
	import {
		RoleList,
		StatusFilterList,
		UserList,
		type User,
		type UserRole,
		type UserStatus,
		filterUsers,
		getUserById,
	} from "../../services/user.service";
	import { Table, type TableCol } from "@edujed/jedsvelted-ui/table";
	import { createHandleDetail, type ActionEvent } from "@edujed/jedsvelted-ui/actions";
	import { toast } from "@edujed/jedsvelted-ui/info";
	import { localeStore } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "../../i18n";

	let locale = $derived($localeStore);

	let pageShell: { showDetail: (row: Record<string, unknown>) => void; closeDetail: () => void } | undefined = $state(undefined);

	let {
		autoOpenId = $bindable(0),
		activeTab = $bindable("permissions"),
		permissionId = $bindable(0),
		role = $bindable("-"),
		status = $bindable("active"),
		onPermissionNotFound,
		onRecordNotFound,
	}: {
		/** Record ID to open automatically on mount/navigation. */
		autoOpenId?: number | undefined;
		/** Active tab in the detail panel (e.g.: "permissions", "activity"). */
		activeTab?: string;
		/** Permission ID to open automatically in the permissions tab. */
		permissionId?: number;
		/** Role filter (bound to the filter SelectField). */
		role?: string;
		/** Status filter (bound to the filter SelectField). */
		status?: string;
		/** Called when permissionId is set but the record is not found. */
		onPermissionNotFound?: (id: number) => void;
		/** Called when autoOpenId is set but the record is not found. */
		onRecordNotFound?: (id: number) => void;
	} = $props();

	// Reactive state with explicit type to avoid 'never[]' inference.
	let filteredUsers = $state<User[]>([]);

	// Tracks the last processed autoOpenId to avoid closing the panel
	// when the pageShell reference changes (bind:this) but autoOpenId did not.
	let lastAutoOpenId = $state<number | undefined>(undefined);

	// Set when the user detail panel is open (via deep-link or table action).
	// Used to reset the permission not-found state when leaving the route.
	let detailOpen = $state(false);

	// Filter panel visibility — collapsed on deep-link (with id), restored when leaving.
	let filterOpen = $state(true);

	$effect(() => {
		if (!pageShell) return;
		// Only acts when autoOpenId changes (not when pageShell changes)
		if (autoOpenId === lastAutoOpenId) return;
		// Save the previous value BEFORE updating, so we can detect leaving a :id route.
		const prevAutoOpenId = lastAutoOpenId;
		lastAutoOpenId = autoOpenId;

		if (autoOpenId && autoOpenId > 0) {
			const users = getUserById(autoOpenId);
			if (users.length > 0) {
				// Deep-link: show the record in the table and collapse the filter panel.
				filteredUsers = users;
				filterOpen = false;
				// Close first, then open. The PageShell's {#key detailKey} forces the
				// detail content to remount fresh, so the close→show in the same tick
				// still produces a clean remount (e.g.: /users/3 → /users/5).
				pageShell.closeDetail();
				pageShell.showDetail(users[0] as unknown as Record<string, unknown>);
				detailOpen = true;
			} else {
				// Deep-link to a non-existent user — "safe mode": show the full
				// list (panel open) and notify via toast.
				lastPermissionKey = null;
				filteredUsers = UserList;
				filterOpen = true;
				pageShell.closeDetail();
				onRecordNotFound?.(autoOpenId);
			}
		} else if (prevAutoOpenId && prevAutoOpenId > 0) {
			// Only closes when leaving a /users/:id route (e.g.: /users/3 → /users).
			// On initial mount (autoOpenId=0) it does not close — avoids closing a panel
			// that was opened via a table action.
			detailOpen = false;
			pageShell.closeDetail();
			// Leave the deep-link: reset the search/filters and reopen the filter panel.
			// Keep the current table data (the single record from the deep-link) —
			// the user can click Search to load the full list if desired.
			searchTerm = "";
			role = "-";
			status = "-";
			filterOpen = true;
		}
	});

	// Translated status filter options — reactive to locale changes.
	const statusOptions = $derived(
		StatusFilterList.map((s) => ({ key: s.key, label: t(s.label as never, undefined, locale) }))
	);

	// Local state for search/filtering
	let searchTerm = $state("");
	const handleSearch = () => {
		filteredUsers = filterUsers(UserList, searchTerm, role as UserRole, status as UserStatus);
	};
	const handleClear = () => {
		role = "-";
		status = "-";
		searchTerm = "";
		filteredUsers = [];
	};

	// Unified CRUD handler — mutates the source list (UserList) and fires the
	// standardized toast. The page is the single owner of data + notification.
	const { handleDetailAction } = createHandleDetail<User>({
		dataRef: { data: UserList },
		toast,
		itemName: () => t('user', undefined, locale),
		displayFields: ["name"],
	});

	// Single event contract from UserDetail: (action, item).
	const handleUserAction = (action: ActionEvent, item: User) => {
		handleDetailAction(action, item);
		pageShell?.closeDetail();
		detailOpen = false;
	};

	// Tracks the last processed (autoOpenId, permissionId) pair so the
	// not-found toast fires once per pair, not on every data refresh.
	// The actual check happens in UserDetail (which owns the async permission
	// load) — this state is just a guard to prevent duplicate toasts.
	let lastPermissionKey = $state<string | null>(null);

	// Called by UserDetail after it loads the permission list and confirms
	// the permissionId is not present. The composite key ensures the toast
	// fires once per (user, permission) pair.
	const handlePermissionNotFound = (id: number) => {
		const key = `${autoOpenId}:${id}`;
		if (lastPermissionKey === key) return;
		lastPermissionKey = key;
		onPermissionNotFound?.(id);
	};

	// Table columns (reactive — recomputed when locale changes)
	const colunas: TableCol[] = $derived([
		{ key: "id", title: "ID", align: "right", sortable: true, filterable: true },
		{ key: "role", title: t('role', undefined, locale), align: "center", sortable: true, filterable: false },
		{ key: "login", title: t('login', undefined, locale), align: "left", sortable: true, filterable: true },
		{ key: "name", title: t('name', undefined, locale), align: "left", sortable: true, filterable: true },
		{ key: "department", title: t('department', undefined, locale), align: "left", sortable: true, filterable: true },
		{ key: "status", title: t('status', undefined, locale), align: "left", sortable: false, filterable: false },
	]);
</script>

<PageShell
    bind:this={pageShell}
	title={t('user', undefined, locale)}
	onSearch={handleSearch}
	onClear={handleClear}
	bind:filterOpen
>
	{#snippet filter(pageState)}
		<SelectField
			label={t('role', undefined, locale)}
			hint={t('filterByRole', undefined, locale)}
			bind:value={role}
			options={RoleList.map((r) => ({ key: r.key, label: t(r.label as never, undefined, locale) }))}
			colSpan={1}
		/>
		<SelectField
			label={t('status', undefined, locale)}
			hint={t('filterByStatus', undefined, locale)}
			bind:value={status}
			options={statusOptions}
			colSpan={1}
		/>
		<EditField
			id="user-search-input"
			label={t('search', undefined, locale)}
			hint={t('searchHint', undefined, locale)}
			type="text"
			placeholder={t('searchPlaceholder', undefined, locale)}
			bind:value={searchTerm}
			colSpan={2}
		/>
	{/snippet}

	{#snippet content(shell)}
		<Table
			id="tblUsers"
			caption={t('users', undefined, locale)}
			data={filteredUsers as unknown as Record<string, unknown>[]}
			rowKey="id"
			csvFileName="users.csv"
			columns={colunas}
			actions={[
				{
					title: t('view', undefined, locale),
					hint: t('viewUserDetails', undefined, locale),
					icon: "eye",
					onClick: (row) => shell.show(row),
				},
				{
					title: t('edit', undefined, locale),
					hint: t('editUser', undefined, locale),
					icon: "edit",
					onClick: (row) => shell.edit(row),
				},
				{
					title: t('delete', undefined, locale),
					hint: t('deleteUser', undefined, locale),
					icon: "trash",
					onClick: (row) => shell.deleteRow(row),
				},
			]}
			onAdd={() => {
				const nova: User = { role: "X", login: "", name: "" };
				shell.edit(nova as unknown as Record<string, unknown>);
			}}
		/>
	{/snippet}

	{#snippet detailContent(shell)}
		<UserDetail
			user={shell.selectedItem as unknown as User | undefined}
			action={shell.detailAction}
			{activeTab}
			{permissionId}
			onClose={() => shell.close()}
			onAction={handleUserAction}
			onPermissionNotFound={handlePermissionNotFound}
		/>
	{/snippet}
</PageShell>
