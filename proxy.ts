import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas restritas apenas para usuários com role === 'ADMIN'
const ADMIN_ONLY_ROUTES = ['/crm/planos', '/crm/corretores']

// Next.js 16+ proxy router function
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Detecta se o usuário está acessando pelo subdomínio crm
  // Funciona para crm.venacorseguros.com, crm.venacorsaude.com.br e crm.localhost em dev
  const isCrmSubdomain = hostname.startsWith('crm.');
  const isCrmPath = url.pathname.startsWith('/crm');

  if (isCrmSubdomain && !isCrmPath) {
    url.pathname = `/crm${url.pathname}`;
  }

  // Verifica proteção da área CRM (qualquer rota /crm/* exceto login e API)
  if (url.pathname.startsWith('/crm') && url.pathname !== '/crm/login' && !url.pathname.startsWith('/crm/api')) {
    const sessionToken = request.cookies.get('better-auth.session_token') ||
                         request.cookies.get('__secure-better-auth.session_token');

    if (!sessionToken) {
      // Sem sessão → redireciona para login
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = isCrmSubdomain ? '/login' : '/crm/login';
      return NextResponse.redirect(redirectUrl);
    }

    // Verifica se a rota atual exige role ADMIN
    const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
      url.pathname.startsWith(route)
    );

    if (isAdminRoute) {
      // Consulta a API de sessão do better-auth para obter o role do usuário
      try {
        const origin = request.nextUrl.origin;
        const sessionRes = await fetch(`${origin}/api/auth/get-session`, {
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
          // Evita cache entre requests
          cache: 'no-store',
        });

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          const role = sessionData?.user?.role;

          if (role !== 'ADMIN') {
            // Autenticado mas sem permissão → redireciona para o dashboard
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = '/crm/resume';
            return NextResponse.redirect(redirectUrl);
          }
        } else {
          // Falha na verificação de sessão → redireciona para login por segurança
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = isCrmSubdomain ? '/login' : '/crm/login';
          return NextResponse.redirect(redirectUrl);
        }
      } catch {
        // Falha silenciosa: em caso de erro de rede no proxy, redireciona para o dashboard
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/crm/resume';
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  if (isCrmSubdomain && !isCrmPath) {
    return NextResponse.rewrite(url);
  }
}

// Garante que o Next.js processe o proxy em todas as páginas,
// ignorando arquivos estáticos, imagens e APIs para não perder desempenho
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.svg$|.*\\.webp$|.*\\.jpg$|.*\\.jpeg$).*)',
  ],
}
