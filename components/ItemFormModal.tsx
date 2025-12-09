import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CollectionItem } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<CollectionItem, 'id'>) => void;
  initialData?: CollectionItem;
  cities: string[];
}

export const ItemFormModal: React.FC<ItemFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  cities 
}) => {
  const [formData, setFormData] = useState({
    material: '',
    adicionadoEm: new Date().toLocaleDateString('pt-BR'),
    moveisVolumosos: 'Não',
    obs: '',
    encaminharPara: '',
    cidade: cities[0] || 'Joinville'
  });
  
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');

  useEffect(() => {
    if (initialData) {
      const cityExists = cities.includes(initialData.cidade);
      setFormData({
        material: initialData.material,
        adicionadoEm: initialData.adicionadoEm,
        moveisVolumosos: initialData.moveisVolumosos,
        obs: initialData.obs,
        encaminharPara: initialData.encaminharPara,
        cidade: initialData.cidade,
      });
      if (!cityExists) {
        setIsCustomCity(true);
        setCustomCityInput(initialData.cidade);
      }
    } else {
        setFormData({
            material: '',
            adicionadoEm: new Date().toLocaleDateString('pt-BR'),
            moveisVolumosos: 'Não',
            obs: '',
            encaminharPara: '',
            cidade: cities[0] || 'Joinville'
        });
        setIsCustomCity(false);
        setCustomCityInput('');
    }
  }, [initialData, isOpen, cities]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      cidade: isCustomCity ? customCityInput : formData.cidade
    };
    onSubmit(submitData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? 'Editar Item' : 'Novo Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Material" 
            value={formData.material} 
            onChange={e => setFormData({...formData, material: e.target.value})}
            required
            placeholder="Ex: Sofá velho"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Móveis Volumosos?</label>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500"
                value={formData.moveisVolumosos}
                onChange={e => setFormData({...formData, moveisVolumosos: e.target.value})}
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
                <option value="Depende">Depende</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Cidade</label>
              {!isCustomCity ? (
                <div className="flex gap-1">
                  <select 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm"
                    value={formData.cidade}
                    onChange={e => setFormData({...formData, cidade: e.target.value})}
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCustomCity(true)}
                    className="px-2 py-1 text-xs text-eco-600 hover:text-eco-700 border border-eco-300 rounded-lg hover:bg-eco-50 transition-colors whitespace-nowrap"
                    title="Adicionar nova cidade"
                  >
                    + Nova
                  </button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={customCityInput}
                    onChange={e => setCustomCityInput(e.target.value)}
                    placeholder="Digite a cidade"
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCity(false);
                      setCustomCityInput('');
                      setFormData({...formData, cidade: cities[0] || 'Joinville'});
                    }}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Voltar para seleção"
                  >
                    ←
                  </button>
                </div>
              )}
            </div>
          </div>

          <Input 
            label="Encaminhar Para" 
            value={formData.encaminharPara} 
            onChange={e => setFormData({...formData, encaminharPara: e.target.value})}
            placeholder="Ex: Coleta Seletiva"
          />

          <div className="flex flex-col gap-1">
             <label className="text-sm font-medium text-gray-700">Observações</label>
             <textarea 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 min-h-[100px]"
                value={formData.obs}
                onChange={e => setFormData({...formData, obs: e.target.value})}
                placeholder="Detalhes adicionais sobre o descarte..."
             />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
