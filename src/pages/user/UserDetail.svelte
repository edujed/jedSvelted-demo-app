<script lang="ts">
	import { DetailShell } from "@edujed/jedsvelted-ui/pages";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { SelectField } from "@edujed/jedsvelted-ui/forms";
	import { Panel } from "@edujed/jedsvelted-ui/container";
	import { Button } from "@edujed/jedsvelted-ui/ui";
	import {
		RoleList,
		type User,
		type UserRole,
		type UserStatus,
	} from "../../services/user.service";

	const StatusList = [
		{ key: "active", label: "Active" },
		{ key: "inactive", label: "Inactive" },
		{ key: "pending", label: "Pending" },
	];

	let {
		user,
		action = "detail",
		onClose,
		onSave,
		onDelete,
	}: {
		user?: User;
		action?: "detail" | "edit" | "delete";
		onClose?: () => void;
		onSave?: (user: User) => void;
		onDelete?: (user: User) => void;
	} = $props();

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

	function handleSave() {
		const updated: User = {
			id: user?.id,
			login: formLogin,
			name: formName,
			department: formDepartment || undefined,
			role: formRole,
			status: formStatus,
		};
		onSave?.(updated);
	}

	function handleDelete() {
		if (user) {
			onDelete?.(user);
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
				<div class="detail-grid">
					<div class="detail-field">
						<span class="detail-label">ID</span>
						<span class="detail-value">{user?.id ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Login</span>
						<span class="detail-value">{user?.login ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Name</span>
						<span class="detail-value">{user?.name ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Role</span>
						<span class="detail-value">
							{RoleList.find((r) => r.key === user?.role)?.label ?? user?.role ?? "—"}
						</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Department</span>
						<span class="detail-value">{user?.department ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Status</span>
						<span class="detail-value">{user?.status ?? "—"}</span>
					</div>
				</div>
			</Panel>
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
				<div class="detail-grid">
					<div class="detail-field">
						<span class="detail-label">ID</span>
						<span class="detail-value">{user?.id ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Login</span>
						<span class="detail-value">{user?.login ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Name</span>
						<span class="detail-value">{user?.name ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Role</span>
						<span class="detail-value">
							{RoleList.find((r) => r.key === user?.role)?.label ?? user?.role ?? "—"}
						</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Department</span>
						<span class="detail-value">{user?.department ?? "—"}</span>
					</div>
					<div class="detail-field">
						<span class="detail-label">Status</span>
						<span class="detail-value">{user?.status ?? "—"}</span>
					</div>
				</div>
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
	.detail-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem 1.5rem;
	}

	.detail-field {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.detail-label {
		font-size: var(--font-size-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-muted);
	}

	.detail-value {
		font-size: var(--font-size-sm);
		color: var(--color-on-surface);
	}

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
