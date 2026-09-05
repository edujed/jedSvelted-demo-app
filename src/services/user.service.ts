// Role configuration — labels are i18n keys resolved by the UI (see getRoleOptions).
export const RoleList = [
  { key: "-", label: "noFilter" },
  { key: "A", label: "admin" },
  { key: "M", label: "manager" },
  { key: "U", label: "user" },
  { key: "X", label: "external" },
];

export type UserRole = "-" | "A" | "M" | "U" | "X";
export type UserStatus = "active" | "inactive" | "pending";

// Status configuration — labels are i18n keys resolved by the UI.
// StatusList: form options (no "no filter" entry).
// StatusFilterList: filter options (includes the "no filter" entry, like RoleList).
export const StatusList = [
  { key: "active", label: "active" },
  { key: "inactive", label: "inactive" },
  { key: "pending", label: "pending" },
];

export const StatusFilterList = [
  { key: "-", label: "noFilter" },
  ...StatusList,
];

// User entity definition
export interface User {
  id?: number;
  role: UserRole;
  login: string;
  name: string;
  department?: string;
  status?: UserStatus;
  email?: string;
  createdAt?: string;
  lastLogin?: string;
}

// Activity log entry for a user
export interface UserActivity {
  id: number;
  userId: number;
  timestamp: string;
  type:
    | "login"
    | "logout"
    | "password_change"
    | "profile_update"
    | "permission_change"
    | "role_change";
  description: string; // i18n key
  ip?: string;
}

// Expanded user list with diverse profiles (25 users)
export const UserList: User[] = [
  // Admins (3)
  {
    id: 1,
    role: "A",
    login: "edujed",
    name: "Eduardo Junior",
    department: "Engineering",
    status: "active",
    email: "eduardo.junior@company.com",
    createdAt: "2023-01-15T09:00:00Z",
    lastLogin: "2026-09-04T14:32:00Z",
  },
  {
    id: 2,
    role: "A",
    login: "maria_admin",
    name: "Maria Santos",
    department: "IT Operations",
    status: "active",
    email: "maria.santos@company.com",
    createdAt: "2023-03-22T10:30:00Z",
    lastLogin: "2026-09-04T08:15:00Z",
  },
  {
    id: 3,
    role: "A",
    login: "carlos_root",
    name: "Carlos Mendes",
    department: "Security",
    status: "active",
    email: "carlos.mendes@company.com",
    createdAt: "2023-06-10T14:00:00Z",
    lastLogin: "2026-09-03T17:45:00Z",
  },

  // Managers (4)
  {
    id: 4,
    role: "M",
    login: "ana_gestora",
    name: "Ana Rodrigues",
    department: "Sales",
    status: "active",
    email: "ana.rodrigues@company.com",
    createdAt: "2023-08-05T08:00:00Z",
    lastLogin: "2026-09-04T11:20:00Z",
  },
  {
    id: 5,
    role: "M",
    login: "pedro_supervisor",
    name: "Pedro Silva",
    department: "Marketing",
    status: "active",
    email: "pedro.silva@company.com",
    createdAt: "2023-09-18T13:15:00Z",
    lastLogin: "2026-09-02T09:30:00Z",
  },
  {
    id: 6,
    role: "M",
    login: "lucia_gerente",
    name: "Lúcia Ferreira",
    department: "HR",
    status: "pending",
    email: "lucia.ferreira@company.com",
    createdAt: "2024-01-10T10:00:00Z",
    lastLogin: "2026-08-28T16:00:00Z",
  },
  {
    id: 7,
    role: "M",
    login: "jorge_manager",
    name: "Jorge Oliveira",
    department: "Finance",
    status: "active",
    email: "jorge.oliveira@company.com",
    createdAt: "2023-11-25T11:45:00Z",
    lastLogin: "2026-09-04T07:50:00Z",
  },

  // Regular Users (14) - mixed departments and statuses
  {
    id: 8,
    role: "U",
    login: "sofia_dev",
    name: "Sofia Martins",
    department: "Engineering",
    status: "active",
    email: "sofia.martins@company.com",
    createdAt: "2024-02-14T09:30:00Z",
    lastLogin: "2026-09-04T13:10:00Z",
  },
  {
    id: 9,
    role: "U",
    login: "rafael_designer",
    name: "Rafael Costa",
    department: "Design",
    status: "active",
    email: "rafael.costa@company.com",
    createdAt: "2024-03-08T14:20:00Z",
    lastLogin: "2026-09-03T10:45:00Z",
  },
  {
    id: 10,
    role: "U",
    login: "marta_analyst",
    name: "Marta Lopes",
    department: "Data Analysis",
    status: "inactive",
    email: "marta.lopes@company.com",
    createdAt: "2024-04-22T08:15:00Z",
    lastLogin: "2026-07-15T15:30:00Z",
  },
  {
    id: 11,
    role: "U",
    login: "joao_tech",
    name: "João Pereira",
    department: "Support",
    status: "active",
    email: "joao.pereira@company.com",
    createdAt: "2024-05-30T10:00:00Z",
    lastLogin: "2026-09-04T12:00:00Z",
  },
  {
    id: 12,
    role: "U",
    login: "clara_writer",
    name: "Clara Dias",
    department: "Content",
    status: "active",
    email: "clara.dias@company.com",
    createdAt: "2024-06-15T11:30:00Z",
    lastLogin: "2026-09-01T14:20:00Z",
  },
  {
    id: 13,
    role: "U",
    login: "miguel_qa",
    name: "Miguel Neto",
    department: "QA Testing",
    status: "pending",
    email: "miguel.neto@company.com",
    createdAt: "2024-07-20T09:00:00Z",
    lastLogin: "2026-08-25T10:15:00Z",
  },
  {
    id: 14,
    role: "U",
    login: "teresa_hr",
    name: "Teresa Alves",
    department: "Human Resources",
    status: "active",
    email: "teresa.alves@company.com",
    createdAt: "2024-08-12T13:45:00Z",
    lastLogin: "2026-09-03T09:00:00Z",
  },
  {
    id: 15,
    role: "U",
    login: "bruno_sales",
    name: "Bruno Machado",
    department: "Sales",
    status: "active",
    email: "bruno.machado@company.com",
    createdAt: "2024-09-05T08:30:00Z",
    lastLogin: "2026-09-04T10:30:00Z",
  },
  {
    id: 16,
    role: "U",
    login: "paula_marketing",
    name: "Paula Santos",
    department: "Marketing",
    status: "inactive",
    email: "paula.santos@company.com",
    createdAt: "2024-10-18T10:15:00Z",
    lastLogin: "2026-08-01T11:00:00Z",
  },
  {
    id: 17,
    role: "U",
    login: "diego_ops",
    name: "Diego Ribeiro",
    department: "DevOps",
    status: "active",
    email: "diego.ribeiro@company.com",
    createdAt: "2024-11-25T14:00:00Z",
    lastLogin: "2026-09-04T06:45:00Z",
  },
  {
    id: 18,
    role: "U",
    login: "vitoria_pm",
    name: "Vitória Campos",
    department: "Product Management",
    status: "active",
    email: "vitoria.campos@company.com",
    createdAt: "2024-12-10T09:20:00Z",
    lastLogin: "2026-09-03T15:30:00Z",
  },
  {
    id: 19,
    role: "U",
    login: "lucas_backend",
    name: "Lucas Mendes",
    department: "Backend Development",
    status: "active",
    email: "lucas.mendes@company.com",
    createdAt: "2025-01-08T11:00:00Z",
    lastLogin: "2026-09-04T13:45:00Z",
  },
  {
    id: 20,
    role: "U",
    login: "julia_frontend",
    name: "Júlia Torres",
    department: "Frontend Development",
    status: "pending",
    email: "julia.torres@company.com",
    createdAt: "2025-02-14T10:30:00Z",
    lastLogin: "2026-08-30T14:00:00Z",
  },

  // External/Restricted Users (4)
  {
    id: 21,
    role: "X",
    login: "guest_externo",
    name: "Guest Visitor",
    department: "External",
    status: "active",
    email: "guest@external.com",
    createdAt: "2025-03-01T08:00:00Z",
    lastLogin: "2026-09-02T12:00:00Z",
  },
  {
    id: 22,
    role: "X",
    login: "vendor_acme",
    name: "ACME Representative",
    department: "Vendor Access",
    status: "active",
    email: "rep@acme.com",
    createdAt: "2025-04-15T09:30:00Z",
    lastLogin: "2026-09-03T16:30:00Z",
  },
  {
    id: 23,
    role: "X",
    login: "consultant_x",
    name: "Temporary Consultant",
    department: "Consulting",
    status: "pending",
    email: "consultant@temp.com",
    createdAt: "2025-05-20T10:00:00Z",
    lastLogin: "2026-08-20T09:00:00Z",
  },
  {
    id: 24,
    role: "X",
    login: "partner_y",
    name: "Partner Company User",
    department: "Partnership",
    status: "inactive",
    email: "partner@partner.com",
    createdAt: "2025-06-10T14:30:00Z",
    lastLogin: "2026-07-20T11:30:00Z",
  },
];

// Lookup by primary key
export function getUserById(id: number): User[] {
  return UserList.filter((u) => u.id === id);
}

// Search/filter function for users
export function filterUsers(
  users: User[],
  query: string = "",
  roleFilter?: UserRole | "-",
  statusFilter?: UserStatus | "-",
): User[] {
  const normalizedQuery = query.toLowerCase().trim();

  return users.filter((user) => {
    const matchesRole =
      !roleFilter || roleFilter === "-" || user.role === roleFilter;
    const matchesStatus =
      !statusFilter || statusFilter === "-" || user.status === statusFilter;

    // If no search query, only apply role/status filtering
    if (!normalizedQuery || !normalizedQuery.length)
      return matchesRole && matchesStatus;

    // Apply text search across multiple fields
    const matchesSearch =
      user.login.toLowerCase().includes(normalizedQuery) ||
      user.name.toLowerCase().includes(normalizedQuery);

    return matchesRole && matchesStatus && matchesSearch;
  });
}

// Mock activity log data (descriptions are i18n keys resolved by the UI)
const seedActivity: UserActivity[] = [
  // User 1 (edujed)
  {
    id: 1,
    userId: 1,
    timestamp: "2026-09-04T14:32:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.1.10",
  },
  {
    id: 2,
    userId: 1,
    timestamp: "2026-09-04T09:15:00Z",
    type: "permission_change",
    description: "activityPermGranted",
    ip: "192.168.1.10",
  },
  {
    id: 3,
    userId: 1,
    timestamp: "2026-09-03T16:45:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.1.10",
  },
  {
    id: 4,
    userId: 1,
    timestamp: "2026-09-03T08:30:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.1.10",
  },
  {
    id: 5,
    userId: 1,
    timestamp: "2026-09-01T11:20:00Z",
    type: "password_change",
    description: "activityPasswordChanged",
    ip: "192.168.1.10",
  },
  {
    id: 6,
    userId: 1,
    timestamp: "2026-08-28T14:00:00Z",
    type: "profile_update",
    description: "activityProfileUpdated",
    ip: "10.0.0.5",
  },
  {
    id: 7,
    userId: 1,
    timestamp: "2026-08-25T10:30:00Z",
    type: "role_change",
    description: "activityRoleChanged",
    ip: "192.168.1.10",
  },

  // User 2 (maria_admin)
  {
    id: 8,
    userId: 2,
    timestamp: "2026-09-04T08:15:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.1.20",
  },
  {
    id: 9,
    userId: 2,
    timestamp: "2026-09-03T17:30:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.1.20",
  },
  {
    id: 10,
    userId: 2,
    timestamp: "2026-09-03T09:00:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.1.20",
  },
  {
    id: 11,
    userId: 2,
    timestamp: "2026-09-02T14:20:00Z",
    type: "permission_change",
    description: "activityPermRevoked",
    ip: "192.168.1.20",
  },
  {
    id: 12,
    userId: 2,
    timestamp: "2026-08-30T10:45:00Z",
    type: "profile_update",
    description: "activityProfileUpdated",
    ip: "192.168.1.20",
  },

  // User 3 (carlos_root)
  {
    id: 13,
    userId: 3,
    timestamp: "2026-09-03T17:45:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.1.30",
  },
  {
    id: 14,
    userId: 3,
    timestamp: "2026-09-03T08:00:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.1.30",
  },
  {
    id: 15,
    userId: 3,
    timestamp: "2026-09-02T16:30:00Z",
    type: "permission_change",
    description: "activityPermGranted",
    ip: "192.168.1.30",
  },
  {
    id: 16,
    userId: 3,
    timestamp: "2026-09-01T09:15:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.1.30",
  },

  // User 4 (ana_gestora)
  {
    id: 17,
    userId: 4,
    timestamp: "2026-09-04T11:20:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.2.10",
  },
  {
    id: 18,
    userId: 4,
    timestamp: "2026-09-03T15:45:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.2.10",
  },
  {
    id: 19,
    userId: 4,
    timestamp: "2026-09-03T08:30:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.2.10",
  },
  {
    id: 20,
    userId: 4,
    timestamp: "2026-09-01T10:00:00Z",
    type: "profile_update",
    description: "activityProfileUpdated",
    ip: "192.168.2.10",
  },

  // User 5 (pedro_supervisor)
  {
    id: 21,
    userId: 5,
    timestamp: "2026-09-02T09:30:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.2.20",
  },
  {
    id: 22,
    userId: 5,
    timestamp: "2026-09-01T17:00:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.2.20",
  },
  {
    id: 23,
    userId: 5,
    timestamp: "2026-09-01T08:15:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.2.20",
  },

  // User 8 (sofia_dev)
  {
    id: 24,
    userId: 8,
    timestamp: "2026-09-04T13:10:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.3.10",
  },
  {
    id: 25,
    userId: 8,
    timestamp: "2026-09-03T18:30:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.3.10",
  },
  {
    id: 26,
    userId: 8,
    timestamp: "2026-09-03T09:00:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.3.10",
  },
  {
    id: 27,
    userId: 8,
    timestamp: "2026-08-28T11:30:00Z",
    type: "password_change",
    description: "activityPasswordChanged",
    ip: "192.168.3.10",
  },

  // User 11 (joao_tech)
  {
    id: 28,
    userId: 11,
    timestamp: "2026-09-04T12:00:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.3.20",
  },
  {
    id: 29,
    userId: 11,
    timestamp: "2026-09-03T16:15:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.3.20",
  },
  {
    id: 30,
    userId: 11,
    timestamp: "2026-09-03T08:45:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.3.20",
  },

  // User 17 (diego_ops)
  {
    id: 31,
    userId: 17,
    timestamp: "2026-09-04T06:45:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.4.10",
  },
  {
    id: 32,
    userId: 17,
    timestamp: "2026-09-03T22:30:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.4.10",
  },
  {
    id: 33,
    userId: 17,
    timestamp: "2026-09-03T07:00:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.4.10",
  },
  {
    id: 34,
    userId: 17,
    timestamp: "2026-09-02T14:00:00Z",
    type: "permission_change",
    description: "activityPermGranted",
    ip: "192.168.4.10",
  },

  // User 19 (lucas_backend)
  {
    id: 35,
    userId: 19,
    timestamp: "2026-09-04T13:45:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.3.30",
  },
  {
    id: 36,
    userId: 19,
    timestamp: "2026-09-03T19:00:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "192.168.3.30",
  },
  {
    id: 37,
    userId: 19,
    timestamp: "2026-09-03T09:30:00Z",
    type: "login",
    description: "activityLogin",
    ip: "192.168.3.30",
  },

  // User 21 (guest_externo)
  {
    id: 38,
    userId: 21,
    timestamp: "2026-09-02T12:00:00Z",
    type: "login",
    description: "activityLogin",
    ip: "203.0.113.50",
  },
  {
    id: 39,
    userId: 21,
    timestamp: "2026-09-01T15:30:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "203.0.113.50",
  },

  // User 22 (vendor_acme)
  {
    id: 40,
    userId: 22,
    timestamp: "2026-09-03T16:30:00Z",
    type: "login",
    description: "activityLogin",
    ip: "198.51.100.25",
  },
  {
    id: 41,
    userId: 22,
    timestamp: "2026-09-02T10:15:00Z",
    type: "logout",
    description: "activityLogout",
    ip: "198.51.100.25",
  },
];

// Returns the activity log for a user (mocked, with a small delay).
export function getActivityByUser(userId: number): Promise<UserActivity[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        seedActivity
          .filter((a) => a.userId === userId)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          ),
      );
    }, 150);
  });
}
