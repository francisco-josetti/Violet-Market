export const routes = {
  home: '/',
  catalog: '/catalog',
  cart: '/cart',
  login: '/login',
  register: '/cadastro',
  resetPassword: '/reset-password',
  profile: '/perfil',
  plans: '/planos',
  product: (id: string) => `/produto/${id}`,
  sell: '/sell',
  sellSuccess: '/sell/success',
  catalogWithCategory: (category: string) =>
    `/catalog?categoria=${encodeURIComponent(category)}`,
} as const;

export const authRoutes = [routes.login, routes.register, routes.resetPassword] as const;

export function isAuthRoute(pathname: string) {
  return authRoutes.includes(pathname as (typeof authRoutes)[number]);
}
