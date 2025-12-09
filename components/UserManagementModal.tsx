import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Lock, AlertCircle, Trash2, Edit2, UserX, UserCheck } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { supabaseService } from '../services/supabaseClient';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const userList = await supabaseService.listUsers();
      setUsers(userList);
    } catch (err: any) {
      setError('Erro ao carregar usuários: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      await supabaseService.createUser(newEmail, newPassword);
      setSuccess('Usuário criado com sucesso!');
      setNewEmail('');
      setNewPassword('');
      setShowCreateForm(false);
      loadUsers();
    } catch (err: any) {
      setError('Erro ao criar usuário: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      await supabaseService.updateUser(editingUser.id, editEmail, editPassword || undefined);
      setSuccess('Usuário atualizado com sucesso!');
      setEditingUser(null);
      setEditEmail('');
      setEditPassword('');
      loadUsers();
    } catch (err: any) {
      setError('Erro ao atualizar usuário: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, shouldBan: boolean) => {
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      await supabaseService.banUser(userId, shouldBan);
      setSuccess(`Usuário ${shouldBan ? 'desativado' : 'ativado'} com sucesso!`);
      loadUsers();
    } catch (err: any) {
      setError(`Erro ao ${shouldBan ? 'desativar' : 'ativar'} usuário: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário permanentemente?')) return;
    
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      await supabaseService.deleteUser(userId);
      setSuccess('Usuário excluído com sucesso!');
      loadUsers();
    } catch (err: any) {
      setError('Erro ao excluir usuário: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Gerenciar Usuários</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          {/* Create User Button */}
          <div className="mb-6">
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="w-full sm:w-auto">
              <UserPlus size={18} className="mr-2" />
              Novo Usuário
            </Button>
          </div>

          {/* Create User Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateUser} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
              <h3 className="font-semibold text-gray-700">Criar Novo Usuário</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  placeholder="usuario@email.com"
                  disabled={loading}
                />
                <Input
                  label="Senha"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Usuário'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {/* Edit User Form */}
          {editingUser && (
            <form onSubmit={handleUpdateUser} className="bg-blue-50 p-4 rounded-lg mb-6 space-y-4">
              <h3 className="font-semibold text-gray-700">Editar Usuário</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Novo E-mail"
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  required
                  placeholder={editingUser.email}
                  disabled={loading}
                />
                <Input
                  label="Nova Senha (opcional)"
                  type="password"
                  value={editPassword}
                  onChange={e => setEditPassword(e.target.value)}
                  placeholder="Deixe em branco para manter"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => {
                  setEditingUser(null);
                  setEditEmail('');
                  setEditPassword('');
                }}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {/* Users List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 mb-3">Usuários Cadastrados ({users.length})</h3>
            {loading && users.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-eco-200 border-t-eco-600"></div>
                <p className="text-gray-500 mt-2">Carregando usuários...</p>
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum usuário encontrado</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={16} className="text-gray-400 flex-shrink-0" />
                      <p className="font-medium text-gray-900 truncate">{user.email}</p>
                      {user.banned_until && (
                        <Badge variant="danger">Desativado</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      {user.last_sign_in_at && ` • Último acesso: ${new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingUser(user);
                        setEditEmail(user.email);
                        setEditPassword('');
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBanUser(user.id, !user.banned_until)}
                      className={user.banned_until ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"}
                      title={user.banned_until ? "Ativar" : "Desativar"}
                    >
                      {user.banned_until ? <UserCheck size={16} /> : <UserX size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
