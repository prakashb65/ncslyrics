import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useToast } from '@chakra-ui/react';

interface Category {
  id: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const toast = useToast();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error fetching categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategoryName.trim() }),
        });

        if (!response.ok) throw new Error('Failed to add category');
        
        setNewCategoryName('');
        fetchCategories(); // Refresh the list
        
        toast({
          title: 'Category added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error adding category:', error);
        toast({
          title: 'Error adding category',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete category');
        
        fetchCategories(); // Refresh the list
        
        toast({
          title: 'Category deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: 'Error deleting category',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const updateCategory = async (id: string, newName: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      fetchCategories(); // Refresh the list
      setEditingCategory(null);
      
      toast({
        title: 'Category updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error updating category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Categories</h1>

      {/* Add New Category */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Category</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addCategory}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
        <div className="space-y-4">
          {Array.isArray(categories) && categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            >
              {editingCategory === category.id ? (
                <input
                  type="text"
                  defaultValue={category.name}
                  onBlur={(e) => updateCategory(category.id, e.target.value)}
                  className="px-4 py-2 bg-gray-600 border border-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              ) : (
                <span className="text-white">{category.name}</span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCategory(category.id)}
                  className="p-2 text-blue-400 hover:text-blue-300"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}