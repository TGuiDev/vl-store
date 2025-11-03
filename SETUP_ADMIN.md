# Configuração do Usuário Admin

## Passo 1: Criar o usuário admin

1. Acesse a aplicação em seu navegador
2. Na tela de login, clique em "Registro"
3. Preencha os seguintes dados:
   - **Nome Completo**: Administrator
   - **Email**: admin@vlstore.com
   - **Senha**: administrator

4. Clique em "Criar Conta"

## Passo 2: Promover o usuário a Admin

Após criar a conta, você precisa promovê-la a admin no banco de dados:

### Opção A: Usando o Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Execute o seguinte comando:

```sql
SELECT set_user_as_admin('admin@vlstore.com');
```

5. Clique em "Run" para executar

### Opção B: Usando a ferramenta MCP Supabase (se disponível)

Execute o comando SQL diretamente através da ferramenta:

```sql
SELECT set_user_as_admin('admin@vlstore.com');
```

## Passo 3: Verificar

1. Faça logout da aplicação
2. Faça login novamente com:
   - **Email**: admin@vlstore.com
   - **Senha**: administrator

3. Agora você deve ver a opção "Admin" no menu de navegação
4. Acesse o painel administrativo para começar a cadastrar perfumes

## Funcionalidades do Admin

Como administrador, você terá acesso a:

- **Gerenciamento de Perfumes**
  - Adicionar novos perfumes
  - Editar perfumes existentes
  - Excluir perfumes
  - Definir status (Disponível/Indisponível)
  - Configurar preços e promoções

- **Gerenciamento de Usuários**
  - Visualizar todos os usuários
  - Promover/remover privilégios de admin

## Notas Importantes

- O email do admin não pode ser alterado após a criação
- A senha pode ser alterada através da funcionalidade de reset de senha do Supabase
- Mantenha as credenciais de admin em segurança
- Em produção, considere usar senhas mais fortes
