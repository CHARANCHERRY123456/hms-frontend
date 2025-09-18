import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  User, 
  Calendar,
  Filter,
  Eye,
  Search
} from 'lucide-react';

const RecentPrescriptions: React.FC = () => {
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');

  const prescriptions = [
    {
      id: 'PRX-001',
      patientName: 'Rajesh Kumar',
      studentId: 'R200137',
      date: '2024-01-15',
      time: '10:30 AM',
      status: 'Prescribed by Doctor',
      chiefComplaint: 'Fever and headache',
      nurseNotes: 'Patient appears unwell, temperature elevated',
      doctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'PRX-002',
      patientName: 'Priya Sharma',
      studentId: 'R200142',
      date: '2024-01-15',
      time: '11:15 AM',
      status: 'Lab Test Requested',
      chiefComplaint: 'Stomach pain and nausea',
      nurseNotes: 'Patient complains of severe abdominal pain',
      doctor: 'Dr. Michael Brown'
    },
    {
      id: 'PRX-003',
      patientName: 'Amit Singh',
      studentId: 'R200155',
      date: '2024-01-14',
      time: '2:45 PM',
      status: 'Medication Issued',
      chiefComplaint: 'Cough and cold symptoms',
      nurseNotes: 'Persistent cough for 3 days, no fever',
      doctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'PRX-004',
      patientName: 'Sneha Patel',
      studentId: 'R200168',
      date: '2024-01-14',
      time: '3:20 PM',
      status: 'Initiated by Nurse',
      chiefComplaint: 'Sore throat and difficulty swallowing',
      nurseNotes: 'Throat appears red and inflamed',
      doctor: 'Pending assignment'
    },
    {
      id: 'PRX-005',
      patientName: 'Vikram Reddy',
      studentId: 'R200180',
      date: '2024-01-13',
      time: '9:15 AM',
      status: 'Lab Test Completed',
      chiefComplaint: 'Fatigue and dizziness',
      nurseNotes: 'Patient reports feeling weak for past week',
      doctor: 'Dr. Michael Brown'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Initiated by Nurse':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Prescribed by Doctor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Lab Test Requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Lab Test Completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Medication Issued':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (filterStatus === 'all') return true;
    return prescription.status.toLowerCase().includes(filterStatus.toLowerCase());
  });

  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.patientName.localeCompare(b.patientName);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            Recent Prescriptions
          </h2>
          <p className="text-gray-600 mt-2">Track and manage all prescription records</p>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="name">Patient Name</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    id="filterStatus"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="initiated">Initiated by Nurse</option>
                    <option value="prescribed">Prescribed by Doctor</option>
                    <option value="lab">Lab Test</option>
                    <option value="medication">Medication Issued</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {sortedPrescriptions.length} prescriptions found
              </span>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="p-6">
          <div className="space-y-4">
            {sortedPrescriptions.map((prescription, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Patient Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{prescription.patientName}</h4>
                        <p className="text-sm text-gray-600">ID: {prescription.studentId}</p>
                        <p className="text-xs text-gray-500 mt-1">PRX: {prescription.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Prescription Details */}
                  <div className="lg:col-span-2">
                    <div className="space-y-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Chief Complaint</h5>
                        <p className="text-sm text-gray-600">{prescription.chiefComplaint}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Nurse Notes</h5>
                        <p className="text-sm text-gray-600">{prescription.nurseNotes}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{prescription.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{prescription.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="lg:col-span-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">
                          Doctor: {prescription.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedPrescriptions.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No prescriptions found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentPrescriptions;