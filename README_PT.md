# VL Store Import - Loja de Perfumes Importados

Uma aplicação completa de e-commerce para venda de perfumes importados, desenvolvida com React, TypeScript, Tailwind CSS e Supabase.

## Funcionalidades

### Para Usuários
- **Autenticação**: Login e registro de usuários
- **Catálogo de Produtos**: Navegação e busca de perfumes por marca
- **Detalhes do Produto**: Visualização completa com imagens e descrições
- **Avaliações**: Sistema de avaliação com estrelas (1-5) e comentários
- **Favoritos**: Adicionar perfumes aos favoritos para acesso rápido
- **Carrinho de Compras**: Gerenciamento de itens com quantidades
- **Checkout**: Finalização via WhatsApp ou Instagram com resumo do pedido
- **Perfil**: Gerenciamento de informações pessoais

### Para Administradores
- **Gestão de Perfumes**: Criar, editar e excluir produtos
- **Upload de Imagens**: Conversão automática para Base64
- **Controle de Status**: Marcar produtos como disponíveis ou indisponíveis
- **Promoções**: Configurar preços promocionais
- **Gestão de Usuários**: Visualizar usuários e gerenciar permissões de admin
- **Analytics**: Visualização de métricas (em desenvolvimento)

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Ícones**: Lucide React
- **Build Tool**: Vite

## Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

As credenciais do Supabase já estão configuradas no arquivo `.env`:

```
VITE_SUPABASE_URL=https://tmtcoaxmjxmnpqcnvjtz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Criar Usuário Admin

1. Execute a aplicação: `npm run dev`
2. Acesse a página de registro
3. Crie um usuário com:
   - **Email**: admin@vlstore.com
   - **Senha**: administrator
   - **Nome**: Administrator

O sistema irá automaticamente configurar este usuário como administrador.

### 4. Iniciar Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Estrutura do Banco de Dados

### Tabelas

- **profiles**: Informações dos usuários
- **perfumes**: Catálogo de produtos
- **reviews**: Avaliações dos produtos
- **favorites**: Lista de favoritos dos usuários
- **cart_items**: Itens do carrinho de compras

### Segurança

Todas as tabelas possuem Row Level Security (RLS) configurado:
- Usuários só podem acessar seus próprios dados
- Apenas admins podem gerenciar perfumes
- Políticas específicas para cada operação (SELECT, INSERT, UPDATE, DELETE)

## Fluxo de Uso

### Cliente
1. Registrar/Login
2. Navegar pelo catálogo
3. Filtrar por marca ou buscar produtos
4. Ver detalhes do produto
5. Adicionar avaliação e estrelas
6. Adicionar aos favoritos
7. Adicionar ao carrinho
8. Finalizar pedido via WhatsApp ou Instagram

### Administrador
1. Login com credenciais de admin
2. Acessar painel "Admin" no menu
3. Cadastrar novos perfumes com imagens
4. Gerenciar produtos existentes
5. Visualizar e gerenciar usuários

## Contatos da Loja

- **WhatsApp**: +55 19 99248-3502
- **Instagram**: @viniciuss.lucas

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter
- `npm run typecheck` - Verifica tipos TypeScript

## Design

O design da aplicação segue o tema escuro elegante com:
- **Cores principais**: Cinza escuro, preto e dourado/âmbar
- **Gradientes**: De cinza-900 para preto
- **Acentos**: Dourado/âmbar (#F59E0B) para CTAs e destaques
- **Tipografia**: System fonts com hierarquia clara
- **Responsividade**: Totalmente adaptável para mobile, tablet e desktop

## Recursos de Segurança

- Autenticação via Supabase Auth
- Row Level Security em todas as tabelas
- Validação de permissões de admin
- Proteção contra acesso não autorizado
- Sanitização de inputs

## Próximas Funcionalidades

- [ ] Sistema de pagamento integrado
- [ ] Analytics avançado para admins
- [ ] Notificações por email
- [ ] Sistema de cupons de desconto
- [ ] Histórico de pedidos
- [ ] Chat de suporte

## Suporte

Para dúvidas ou problemas, entre em contato através do WhatsApp ou Instagram listados acima.

## Licença

Este projeto é propriedade da VL Store Import.
