import React, { useState, useEffect, useMemo } from 'react';
import { Search, LogIn, LogOut, Plus, Recycle, Filter } from 'lucide-react';
import { CollectionItem, User } from './types';
import { supabaseService } from './services/supabaseClient';
import { DataTable } from './components/DataTable';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { ItemFormModal } from './components/ItemFormModal';
import { LoginModal } from './components/LoginModal';

const App: React.FC = () => {
  // --- State ---
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [user, setUser] = useState<User>({ role: 'guest' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | undefined>(undefined);

  // --- Effects ---
  useEffect(() => {
    // Load initial data
    loadItems();
    
    // Check for existing session
    checkAuth();
    
    // Subscribe to auth changes
    const authSubscription = supabaseService.onAuthStateChange((user) => {
      if (user) {
        setUser({ role: 'admin', username: user.email || 'Admin' });
      } else {
        setUser({ role: 'guest' });
      }
    });
    
    // Subscribe to real-time changes
    const subscription = supabaseService.subscribeToChanges((payload) => {
      console.log('Real-time change detected:', payload);
      loadItems();
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await supabaseService.getCurrentUser();
      if (currentUser) {
        setUser({ role: 'admin', username: currentUser.email || 'Admin' });
      }
    } catch (err) {
      console.error('Error checking auth:', err);
    }
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.fetchItems();
      setItems(data);
    } catch (err) {
      console.error('Error loading items from Supabase:', err);
      setError('Erro ao carregar dados do Supabase. Verifique a conexão.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Computed ---
  const cities = useMemo(() => {
    const citySet = new Set(items.map(i => i.cidade).filter(Boolean));
    return Array.from(citySet).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.obs.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.encaminharPara.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = selectedCity === 'Todas' || item.cidade === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [items, searchQuery, selectedCity]);

  // --- Handlers ---
  const handleLogin = (email: string) => {
    setUser({ role: 'admin', username: email });
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabaseService.signOut();
      setUser({ role: 'guest' });
    } catch (err) {
      console.error('Error logging out:', err);
      setUser({ role: 'guest' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await supabaseService.deleteItem(id);
        setItems(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Erro ao excluir item. Tente novamente.');
      }
    }
  };

  const handleEdit = (item: CollectionItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: Omit<CollectionItem, 'id'>) => {
    try {
      if (editingItem) {
        // Update
        await supabaseService.updateItem(editingItem.id, formData);
        setItems(prev => prev.map(item => 
          item.id === editingItem.id ? { ...formData, id: item.id } : item
        ));
      } else {
        // Create
        const newItem = await supabaseService.createItem(formData);
        setItems(prev => [newItem, ...prev]);
      }
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Erro ao salvar item. Verifique as permissões ou tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-eco-100 p-2 rounded-lg">
                <Recycle className="text-eco-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Amb.<span className="text-eco-600">Resíduos</span></h1>
          </div>
          
          <div>
            {user.role === 'admin' ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 hidden sm:inline">Olá, {user.username}</span>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2">
                <LogIn size={16} />
                <span>Área Admin</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Guia de Descarte</h2>
          <p className="text-gray-600 max-w-2xl">
            Pesquise como descartar corretamente o resíduos.
          </p>
          {error && (
            <p className="text-sm text-amber-600 mt-2">⚠️ {error}</p>
          )}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-eco-200 border-t-eco-600"></div>
            <p className="text-gray-500 mt-4">Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* Filters & Actions */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 items-end lg:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Pesquisar material (ex: sofá, vidro...)"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative min-w-[200px]">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <select
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-500 appearance-none cursor-pointer"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="Todas">Todas as Cidades</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {user.role === 'admin' && (
            <Button onClick={handleCreate} className="w-full sm:w-auto shadow-md shadow-eco-200">
              <Plus size={18} className="mr-2" />
              Novo Item
            </Button>
          )}
        </div>

        {/* Data Table */}
        <DataTable 
          items={filteredItems} 
          userRole={user.role}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="mt-4 text-center text-sm text-gray-400">
          Mostrando {filteredItems.length} resultados
        </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="w-full px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Amb.Resíduos. Todos os direitos reservados.
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={handleLogin} 
      />
      
      <ItemFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        cities={cities}
      />
    </div>
  );
};

export default App;