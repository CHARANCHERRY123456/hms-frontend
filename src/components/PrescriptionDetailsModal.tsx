import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Thermometer, 
  Activity, 
  FileText, 
  Pill,
  TestTube,
  Download,
  Eye
} from 'lucide-react';

interface PrescriptionDetailsModalProps {
  prescriptionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PrescriptionDetailsModal: React.FC<PrescriptionDetailsModalProps> = ({ 
  prescriptionId, 
  isOpen, 
  onClose 
}) => {
  const [prescription, setPrescription] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && prescriptionId) {
      fetchPrescriptionDetails();
    }
  }, [isOpen, prescriptionId]);

  const fetchPrescriptionDetails = async () => {
    setLoading(true);
    try {
      // Fetch prescription details
      const prescriptionResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/prescriptions/${prescriptionId}`, {
        method: 'GET',
        headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (prescriptionResponse.ok) {
        const prescriptionData = await prescriptionResponse.json();
        setPrescription(prescriptionData);
        console.log('Fetched prescription data:', prescriptionData);

        // // Fetch student details using student_id
        // const studentResponse = await fetch(`/api/students/${prescriptionData.student_id}`, {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (studentResponse.ok) {
        //   const studentData = await studentResponse.json();
        //   setStudent(studentData);
        // }
      }
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      // Sample data for demo
      setPrescription({
        id: prescriptionId,
        student_id: 'R200137',
        status: 'Prescribed by Doctor',
        notes: 'Patient presented with high fever and severe headache. Prescribed symptomatic treatment.',
        weight: '68kg',
        bp: '140/90',
        temperature: '102.1°F',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T14:20:00Z',
        medicines: [
          { 
            id: 1,
            medicine: { id: 1, name: 'Paracetamol 500mg', category: 'Analgesic' },
            quantity_prescribed: 10,
            quantity_issued: 10
          },
          { 
            id: 2,
            medicine: { id: 2, name: 'Ibuprofen 400mg', category: 'Anti-inflammatory' },
            quantity_prescribed: 6,
            quantity_issued: 6
          }
        ],
        lab_reports: [
          {
            id: 1,
            test_name: 'Complete Blood Count',
            status: 'Lab Test Completed',
            result: 'reports/cbc_report.pdf',
            created_at: '2024-01-15T11:00:00Z'
          }
        ]
      });
      setStudent({
        id: 1,
        student_id: 'R200137',
        name: 'Rajesh Kumar',
        email: 'r200137@rgukitrkv.ac.in',
        branch: 'CSE',
        section: 'A'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadLabReport = async (reportId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/lab-reports/${reportId}/download`, {
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
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Download functionality will be implemented with backend integration');
    }
  };

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
      case 'Medication Issued by Pharmacist':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Prescription Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading prescription details...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Patient & Prescription Info */}
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900 font-medium">{prescription?.student?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Student ID</label>
                      <p className="text-gray-900">{prescription?.student?.id_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Branch</label>
                      <p className="text-gray-900">{prescription?.student?.branch}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Section</label>
                      <p className="text-gray-900">{prescription?.student?.section}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{prescription?.student?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-red-600" />
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-medium text-gray-900">{prescription?.temperature || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <p className="font-medium text-gray-900">{prescription?.bp || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-medium text-gray-900">{prescription?.weight || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Prescription Status & Timeline */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    Prescription Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Current Status</span>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(prescription?.status)}`}>
                        {prescription?.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Created</span>
                      <span className="text-sm text-gray-600">
                        {prescription?.created_at ? new Date(prescription.created_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    {prescription?.updated_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Last Updated</span>
                        <span className="text-sm text-gray-600">
                          {new Date(prescription.updated_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Clinical Details */}
              <div className="space-y-6">
                {/* Clinical Notes */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Clinical Notes
                  </h3>
                  <p className="text-gray-900 bg-white p-3 rounded-lg border">
                    {prescription?.notes || 'No clinical notes available'}
                  </p>
                </div>

                {/* Prescribed Medicines */}
                {prescription?.medicines && prescription.medicines.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Pill className="w-5 h-5 mr-2 text-blue-600" />
                      Prescribed Medicines ({prescription.medicines.length})
                    </h3>
                    <div className="space-y-3">
                      {prescription.medicines.map((medicine: any, index: number) => (
                        <div key={index} className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{medicine.medicine_name}</h4>
                              <p className="text-sm text-gray-600">{medicine.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                Prescribed: {medicine.quantity_prescribed}
                              </p>
                              {medicine.quantity_issued && (
                                <p className="text-sm text-green-600">
                                  Issued: {medicine.quantity_issued}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Reports */}
                {prescription?.lab_reports && prescription.lab_reports.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TestTube className="w-5 h-5 mr-2 text-purple-600" />
                      Lab Reports ({prescription.lab_reports.length})
                    </h3>
                    <div className="space-y-3">
                      {prescription.lab_reports.map((report: any, index: number) => (
                        <div key={index} className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{report.test_name}</h4>
                              <p className="text-sm text-gray-600">
                                Requested: {new Date(report.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                report.status === 'Lab Test Completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {report.status}
                              </span>
                              {report.result && (
                                <button
                                  onClick={() => downloadLabReport(report.id, report.result)}
                                  className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionDetailsModal;