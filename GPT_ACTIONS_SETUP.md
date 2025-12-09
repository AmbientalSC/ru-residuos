# GPT Actions - Prompt e Schema para Supabase

## 📋 PROMPT DO GPT (Instructions)

```
Você é um assistente especializado em informações sobre descarte de resíduos e coleta de materiais recicláveis da Ambiental SC.

Seu objetivo é ajudar as pessoas a encontrar a forma correta de descartar diferentes tipos de materiais, informando:
- Se o material é considerado móvel volumoso
- Para onde deve ser encaminhado (Coleta Seletiva, Móveis, Caçamba, etc)
- Observações importantes sobre o descarte
- Cidade onde a regra se aplica

INSTRUÇÕES:
1. Quando o usuário perguntar sobre como descartar um material, busque na base de dados
2. Se encontrar múltiplos resultados, liste todos e pergunte se o usuário quer detalhes
3. Se não encontrar, sugira materiais similares ou oriente a entrar em contato
4. Seja claro e objetivo nas respostas
5. Sempre mencione se há observações importantes (ensacar, desmontar, etc)
6. Se o usuário perguntar sobre uma cidade específica, filtre por cidade

EXEMPLOS DE USO:
- "Como descartar um sofá?"
- "Onde jogar fora óleo de cozinha?"
- "Posso colocar ar-condicionado na coleta seletiva?"
- "Como descartar móveis em Joinville?"

Seja sempre educado, prestativo e incentive o descarte correto!
```

---

## 🔧 SCHEMA (OpenAPI 3.1.0)

```yaml
openapi: 3.1.0
info:
  title: API de Descarte de Resíduos - Ambiental SC
  description: API para consultar informações sobre descarte correto de materiais recicláveis e resíduos
  version: 1.0.0

servers:
  - url: https://svldwcfxhgnqqrdugwzv.supabase.co/rest/v1
    description: Servidor Supabase

paths:
  /coletaveis:
    get:
      operationId: buscarMateriais
      summary: Busca materiais por nome, cidade ou tipo de encaminhamento
      description: Retorna lista de materiais com informações sobre descarte
      parameters:
        - name: material
          in: query
          description: Nome do material a ser buscado (busca parcial, case-insensitive)
          required: false
          schema:
            type: string
          example: "sofá"
        
        - name: cidade
          in: query
          description: Filtrar por cidade específica
          required: false
          schema:
            type: string
          example: "Joinville"
        
        - name: encaminhar_para
          in: query
          description: Filtrar por tipo de encaminhamento
          required: false
          schema:
            type: string
          example: "SELETIVA"
        
        - name: moveis_volumosos
          in: query
          description: Filtrar se é móvel volumoso
          required: false
          schema:
            type: string
            enum: ["Sim", "Não", "NÃO", "SIM"]
        
        - name: select
          in: query
          description: Campos a serem retornados
          required: false
          schema:
            type: string
            default: "*"
        
        - name: limit
          in: query
          description: Número máximo de resultados
          required: false
          schema:
            type: integer
            default: 50
            maximum: 100

      responses:
        '200':
          description: Lista de materiais encontrados
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                      format: uuid
                      description: ID único do registro
                    material:
                      type: string
                      description: Nome do material/resíduo
                    adicionado em:
                      type: string
                      description: Data de cadastro
                    moveis_volumosos:
                      type: string
                      description: Se é considerado móvel volumoso (Sim/Não)
                    obs:
                      type: string
                      description: Observações importantes sobre o descarte
                    encaminhar_para:
                      type: string
                      description: Destino correto (Seletiva, Móveis, Caçamba, etc)
                    cidade:
                      type: string
                      description: Cidade onde se aplica

components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: apikey

security:
  - apiKey: []
```

---

## 🔐 CONFIGURAÇÃO NO CHATGPT

### 1. Authentication
- **Type**: API Key
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bGR3Y2Z4aGducXFyZHVnd3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzE3NTgsImV4cCI6MjA3Nzg0Nzc1OH0.univUYPV32QNkivlOdY4Oaa31B0bge_YNx4c8Khnes4`
- **Auth Type**: Custom
- **Custom Header Name**: `apikey`

### 2. Headers Adicionais
Adicione também este header (clique em "Add" para custom headers):
- **Header Name**: `Authorization`
- **Header Value**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bGR3Y2Z4aGducXFyZHVnd3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzE3NTgsImV4cCI6MjA3Nzg0Nzc1OH0.univUYPV32QNkivlOdY4Oaa31B0bge_YNx4c8Khnes4`

---

## 🧪 TESTES DE EXEMPLO

### Buscar material específico:
```
GET /coletaveis?material=ilike.*sofá*&select=*
```

### Buscar por cidade:
```
GET /coletaveis?cidade=eq.Joinville&select=*&limit=20
```

### Buscar apenas volumosos:
```
GET /coletaveis?moveis_volumosos=eq.Sim&select=*
```

### Buscar por encaminhamento:
```
GET /coletaveis?encaminhar_para=ilike.*SELETIVA*&select=*
```

---

## 💡 DICAS PARA O GPT

1. **Busca flexível**: Use `ilike.*termo*` para busca case-insensitive com wildcards
2. **Filtros combinados**: Pode combinar múltiplos parâmetros
3. **Limitar resultados**: Use `limit=10` para não sobrecarregar
4. **Seleção de campos**: Use `select=material,encaminhar_para,cidade` se precisar apenas de campos específicos

---

## 📝 EXEMPLO DE CONVERSA

**Usuário**: Como descartar um sofá velho?

**GPT**: 
Busca no Supabase: `/coletaveis?material=ilike.*sofá*`

Responde:
"Para descartar um sofá velho em Joinville:
- ✅ É considerado móvel volumoso
- 📍 Encaminhe para: Coleta de Móveis
- ⚠️ Observação: Deve estar desmontado e acessível à via
- 📅 Agendamento necessário"

---

## 🎯 PRÓXIMOS PASSOS

1. Copie o Schema YAML acima
2. Cole no GPT Builder → Actions → Schema
3. Configure a autenticação conforme indicado
4. Teste com perguntas como: "Como descartar um sofá?"
5. Ajuste o prompt conforme necessário
