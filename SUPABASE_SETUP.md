# 🚀 Configuração Supabase - EcoColeta Manager

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado no Supabase

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha os dados:
   - **Name**: ecocoleta-manager
   - **Database Password**: [sua senha segura]
   - **Region**: South America (São Paulo) ou mais próximo
4. Aguarde a criação do projeto (~2 minutos)

### 2. Criar Tabela no Banco de Dados

1. No painel do projeto, vá em **SQL Editor** (menu lateral)
2. Clique em "New Query"
3. Cole o conteúdo do arquivo `supabase-setup.sql`
4. Clique em **Run** para executar o script

### 3. Configurar Variáveis de Ambiente

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie as credenciais:
   - **Project URL** (exemplo: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública)

3. Abra o arquivo `.env.local` na raiz do projeto
4. Substitua os valores:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica_aqui
```

### 4. Importar Dados Iniciais (Opcional)

Para migrar os dados do CSV para o Supabase:

1. Vá em **Table Editor** no painel do Supabase
2. Selecione a tabela `collection_items`
3. Clique em **Insert** → **Insert Row**
4. OU use o SQL Editor para fazer um INSERT em lote:

```sql
INSERT INTO collection_items (material, adicionadoEm, moveisVolumosos, obs, encaminharPara, cidade)
VALUES 
  ('Check out - caixa de supermercado', '18/09/2023', 'Sim', 'Confirmado pela Gabriela em 18/09/2023. EM POUCA QUANTIDADE', 'Móveis', 'Joinville'),
  ('fibras ópticas', '30/07/2024', 'NÃO', 'CONFORME RETORNO DE THASSIA - PRECISA ESTAR ENSACADA E EM POUCA QUANTIDADE. 30/07/2024', 'SELETIVA', 'Joinville'),
  -- ... adicione mais linhas conforme necessário
;
```

### 5. Testar Conexão

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o navegador em `http://localhost:3000`
3. Se houver erro de conexão, você verá: "⚠️ Usando dados locais (Supabase não configurado)"
4. Se conectar com sucesso, os dados virão do banco de dados

## 🔐 Autenticação (Opcional)

Para habilitar autenticação real no Supabase:

1. Vá em **Authentication** → **Providers**
2. Habilite **Email** provider
3. Configure políticas de RLS mais restritivas
4. Atualize o `LoginModal.tsx` para usar `supabase.auth.signIn()`

## 📊 Estrutura da Tabela

```
collection_items
├── id (UUID, PK)
├── material (TEXT)
├── adicionadoEm (TEXT)
├── moveisVolumosos (TEXT)
├── obs (TEXT)
├── encaminharPara (TEXT)
├── cidade (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🔄 Real-time Sincronização

A aplicação já está configurada para:
- ✅ Buscar dados do Supabase ao carregar
- ✅ Criar/Editar/Deletar com sync automático
- ✅ Escutar mudanças em tempo real
- ✅ Fallback para dados locais se Supabase não configurado

## 🛡️ Segurança

As políticas RLS estão configuradas para:
- **Leitura pública**: Qualquer pessoa pode visualizar
- **Escrita restrita**: Apenas usuários autenticados podem criar/editar/deletar

## 🐛 Troubleshooting

### Erro: "Supabase not configured"
- Verifique se as variáveis estão corretas no `.env.local`
- Reinicie o servidor (`npm run dev`)

### Dados não aparecem
- Verifique no **Table Editor** se há dados na tabela
- Verifique no Console do navegador por erros

### Políticas RLS bloqueando
- Para testes, você pode desabilitar temporariamente o RLS:
  ```sql
  ALTER TABLE collection_items DISABLE ROW LEVEL SECURITY;
  ```

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Docs](https://supabase.com/docs/guides/realtime)
