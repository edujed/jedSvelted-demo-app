<script lang="ts">
	import type { RouteState } from "@edujed/jedsvelted-ui/router";
	import { initTheme } from "@edujed/jedsvelted-ui/theme";
	import { initI18n } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "./i18n";
	import { ToastContainer, toast } from "@edujed/jedsvelted-ui/info";
	import { Layout } from "@edujed/jedsvelted-ui/router";
	import { HashRouter } from "@edujed/jedsvelted-ui/router";
	import { localeStore } from "@edujed/jedsvelted-ui/i18n";
	import HomePage from "./pages/HomePage.svelte";
	import DepartmentPage from "./pages/department/DepartmentPage.svelte";
	import UserPage from "./pages/user/UserPage.svelte";

	initTheme();
	initI18n();

	// Routes — titles are getters so they re-resolve on locale change.
	// The lib's Navbar/Sidenav resolves them at read time (reactive).
	const routes = [
		{
			pattern: "/",
			moduleName: "home",
			title: () => t('home'),
			icon: "🏠",
			showInMenu: true,
		},
		{
			pattern: "/home",
			moduleName: "home",
			title: () => t('home'),
			icon: "🏠",
			showInMenu: false,
		},
		{
		pattern: "/departments",
		moduleName: "departments",
		title: () => t('departments'),
		icon: "🏢",
		showInMenu: true,
	},
	{
		pattern: "/departments/:id",
		moduleName: "departments",
		title: () => t('department'),
		icon: "🏢",
		showInMenu: false,
	}, {
			pattern: "/users",
			moduleName: "users",
			title: () => t('users'),
			icon: "👥",
			showInMenu: true,
		},
		{
			pattern: "/users/:id",
			moduleName: "users",
			title: () => t('user'),
			icon: "👤",
			showInMenu: false,
		}, // internal item
		{
			pattern: "/users/:id/*",
			moduleName: "users",
			title: () => t('user'),
			icon: "👤",
			showInMenu: false,
		}, // internal item (deep-link: /users/3/activity, /users/3/permissions/27)
	];

	// Registers all routes with their full metadata in the internal router.
	const router = new HashRouter();
	for (const r of routes) {
		router.add(r.pattern, () => {}, {
			moduleName: r.moduleName,
			title: r.title,
			icon: r.icon,
			showInMenu: r.showInMenu,
		});
	}
	router.init();

	let routeState: RouteState = $state(router.getState());
	router.addRouterListener(() => {
		routeState = router.getState();
	});

	// Deep-link to a non-existent record (e.g.: /users/999) — "safe mode":
	// the page shows the full list and this fires the "record not found" toast.
	const handleRecordNotFound = (id: number) => {
		toast.error(t('errorWithId', { error: t('recordNotFound', undefined, $localeStore), id }, $localeStore));
	};

	// Derives the user ID from the current route (e.g.: /users/3 → id=3)
	let currentUserId = $derived(
		routeState?.routeParams?.id ? Number(routeState.routeParams.id) : undefined
	);

	// Derives the department ID from the current route (e.g.: /departments/3 → id=3)
	let currentDepartmentId = $derived(
		routeState?.routeParams?.id ? Number(routeState.routeParams.id) : undefined
	);

	// Derives the active tab from the URL (e.g.: /users/3/activity → tab="activity")
	let currentTab = $derived(
		routeState?.path?.split("/").filter(Boolean).pop() || "permissions"
	);

	// Derives the permission ID from the URL (e.g.: /users/3/permissions/27 → id=27)
	let currentPermissionId = $derived.by(() => {
		const parts = routeState?.path?.split("/").filter(Boolean) || [];
		// Expected format: ["users", "3", "permissions", "27"]
		if (parts.length >= 4 && parts[2] === "permissions") {
			return Number(parts[3]) || 0;
		}
		return 0;
	});
</script>

<Layout {router}>
  {#if routeState?.moduleName === "users"}
    <UserPage
      role="-"
      autoOpenId={currentUserId}
      activeTab={currentTab}
      permissionId={currentPermissionId}
      onPermissionNotFound={handleRecordNotFound}
      onRecordNotFound={handleRecordNotFound}
    />
  {:else if routeState?.moduleName === "departments"}
    <DepartmentPage autoOpenId={currentDepartmentId} onRecordNotFound={handleRecordNotFound} />
  {:else}
    <HomePage />
  {/if}
  <!--
	<div style="padding:2rem">
		<p><strong>path:</strong> {routeState.path}</p>
		<p><strong>title:</strong> {routeState.title || "-"}</p>
	</div>
 -->
</Layout>
<ToastContainer />
