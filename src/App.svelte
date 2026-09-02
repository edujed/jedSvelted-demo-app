<script lang="ts">
	import type { RouteState } from "@edujed/jedsvelted-ui/router";
	import { initTheme } from "@edujed/jedsvelted-ui/theme";
	import { ToastContainer } from "@edujed/jedsvelted-ui/info";
	import { Layout } from "@edujed/jedsvelted-ui/container";
	import { HashRouter } from "@edujed/jedsvelted-ui/router";
	import HomePage from "./pages/HomePage.svelte";
	import UserPage from "./pages/user/UserPage.svelte";

	initTheme();

	const routes = [
		{
			pattern: "/",
			moduleName: "home",
			title: "Home",
			icon: "🏠",
			showInMenu: true,
		},
		{
			pattern: "/home",
			moduleName: "home",
			title: "Home",
			icon: "🏠",
			showInMenu: false,
		}, // redirects to /
		{
			pattern: "/users",
			moduleName: "users",
			title: "Users",
			icon: "👥",
			showInMenu: true,
		},
		{
			pattern: "/users/:id",
			moduleName: "users",
			title: "User by id",
			icon: "👤",
			showInMenu: false,
		}, // internal item
		{
			pattern: "/users/:id/*",
			moduleName: "users",
			title: "User by id",
			icon: "👤",
			showInMenu: false,
		}, // internal sub-pages
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
</script>

<Layout {router}>
	{#if routeState?.moduleName === "users"}
		<UserPage role="-" autoOpenId={currentUserId} />
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
