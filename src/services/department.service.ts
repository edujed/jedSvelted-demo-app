// Department entity definition
export interface Department {
  id?: number;
  name: string;
  code?: string;
  location?: string;
  manager?: string;
  employeeCount?: number;
  createdAt?: string;
}

// Department list (mocked)
export const DepartmentList: Department[] = [
  {
    id: 1,
    name: "Engineering",
    code: "ENG",
    location: "Building A",
    manager: "Eduardo Junior",
    employeeCount: 8,
    createdAt: "2023-01-15T09:00:00Z",
  },
  {
    id: 2,
    name: "IT Operations",
    code: "ITOPS",
    location: "Building A",
    manager: "Maria Santos",
    employeeCount: 5,
    createdAt: "2023-03-22T10:30:00Z",
  },
  {
    id: 3,
    name: "Security",
    code: "SEC",
    location: "Building B",
    manager: "Carlos Mendes",
    employeeCount: 3,
    createdAt: "2023-06-10T14:00:00Z",
  },
  {
    id: 4,
    name: "Sales",
    code: "SALES",
    location: "Building C",
    manager: "Ana Rodrigues",
    employeeCount: 6,
    createdAt: "2023-08-05T08:00:00Z",
  },
  {
    id: 5,
    name: "Marketing",
    code: "MKT",
    location: "Building C",
    manager: "Pedro Silva",
    employeeCount: 4,
    createdAt: "2023-09-18T13:15:00Z",
  },
  {
    id: 6,
    name: "HR",
    code: "HR",
    location: "Building B",
    manager: "Lúcia Ferreira",
    employeeCount: 3,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: 7,
    name: "Finance",
    code: "FIN",
    location: "Building B",
    manager: "Jorge Oliveira",
    employeeCount: 4,
    createdAt: "2023-11-25T11:45:00Z",
  },
  {
    id: 8,
    name: "Design",
    code: "DES",
    location: "Building A",
    manager: "Rafael Costa",
    employeeCount: 2,
    createdAt: "2024-03-08T14:20:00Z",
  },
  {
    id: 9,
    name: "Data Analysis",
    code: "DATA",
    location: "Building A",
    manager: "Marta Lopes",
    employeeCount: 3,
    createdAt: "2024-04-22T08:15:00Z",
  },
  {
    id: 10,
    name: "Support",
    code: "SUP",
    location: "Building C",
    manager: "João Pereira",
    employeeCount: 5,
    createdAt: "2024-05-30T10:00:00Z",
  },
  {
    id: 11,
    name: "Content",
    code: "CNT",
    location: "Building C",
    manager: "Clara Dias",
    employeeCount: 2,
    createdAt: "2024-06-15T11:30:00Z",
  },
  {
    id: 12,
    name: "QA Testing",
    code: "QA",
    location: "Building A",
    manager: "Miguel Neto",
    employeeCount: 3,
    createdAt: "2024-07-20T09:00:00Z",
  },
  {
    id: 13,
    name: "Human Resources",
    code: "HR2",
    location: "Building B",
    manager: "Teresa Alves",
    employeeCount: 2,
    createdAt: "2024-08-12T13:45:00Z",
  },
  {
    id: 14,
    name: "DevOps",
    code: "DEVOPS",
    location: "Building A",
    manager: "Diego Ribeiro",
    employeeCount: 3,
    createdAt: "2024-11-25T14:00:00Z",
  },
  {
    id: 15,
    name: "Product Management",
    code: "PM",
    location: "Building C",
    manager: "Vitória Campos",
    employeeCount: 2,
    createdAt: "2024-12-10T09:20:00Z",
  },
  {
    id: 16,
    name: "Backend Development",
    code: "BE",
    location: "Building A",
    manager: "Lucas Mendes",
    employeeCount: 4,
    createdAt: "2025-01-08T11:00:00Z",
  },
  {
    id: 17,
    name: "Frontend Development",
    code: "FE",
    location: "Building A",
    manager: "Júlia Torres",
    employeeCount: 3,
    createdAt: "2025-02-14T10:30:00Z",
  },
  {
    id: 18,
    name: "External",
    code: "EXT",
    location: "Remote",
    manager: "Guest Visitor",
    employeeCount: 1,
    createdAt: "2025-03-01T08:00:00Z",
  },
  {
    id: 19,
    name: "Vendor Access",
    code: "VEND",
    location: "Remote",
    manager: "ACME Representative",
    employeeCount: 1,
    createdAt: "2025-04-15T09:30:00Z",
  },
  {
    id: 20,
    name: "Consulting",
    code: "CONS",
    location: "Remote",
    manager: "Temporary Consultant",
    employeeCount: 1,
    createdAt: "2025-05-20T10:00:00Z",
  },
  {
    id: 21,
    name: "Partnership",
    code: "PART",
    location: "Remote",
    manager: "Partner Company User",
    employeeCount: 1,
    createdAt: "2025-06-10T14:30:00Z",
  },
];

// Lookup by primary key
export function getDepartmentById(id: number): Department[] {
  return DepartmentList.filter((d) => d.id === id);
}

// Search/filter function for departments
export function filterDepartments(
  departments: Department[],
  query: string = "",
): Department[] {
  const normalizedQuery = query.toLowerCase().trim();

  return departments.filter((dept) => {
    if (!normalizedQuery || !normalizedQuery.length) return true;

    const matchesSearch =
      dept.name.toLowerCase().includes(normalizedQuery) ||
      (dept.code?.toLowerCase().includes(normalizedQuery) ?? false) ||
      (dept.location?.toLowerCase().includes(normalizedQuery) ?? false) ||
      (dept.manager?.toLowerCase().includes(normalizedQuery) ?? false);

    return matchesSearch;
  });
}
