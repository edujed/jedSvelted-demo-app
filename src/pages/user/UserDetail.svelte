<script lang="ts">
	import { DetailShell } from "@edujed/jedsvelted-ui/pages";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { SelectField } from "@edujed/jedsvelted-ui/forms";
	import { Panel } from "@edujed/jedsvelted-ui/container";
	import { Button, InfoGrid } from "@edujed/jedsvelted-ui/ui";
	import {
		RoleList,
		type User,
		type UserRole,
		type UserStatus,
	} from "../../services/user.service";
	import type { ActionEvent } from "@edujed/jedsvelted-ui/actions";
	import UserPermissions from "./UserPermissions.svelte"
    import { Tabs } from "@edujed/jedsvelted-ui/tabs";

	const StatusList = [
		{ key: "active", label: "Active" },
		{ key: "inactive", label: "Inactive" },
		{ key: "pending", label: "Pending" },
	];

	let {
		user,
		action = "detail",
		onClose,
		onAction,
	}: {
		user?: User;
		action?: "detail" | "edit" | "delete";
		onClose?: () => void;
		/** Single event contract: (action, item). The page owns data + toast. */
		onAction?: (action: ActionEvent, item: User) => void;
	} = $props();

    let currentTab = $state<string>('permissions');

	// Form state — synced with the user prop via $effect
	let formLogin = $state("");
	let formName = $state("");
	let formDepartment = $state("");
	let formRole = $state<UserRole>("U");
	let formStatus = $state<UserStatus>("active");

	$effect(() => {
		if (user) {
			formLogin = user.login ?? "";
			formName = user.name ?? "";
			formDepartment = user.department ?? "";
			formRole = user.role ?? "U";
			formStatus = user.status ?? "active";
		}
	});

	const isReadOnly = $derived(action === "detail");

	// Fields shared by the detail and delete modes (role resolved to its label).
	const userFields = $derived([
		{ label: "ID", value: user?.id },
		{ label: "Login", value: user?.login },
		{ label: "Name", value: user?.name },
		{ label: "Role", value: RoleList.find((r) => r.key === user?.role)?.label ?? user?.role },
		{ label: "Department", value: user?.department },
		{ label: "Status", value: user?.status },
	]);

	function handleSave() {
		const updated: User = {
			id: user?.id,
			login: formLogin,
			name: formName,
			department: formDepartment || undefined,
			role: formRole,
			status: formStatus,
		};
		onAction?.(user?.id ? "update" : "create", updated);
	}

	function handleDelete() {
		if (user) {
			onAction?.("delete", user);
		}
	}
</script>

<DetailShell
	item={user as unknown as Record<string, unknown> | undefined}
	mode={action}
	entityName="User"
	{onClose}
>
	{#snippet children(shell, isMode)}
		{@const cancel = () => shell.onCancel()}
		<!-- View mode -->
		{#if isMode("detail")}
			<Panel title="Basic info" iconName="user">
				<InfoGrid items={userFields} />
			</Panel>

   <div class="detail-section">
          <h3 class="section-title">Related Records</h3>
          <Tabs
            tabs={[
              { value: 'permissions', label: 'Permissions' },
              { value: 'profiles', label: 'Profiles' }
            ]}
            activeTab={currentTab}
          >
            {#snippet tabContent(tabValue)}
              {#if tabValue === 'permissions' && user?.id}
                <UserPermissions
                  id={user.id}
                  inline
                />
              {:else if tabValue === 'profiles'}
                <p class="empty-hint">No profiles assigned to this user.</p>
              {/if}
            {/snippet}
          </Tabs>
        </div>
		{/if}

		<!-- Edit mode -->
		{#if isMode("edit")}
			<Panel title={user?.id ? "Edit user" : "New user"} iconName="edit">
				<div class="form-grid">
					<EditField
						id="user-edit-login"
						label="Login"
						hint="Unique login name"
						type="text"
						placeholder="e.g. joao_dev"
						bind:value={formLogin}
						colSpan={2}
					/>
					<EditField
						id="user-edit-name"
						label="Name"
						hint="Full name"
						type="text"
						placeholder="e.g. João Pereira"
						bind:value={formName}
						colSpan={2}
					/>
					<SelectField
						label="Role"
						hint="User role"
						bind:value={formRole}
						options={RoleList.filter((r) => r.key !== "-")}
						colSpan={1}
					/>
					<SelectField
						label="Status"
						hint="Account status"
						bind:value={formStatus}
						options={StatusList}
						colSpan={1}
					/>
					<EditField
						id="user-edit-department"
						label="Department"
						hint="Department name"
						type="text"
						placeholder="e.g. Engineering"
						bind:value={formDepartment}
						colSpan={2}
					/>
				</div>
				<div class="form-actions">
					<Button variant="primary" icon="check" onclick={handleSave}>Save</Button>
					<Button variant="secondary" icon="x" onclick={cancel}>Cancel</Button>
				</div>
			</Panel>
		{/if}

		<!-- Delete mode -->
		{#if isMode("delete")}
			<Panel title="Delete user" iconName="trash">
				<InfoGrid items={userFields} />
				<p class="delete-message">
					Are you sure you want to delete
					<strong>{user?.name ?? "this user"}</strong>
					{#if user?.login}
					(<code>{user.login}</code>)
					{/if}?
					This action cannot be undone.
				</p>
				<div class="form-actions">
					<Button variant="danger" icon="trash" onclick={handleDelete}>Delete</Button>
					<Button variant="secondary" icon="x" onclick={cancel}>Cancel</Button>
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

	.detail-section {
		margin-top: 1.5rem;
	}

	.empty-hint {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		padding: 1rem 0;
	}
</style>
