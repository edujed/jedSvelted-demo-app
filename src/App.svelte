<script lang="ts">
	import type { RouteState } from "@edujed/jedsvelted-ui/router";
	import { initTheme } from "@edujed/jedsvelted-ui/theme";
	import { initI18n } from "@edujed/jedsvelted-ui/i18n";
	import { t } from "./i18n";
	import { ToastContainer } from "@edujed/jedsvelted-ui/info";
	import { Layout } from "@edujed/jedsvelted-ui/router";
	import { HashRouter } from "@edujed/jedsvelted-ui/router";
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
		},
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
	router.addRouterListener(() => { routeState = router.getState() });

	// Derives the user ID from the current route (e.g.: /users/3 → id=3)
	let currentUserId = $derived(
		routeState?.routeParams?.id ? Number(routeState.routeParams.id) : undefined
	);

	// Derives the department ID from the current route (e.g.: /departments/3 → id=3)
	let currentDepartmentId = $derived(
		routeState?.routeParams?.id ? Number(routeState.routeParams.id) : undefined
	);
</script>

<Layout {router}>
  {#if routeState?.moduleName === "users"}
    <UserPage role="-" autoOpenId={currentUserId} />
  {:else if routeState?.moduleName === "departments"}
    <DepartmentPage autoOpenId={currentDepartmentId} />
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
