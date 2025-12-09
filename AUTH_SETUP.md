# 🔐 Configuração de Autenticação Supabase

## ⚠️ SEGURANÇA IMPORTANTE

**NUNCA exponha a Service Role Key no frontend!** Mesmo com restrição de domínio, ela dá acesso administrativo total.

Para GitHub Pages (frontend estático), temos 2 opções seguras:

### **Opção 1: Gerenciamento Simplificado (Recomendado para MVP)**
- Admins criam usuários diretamente no painel do Supabase
- App só faz login/logout
- Sem gerenciamento de usuários no frontend

### **Opção 2: Edge Functions (Produção)**
- Criar Supabase Edge Functions para operações admin
- Edge Functions rodam no servidor e podem usar Service Role
- Frontend chama as functions de forma segura

---

## 📋 Configuração Atual (Opção 1 - Segura)

### 1. No painel do Supabase, vá em **Authentication** → **Users**

### 2. Clique em **Add User** → **Create new user**

### 3. Preencha:
- **Email**: admin@ecocoleta.com (ou seu email)
- **Password**: [senha segura]
- **Auto Confirm User**: ✅ Marque esta opção

### 4. Clique em **Create User**

### 5. Atualize as políticas RLS:

```sql
-- Permitir leitura pública
CREATE POLICY "Enable read access for all users" ON coletaveis
  FOR SELECT USING (true);

-- Permitir insert/update/delete apenas para usuários autenticados
CREATE POLICY "Enable insert for authenticated users only" ON coletaveis
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON coletaveis
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON coletaveis
  FOR DELETE USING (auth.role() = 'authenticated');
```

---

## 🚀 Para implementar Opção 2 (Edge Functions):

### 1. Instalar Supabase CLI:
```bash
npm install -g supabase
```

### 2. Criar Edge Function:
```bash
supabase functions new manage-users
```

### 3. Exemplo de function (`supabase/functions/manage-users/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { action, email, password, userId } = await req.json()

  switch(action) {
    case 'create':
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email, password, email_confirm: true
      })
      return new Response(JSON.stringify({ data, error }))
    
    case 'delete':
      const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      return new Response(JSON.stringify({ error: delError }))
    
    // ... outras ações
  }
})
```

### 4. Deploy:
```bash
supabase functions deploy manage-users
```

### 5. Chamar do frontend:
```typescript
const { data } = await supabase.functions.invoke('manage-users', {
  body: { action: 'create', email, password }
})
```

---

## ✅ Funcionalidades implementadas (Opção 1):

- ✅ Login com email/senha via Supabase Auth
- ✅ Logout com invalidação de sessão
- ✅ Persistência de sessão (refresh automático)
- ✅ Verificação de usuário ao carregar app
- ✅ Listener de mudanças de autenticação
- ✅ Feedback visual de loading no login
- ✅ Mensagens de erro de autenticação
- ⚠️ Gerenciamento de usuários: Via painel Supabase (seguro)

## 🔑 Como usar:

1. **Criar usuário no Supabase** (veja passos acima)
2. **Fazer login** no app com o email e senha criados
3. **Aproveitar**: Sessão fica salva no navegador!

## 🛡️ Segurança:

- ✅ Anon Key exposta (seguro - só leitura pública)
- ✅ Token JWT gerenciado automaticamente
- ✅ Session refresh automático
- ✅ Logout limpa tokens
- ✅ Políticas RLS protegem dados
- ❌ Service Role Key NUNCA no frontend

