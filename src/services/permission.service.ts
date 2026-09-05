// Mock service for user permissions (hypothetical access-control system).

export interface Permission {
	id: number;
	id_user: number;
	module: string;
	action: string;
	description?: string;
}

// Available modules in the hypothetical access-control system.
export const ModuleList = [
	{ key: "users", label: "Users" },
	{ key: "orders", label: "Orders" },
	{ key: "products", label: "Products" },
	{ key: "reports", label: "Reports" },
	{ key: "settings", label: "Settings" },
];

export type PermissionModule = (typeof ModuleList)[number]["key"];

// Available actions per module.
export const ActionList: Record<PermissionModule, { key: string; label: string }[]> = {
	users: [
		{ key: "view", label: "View" },
		{ key: "create", label: "Create" },
		{ key: "edit", label: "Edit" },
		{ key: "delete", label: "Delete" },
	],
	orders: [
		{ key: "view", label: "View" },
		{ key: "create", label: "Create" },
		{ key: "edit", label: "Edit" },
		{ key: "cancel", label: "Cancel" },
	],
	products: [
		{ key: "view", label: "View" },
		{ key: "create", label: "Create" },
		{ key: "edit", label: "Edit" },
		{ key: "delete", label: "Delete" },
	],
	reports: [
		{ key: "view", label: "View" },
		{ key: "export", label: "Export" },
	],
	settings: [
		{ key: "view", label: "View" },
		{ key: "edit", label: "Edit" },
	],
};

// Seed data: a few permissions per user (mocked).
const seedPermissions: Permission[] = [
	{ id: 1, id_user: 1, module: "users", action: "view", description: "View all users" },
	{ id: 2, id_user: 1, module: "users", action: "edit", description: "Edit user profiles" },
	{ id: 3, id_user: 1, module: "orders", action: "view", description: "View all orders" },
	{ id: 4, id_user: 1, module: "reports", action: "export", description: "Export reports to CSV" },
	{ id: 5, id_user: 2, module: "users", action: "view" },
	{ id: 6, id_user: 2, module: "settings", action: "edit", description: "Change system settings" },
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
