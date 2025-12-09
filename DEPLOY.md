# 🚀 Guia de Deploy - GitHub Pages

## 📋 Configuração Inicial (uma vez)

### 1. Configurar Secrets no GitHub

Acesse: `https://github.com/AmbientalSC/ru-residuos/settings/secrets/actions`

Adicione os seguintes secrets:

- **VITE_SUPABASE_URL**
  - Value: `https://svldwcfxhgnqqrdugwzv.supabase.co`

- **VITE_SUPABASE_ANON_KEY**
  - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bGR3Y2Z4aGducXFyZHVnd3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzE3NTgsImV4cCI6MjA3Nzg0Nzc1OH0.univUYPV32QNkivlOdY4Oaa31B0bge_YNx4c8Khnes4`

### 2. Habilitar GitHub Pages

1. Vá em: `https://github.com/AmbientalSC/ru-residuos/settings/pages`
2. Em **Source**, selecione: `gh-pages` branch
3. Clique em **Save**

---

## 🎯 Deploy Automático

### Já está configurado! ✅

Toda vez que você fizer push para a branch `main`:

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

O GitHub Actions irá automaticamente:
1. ✅ Instalar dependências
2. ✅ Fazer build do projeto
3. ✅ Deploy na branch `gh-pages`
4. ✅ Publicar em: https://ambientalsc.github.io/ru-residuos/

---

## 📦 Deploy Manual (alternativo)

Se preferir fazer deploy manualmente:

```bash
npm run deploy
```

**Importante:** Antes do primeiro deploy manual, configure:

```bash
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

---

## 🔍 Verificar Deploy

1. **Status do workflow:**
   - https://github.com/AmbientalSC/ru-residuos/actions

2. **Site publicado:**
   - https://ambientalsc.github.io/ru-residuos/

---

## 🛠️ Troubleshooting

### Erro: "VITE_SUPABASE_URL is not defined"
- Verifique se os secrets estão configurados corretamente no GitHub

### Página 404
- Certifique-se que GitHub Pages está configurado para branch `gh-pages`
- Aguarde alguns minutos após o primeiro deploy

### Build falha
- Execute localmente: `npm run build`
- Verifique erros no terminal
- Corrija e faça commit novamente

---

## 📝 Estrutura de Deploy

```
main branch (código fonte)
  ↓
  Push to GitHub
  ↓
  GitHub Actions (build)
  ↓
  gh-pages branch (build compilado)
  ↓
  GitHub Pages (site publicado)
```

---

## 🔐 Segurança

✅ **Anon Key** - Segura para frontend (somente leitura pública)  
❌ **Service Role Key** - NUNCA adicionar aos secrets ou código

As variáveis de ambiente são injetadas apenas durante o build e não ficam expostas no código final.
