<script lang="ts">
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { PageShell } from "@edujed/jedsvelted-ui/pages";
	import DepartmentDetail from "./DepartmentDetail.svelte";
	import {
		DepartmentList,
		type Department,
		filterDepartments,
		getDepartmentById,
	} from "../../services/department.service";
	import { Table, type TableCol } from "@edujed/jedsvelted-ui/table";
	import { createHandleDetail, type ActionEvent } from "@edujed/jedsvelted-ui/actions";
	import { toast } from "@edujed/jedsvelted-ui/info";
	import { localeStore } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "../../i18n";

	let locale = $derived($localeStore);

	let pageShell: { showDetail: (row: Record<string, unknown>) => void; closeDetail: () => void } | undefined = $state(undefined);

	let {
		autoOpenId = $bindable(0),
		onRecordNotFound,
	}: {
		/** Record ID to open automatically on mount/navigation. */
		autoOpenId?: number | undefined;
		/** Called when autoOpenId is set but the record is not found. */
		onRecordNotFound?: (id: number) => void;
	} = $props();

	// Reactive state with explicit type to avoid 'never[]' inference.
	let filteredDepartments = $state<Department[]>([]);

	// Tracks the last processed autoOpenId to avoid closing the panel
	// when the pageShell reference changes (bind:this) but autoOpenId did not.
	let lastAutoOpenId = $state<number | undefined>(undefined);

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
			const departments = getDepartmentById(autoOpenId);
			if (departments.length > 0) {
				// Deep-link: show the record in the table and collapse the filter panel.
				filteredDepartments = departments;
				filterOpen = false;
				// Close first, then open. The PageShell's {#key detailKey} forces the
				// detail content to remount fresh, so the close→show in the same tick
				// still produces a clean remount (e.g.: /departments/3 → /departments/5).
				pageShell.closeDetail();
				pageShell.showDetail(departments[0] as unknown as Record<string, unknown>);
			} else {
				// Deep-link to a non-existent department — "safe mode": show the
				// full list (panel open) and notify via toast.
				filteredDepartments = DepartmentList;
				filterOpen = true;
				pageShell.closeDetail();
				onRecordNotFound?.(autoOpenId);
			}
		} else if (prevAutoOpenId && prevAutoOpenId > 0) {
			// Only closes when leaving a /departments/:id route (e.g.: /departments/3 → /departments).
			// On initial mount (autoOpenId=0) it does not close — avoids closing a panel
			// that was opened via a table action.
			pageShell.closeDetail();
			// Leave the deep-link: reset the search and reopen the filter panel.
			// Keep the current table data (the single record from the deep-link) —
			// the user can click Search to load the full list if desired.
			searchTerm = "";
			filterOpen = true;
		}
	});

	// Local state for search/filtering
	let searchTerm = $state("");
	const handleSearch = () => {
		filteredDepartments = filterDepartments(DepartmentList, searchTerm);
	};
	const handleClear = () => {
		searchTerm = "";
		filteredDepartments = [];
	};

	// Unified CRUD handler — mutates the source list (DepartmentList) and fires the
	// standardized toast. The page is the single owner of data + notification.
	const { handleDetailAction } = createHandleDetail<Department>({
		dataRef: { data: DepartmentList },
		toast,
		itemName: () => t('department', undefined, locale),
		displayFields: ["name"],
	});

	// Single event contract from DepartmentDetail: (action, item).
	const handleDepartmentAction = (action: ActionEvent, item: Department) => {
		handleDetailAction(action, item);
		pageShell?.closeDetail();
	};

	// Table columns (reactive — recomputed when locale changes)
	const colunas: TableCol[] = $derived([
		{ key: "id", title: "ID", align: "right", sortable: true, filterable: true },
		{ key: "name", title: t('name', undefined, locale), align: "left", sortable: true, filterable: true },
		{ key: "code", title: t('code', undefined, locale), align: "center", sortable: true, filterable: true },
		{ key: "location", title: t('location', undefined, locale), align: "left", sortable: true, filterable: true },
		{ key: "manager", title: t('manager', undefined, locale), align: "left", sortable: true, filterable: true },
		{ key: "employeeCount", title: t('employees', undefined, locale), align: "right", sortable: true, filterable: false },
	]);
</script>

<PageShell
    bind:this={pageShell}
	title={t('departments', undefined, locale)}
	onSearch={handleSearch}
	onClear={handleClear}
	bind:filterOpen
>
	{#snippet filter(pageState)}
		<EditField
			id="department-search-input"
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
			id="tblDepartments"
			caption={t('departments', undefined, locale)}
			data={filteredDepartments as unknown as Record<string, unknown>[]}
			rowKey="id"
			csvFileName="departments.csv"
			columns={colunas}
			defaultSortKey="name"
			defaultSortDirection="asc"
			actions={[
				{
					title: t('view', undefined, locale),
					hint: t('viewDepartmentDetails', undefined, locale),
					icon: "eye",
					onClick: (row) => shell.show(row),
				},
				{
					title: t('edit', undefined, locale),
					hint: t('editDepartment', undefined, locale),
					icon: "edit",
					onClick: (row) => shell.edit(row),
				},
				{
					title: t('delete', undefined, locale),
					hint: t('deleteDepartment', undefined, locale),
					icon: "trash",
					onClick: (row) => shell.deleteRow(row),
				},
			]}
			onAdd={() => {
				const nova: Department = { name: "" };
				shell.edit(nova as unknown as Record<string, unknown>);
			}}
		/>
	{/snippet}

	{#snippet detailContent(shell)}
		<DepartmentDetail
			department={shell.selectedItem as unknown as Department | undefined}
			action={shell.detailAction}
			onClose={() => shell.close()}
			onAction={handleDepartmentAction}
		/>
	{/snippet}
</PageShell>
