/**
 * Demo-app specific messages (English).
 * These are NOT part of the lib — they belong to this application.
 * Generic messages (Save, Cancel, Delete, etc.) live in the lib's i18n module.
 */
export default {
	// Home
	home: 'Home',
	welcome: 'Welcome',
	homePage: 'Home page loaded successfully',

	// Users
	users: 'Users',
	user: 'User',
	login: 'Login',
	name: 'Name',
	department: 'Department',
	status: 'Status',
	role: 'Role',
	filterByRole: 'Filter by user role',
	searchHint: 'Type to filter by name or login',
	searchPlaceholder: 'Search by name or login...',
	viewUserDetails: 'View user details',
	editUser: 'Edit user',
	deleteUser: 'Delete user',
	basicInfo: 'Basic info',
	relatedRecords: 'Related Records',
	permissions: 'Permissions',
	profiles: 'Profiles',
	noProfiles: 'No profiles assigned to this user.',
	newUser: 'New user',
	editUserTitle: 'Edit user',
	deleteUserTitle: 'Delete user',
	uniqueLoginHint: 'Unique login name',
	fullNameHint: 'Full name',
	userRoleHint: 'User role',
	accountStatusHint: 'Account status',
	departmentHint: 'Department name',
	deleteUserMessage: 'Are you sure you want to delete',
	thisUser: 'this user',
	active: 'Active',
	inactive: 'Inactive',
	pending: 'Pending',
	noFilter: '[no filter]',
	admin: 'Admin',
	manager: 'Manager',
	external: 'External/Restrict',

	// Permissions
	module: 'Module',
	action: 'Action',
	description: 'Description',
	orders: 'Orders',
	products: 'Products',
	reports: 'Reports',
	settings: 'Settings',
	cancel: 'Cancel',
	moduleHint: 'Module the permission applies to',
	actionHint: 'Action allowed on the module',
	descriptionHint: 'Optional description',
	descriptionPlaceholder: 'e.g. View all orders',
	moduleRequired: 'Module is required',
	actionRequired: 'Action is required',

	// Permission descriptions (seed data)
	viewAllUsers: 'View all users',
	editUserProfiles: 'Edit user profiles',
	viewAllOrders: 'View all orders',
	exportReportsCsv: 'Export reports to CSV',
	changeSystemSettings: 'Change system settings',

	// Permission actions
	create: 'Create',
	export: 'Export',
	view: 'View',
	edit: 'Edit',
	delete: 'Delete'
} as const;
