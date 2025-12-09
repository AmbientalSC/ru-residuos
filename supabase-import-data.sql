-- Script para importar dados do CSV para o Supabase
-- Execute este script no SQL Editor do Supabase após criar a tabela

INSERT INTO collection_items (material, adicionadoEm, moveisVolumosos, obs, encaminharPara, cidade)
VALUES 
  ('Check out - caixa de supermercado', '18/09/2023', 'Sim', 'Confirmado pela Gabriela em 18/09/2023. EM POUCA QUANTIDADE', 'Móveis', 'Joinville'),
  ('fibras ópticas', '30/07/2024', 'NÃO', 'CONFORME RETORNO DE THASSIA - PRECISA ESTAR ENSACADA E EM POUCA QUANTIDADE. 30/07/2024', 'SELETIVA', 'Joinville'),
  ('Aglomerado (de móveis)', '25/08/2021', 'SIM', 'Desmontados e acessíveis à via', 'Móveis', 'Joinville'),
  ('Air Friyer', '28/03/2023', 'NÃO', 'Logística reversa ou coleta seletiva - confirmado com Amanda via Discord 30/09/2025', 'SELETIVA', 'Joinville'),
  ('Alcool em gel vencido', '10/12/2021', 'Não', 'Descarte de produto químico, encaminhar para a Adriana. É para falar com a Adriana Ferreira pelo teams!!!', '', 'Joinville'),
  ('Almofadas', '16/06/2023', 'Não', 'Em pouca quantidade e ensacado', 'Coleta domiciliar', 'Joinville'),
  ('Andador infantil', '18/02/2021', 'NÃO', 'Deixar em frente a residência no dia da coleta seletiva.', 'SELETIVA', 'Joinville'),
  ('Antena', '06/05/2022', 'não', '', 'Seletiva', 'Joinville'),
  ('Antena de internet/ TV à cabo (sky)', '19/02/2021', 'NÃO', 'Deixar em frente a residência no dia da coleta seletiva.', 'SELETIVA', 'Joinville'),
  ('Aparelho purificador de água', '05/09/2024', 'NÃO', 'Deve ser agendada para quarta-feira.', 'LINHA BRANCA', 'Joinville'),
  ('aquário', '28/11/2025', 'NÃO', 'inteiro não coletamos só se estiver quebrado e acondicionado, caso contrario ou descartar nos contentores de vidro ou logística reversa', 'contentor de vidro ou logística reversa', 'Joinville'),
  ('Aquecedor', '18/08/2021', 'nao', '', 'seletiva', 'Joinville'),
  ('Ar-condicionado antigo de janela ou Split', '18/02/2021', 'NÃO', 'Coleta deve ser sempre agendada para às quartas-feiras.', 'LINHA BRANCA', 'Joinville'),
  ('ARAME / METAL', '15/06/2023', 'Não', 'Acondicionado para não causar acidentes (colocar em caixas)', 'Seletiva', 'Joinville'),
  ('arara de metal', '18/06/2024', 'não', 'o material precisa estar bem dividido, ensacado ou encaixotado.', 'seletiva', 'Joinville'),
  ('Areia', '24/08/2023', 'não', 'Particular - resto de construção', 'Descarte diretamente em caçamba', 'Joinville'),
  ('Arranhador de gato de madeira', '16/08/2022', 'não', '', 'Caçamba', 'Joinville'),
  ('Aspirador de pó', '19/02/2021', 'NÃO', 'Deixar em frente a residência no dia da coleta seletiva.', 'SELETIVA', 'Joinville'),
  ('Assento de vaso de plástico', '26/01/2023', 'Não', 'Confirmado com Letícia da filial em 26/01/2023', 'Seletiva', 'Joinville'),
  ('Assento de vaso sanitário', '14/09/2021', 'NÃO', 'Considerado resto de construção civil. Consultado com a Jéssica. Se for de plástico ou PVC, pode ser descartado na seletiva', '', 'Joinville'),
  ('Assoalho de madeira', '12/08/2024', 'Não', '', 'Restos de construção', 'Joinville'),
  ('Árvore', '03/11/2022', 'Não', 'Verificar com a SAMA ou Prefeitura', '', 'Joinville'),
  ('Árvore de Natal', '13/01/2022', 'Não', 'Ensacado em um saco de até 100L. **Confirmado com Jéssica em 13/01/2022**', 'Domiciliar', 'Joinville'),
  ('Óleo de carro / motor', '25/02/2021', 'NÃO', 'Confirmar com Adriana pelo teams pois dependendo da quantidade e do tipo precisa ser analisado.', 'Adriana', 'Joinville'),
  ('Óleo de cozinha (vencido, novo, usado)', '24/08/2021', 'Não', 'Acondicionar o óleo em recipientes de plástico, de preferência garrafa PET. Caso contrário não será coletado, pois dependendo do recipiente pode quebrar dentro do caminhão e contaminar a carga.', 'Seletiva', 'Joinville'),
  ('óleo de cozinha', '09/06/2025', 'não', 'acondicionado em PET', 'seletiva', 'Joinville'),
  ('Baú de madeira', '19/02/2021', 'Sim', 'Não é coletado se for de madeira de demolição, o que o caracteriza como resíduo da construção civil. **Editado por Helena Cristina em 24/08/2021, conforme orientação do Gerente Leonardo**', 'Móveis', 'Joinville'),
  ('Baú de moto', '17/02/2025', 'NÃO', '', 'Seletiva', 'Joinville'),
  ('BALANÇA', '28/08/2024', 'NÃO', 'ENSACADA OU ENCAIXOTADA', 'SELETIVA', 'Joinville'),
  ('BALANÇA DIGITAL', '13/05/2024', 'NÃO', 'Não coletamos, encaminhar a um ponto que receba eletrônicos. Confirmado por func. Thassia em 13/05/2024.', 'ELETRÔNICO', 'Joinville'),
  ('Balcão de pia', '19/02/2021', 'SIM', 'Somente o balcão, a cuba se for de alumínio deve ser separada e descartada na coleta seletiva.', 'Móveis', 'Joinville'),
  ('Balcão frigorífico', '17/07/2025', 'NÃO', 'Empresa específica ou caçamba particular.', '', 'Joinville'),
  ('Balde', '08/04/2021', 'não', 'se for de plástico, estar limpo e ensacado.', 'seletiva', 'Joinville'),
  ('Banco de automóvel', '19/02/2021', 'NÃO', 'Somente a parte de ferro. A espuma é material tóxico que deve ser ensacada e deixar disponível na coleta orgânica.', 'SELETIVA', 'Joinville'),
  ('Banco de madeira', '06/07/2021', 'SIM', '', 'Móveis', 'Joinville'),
  ('Banheira de Aço', '14/01/2022', 'Não', 'Contratar caçamba, considerado resto de construção.', '', 'Joinville'),
  ('Banheira de fibra', '24/05/2021', 'NÃO', 'Considerado como resto de construção.', 'CAÇAMBA', 'Joinville'),
  ('Banheira de plástico (bebê)', '11/11/2024', 'Não', 'Confirmado com Helena C., Kassiely - 11/11/2024', 'Seletiva', 'Joinville'),
  ('Banner', '22/02/2024', 'NÃO', 'Se enquadra como Lona (por Helena Cristina via discord)', 'SELETIVA', 'Joinville'),
  ('Banqueta de metal', '15/07/2021', 'Não', 'Se for leve, é coletado na seletiva', 'Seletiva', 'Joinville'),
  ('Barraca de praia de ferro', '26/06/2024', 'NÃO', 'Disponibilizar desmontada para coleta seletiva, confirmado com Thassia em 26/06/2024', 'SELETIVA', 'Joinville'),
  ('Barrica de papelão', '02/04/2024', 'NÃO', 'Descartar 1 por vez, confirmado com Ariane Machado em 02/04/2024.', 'SELETIVA', 'Joinville'),
  ('Batedeira/ Liquidificador', '19/02/2021', 'NÃO', 'Deixar em frente a residência no dia da coleta seletiva - ou logística reversa', 'SELETIVA', 'Joinville'),
  ('Bebê conforto', '19/02/2021', 'NÃO', 'Sem o tecido.', 'SELETIVA', 'Joinville'),
  ('Bebedouro de alumínio/ filtro de água de plástico', '26/08/2021', 'NÃO', 'suporte para galão de água de plástico = SELETIVA', 'SELETIVA', 'Joinville');

-- Nota: Este é apenas um subconjunto dos dados.
-- Para importar todos os dados, você pode usar um script ou ferramenta de importação CSV
-- no painel do Supabase (Table Editor > Import Data from CSV)
