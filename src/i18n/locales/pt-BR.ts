import type { DemoMessages } from '../index';

/** Demo-app specific messages (Brazilian Portuguese). */
const ptBR: DemoMessages = {
	// Home
	home: 'Início',
	welcome: 'Bem-vindo',
	homePage: 'Página inicial carregada com sucesso',

	// Users
	users: 'Usuários',
	user: 'Usuário',
	login: 'Login',
	name: 'Nome',
	department: 'Departamento',
	status: 'Status',
	role: 'Papel',
	filterByRole: 'Filtrar por papel do usuário',
	searchHint: 'Digite para filtrar por nome ou login',
	searchPlaceholder: 'Buscar por nome ou login...',
	viewUserDetails: 'Ver detalhes do usuário',
	editUser: 'Editar usuário',
	deleteUser: 'Excluir usuário',
	basicInfo: 'Informações básicas',
	relatedRecords: 'Registros Relacionados',
	permissions: 'Permissões',
	profiles: 'Perfis',
	noProfiles: 'Nenhum perfil atribuído a este usuário.',
	newUser: 'Novo usuário',
	editUserTitle: 'Editar usuário',
	deleteUserTitle: 'Excluir usuário',
	uniqueLoginHint: 'Nome de login único',
	fullNameHint: 'Nome completo',
	userRoleHint: 'Papel do usuário',
	accountStatusHint: 'Status da conta',
	departmentHint: 'Nome do departamento',
	deleteUserMessage: 'Tem certeza de que deseja excluir',
	thisUser: 'este usuário',
	active: 'Ativo',
	inactive: 'Inativo',
	pending: 'Pendente',
	noFilter: '[sem filtro]',
	admin: 'Administrador',
	manager: 'Gerente',
	external: 'Externo/Restrito',

	// Permissions
	module: 'Módulo',
	action: 'Ação',
	description: 'Descrição',
	orders: 'Pedidos',
	products: 'Produtos',
	reports: 'Relatórios',
	settings: 'Configurações',
	cancel: 'Cancelar',
	moduleHint: 'Módulo ao qual a permissão se aplica',
	actionHint: 'Ação permitida no módulo',
	descriptionHint: 'Descrição opcional',
	descriptionPlaceholder: 'ex. Ver todos os pedidos',
	moduleRequired: 'Módulo é obrigatório',
	actionRequired: 'Ação é obrigatória',

	// Permission descriptions (seed data)
	viewAllUsers: 'Ver todos os usuários',
	editUserProfiles: 'Editar perfis de usuário',
	viewAllOrders: 'Ver todos os pedidos',
	exportReportsCsv: 'Exportar relatórios para CSV',
	changeSystemSettings: 'Alterar configurações do sistema',

	// Permission actions
	create: 'Criar',
	export: 'Exportar',
	view: 'Visualizar',
	edit: 'Editar',
	delete: 'Excluir'
};

export default ptBR;
