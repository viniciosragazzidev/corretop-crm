import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function getSession(request: NextRequest) {
  const origin = request.nextUrl.origin
  const cookies = request.headers.get('cookie') || ''
  try {
    const res = await fetch(`${origin}/api/auth/get-session`, {
      headers: { cookie: cookies },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = url

  console.log(`[Proxy Log] Interceptando rota: ${pathname}`);

  // Permite o root (/) como público, e redireciona de /login se já logado
  if (pathname === '/') {
    return;
  }

  if (pathname === '/login') {
    const sessionData = await getSession(request)
    console.log(`[Proxy Log] Acesso ao /login. Sessão ativa:`, sessionData ? "Sim" : "Não");
    if (sessionData?.user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/resume'
      return NextResponse.redirect(redirectUrl)
    }
    return;
  }

  // Qualquer outra página exige autenticação
  const sessionData = await getSession(request)
  console.log(`[Proxy Log] Sessão encontrada para ${pathname}:`, sessionData ? "Sim (User: " + sessionData.user?.email + ")" : "Não");

  if (!sessionData?.user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Rotas restritas para Administradores
  const ADMIN_ONLY_ROUTES = ['/planos', '/corretores']
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isAdminRoute && sessionData.user.role !== 'ADMIN') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/resume'
    return NextResponse.redirect(redirectUrl)
  }
}

// Configuração para processar o proxy em todas as páginas exceto APIs, arquivos estáticos e imagens
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.svg$|.*\\.webp$|.*\\.jpg$|.*\\.jpeg$).*)',
  ],
}
