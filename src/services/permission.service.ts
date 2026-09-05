// Mock service for user permissions (hypothetical access-control system).

export interface Permission {
	id: number;
	id_user: number;
	module: string;
	action: string;
	description?: string;
}

// Available modules in the hypothetical access-control system.
// Labels are i18n keys resolved by the UI (see getModuleOptions).
export const ModuleList = [
	{ key: "users", label: "users" },
	{ key: "orders", label: "orders" },
	{ key: "products", label: "products" },
	{ key: "reports", label: "reports" },
	{ key: "settings", label: "settings" },
];

export type PermissionModule = (typeof ModuleList)[number]["key"];

// Available actions per module — labels are i18n keys resolved by the UI.
export const ActionList: Record<PermissionModule, { key: string; label: string }[]> = {
	users: [
		{ key: "view", label: "view" },
		{ key: "create", label: "create" },
		{ key: "edit", label: "edit" },
		{ key: "delete", label: "delete" },
	],
	orders: [
		{ key: "view", label: "view" },
		{ key: "create", label: "create" },
		{ key: "edit", label: "edit" },
		{ key: "cancel", label: "cancel" },
	],
	products: [
		{ key: "view", label: "view" },
		{ key: "create", label: "create" },
		{ key: "edit", label: "edit" },
		{ key: "delete", label: "delete" },
	],
	reports: [
		{ key: "view", label: "view" },
		{ key: "export", label: "export" },
	],
	settings: [
		{ key: "view", label: "view" },
		{ key: "edit", label: "edit" },
	],
};

// Seed data: a few permissions per user (mocked).
// Descriptions are i18n keys resolved by the UI (see getPermissionsByUser).
const seedPermissions: Permission[] = [
	{ id: 1, id_user: 1, module: "users", action: "view", description: "viewAllUsers" },
	{ id: 2, id_user: 1, module: "users", action: "edit", description: "editUserProfiles" },
	{ id: 3, id_user: 1, module: "orders", action: "view", description: "viewAllOrders" },
	{ id: 4, id_user: 1, module: "reports", action: "export", description: "exportReportsCsv" },
	{ id: 5, id_user: 2, module: "users", action: "view" },
	{ id: 6, id_user: 2, module: "settings", action: "edit", description: "changeSystemSettings" },
	{ id: 7, id_user: 3, module: "orders", action: "view" },
	{ id: 8, id_user: 3, module: "orders", action: "cancel" },
	{ id: 9, id_user: 4, module: "products", action: "view" },
	{ id: 10, id_user: 4, module: "products", action: "create" },
	{ id: 11, id_user: 5, module: "reports", action: "view" },
	{ id: 12, id_user: 6, module: "users", action: "view" },
	{ id: 13, id_user: 7, module: "orders", action: "view" },
	{ id: 14, id_user: 8, module: "products", action: "view" },
	{ id: 15, id_user: 9, module: "reports", action: "view" },
];

// Returns the permissions granted to a user (mocked, with a small delay).
export function getPermissionsByUser(userId: number): Promise<Permission[]> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(seedPermissions.filter((p) => p.id_user === userId));
		}, 150);
	});
}
