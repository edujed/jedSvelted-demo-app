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
export const ActionList: Record<
  PermissionModule,
  { key: string; label: string }[]
> = {
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

// Seed data: permissions per user, varied by role (mocked).
// Descriptions are i18n keys resolved by the UI (see getPermissionsByUser).
const seedPermissions: Permission[] = [
  // User 1 (edujed — Admin): full access
  {
    id: 1,
    id_user: 1,
    module: "users",
    action: "view",
    description: "viewAllUsers",
  },
  {
    id: 2,
    id_user: 1,
    module: "users",
    action: "create",
    description: "createNewUsers",
  },
  {
    id: 3,
    id_user: 1,
    module: "users",
    action: "edit",
    description: "editUserProfiles",
  },
  {
    id: 4,
    id_user: 1,
    module: "users",
    action: "delete",
    description: "deleteUserAccounts",
  },
  {
    id: 5,
    id_user: 1,
    module: "orders",
    action: "view",
    description: "viewAllOrders",
  },
  { id: 6, id_user: 1, module: "orders", action: "create" },
  { id: 7, id_user: 1, module: "orders", action: "edit" },
  {
    id: 8,
    id_user: 1,
    module: "orders",
    action: "cancel",
    description: "cancelPendingOrders",
  },
  { id: 9, id_user: 1, module: "products", action: "view" },
  { id: 10, id_user: 1, module: "products", action: "create" },
  { id: 11, id_user: 1, module: "products", action: "edit" },
  { id: 12, id_user: 1, module: "products", action: "delete" },
  {
    id: 13,
    id_user: 1,
    module: "reports",
    action: "view",
    description: "viewAllReports",
  },
  {
    id: 14,
    id_user: 1,
    module: "reports",
    action: "export",
    description: "exportReportsCsv",
  },
  { id: 15, id_user: 1, module: "settings", action: "view" },
  {
    id: 16,
    id_user: 1,
    module: "settings",
    action: "edit",
    description: "changeSystemSettings",
  },

  // User 2 (maria_admin — Admin): IT operations focus
  {
    id: 17,
    id_user: 2,
    module: "users",
    action: "view",
    description: "viewAllUsers",
  },
  {
    id: 18,
    id_user: 2,
    module: "users",
    action: "edit",
    description: "editUserProfiles",
  },
  { id: 19, id_user: 2, module: "orders", action: "view" },
  { id: 20, id_user: 2, module: "reports", action: "view" },
  { id: 21, id_user: 2, module: "reports", action: "export" },
  { id: 22, id_user: 2, module: "settings", action: "view" },
  {
    id: 23,
    id_user: 2,
    module: "settings",
    action: "edit",
    description: "changeSystemSettings",
  },

  // User 3 (carlos_root — Admin): security focus
  { id: 24, id_user: 3, module: "users", action: "view" },
  {
    id: 25,
    id_user: 3,
    module: "users",
    action: "delete",
    description: "deleteUserAccounts",
  },
  { id: 26, id_user: 3, module: "orders", action: "view" },
  { id: 27, id_user: 3, module: "orders", action: "cancel" },
  { id: 28, id_user: 3, module: "reports", action: "view" },
  { id: 29, id_user: 3, module: "settings", action: "view" },
  { id: 30, id_user: 3, module: "settings", action: "edit" },

  // User 4 (ana_gestora — Manager): sales focus
  { id: 31, id_user: 4, module: "users", action: "view" },
  {
    id: 32,
    id_user: 4,
    module: "orders",
    action: "view",
    description: "viewTeamOrders",
  },
  { id: 33, id_user: 4, module: "orders", action: "create" },
  { id: 34, id_user: 4, module: "orders", action: "edit" },
  { id: 35, id_user: 4, module: "products", action: "view" },
  { id: 36, id_user: 4, module: "products", action: "create" },
  {
    id: 37,
    id_user: 4,
    module: "reports",
    action: "view",
    description: "viewSalesReports",
  },

  // User 5 (pedro_supervisor — Manager): marketing focus
  { id: 38, id_user: 5, module: "users", action: "view" },
  { id: 39, id_user: 5, module: "orders", action: "view" },
  { id: 40, id_user: 5, module: "products", action: "view" },
  { id: 41, id_user: 5, module: "products", action: "edit" },
  { id: 42, id_user: 5, module: "reports", action: "view" },
  { id: 43, id_user: 5, module: "reports", action: "export" },

  // User 6 (lucia_gerente — Manager): HR focus
  {
    id: 44,
    id_user: 6,
    module: "users",
    action: "view",
    description: "viewAllUsers",
  },
  {
    id: 45,
    id_user: 6,
    module: "users",
    action: "create",
    description: "createNewUsers",
  },
  { id: 46, id_user: 6, module: "users", action: "edit" },
  { id: 47, id_user: 6, module: "reports", action: "view" },

  // User 7 (jorge_manager — Manager): finance focus
  { id: 48, id_user: 7, module: "users", action: "view" },
  { id: 49, id_user: 7, module: "orders", action: "view" },
  { id: 50, id_user: 7, module: "orders", action: "edit" },
  { id: 51, id_user: 7, module: "orders", action: "cancel" },
  { id: 52, id_user: 7, module: "reports", action: "view" },
  {
    id: 53,
    id_user: 7,
    module: "reports",
    action: "export",
    description: "exportFinancialReports",
  },

  // User 8 (sofia_dev — User): engineering
  { id: 54, id_user: 8, module: "users", action: "view" },
  { id: 55, id_user: 8, module: "products", action: "view" },
  { id: 56, id_user: 8, module: "products", action: "edit" },
  { id: 57, id_user: 8, module: "reports", action: "view" },

  // User 9 (rafael_designer — User): design
  { id: 58, id_user: 9, module: "users", action: "view" },
  { id: 59, id_user: 9, module: "products", action: "view" },
  { id: 60, id_user: 9, module: "products", action: "create" },
  { id: 61, id_user: 9, module: "reports", action: "view" },

  // User 10 (marta_analyst — User): data analysis
  { id: 62, id_user: 10, module: "users", action: "view" },
  { id: 63, id_user: 10, module: "orders", action: "view" },
  { id: 64, id_user: 10, module: "reports", action: "view" },
  { id: 65, id_user: 10, module: "reports", action: "export" },

  // User 11 (joao_tech — User): support
  { id: 66, id_user: 11, module: "users", action: "view" },
  { id: 67, id_user: 11, module: "orders", action: "view" },
  { id: 68, id_user: 11, module: "orders", action: "edit" },

  // User 12 (clara_writer — User): content
  { id: 69, id_user: 12, module: "users", action: "view" },
  { id: 70, id_user: 12, module: "products", action: "view" },
  { id: 71, id_user: 12, module: "products", action: "create" },
  { id: 72, id_user: 12, module: "products", action: "edit" },

  // User 13 (miguel_qa — User): QA testing
  { id: 73, id_user: 13, module: "users", action: "view" },
  { id: 74, id_user: 13, module: "products", action: "view" },
  { id: 75, id_user: 13, module: "reports", action: "view" },

  // User 14 (teresa_hr — User): HR
  { id: 76, id_user: 14, module: "users", action: "view" },
  { id: 77, id_user: 14, module: "users", action: "edit" },
  { id: 78, id_user: 14, module: "reports", action: "view" },

  // User 15 (bruno_sales — User): sales
  { id: 79, id_user: 15, module: "users", action: "view" },
  { id: 80, id_user: 15, module: "orders", action: "view" },
  { id: 81, id_user: 15, module: "orders", action: "create" },
  { id: 82, id_user: 15, module: "products", action: "view" },

  // User 16 (paula_marketing — User): marketing
  { id: 83, id_user: 16, module: "users", action: "view" },
  { id: 84, id_user: 16, module: "products", action: "view" },
  { id: 85, id_user: 16, module: "reports", action: "view" },

  // User 17 (diego_ops — User): DevOps
  { id: 86, id_user: 17, module: "users", action: "view" },
  { id: 87, id_user: 17, module: "settings", action: "view" },
  { id: 88, id_user: 17, module: "reports", action: "view" },

  // User 18 (vitoria_pm — User): product management
  { id: 89, id_user: 18, module: "users", action: "view" },
  { id: 90, id_user: 18, module: "orders", action: "view" },
  { id: 91, id_user: 18, module: "products", action: "view" },
  { id: 92, id_user: 18, module: "products", action: "edit" },
  { id: 93, id_user: 18, module: "reports", action: "view" },
  { id: 94, id_user: 18, module: "reports", action: "export" },

  // User 19 (lucas_backend — User): backend dev
  { id: 95, id_user: 19, module: "users", action: "view" },
  { id: 96, id_user: 19, module: "products", action: "view" },
  { id: 97, id_user: 19, module: "products", action: "edit" },

  // User 20 (julia_frontend — User): frontend dev
  { id: 98, id_user: 20, module: "users", action: "view" },
  { id: 99, id_user: 20, module: "products", action: "view" },
  { id: 100, id_user: 20, module: "products", action: "edit" },
  { id: 101, id_user: 20, module: "reports", action: "view" },

  // User 21 (guest_externo — External): read-only
  { id: 102, id_user: 21, module: "users", action: "view" },
  { id: 103, id_user: 21, module: "products", action: "view" },

  // User 22 (vendor_acme — External): limited order access
  {
    id: 104,
    id_user: 22,
    module: "orders",
    action: "view",
    description: "viewAssignedOrders",
  },
  { id: 105, id_user: 22, module: "products", action: "view" },

  // User 23 (consultant_x — External): temporary access
  { id: 106, id_user: 23, module: "users", action: "view" },
  { id: 107, id_user: 23, module: "reports", action: "view" },

  // User 24 (partner_y — External): partnership access
  { id: 108, id_user: 24, module: "orders", action: "view" },
  { id: 109, id_user: 24, module: "products", action: "view" },
  { id: 110, id_user: 24, module: "reports", action: "view" },
];

// Returns the permissions granted to a user (mocked, with a small delay).
export function getPermissionsByUser(userId: number): Promise<Permission[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(seedPermissions.filter((p) => p.id_user === userId));
    }, 150);
  });
}
