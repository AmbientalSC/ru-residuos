import React from 'react';
import { Edit2, Trash2, MapPin, Calendar, Truck, AlertCircle } from 'lucide-react';
import { CollectionItem, UserRole } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface DataTableProps {
  items: CollectionItem[];
  userRole: UserRole;
  onEdit: (item: CollectionItem) => void;
  onDelete: (id: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ items, userRole, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <AlertCircle className="text-gray-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Nenhum item encontrado</h3>
        <p className="text-gray-500">Tente ajustar seus filtros de busca.</p>
      </div>
    );
  }

  const getVolumososVariant = (val: string) => {
      const v = val.toLowerCase();
      if (v.includes('sim')) return 'success';
      if (v.includes('não') || v.includes('nao')) return 'danger';
      return 'warning';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700 w-[18%]">Material</th>
              <th className="px-6 py-4 font-semibold text-gray-700 w-[16%] hidden md:table-cell">Encaminhamento</th>
              <th className="px-6 py-4 font-semibold text-gray-700 w-[11%]">Móveis/Volumosos</th>
              <th className="px-6 py-4 font-semibold text-gray-700 w-[11%] hidden lg:table-cell">Cidade</th>
              <th className="px-6 py-4 font-semibold text-gray-700 w-[10%] hidden xl:table-cell">Adicionado em</th>
              <th className="px-6 py-4 font-semibold text-gray-700 w-[24%] hidden sm:table-cell">Observação</th>
              {userRole === 'admin' && (
                <th className="px-6 py-4 font-semibold text-gray-700 text-right w-[10%]">Ações</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex flex-col">
                        <span className="break-words">{item.material}</span>
                        <span className="text-xs text-gray-400 font-normal lg:hidden mt-1 break-words">{item.cidade}</span>
                    </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-start gap-2 text-gray-600 uppercase">
                        <Truck size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="break-words">{item.encaminharPara || 'N/A'}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                   <Badge variant={getVolumososVariant(item.moveisVolumosos)}>
                     {item.moveisVolumosos?.toUpperCase() || 'N/A'}
                   </Badge>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell text-gray-600">
                    <div className="flex items-start gap-2">
                        <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="break-words">{item.cidade}</span>
                    </div>
                </td>
                <td className="px-6 py-4 hidden xl:table-cell text-gray-600">
                    <div className="flex items-start gap-2">
                        <Calendar size={14} className="flex-shrink-0 mt-0.5" />
                        <span className="whitespace-nowrap">{item.adicionadoEm}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-gray-500 hidden sm:table-cell" title={item.obs}>
                    <div className="break-words line-clamp-3">{item.obs}</div>
                </td>
                {userRole === 'admin' && (
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};