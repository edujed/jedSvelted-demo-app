<script lang="ts">
	import { CrudPanel } from "@edujed/jedsvelted-ui/ui";
	import { FormActions } from "@edujed/jedsvelted-ui/ui";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { SelectField } from "@edujed/jedsvelted-ui/forms";
	import { toast } from "@edujed/jedsvelted-ui/info";
	import { createHandleDetail, type ActionEvent } from "@edujed/jedsvelted-ui/actions";
	import type { TableCol } from "@edujed/jedsvelted-ui/table";
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

	// Single source of truth for the permissions list. The array is never
	// reassigned — it is mutated in place (splice) so the stable dataRef below
	// always points to the live list, even across user changes.
	let permissions = $state<Permission[]>([]);

	// Unified CRUD handler — mutates the permissions list in place and fires
	// the standardized toast. The component is the owner of this data slice.
	const { handleDetailAction } = createHandleDetail<Permission>({
		dataRef: { data: permissions },
		toast,
		itemName: "Permission",
		displayFields: ["module", "action"],
	});

	// Loads the mocked permissions whenever the user id changes. Splice keeps
	// the same array instance so dataRef stays valid.
	$effect(() => {
		permissions.splice(0, permissions.length);
		getPermissionsByUser(id).then((result) => {
			permissions.splice(0, permissions.length, ...result);
		});
	});

	// Form state
	let formModule = $state<PermissionModule | "">("");
	let formAction = $state("");
	let formDescription = $state("");
	let editRow: Permission | null = $state(null);

	const actionOptions = $derived(
		formModule ? ActionList[formModule] : []
	);

	const columns: TableCol[] = [
		{ key: "module", title: "Module", align: "left" as const, sortable: true, filterable: true },
		{ key: "action", title: "Action", align: "left" as const, sortable: true, filterable: true },
		{ key: "description", title: "Description", align: "left" as const, sortable: false, filterable: true },
	];

	function handleEdit(...args: unknown[]): void {
		const row = args[0] as unknown as Permission;
		editRow = row;
		formModule = row.module;
		formAction = row.action;
		formDescription = row.description ?? "";
	}

	function handleSave(onComplete?: () => void): void {
		if (!formModule) {
			toast.error("Module is required");
			return;
		}
		if (!formAction) {
			toast.error("Action is required");
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
			<span class="view-label">Module</span>
			<span class="view-value">{row.module}</span>
		</div>
		<div class="view-row">
			<span class="view-label">Action</span>
			<span class="view-value">{row.action}</span>
		</div>
		<div class="view-row">
			<span class="view-label">Description</span>
			<span class="view-value">{row.description || '—'}</span>
		</div>
	</div>
{/snippet}

<CrudPanel
	title="Permissions"
	addLabel="Add permission"
	csvFileName="permissions.csv"
	{inline}
	{columns}
	data={permissions as unknown as Record<string, unknown>[]}
	onAction={(action, item) => {
		if (action === 'delete') handleDetailAction('delete', item as unknown as Permission);
	}}
	renderView={viewContent as any}
>
	{#snippet renderForm(onComplete)}
		<div class="form-fields">
			<SelectField
				label="Module"
				hint="Module the permission applies to"
				bind:value={formModule}
				options={ModuleList}
				colSpan={2}
			/>
			<SelectField
				label="Action"
				hint="Action allowed on the module"
				bind:value={formAction}
				options={actionOptions}
				colSpan={2}
			/>
			<EditField
				id="perm-description"
				label="Description"
				hint="Optional description"
				type="text"
				placeholder="e.g. View all orders"
				bind:value={formDescription}
				colSpan={4}
			/>
		</div>
		<FormActions
			onSave={() => handleSave(onComplete)}
			onCancel={() => { resetForm(); onComplete(); }}
			saveLabel="Save"
			cancelLabel="Cancel"
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
