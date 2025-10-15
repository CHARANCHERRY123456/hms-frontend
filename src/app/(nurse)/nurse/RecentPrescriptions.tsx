'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FileText,
  Clock,
  User,
  Calendar,
  Filter,
  Eye,
  Search
} from 'lucide-react';
import PrescriptionDetailsModal from '@/components/PrescriptionDetailsModal';

interface PrescriptionResponse {
  student: any;
  id: number;
  student_id: string;
  nurse_id: number;
  doctor_id?: number | null;
  notes?: string | null;
  weight?: string | null;
  bp?: string | null;
  temperature?: string | null;
  status: string;
  created_at: string;
  updated_at?: string | null;
}

const PrescriptionsList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionResponse[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (prescriptionId: string) => {
    setSelectedPrescriptionId(prescriptionId);
    setShowModal(true);
  };

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/prescriptions`,
        {
          params: {
            page,
            limit,
            sortBy,
            status: filterStatus
          }
        }
      );
      // Defensive: make sure data shape is what we expect
      const arr = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      console.log('Fetched prescriptions:', arr);
      setPrescriptions(arr);
      setTotal(res.data.total ?? arr.length);
    } catch (err) {
      console.error(err);
      setError('Failed to load prescriptions');
      setPrescriptions([]); // reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-600" />
            Prescriptions
          </h2>
          <p className="text-gray-600 mt-2">
            Track and manage all prescription records
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort by
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="name">Student ID</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filterStatus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                    <option value="Initiated by Nurse">Initiated by Nurse</option>
                    <option value="Prescribed by Doctor">Prescribed by Doctor</option>
                    <option value="Lab Test Requested">Lab Test Requested</option>
                    <option value="Lab Test Completed">Lab Test Completed</option>
                    <option value="Medication Issued">Medication Issued</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {total} prescriptions found
              </span>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="p-6">
          {loading && <p className="text-gray-500">Loading prescriptions...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {Array.isArray(prescriptions) && prescriptions.length > 0 && (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Student Info */}
                    <div className="lg:col-span-1">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Student ID: {prescription.student.id_number}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            PRX: {prescription.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">
                            Notes
                          </h5>
                          <p className="text-sm text-gray-600">
                            {prescription.notes || 'No notes'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(prescription.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(prescription.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="lg:col-span-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {prescription.status}
                        </span>
                        <p className="text-xs text-gray-600">
                          Doctor ID: {prescription.doctor_id ?? 'Pending'}
                        </p>
                      </div>
                      <div className="mt-4">
                        <button onClick={() => handleViewDetails(prescription.id.toString())}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && Array.isArray(prescriptions) && prescriptions.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No prescriptions found matching your criteria
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => (page < totalPages ? prev + 1 : prev))}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
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

export default PrescriptionsList;