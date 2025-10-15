import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Plus, CreditCard as Edit, Trash2, Upload, Download, AlertTriangle, Calendar, Save, X } from 'lucide-react';

interface Medicine {
  id: number;
  name: string;
  category: string;
  quantity: number;
  expiry_date: string;
}

const MedicineInventory: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
const [categories, setCategories] = useState([
    'Tablet',
    'Capsule',
    'Syrup',
    'Ointment',
    'Cream',
    'Injection',
    'Drops',
    'Powder',
    'Lozenge',
    'Gel'
]);

  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>({
    name: '',
    category: '',
    quantity: 0,
    expiry_date: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [medicines, searchTerm, filterCategory]);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicines`, {
        method: 'GET',
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMedicines(data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      // Sample data for demo
      const sampleMedicines = [
        { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic', quantity: 150, expiry_date: '2025-06-15' },
        { id: 2, name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', quantity: 8, expiry_date: '2024-12-20' },
        { id: 3, name: 'Amoxicillin 250mg', category: 'Antibiotic', quantity: 60, expiry_date: '2025-03-10' },
        { id: 4, name: 'Cetirizine 10mg', category: 'Antihistamine', quantity: 120, expiry_date: '2025-08-25' },
        { id: 5, name: 'Omeprazole 20mg', category: 'Antacid', quantity: 5, expiry_date: '2024-11-30' },
        { id: 6, name: 'Aspirin 75mg', category: 'Analgesic', quantity: 200, expiry_date: '2025-04-18' }
      ];
      setMedicines(sampleMedicines);
    } finally {
      setLoading(false);
    }
  };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch('/api/pharmacist/medicine-categories', {
//         method: 'GET',
//         headers: {
//         //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setCategories(data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       // Sample categories
//       setCategories(['Analgesic', 'Anti-inflammatory', 'Antibiotic', 'Antihistamine', 'Antacid', 'Antiviral']);
//     }
//   };

  const filterMedicines = () => {
    if (!medicines || !Array.isArray(medicines)) return;

    const filtered = medicines.filter((medicine: any) => {
        if (!medicine) return false; // skip undefined/null entries

        const name = medicine?.name ?? '';
        const category = medicine?.category ?? '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort by quantity (low stock first)
    filtered.sort((a: any, b: any) => (a?.quantity ?? 0) - (b?.quantity ?? 0));

    setFilteredMedicines(filtered);
    };


  const handleAddMedicine = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicines`, {
        method: 'POST',
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMedicine),
      });

      if (response.ok) {
        const data = await response.json();
        setMedicines([...medicines, data.medicine]);
        setNewMedicine({ name: '', category: '', quantity: 0, expiry_date: '' });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
      // For demo, add to local state
      const newId = Math.max(...medicines.map((m: any) => m.id)) + 1;
      setMedicines([...medicines, { ...newMedicine, id: newId }]);
      setNewMedicine({ name: '', category: '', quantity: 0, expiry_date: '' });
      setShowAddModal(false);
    }
  };

  const handleEditMedicine = async () => {
    if (!selectedMedicine) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedMedicine.id}`, {
        method: 'PUT',
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedMedicine),
      });

      if (response.ok) {
        const updatedMedicines = medicines.map((med: any) => 
          med.id === selectedMedicine.id ? selectedMedicine : med
        );
        setMedicines(updatedMedicines);
        setShowEditModal(false);
        setSelectedMedicine(null);
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      // For demo, update local state
      const updatedMedicines = medicines.map((med: any) => 
        med.id === selectedMedicine.id ? selectedMedicine : med
      );
      setMedicines(updatedMedicines);
      setShowEditModal(false);
      setSelectedMedicine(null);
    }
  };

  const handleDeleteMedicine = async (medicineId: number) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medicines/${medicineId}`, {
        method: 'DELETE',
        
      });

      if (response.ok) {
        setMedicines(medicines.filter((med: any) => med.id !== medicineId));
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      // For demo, remove from local state
      setMedicines(medicines.filter((med: any) => med.id !== medicineId));
    }
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/pharmacist/medicines/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully uploaded ${data.count} medicines`);
        fetchMedicines(); // Refresh the list
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Bulk upload functionality will be implemented with backend integration');
    }
  };

  const handleDownloadInventory = async () => {
    try {
      const response = await fetch('/api/pharmacist/medicines/download', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'medicine-inventory.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading inventory:', error);
      alert('Download functionality will be implemented with backend integration');
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity <= 10) return { color: 'text-red-600 bg-red-100', label: 'Critical' };
    if (quantity <= 50) return { color: 'text-yellow-600 bg-yellow-100', label: 'Low' };
    return { color: 'text-green-600 bg-green-100', label: 'Good' };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expiring within 3 months
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 h-24">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Package className="w-6 h-6 mr-3 text-purple-600" />
                Medicine Inventory
              </h2>
              <p className="text-gray-600 mt-2">Manage your medicine stock and inventory</p>
            </div>
            <div className="flex space-x-3">
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors duration-200">
                <Upload className="w-4 h-4" />
                <span>Upload Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleDownloadInventory}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download Excel</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Medicines
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by medicine name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Medicines ({filteredMedicines.length})
            </h3>
          </div>

          {filteredMedicines.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medicines found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedicines.map((medicine: any) => {
                    const stockStatus = getStockStatus(medicine.quantity);
                    const expiringSoon = isExpiringSoon(medicine.expiry_date);
                    
                    return (
                      <tr key={medicine.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {medicine.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                              {medicine.quantity} units
                            </span>
                            {medicine.quantity <= 10 && (
                              <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            <span className={`text-sm ${expiringSoon ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                              {new Date(medicine.expiry_date).toLocaleDateString()}
                            </span>
                            {expiringSoon && (
                              <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedMedicine(medicine);
                                setShowEditModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(medicine.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Medicine</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newMedicine.category}
                  onChange={(e) => setNewMedicine({...newMedicine, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                    type="number"
                    value={newMedicine.quantity ?? ''}  // fallback to empty string
                    onChange={(e) =>
                        setNewMedicine({
                        ...newMedicine,
                        quantity: e.target.value === '' ? 0 : parseInt(e.target.value),
                        })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                />

              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={newMedicine.expiry_date}
                  onChange={(e) => setNewMedicine({...newMedicine, expiry_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedicine}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Medicine</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={selectedMedicine.name}
                  onChange={(e) => setSelectedMedicine({...selectedMedicine, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedMedicine.category}
                  onChange={(e) => setSelectedMedicine({...selectedMedicine, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map((category: string) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={selectedMedicine.quantity}
                  onChange={(e) => setSelectedMedicine({...selectedMedicine, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={selectedMedicine.expiry_date}
                  onChange={(e) => setSelectedMedicine({...selectedMedicine, expiry_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditMedicine}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineInventory;