import React, { useState, useEffect } from 'react';
import PrescriptionDetailsModal from '@/components/PrescriptionDetailsModal';
import { 
  TestTube, 
  Search, 
  Filter, 
  Calendar,
  User,
  Eye,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface LabTestQueueProps {
  onSelectLabReport: (labReportId: string) => void;
  setActiveTab: (tab: 'overview' | 'queue' | 'upload' | 'profile') => void;
}

interface LabReport {
  id: number;
  prescription_id: number;
  test_name: string;
  status: string;
  result: string | null;
  created_at: string;
  updated_at: string | null;
  prescription: {
    student_id: string;
    student_name: string;
    notes: string;
  };
}

const LabTestQueue: React.FC<LabTestQueueProps> = ({ onSelectLabReport, setActiveTab }) => {
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<LabReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLabReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [labReports, searchTerm, filterStatus, filterDate]);

  const fetchLabReports = async () => {
    try {
      // Fetch lab reports for technician
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lab-reports`, {
        method: 'GET',
        headers: {
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLabReports(data);
      }
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      // Sample data for demo
      const sampleReports = [
        {
          id: 1,
          prescription_id: 2,
          test_name: 'Complete Blood Count',
          status: 'Lab Test Requested',
          result: null,
          created_at: '2024-01-15T11:00:00Z',
          updated_at: null,
          prescription: {
            student_id: 'R200142',
            student_name: 'Priya Sharma',
            notes: 'Patient complains of stomach pain. Ordered lab tests to rule out infection.'
          }
        },
        {
          id: 2,
          prescription_id: 3,
          test_name: 'Blood Sugar Test',
          status: 'Lab Test Requested',
          result: null,
          created_at: '2024-01-16T09:15:00Z',
          updated_at: null,
          prescription: {
            student_id: 'R200180',
            student_name: 'Vikram Reddy',
            notes: 'Patient reports feeling weak for past week. Check for diabetes.'
          }
        },
        {
          id: 3,
          prescription_id: 4,
          test_name: 'Urine Analysis',
          status: 'Lab Test Completed',
          result: 'reports/urine_analysis_report.pdf',
          created_at: '2024-01-14T14:30:00Z',
          updated_at: '2024-01-15T10:45:00Z',
          prescription: {
            student_id: 'R200195',
            student_name: 'Anita Patel',
            notes: 'Patient has burning sensation during urination. UTI suspected.'
          }
        }
      ];
      setLabReports(sampleReports);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = labReports.filter((report: any) => {
      const matchesSearch = report.prescription?.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.prescription?.student_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.test_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || report.status.toLowerCase().includes(filterStatus.toLowerCase());
      const matchesDate = !filterDate || report.created_at.split('T')[0] === filterDate;
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort by date (newest first)
    filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredReports(filtered);
  };

  const handleUploadResults = (reportId: string) => {
    onSelectLabReport(reportId);
    setActiveTab('upload');
  };
  

  const handleViewDetails = (prescriptionId: string) => {
    setSelectedPrescriptionId(prescriptionId);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lab Test Requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Lab Test Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Lab Test Requested':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Lab Test Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (createdAt: string) => {
    const hoursAgo = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursAgo > 24) return 'text-red-600'; // High priority - over 24 hours
    if (hoursAgo > 12) return 'text-yellow-600'; // Medium priority - over 12 hours
    return 'text-green-600'; // Normal priority
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 h-48">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TestTube className="w-6 h-6 mr-3 text-teal-600" />
            Lab Test Queue
          </h2>
          <p className="text-gray-600 mt-2">Process lab test requests and upload results</p>
        </div>

        {/* Search and Filter Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Tests
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by patient name, ID, or test name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="requested">Lab Test Requested</option>
                  <option value="completed">Lab Test Completed</option>
                </select>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lab Reports List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Lab Reports ({filteredReports.length})
            </h3>
          </div>

          {filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No lab reports found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReports.map((report: any, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Patient Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{report.prescription?.student?.name}</h4>
                          <p className="text-sm text-gray-600">ID: {report.prescription?.student?.id_number}</p>
                          <p className="text-xs text-gray-500">Report: {report.id}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{report.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Test Details */}
                    <div className="lg:col-span-2">
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Test Name</h5>
                          <p className="text-sm text-gray-900 font-medium">{report.test_name}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Doctor's Notes</h5>
                          <p className="text-sm text-gray-600">{report.prescription?.notes}</p>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Requested: {new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                          {report.updated_at && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-600">Completed: {new Date(report.updated_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Priority and Actions */}
                    <div className="lg:col-span-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className={`w-4 h-4 ${getPriorityColor(report.created_at)}`} />
                          <span className={`text-sm font-medium ${getPriorityColor(report.created_at)}`}>
                            {(() => {
                              const hoursAgo = (new Date().getTime() - new Date(report.created_at).getTime()) / (1000 * 60 * 60);
                              if (hoursAgo > 24) return 'High Priority';
                              if (hoursAgo > 12) return 'Medium Priority';
                              return 'Normal Priority';
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <button 
                          onClick={() => handleViewDetails(report.prescription_id.toString())}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {report.status === 'Lab Test Requested' && (
                          <button 
                            onClick={() => handleUploadResults(report.id.toString())}
                            className="flex items-center space-x-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors duration-200"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PrescriptionDetailsModal
        prescriptionId={selectedPrescriptionId}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default LabTestQueue;