# Informações do Banco de Dados - VL Store Import

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas

#### 1. profiles
Armazena informações dos usuários.

**Campos:**
- `id` (uuid) - ID do usuário (referência para auth.users)
- `email` (text) - Email do usuário
- `full_name` (text) - Nome completo
- `is_admin` (boolean) - Se é administrador
- `created_at` (timestamptz) - Data de criação
- `updated_at` (timestamptz) - Data de atualização

**Trigger Especial:**
- Usuários com email `admin@vlstore.com` automaticamente recebem `is_admin = true`

#### 2. perfumes
Catálogo de produtos.

**Campos:**
- `id` (uuid) - ID único do perfume
- `name` (text) - Nome do perfume
- `brand` (text) - Marca
- `price` (decimal) - Preço normal
- `promotion_price` (decimal, nullable) - Preço promocional
- `image_base64` (text) - Imagem em Base64
- `status` (text) - 'available' ou 'unavailable'
- `description` (text, nullable) - Descrição do produto
- `created_at` (timestamptz) - Data de criação
- `updated_at` (timestamptz) - Data de atualização

#### 3. reviews
Avaliações dos produtos.

**Campos:**
- `id` (uuid) - ID único da avaliação
- `perfume_id` (uuid) - Referência ao perfume
- `user_id` (uuid) - Referência ao usuário
- `rating` (integer) - Nota de 1 a 5
- `comment` (text, nullable) - Comentário
- `created_at` (timestamptz) - Data de criação

**Restrições:**
- Um usuário pode avaliar cada perfume apenas uma vez (UNIQUE constraint)

#### 4. favorites
Lista de favoritos dos usuários.

**Campos:**
- `id` (uuid) - ID único
- `perfume_id` (uuid) - Referência ao perfume
- `user_id` (uuid) - Referência ao usuário
- `created_at` (timestamptz) - Data de adição

**Restrições:**
- Um perfume pode estar nos favoritos apenas uma vez por usuário

#### 5. cart_items
Itens do carrinho de compras.

**Campos:**
- `id` (uuid) - ID único
- `perfume_id` (uuid) - Referência ao perfume
- `user_id` (uuid) - Referência ao usuário
- `quantity` (integer) - Quantidade (mínimo 1)
- `created_at` (timestamptz) - Data de adição

**Restrições:**
- Um perfume pode estar no carrinho apenas uma vez por usuário (quantidade é atualizada)

## 🔒 Políticas de Segurança (RLS)

### profiles
- ✅ Qualquer usuário autenticado pode ver todos os perfis
- ✅ Usuários podem atualizar apenas seu próprio perfil

### perfumes
- ✅ Qualquer usuário autenticado pode visualizar perfumes
- 🔐 Apenas admins podem inserir, atualizar ou deletar perfumes

### reviews
- ✅ Qualquer usuário autenticado pode ver todas as avaliações
- ✅ Usuários podem criar suas próprias avaliações
- ✅ Usuários podem atualizar/deletar apenas suas próprias avaliações

### favorites
- 🔐 Usuários só podem ver seus próprios favoritos
- ✅ Usuários podem adicionar aos seus favoritos
- ✅ Usuários podem remover de seus favoritos

### cart_items
- 🔐 Usuários só podem ver seu próprio carrinho
- ✅ Usuários podem adicionar ao seu carrinho
- ✅ Usuários podem atualizar/remover itens do seu carrinho

## 🔧 Funções Especiais

### set_user_as_admin(user_email TEXT)
Promove um usuário a administrador.

**Uso:**
```sql
SELECT set_user_as_admin('email@example.com');
```

### auto_set_admin_for_specific_email()
Trigger que automaticamente define `is_admin = true` para o email `admin@vlstore.com`.

### handle_new_user()
Trigger que cria automaticamente um registro em `profiles` quando um novo usuário se registra.

### update_updated_at_column()
Trigger que atualiza automaticamente o campo `updated_at` quando um registro é modificado.

## 📝 Consultas Úteis

### Ver todos os usuários
```sql
SELECT * FROM profiles ORDER BY created_at DESC;
```

### Ver todos os perfumes
```sql
SELECT * FROM perfumes ORDER BY created_at DESC;
```

### Ver avaliações de um perfume específico
```sql
SELECT r.*, p.full_name
FROM reviews r
JOIN profiles p ON r.user_id = p.id
WHERE r.perfume_id = 'ID_DO_PERFUME'
ORDER BY r.created_at DESC;
```

### Média de avaliações por perfume
```sql
SELECT
  p.name,
  p.brand,
  COUNT(r.id) as total_reviews,
  AVG(r.rating) as average_rating
FROM perfumes p
LEFT JOIN reviews r ON p.id = r.perfume_id
GROUP BY p.id, p.name, p.brand
ORDER BY average_rating DESC;
```

### Ver carrinho de um usuário
```sql
SELECT
  ci.quantity,
  p.name,
  p.brand,
  p.price,
  p.promotion_price,
  (ci.quantity * COALESCE(p.promotion_price, p.price)) as subtotal
FROM cart_items ci
JOIN perfumes p ON ci.perfume_id = p.id
WHERE ci.user_id = 'ID_DO_USUARIO';
```

## 🔄 Realtime Updates

A aplicação usa Supabase Realtime para atualizar o contador do carrinho em tempo real:

```typescript
supabase
  .channel('cart_changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'cart_items',
    filter: `user_id=eq.${user.id}`
  }, callback)
  .subscribe();
```

## 🛡️ Backup e Manutenção

### Fazer Backup
Use o Supabase Dashboard para fazer backup regular dos dados.

### Limpar Carrinhos Antigos (Opcional)
```sql
DELETE FROM cart_items
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Ver Estatísticas
```sql
SELECT
  'Usuários' as tipo, COUNT(*) as total FROM profiles
UNION ALL
SELECT 'Perfumes', COUNT(*) FROM perfumes
UNION ALL
SELECT 'Avaliações', COUNT(*) FROM reviews
UNION ALL
SELECT 'Favoritos', COUNT(*) FROM favorites
UNION ALL
SELECT 'Itens no Carrinho', COUNT(*) FROM cart_items;
```

## 📊 Dados de Exemplo

Para testar, você pode inserir alguns perfumes de exemplo após fazer login como admin através da interface.

## ⚠️ Notas Importantes

1. **Imagens em Base64**: As imagens são armazenadas como Base64, o que pode aumentar o tamanho do banco. Para produção, considere usar Supabase Storage.

2. **Limite de Tamanho**: PostgreSQL tem limite de ~1GB para campos text. Para imagens muito grandes, use Supabase Storage.

3. **Performance**: Para catálogos muito grandes (>10000 produtos), considere adicionar índices:
```sql
CREATE INDEX idx_perfumes_brand ON perfumes(brand);
CREATE INDEX idx_perfumes_status ON perfumes(status);
```

4. **Segurança**: Nunca desabilite o RLS em produção!

## 🔗 Credenciais do Supabase

As credenciais estão no arquivo `.env`:
```
VITE_SUPABASE_URL=https://tmtcoaxmjxmnpqcnvjtz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANTE**: Em produção, mantenha estas credenciais seguras!
