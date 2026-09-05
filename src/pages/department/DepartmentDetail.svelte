<script lang="ts">
	import { DetailShell } from "@edujed/jedsvelted-ui/pages";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { Panel } from "@edujed/jedsvelted-ui/container";
	import { Button, InfoGrid } from "@edujed/jedsvelted-ui/ui";
	import type { Department } from "../../services/department.service";
	import type { ActionEvent } from "@edujed/jedsvelted-ui/actions";
	import { localeStore } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "../../i18n";

	let locale = $derived($localeStore);

	let {
		department,
		action = "detail",
		onClose,
		onAction,
	}: {
		department?: Department;
		action?: "detail" | "edit" | "delete";
		onClose?: () => void;
		/** Single event contract: (action, item). The page owns data + toast. */
		onAction?: (action: ActionEvent, item: Department) => void;
	} = $props();

	// Form state — synced with the department prop via $effect
	let formName = $state("");
	let formCode = $state("");
	let formLocation = $state("");
	let formManager = $state("");
	let formEmployeeCount = $state("0");

	$effect(() => {
		if (department) {
			formName = department.name ?? "";
			formCode = department.code ?? "";
			formLocation = department.location ?? "";
			formManager = department.manager ?? "";
			formEmployeeCount = department.employeeCount != null ? String(department.employeeCount) : "";
		}
	});

	// Fields shared by the detail and delete modes.
	const departmentFields = $derived([
		{ label: "ID", value: department?.id },
		{ label: t('name', undefined, locale), value: department?.name },
		{ label: t('code', undefined, locale), value: department?.code },
		{ label: t('location', undefined, locale), value: department?.location },
		{ label: t('manager', undefined, locale), value: department?.manager },
		{ label: t('employees', undefined, locale), value: department?.employeeCount },
		{ label: t('createdAt', undefined, locale), value: department?.createdAt ? new Date(department.createdAt).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US') : undefined },
	]);

	function handleSave() {
		const updated: Department = {
			id: department?.id,
			name: formName,
			code: formCode || undefined,
			location: formLocation || undefined,
			manager: formManager || undefined,
			employeeCount: formEmployeeCount === "" ? undefined : Number(formEmployeeCount),
		};
		onAction?.(department?.id ? "update" : "create", updated);
	}

	function handleDelete() {
		if (department) {
			onAction?.("delete", department);
		}
	}
</script>

<DetailShell
	item={department as unknown as Record<string, unknown> | undefined}
	mode={action}
	entityName={t('department', undefined, locale)}
	{onClose}
>
	{#snippet children(shell, isMode)}
		{@const cancel = () => shell.onCancel()}
		<!-- View mode -->
		{#if isMode("detail")}
			<Panel title={t('basicInfo', undefined, locale)} iconName="building">
				<InfoGrid items={departmentFields} />
			</Panel>
		{/if}

		<!-- Edit mode -->
		{#if isMode("edit")}
			<Panel title={department?.id ? t('editDepartmentTitle', undefined, locale) : t('newDepartment', undefined, locale)} iconName="edit">
				<div class="form-grid">
					<EditField
						id="department-edit-name"
						label={t('name', undefined, locale)}
						hint={t('departmentHint', undefined, locale)}
						type="text"
						placeholder="e.g. Engineering"
						bind:value={formName}
						colSpan={2}
					/>
					<EditField
						id="department-edit-code"
						label={t('code', undefined, locale)}
						hint={t('codeHint', undefined, locale)}
						type="text"
						placeholder="e.g. ENG"
						bind:value={formCode}
						colSpan={1}
					/>
					<EditField
						id="department-edit-location"
						label={t('location', undefined, locale)}
						hint={t('locationHint', undefined, locale)}
						type="text"
						placeholder="e.g. Building A"
						bind:value={formLocation}
						colSpan={1}
					/>
					<EditField
						id="department-edit-manager"
						label={t('manager', undefined, locale)}
						hint={t('managerHint', undefined, locale)}
						type="text"
						placeholder="e.g. João Pereira"
						bind:value={formManager}
						colSpan={1}
					/>
					<EditField
						id="department-edit-employee-count"
						label={t('employees', undefined, locale)}
						hint={t('employeeCountHint', undefined, locale)}
						type="number"
						bind:value={formEmployeeCount}
						colSpan={1}
					/>
				</div>
				<div class="form-actions">
					<Button variant="primary" icon="check" onclick={handleSave}>{t('save', undefined, locale)}</Button>
					<Button variant="secondary" icon="x" onclick={cancel}>{t('cancel', undefined, locale)}</Button>
				</div>
			</Panel>
		{/if}

		<!-- Delete mode -->
		{#if isMode("delete")}
			<Panel title={t('deleteDepartmentTitle', undefined, locale)} iconName="trash">
				<InfoGrid items={departmentFields} />
				<p class="delete-message">
					{t('deleteDepartmentMessage', undefined, locale)}
					<strong>{department?.name ?? t('thisDepartment', undefined, locale)}</strong>
					{#if department?.code}
					(<code>{department.code}</code>)
					{/if}?
					{t('deleteWarning', undefined, locale)}
				</p>
				<div class="form-actions">
					<Button variant="danger" icon="trash" onclick={handleDelete}>{t('delete', undefined, locale)}</Button>
					<Button variant="secondary" icon="x" onclick={cancel}>{t('cancel', undefined, locale)}</Button>
				</div>
			</Panel>
		{/if}
	{/snippet}
</DetailShell>

<style>
	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1.5rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.delete-message {
		font-size: var(--font-size-sm);
		color: var(--color-on-surface);
		line-height: 1.5;
	}

	.delete-message code {
		background: var(--color-surface);
		padding: 0.125rem 0.375rem;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
	}
</style>
