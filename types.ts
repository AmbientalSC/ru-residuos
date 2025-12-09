export interface CollectionItem {
  id: string;
  material: string;
  adicionadoEm: string;
  moveisVolumosos: string;
  obs: string;
  encaminharPara: string;
  cidade: string;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'guest' | 'admin';

export interface User {
  role: UserRole;
  username?: string;
}
