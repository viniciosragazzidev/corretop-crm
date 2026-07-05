<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Regras do Projeto

## shadcn/ui

**SEMPRE QUE POSSÍVEL, INSTALAR E USAR COMPONENTES DO SHADCN.**

- Verificar componentes existentes antes de criar markup customizado.
- Usar variantes embutidas antes de estilos manuais.
- Cores semânticas (`bg-primary`, `text-muted-foreground`), nunca valores brutos.
- Seguir as regras em `.agents/skills/shadcn/rules/`.
