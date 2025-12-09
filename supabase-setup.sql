-- Script SQL para configurar a tabela no Supabase

-- Criar a tabela collection_items
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material TEXT NOT NULL,
  adicionadoEm TEXT NOT NULL,
  moveisVolumosos TEXT NOT NULL,
  obs TEXT,
  encaminharPara TEXT NOT NULL,
  cidade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_collection_items_material ON collection_items(material);
CREATE INDEX IF NOT EXISTS idx_collection_items_cidade ON collection_items(cidade);
CREATE INDEX IF NOT EXISTS idx_collection_items_encaminharPara ON collection_items(encaminharPara);

-- Habilitar Row Level Security (RLS)
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Enable read access for all users" ON collection_items
  FOR SELECT USING (true);

-- Política para permitir inserção apenas para usuários autenticados
CREATE POLICY "Enable insert for authenticated users only" ON collection_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização apenas para usuários autenticados
CREATE POLICY "Enable update for authenticated users only" ON collection_items
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Enable delete for authenticated users only" ON collection_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para chamar a função de atualização
CREATE TRIGGER update_collection_items_updated_at BEFORE UPDATE
  ON collection_items FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Comentários na tabela e colunas
COMMENT ON TABLE collection_items IS 'Tabela de itens de coleta de resíduos';
COMMENT ON COLUMN collection_items.material IS 'Nome do material/resíduo';
COMMENT ON COLUMN collection_items.adicionadoEm IS 'Data de adição do registro';
COMMENT ON COLUMN collection_items.moveisVolumosos IS 'Indica se é móvel volumoso (Sim/Não/Depende)';
COMMENT ON COLUMN collection_items.obs IS 'Observações sobre o descarte';
COMMENT ON COLUMN collection_items.encaminharPara IS 'Destino do descarte (Seletiva, Móveis, Caçamba, etc)';
COMMENT ON COLUMN collection_items.cidade IS 'Cidade onde se aplica a regra de descarte';
