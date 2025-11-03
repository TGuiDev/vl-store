# Guia de Deploy - VL Store Import

## 🚀 Opções de Deploy

### Opção 1: Vercel (Recomendado)

#### Passo 1: Preparar Repositório
```bash
git init
git add .
git commit -m "Initial commit - VL Store Import"
```

#### Passo 2: Fazer Push para GitHub
```bash
# Criar repositório no GitHub primeiro
git remote add origin https://github.com/seu-usuario/vl-store-import.git
git branch -M main
git push -u origin main
```

#### Passo 3: Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Import Project"
3. Selecione seu repositório do GitHub
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: (já está no .env)
   - `VITE_SUPABASE_ANON_KEY`: (já está no .env)
5. Clique em "Deploy"

**Pronto!** Seu site estará online em minutos.

---

### Opção 2: Netlify

#### Deploy via Interface
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `dist` após rodar `npm run build`
3. Configure variáveis de ambiente no painel

#### Deploy via CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

---

### Opção 3: GitHub Pages

#### Configurar vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/vl-store-import/', // nome do seu repositório
  // ... resto da config
});
```

#### Deploy
```bash
npm run build
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

---

### Opção 4: Render

1. Conecte seu repositório GitHub
2. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Adicione variáveis de ambiente
4. Deploy automático

---

## 🔐 Variáveis de Ambiente

Certifique-se de configurar estas variáveis no seu provedor de hosting:

```env
VITE_SUPABASE_URL=https://tmtcoaxmjxmnpqcnvjtz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdGNvYXhtanhtbnBxY252anR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODgwMzUsImV4cCI6MjA3Nzc2NDAzNX0.XZVvyHlDmKMEIJFZaVpTlRKP05pVmQvrHmlNnZicVK8
```

---

## 📋 Checklist Pré-Deploy

Antes de fazer deploy, verifique:

- [ ] Build funciona localmente (`npm run build`)
- [ ] TypeCheck passou (`npm run typecheck`)
- [ ] Variáveis de ambiente configuradas
- [ ] Testou localmente (`npm run preview`)
- [ ] Criou usuário admin de teste
- [ ] Cadastrou pelo menos um produto
- [ ] Testou todas as funcionalidades principais

---

## 🌐 Configuração de Domínio Customizado

### Vercel
1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

### Netlify
1. Domain Settings > Add Custom Domain
2. Configure DNS do seu registrador

---

## 🔄 Deploy Contínuo (CI/CD)

### GitHub Actions (Exemplo)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 🛡️ Segurança em Produção

### 1. Configure CORS no Supabase
1. Vá para Settings > API
2. Adicione seu domínio em "Allowed Origins"

### 2. Configure Rate Limiting
No Supabase, configure limites de requisição para evitar abuso.

### 3. SSL/HTTPS
A maioria dos provedores oferece SSL gratuito. Certifique-se de que está ativo.

### 4. Monitoramento
Configure alertas para:
- Erros de autenticação
- Falhas no banco de dados
- Uso excessivo de recursos

---

## 📊 Monitoramento e Analytics

### Supabase Dashboard
- Monitore queries
- Verifique uso de storage
- Analise logs de autenticação

### Google Analytics (Opcional)
Adicione no `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique URLs do Supabase
- Confirme CORS configurado
- Teste credenciais

### Erro: "Module not found"
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente
- Execute `npm run build`

### Erro: "Build failed"
- Verifique logs de erro
- Execute `npm run typecheck`
- Corrija erros TypeScript

### Página em branco após deploy
- Verifique console do navegador
- Confirme variáveis de ambiente
- Teste `npm run preview` localmente

---

## 🎯 Otimizações Pós-Deploy

### 1. Configure Cache
No Vercel/Netlify, configure headers:
```
/*
  Cache-Control: public, max-age=31536000, immutable
```

### 2. Habilite Compressão
A maioria dos provedores faz isso automaticamente.

### 3. Otimize Imagens
Considere usar Supabase Storage ao invés de Base64 para imagens grandes.

### 4. Adicione CDN
Provedores como Vercel e Netlify já incluem CDN global.

---

## 📱 Testes Pós-Deploy

Após o deploy, teste:

1. **Desktop**
   - Chrome, Firefox, Safari, Edge
   - Teste todas as funcionalidades

2. **Mobile**
   - iOS Safari
   - Chrome Android
   - Responsividade em diferentes tamanhos

3. **Performance**
   - Lighthouse Score
   - Tempo de carregamento
   - Core Web Vitals

---

## 🆘 Suporte Pós-Deploy

### Logs e Debugging
- Vercel: Acesse tab "Logs"
- Netlify: Acesse "Functions" > "Logs"
- Supabase: Table Editor > Logs

### Rollback
Se algo der errado:
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

---

## ✅ Deploy Checklist Final

- [ ] Site acessível via HTTPS
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Admin pode adicionar produtos
- [ ] Clientes podem comprar
- [ ] WhatsApp redirect funciona
- [ ] Instagram redirect funciona
- [ ] Mobile responsivo funciona
- [ ] Imagens carregam corretamente
- [ ] Sem erros no console

---

## 🎉 Parabéns!

Seu site VL Store Import está no ar e pronto para vender!

**URLs Importantes:**
- Site: [seu-dominio.com]
- Dashboard Supabase: https://supabase.com/dashboard
- WhatsApp: https://wa.me/5519992483502
- Instagram: https://instagram.com/viniciuss.lucas

---

**Dica Final**: Mantenha backups regulares do banco de dados através do Supabase Dashboard!
