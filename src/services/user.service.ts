
// Role configuration — labels are i18n keys resolved by the UI (see getRoleOptions).
export const RoleList = [
  { key: "-", label: "noFilter" },
  { key: "A", label: "admin" },
  { key: "M", label: "manager" },
  { key: "U", label: "user" },
  { key: "X", label: "external" }
];

export type UserRole = '-' | 'A' | 'M' | 'U' | 'X';
export type UserStatus = 'active' | 'inactive' | 'pending';

// User entity definition
export interface User {
  id?: number;
  role: UserRole;
  login: string;
  name: string;
  department?: string;
  status?: UserStatus;
}

// Expanded user list with diverse profiles (25 users)
export const UserList: User[] = [
  // Admins (3)
  { id: 1, role: "A", login: "edujed", name: "Eduardo Junior", department: "Engineering", status: "active" },
  { id: 2, role: "A", login: "maria_admin", name: "Maria Santos", department: "IT Operations", status: "active" },
  { id: 3, role: "A", login: "carlos_root", name: "Carlos Mendes", department: "Security", status: "active" },

  // Managers (4)
  { id: 4, role: "M", login: "ana_gestora", name: "Ana Rodrigues", department: "Sales", status: "active" },
  { id: 5, role: "M", login: "pedro_supervisor", name: "Pedro Silva", department: "Marketing", status: "active" },
  { id: 6, role: "M", login: "lucia_gerente", name: "Lúcia Ferreira", department: "HR", status: "pending" },
  { id: 7, role: "M", login: "jorge_manager", name: "Jorge Oliveira", department: "Finance", status: "active" },

  // Regular Users (14) - mixed departments and statuses
  { id: 8, role: "U", login: "sofia_dev", name: "Sofia Martins", department: "Engineering", status: "active" },
  { id: 9, role: "U", login: "rafael_designer", name: "Rafael Costa", department: "Design", status: "active" },
  { id: 10, role: "U", login: "marta_analyst", name: "Marta Lopes", department: "Data Analysis", status: "inactive" },
  { id: 11, role: "U", login: "joao_tech", name: "João Pereira", department: "Support", status: "active" },
  { id: 12, role: "U", login: "clara_writer", name: "Clara Dias", department: "Content", status: "active" },
  { id: 13, role: "U", login: "miguel_qa", name: "Miguel Neto", department: "QA Testing", status: "pending" },
  { id: 14, role: "U", login: "teresa_hr", name: "Teresa Alves", department: "Human Resources", status: "active" },
  { id: 15, role: "U", login: "bruno_sales", name: "Bruno Machado", department: "Sales", status: "active" },
  { id: 16, role: "U", login: "paula_marketing", name: "Paula Santos", department: "Marketing", status: "inactive" },
  { id: 17, role: "U", login: "diego_ops", name: "Diego Ribeiro", department: "DevOps", status: "active" },
  { id: 18, role: "U", login: "vitoria_pm", name: "Vitória Campos", department: "Product Management", status: "active" },
  { id: 19, role: "U", login: "lucas_backend", name: "Lucas Mendes", department: "Backend Development", status: "active" },
  { id: 20, role: "U", login: "julia_frontend", name: "Júlia Torres", department: "Frontend Development", status: "pending" },

  // External/Restricted Users (4)
  { id: 21, role: "X", login: "guest_externo", name: "Guest Visitor", department: "External", status: "active" },
  { id: 22, role: "X", login: "vendor_acme", name: "ACME Representative", department: "Vendor Access", status: "active" },
  { id: 23, role: "X", login: "consultant_x", name: "Temporary Consultant", department: "Consulting", status: "pending" },
  { id: 24, role: "X", login: "partner_y", name: "Partner Company User", department: "Partnership", status: "inactive" }
];

// Lookup by primary key
export function getUserById(id: number): User[] {
	return UserList.filter(u => u.id === id);
}

// Search/filter function for users
export function filterUsers(
  users: User[],
  query: string = "",
  roleFilter?: UserRole | '-'
): User[] {
  const normalizedQuery = query.toLowerCase().trim();

  return users
    .filter((user) => {

      const matchesRole = !roleFilter || roleFilter === '-' || user.role === roleFilter;

    // If no search query, only apply role filtering
    if (!normalizedQuery || !normalizedQuery.length) return matchesRole;

    // Apply text search across multiple fields
    const matchesSearch =
      user.login.toLowerCase().includes(normalizedQuery) ||
      user.name.toLowerCase().includes(normalizedQuery);

    return matchesRole && matchesSearch;
  });
}
