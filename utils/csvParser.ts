import { CollectionItem } from '../types';

export const parseCSV = (csvText: string): CollectionItem[] => {
  const lines = csvText.split('\n');
  const items: CollectionItem[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // The CSV uses semicolons. We also need to handle quoted strings which might contain semicolons (though simple split usually works for this specific dataset structure, a robust regex is safer)
    // For this specific dataset, a simple split by ';' works well enough as long as we handle the structure correctly.
    // However, some fields are quoted like "Considerado...".
    
    // Simple regex to split by semicolon but ignore semicolons inside quotes
    const matches = line.match(/(".*?"|[^;]+)(?=\s*;|\s*$)/g);
    
    if (matches) {
      // Clean quotes from start/end
      const cleanValues = matches.map(val => val.replace(/^"|"$/g, '').trim());
      
      if (cleanValues.length >= 6) {
        items.push({
          id: `item-${i}`,
          material: cleanValues[0] || '',
          adicionadoEm: cleanValues[1] || '',
          moveisVolumosos: cleanValues[2] || '',
          obs: cleanValues[3] || '',
          encaminharPara: cleanValues[4] || '',
          cidade: cleanValues[5] || '',
        });
      }
    } else {
        // Fallback for simple lines without quotes
        const parts = line.split(';');
        if (parts.length >= 6) {
             items.push({
                id: `item-${i}`,
                material: parts[0]?.trim() || '',
                adicionadoEm: parts[1]?.trim() || '',
                moveisVolumosos: parts[2]?.trim() || '',
                obs: parts[3]?.trim() || '',
                encaminharPara: parts[4]?.trim() || '',
                cidade: parts[5]?.trim() || '',
            });
        }
    }
  }
  return items;
};
