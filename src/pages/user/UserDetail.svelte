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
	import { localeStore } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "../../i18n";

	let locale = $derived($localeStore);

	const StatusList = $derived([
		{ key: "active", label: t('active', undefined, locale) },
		{ key: "inactive", label: t('inactive', undefined, locale) },
		{ key: "pending", label: t('pending', undefined, locale) },
	]);

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
		{ label: t('login', undefined, locale), value: user?.login },
		{ label: t('name', undefined, locale), value: user?.name },
		{ label: t('role', undefined, locale), value: RoleList.find((r) => r.key === user?.role) ? t(RoleList.find((r) => r.key === user?.role)!.label as never, undefined, locale) : user?.role },
		{ label: t('department', undefined, locale), value: user?.department },
		{ label: t('status', undefined, locale), value: user?.status },
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
	entityName={t('user', undefined, locale)}
	{onClose}
>
	{#snippet children(shell, isMode)}
		{@const cancel = () => shell.onCancel()}
		<!-- View mode -->
		{#if isMode("detail")}
			<Panel title={t('basicInfo', undefined, locale)} iconName="user">
				<InfoGrid items={userFields} />
			</Panel>

   <div class="detail-section">
          <h3 class="section-title">{t('relatedRecords', undefined, locale)}</h3>
          <Tabs
            tabs={[
              { value: 'permissions', label: t('permissions', undefined, locale) },
              { value: 'profiles', label: t('profiles', undefined, locale) }
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
                <p class="empty-hint">{t('noProfiles', undefined, locale)}</p>
              {/if}
            {/snippet}
          </Tabs>
        </div>
		{/if}

		<!-- Edit mode -->
		{#if isMode("edit")}
			<Panel title={user?.id ? t('editUserTitle', undefined, locale) : t('newUser', undefined, locale)} iconName="edit">
				<div class="form-grid">
					<EditField
						id="user-edit-login"
						label={t('login', undefined, locale)}
						hint={t('uniqueLoginHint', undefined, locale)}
						type="text"
						placeholder="e.g. joao_dev"
						bind:value={formLogin}
						colSpan={2}
					/>
					<EditField
						id="user-edit-name"
						label={t('name', undefined, locale)}
						hint={t('fullNameHint', undefined, locale)}
						type="text"
						placeholder="e.g. João Pereira"
						bind:value={formName}
						colSpan={2}
					/>
					<SelectField
						label={t('role', undefined, locale)}
						hint={t('userRoleHint', undefined, locale)}
						bind:value={formRole}
						options={RoleList.filter((r) => r.key !== "-").map((r) => ({ key: r.key, label: t(r.label as never, undefined, locale) }))}
						colSpan={1}
					/>
					<SelectField
						label={t('status', undefined, locale)}
						hint={t('accountStatusHint', undefined, locale)}
						bind:value={formStatus}
						options={StatusList}
						colSpan={1}
					/>
					<EditField
						id="user-edit-department"
						label={t('department', undefined, locale)}
						hint={t('departmentHint', undefined, locale)}
						type="text"
						placeholder="e.g. Engineering"
						bind:value={formDepartment}
						colSpan={2}
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
			<Panel title={t('deleteUserTitle', undefined, locale)} iconName="trash">
				<InfoGrid items={userFields} />
				<p class="delete-message">
					{t('deleteUserMessage', undefined, locale)}
					<strong>{user?.name ?? t('thisUser', undefined, locale)}</strong>
					{#if user?.login}
					(<code>{user.login}</code>)
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

	.detail-section {
		margin-top: 1.5rem;
	}

	.empty-hint {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		padding: 1rem 0;
	}
</style>
