<script lang="ts">
	import { SelectField } from "@edujed/jedsvelted-ui/forms";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { PageShell } from "@edujed/jedsvelted-ui/pages";
	import UserDetail from "./UserDetail.svelte";
	import {
		RoleList,
		UserList,
		type User,
		type UserRole,
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
		role = $bindable("-"),
	}: {
		/** Record ID to open automatically on mount/navigation. */
		autoOpenId?: number | undefined;
		/** Role filter (bound to the filter SelectField). */
		role: string;
	} = $props();

	// Reactive state with explicit type to avoid 'never[]' inference.
	let filteredUsers = $state<User[]>([]);

	// Tracks the last processed autoOpenId to avoid closing the panel
	// when the pageShell reference changes (bind:this) but autoOpenId did not.
	let lastAutoOpenId = $state<number | undefined>(undefined);

	$effect(() => {
		if (!pageShell) return;
		// Only acts when autoOpenId changes (not when pageShell changes)
		if (autoOpenId === lastAutoOpenId) return;
		lastAutoOpenId = autoOpenId;

		if (autoOpenId && autoOpenId > 0) {
			const users = getUserById(autoOpenId);
			if (users.length > 0) {
				pageShell.showDetail(users[0] as unknown as Record<string, unknown>);
			}
		} else if (lastAutoOpenId && lastAutoOpenId > 0) {
			// Only closes when leaving a /users/:id route (e.g.: /users/3 → /users).
			// On initial mount (autoOpenId=0) it does not close — avoids closing a panel
			// that was opened via a table action.
			pageShell.closeDetail();
		}
	});

	// Local state for search/filtering
	let searchTerm = $state("");
	const handleSearch = () => {
		filteredUsers = filterUsers(UserList, searchTerm, role as UserRole);
	};
	const handleClear = () => {
		role = "-";
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
>
	{#snippet filter(pageState)}
		<SelectField
			label={t('role', undefined, locale)}
			hint={t('filterByRole', undefined, locale)}
			bind:value={role}
			options={RoleList.map((r) => ({ key: r.key, label: t(r.label as never, undefined, locale) }))}
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
			onClose={() => shell.close()}
			onAction={handleUserAction}
		/>
	{/snippet}
</PageShell>
