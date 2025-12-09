import React, { useState } from 'react';
import { X, User, Lock, AlertCircle } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { supabaseService } from '../services/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await supabaseService.signIn(email, password);
      onLogin(user.email || 'Admin');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Acesso Administrativo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
                <User className="absolute left-3 top-[34px] text-gray-400" size={18} />
                <Input 
                    label="E-mail" 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="seu@email.com"
                    disabled={loading}
                />
            </div>
            
            <div className="relative">
                <Lock className="absolute left-3 top-[34px] text-gray-400" size={18} />
                <Input 
                    label="Senha" 
                    type="password"
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="••••••"
                    disabled={loading}
                />
            </div>
          </div>

          <Button type="submit" className="w-full py-3 text-base shadow-lg shadow-eco-200" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </Button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Área restrita para colaboradores autorizados.
          </p>
        </form>
      </div>
    </div>
  );
};
