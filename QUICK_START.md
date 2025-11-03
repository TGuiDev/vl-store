# Quick Start - VL Store Import

## 🚀 Início Rápido

### 1. Criar Conta Admin (PRIMEIRO PASSO)

1. Inicie a aplicação
2. Vá para "Registro"
3. Use estes dados EXATAMENTE:
   - Email: `admin@vlstore.com`
   - Senha: `administrator`
   - Nome: Administrator

**IMPORTANTE**: Este email específico receberá privilégios de admin automaticamente!

### 2. Cadastrar Perfumes

1. Faça login com a conta admin
2. Clique em "Admin" no menu
3. Clique em "Adicionar Perfume"
4. Preencha:
   - Nome do perfume
   - Marca
   - Preço (use ponto para decimais, ex: 189.99)
   - Preço promocional (opcional)
   - Status (Disponível/Indisponível)
   - Descrição
   - Imagem (será convertida para Base64 automaticamente)

### 3. Funcionalidades do Cliente

Os clientes podem:
- Buscar e filtrar perfumes por marca
- Ver detalhes completos do produto
- Avaliar com estrelas (1-5 estrelas)
- Adicionar comentários
- Adicionar aos favoritos (❤️)
- Adicionar ao carrinho
- Finalizar via WhatsApp ou Instagram

### 4. Finalização de Pedidos

Quando o cliente finaliza:
1. Vai para o carrinho
2. Revisa os itens
3. Clica em "Finalizar pelo WhatsApp" ou "Finalizar pelo Instagram"
4. É redirecionado com a mensagem pronta contendo:
   - Lista de produtos
   - Quantidades
   - Preços
   - Total

**Contatos:**
- WhatsApp: +55 19 99248-3502
- Instagram: @viniciuss.lucas

## 📋 Checklist de Configuração

- [ ] Criar conta admin (admin@vlstore.com)
- [ ] Fazer login
- [ ] Verificar se menu "Admin" aparece
- [ ] Cadastrar primeiro perfume
- [ ] Testar busca e filtros
- [ ] Testar adicionar ao carrinho
- [ ] Testar finalização via WhatsApp

## 🎨 Design

Cores do tema:
- **Fundo**: Gradiente de cinza escuro para preto
- **Destaques**: Dourado/Âmbar (#F59E0B)
- **Texto**: Branco e tons de cinza
- **Cards**: Cinza escuro (zinc-800)

## 🔐 Segurança

- Apenas admins veem o menu "Admin"
- Apenas admins podem cadastrar/editar perfumes
- Cada usuário vê apenas seus próprios favoritos e carrinho
- Sistema de autenticação seguro via Supabase

## 📱 Responsivo

A aplicação funciona perfeitamente em:
- Celulares (Mobile)
- Tablets
- Desktop

## ⚠️ Notas Importantes

1. Use sempre `admin@vlstore.com` para ter acesso admin
2. Imagens são convertidas para Base64 (podem aumentar o tamanho do banco)
3. Preços devem usar ponto (.) e não vírgula (,)
4. O status "Indisponível" mostra o produto mas não permite compra

## 🆘 Problemas Comuns

**Não consigo ver o menu Admin**
- Certifique-se de estar logado com admin@vlstore.com
- Faça logout e login novamente

**Erro ao adicionar imagem**
- Use imagens em formato JPG, PNG ou WebP
- Tamanho recomendado: máximo 2MB

**Produtos não aparecem**
- Verifique se cadastrou pelo menos um perfume
- Atualize a página

## 📞 Suporte

WhatsApp: +55 19 99248-3502
Instagram: @viniciuss.lucas
