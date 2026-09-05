<script lang="ts">
	import { CrudPanel } from "@edujed/jedsvelted-ui/ui";
	import { FormActions } from "@edujed/jedsvelted-ui/ui";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { SelectField } from "@edujed/jedsvelted-ui/forms";
	import { toast } from "@edujed/jedsvelted-ui/info";
	import { createHandleDetail, type ActionEvent } from "@edujed/jedsvelted-ui/actions";
	import type { TableCol } from "@edujed/jedsvelted-ui/table";
	import { localeStore } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "../../i18n";

	let locale = $derived($localeStore);
	import type { Snippet } from 'svelte';
	import {
		ModuleList,
		ActionList,
		getPermissionsByUser,
		type Permission,
		type PermissionModule,
	} from "../../services/permission.service";

	let {
		id,
		inline = false,
	}: {
		/** User ID whose permissions are listed. */
		id: number;
		/** Render inside the parent panel instead of an overlay. */
		inline?: boolean;
	} = $props();

	// Loads the mocked permissions whenever the user id changes. The raw data
	// is stored separately; the translated list is derived so it stays in sync
	// with the locale without re-triggering the load effect.
	let rawPermissions = $state<Permission[]>([]);
	let lastLoadedId = $state<number | null>(null);

	$effect(() => {
		if (id === lastLoadedId) return; // Only reload when the user actually changes
		lastLoadedId = id;
		getPermissionsByUser(id).then((result) => {
			rawPermissions = result;
		});
	});

	// Translated view of the permissions — reactive to locale changes.
	const translatedPermissions = $derived(
		rawPermissions.map((p) =>
			p.description ? { ...p, description: t(p.description as never, undefined, locale) } : p
		)
	);

	// Unified CRUD handler — mutates the raw list in place and fires the
	// standardized toast. The component is the owner of this data slice.
	const { handleDetailAction } = createHandleDetail<Permission>({
		dataRef: { data: rawPermissions },
		toast,
		itemName: () => t('permissions', undefined, locale),
		displayFields: ["module", "action"],
	});

	// Form state
	let formModule = $state<PermissionModule | "">("");
	let formAction = $state("");
	let formDescription = $state("");
	let editRow: Permission | null = $state(null);

	const actionOptions = $derived(
		formModule ? ActionList[formModule].map((a) => ({ key: a.key, label: t(a.label as never, undefined, locale) })) : []
	);

	const columns: TableCol[] = $derived([
		{ key: "module", title: t('module', undefined, locale), align: "left" as const, sortable: true, filterable: true },
		{ key: "action", title: t('action', undefined, locale), align: "left" as const, sortable: true, filterable: true },
		{ key: "description", title: t('description', undefined, locale), align: "left" as const, sortable: false, filterable: true },
	]);

	function handleEdit(...args: unknown[]): void {
		const row = args[0] as unknown as Permission;
		editRow = row;
		formModule = row.module;
		formAction = row.action;
		formDescription = row.description ?? "";
	}

	function handleSave(onComplete?: () => void): void {
		if (!formModule) {
			toast.error(t('moduleRequired', undefined, locale));
			return;
		}
		if (!formAction) {
			toast.error(t('actionRequired', undefined, locale));
			return;
		}

		const item: Permission = editRow
			? {
					...editRow,
					module: formModule,
					action: formAction,
					description: formDescription || undefined,
				}
			: {
					id: Date.now(),
					id_user: id,
					module: formModule,
					action: formAction,
					description: formDescription || undefined,
				};

		handleDetailAction(editRow ? "update" : "create", item);

		resetForm();
		onComplete?.();
	}

	function resetForm(): void {
		editRow = null;
		formModule = "";
		formAction = "";
		formDescription = "";
	}
</script>

{#snippet viewContent(row: Record<string, unknown>)}
	<div class="view-fields">
		<div class="view-row">
			<span class="view-label">{t('module', undefined, locale)}</span>
			<span class="view-value">{row.module}</span>
		</div>
		<div class="view-row">
			<span class="view-label">{t('action', undefined, locale)}</span>
			<span class="view-value">{row.action}</span>
		</div>
		<div class="view-row">
			<span class="view-label">{t('description', undefined, locale)}</span>
			<span class="view-value">{row.description || '—'}</span>
		</div>
	</div>
{/snippet}

<CrudPanel
	title={t('permissions', undefined, locale)}
	csvFileName="permissions.csv"
	{inline}
	{columns}
	data={translatedPermissions as unknown as Record<string, unknown>[]}
	onAction={(action: ActionEvent, item: Record<string, unknown>) => {
		if (action === 'delete') handleDetailAction('delete', item as unknown as Permission);
	}}
	renderView={viewContent as any}
>
	{#snippet renderForm(onComplete)}
		<div class="form-fields">
			<SelectField
				label={t('module', undefined, locale)}
				hint={t('moduleHint', undefined, locale)}
				bind:value={formModule}
				options={ModuleList.map((m) => ({ key: m.key, label: t(m.label as never, undefined, locale) }))}
				colSpan={2}
			/>
			<SelectField
				label={t('action', undefined, locale)}
				hint={t('actionHint', undefined, locale)}
				bind:value={formAction}
				options={actionOptions}
				colSpan={2}
			/>
			<EditField
				id="perm-description"
				label={t('description', undefined, locale)}
				hint={t('descriptionHint', undefined, locale)}
				type="text"
				placeholder={t('descriptionPlaceholder', undefined, locale)}
				bind:value={formDescription}
				colSpan={4}
			/>
		</div>
		<FormActions
			onSave={() => handleSave(onComplete)}
			onCancel={() => { resetForm(); onComplete(); }}
			saveLabel={t('save', undefined, locale)}
			cancelLabel={t('cancel', undefined, locale)}
		/>
	{/snippet}
</CrudPanel>

<style>
	.form-fields {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	@media (max-width: 600px) {
		.form-fields {
			grid-template-columns: 1fr;
		}
	}
</style>
