<script lang="ts">
	import { DetailShell } from "@edujed/jedsvelted-ui/pages";
	import { EditField } from "@edujed/jedsvelted-ui/forms";
	import { SelectField } from "@edujed/jedsvelted-ui/forms";
	import { Panel } from "@edujed/jedsvelted-ui/container";
	import { Button, InfoGrid } from "@edujed/jedsvelted-ui/ui";
	import {
		RoleList,
		StatusList,
		getActivityByUser,
		type User,
		type UserRole,
		type UserStatus,
		type UserActivity,
	} from "../../services/user.service";
	import type { ActionEvent } from "@edujed/jedsvelted-ui/actions";
	import UserPermissions from "./UserPermissions.svelte"
    import { Tabs } from "@edujed/jedsvelted-ui/tabs";
	import { localeStore } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "../../i18n";

	let locale = $derived($localeStore);

	// Translated status options — reactive to locale changes.
	const statusOptions = $derived(
		StatusList.map((s) => ({ key: s.key, label: t(s.label as never, undefined, locale) }))
	);

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
		{ label: t('email', undefined, locale), value: user?.email },
		{ label: t('role', undefined, locale), value: RoleList.find((r) => r.key === user?.role) ? t(RoleList.find((r) => r.key === user?.role)!.label as never, undefined, locale) : user?.role },
		{ label: t('department', undefined, locale), value: user?.department },
		{ label: t('status', undefined, locale), value: user?.status },
		{ label: t('createdAt', undefined, locale), value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString(locale === 'pt-BR' ? 'pt-BR' : 'en-US') : undefined },
		{ label: t('lastLogin', undefined, locale), value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString(locale === 'pt-BR' ? 'pt-BR' : 'en-US') : undefined },
	]);

	// Activity log state
	let activity = $state<UserActivity[]>([]);

	$effect(() => {
		if (user?.id) {
			getActivityByUser(user.id).then((result) => {
				activity = result.map((a) => ({
				...a,
				description: t(a.description as never, undefined, locale),
			}));
			});
		}
	});

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

	function activityIcon(type: UserActivity['type']): string {
		switch (type) {
			case 'login': return '🔓';
			case 'logout': return '🔒';
			case 'password_change': return '🔑';
			case 'profile_update': return '👤';
			case 'permission_change': return '🛡️';
			case 'role_change': return '🔄';
			default: return '📋';
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
              { value: 'activity', label: t('activity', undefined, locale) }
            ]}
            activeTab={currentTab}
          >
            {#snippet tabContent(tabValue)}
              {#if tabValue === 'permissions' && user?.id}
                <UserPermissions
                  id={user.id}
                  inline
                />
              {:else if tabValue === 'activity'}
                {#if activity.length === 0}
                  <p class="empty-hint">{t('noActivity', undefined, locale)}</p>
                {:else}
                  <div class="activity-list">
                    {#each activity as item (item.id)}
                      <div class="activity-item">
                        <span class="activity-icon">{activityIcon(item.type)}</span>
                        <div class="activity-content">
                          <span class="activity-desc">{item.description}</span>
                          <span class="activity-meta">
                            {new Date(item.timestamp).toLocaleString(locale === 'pt-BR' ? 'pt-BR' : 'en-US')}
                            {#if item.ip}<span class="activity-ip">· {item.ip}</span>{/if}
                          </span>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
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
						options={statusOptions}
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

	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.activity-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	.activity-icon {
		font-size: 1.1rem;
		line-height: 1;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.activity-content {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		flex: 1;
	}

	.activity-desc {
		font-size: var(--font-size-sm);
		color: var(--color-on-surface);
		font-weight: 500;
	}

	.activity-meta {
		font-size: var(--font-size-xs);
		color: var(--color-on-surface);
		opacity: 0.6;
	}

	.activity-ip {
		font-family: monospace;
	}
</style>
