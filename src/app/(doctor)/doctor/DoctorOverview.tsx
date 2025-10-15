import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Calendar,
  AlertTriangle,
  TestTube
} from 'lucide-react';

interface DoctorOverviewProps {
  setActiveTab: (tab: string) => void;
}

const DoctorOverview: React.FC<DoctorOverviewProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalPrescriptions: 0,
    pendingPrescriptions: 0,
    completedPrescriptions: 0,
    labReportsRequested: 0
  });
  interface Prescription {
    id: number;
    student_id: string;
    student_name: string;
    created_at: string;
    status: string;
    notes: string;
  }

  const [recentPrescriptions, setRecentPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch doctor dashboard statistics
      const statsResponse = await fetch('/api/doctor/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      // Fetch recent prescriptions
      const prescriptionsResponse = await fetch('/api/doctor/prescriptions/recent', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (statsResponse.ok && prescriptionsResponse.ok) {
        const statsData = await statsResponse.json();
        const prescriptionsData = await prescriptionsResponse.json();
        
        setStats(statsData);
        setRecentPrescriptions(prescriptionsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Sample data for demo
      setStats({
        totalPrescriptions: 45,
        pendingPrescriptions: 8,
        completedPrescriptions: 37,
        labReportsRequested: 12
      });
      setRecentPrescriptions([
        { 
          id: 1, 
          student_id: 'R200137', 
          student_name: 'Rajesh Kumar', 
          created_at: '2024-01-15T10:30:00Z', 
          status: 'Initiated by Nurse',
          notes: 'Patient complains of fever and headache'
        },
        { 
          id: 2, 
          student_id: 'R200142', 
          student_name: 'Priya Sharma', 
          created_at: '2024-01-15T11:15:00Z', 
          status: 'Lab Test Completed',
          notes: 'Stomach pain, lab results available'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      title: 'Total Prescriptions',
      value: stats.totalPrescriptions.toString(),
      change: '+8%',
      icon: Users,
      color: 'blue',
      onClick: () => setActiveTab('queue')
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingPrescriptions.toString(),
      change: '-5%',
      icon: Clock,
      color: 'yellow',
      onClick: () => setActiveTab('queue')
    },
    {
      title: 'Completed',
      value: stats.completedPrescriptions.toString(),
      change: '+12%',
      icon: ClipboardList,
      color: 'green',
      onClick: () => setActiveTab('prescriptions')
    },
    {
      title: 'Lab Reports',
      value: stats.labReportsRequested.toString(),
      change: '+3%',
      icon: TestTube,
      color: 'purple',
      onClick: () => setActiveTab('lab-requests')
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Initiated by Nurse':
        return 'bg-blue-100 text-blue-800';
      case 'Prescribed by Doctor':
        return 'bg-green-100 text-green-800';
      case 'Lab Test Requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Lab Test Completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 h-32">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Dr. Sarah</h2>
        <p className="text-gray-600 mt-2">Here's your patient overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              onClick={stat.onClick}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-600" />
              Pending Reviews
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPrescriptions.filter((prescription: any) => prescription.status === 'Initiated by Nurse' || prescription.status === 'Lab Test Completed').map((prescription: any, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">{prescription.student_name?.charAt(0) || 'P'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{prescription.student_name || 'Unknown Patient'}</p>
                      <p className="text-sm text-gray-600">ID: {prescription.student_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{new Date(prescription.created_at).toLocaleTimeString()}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab('queue')}
              className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              View All Patients
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <button 
                onClick={() => setActiveTab('queue')}
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Review Patients</span>
                </div>
                <div className="text-green-600">→</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('prescriptions')}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">View Prescriptions</span>
                </div>
                <div className="text-blue-600">→</div>
              </button>
              
              <button 
                onClick={() => setActiveTab('lab-requests')}
                className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <TestTube className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Lab Requests</span>
                </div>
                <div className="text-purple-600">→</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Today's Schedule
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">9:00 AM - 1:00 PM</p>
              <p className="text-sm text-green-800 mt-1">Morning Consultations</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">2:00 PM - 4:00 PM</p>
              <p className="text-sm text-blue-800 mt-1">Afternoon Rounds</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">4:00 PM - 6:00 PM</p>
              <p className="text-sm text-purple-800 mt-1">Lab Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;