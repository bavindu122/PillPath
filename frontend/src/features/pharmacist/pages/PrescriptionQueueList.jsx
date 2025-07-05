import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  MessageCircle,
  ArrowLeft,
  SortDesc,
  Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const PrescriptionQueue = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('time');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      loadPrescriptionData();
      setFadeIn(true);
    }, 300);
  }, []);

  useEffect(() => {
    filterAndSortPrescriptions();
  }, [prescriptions, searchTerm, priorityFilter, statusFilter, sortBy]);

  const loadPrescriptionData = () => {
    // Extended mock prescription queue data
    const mockPrescriptions = [
      {
        id: 1,
        patientName: "John Smith",
        medication: "Amoxicillin 500mg - 30 tablets",
        priority: "High Priority",
        time: "10:30 AM",
        date: "2025-07-04",
        status: "pending_review",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "15 mins"
      },
      {
        id: 2,
        patientName: "Maria Garcia",
        medication: "Metformin 850mg - 60 tablets",
        priority: "Medium Priority",
        time: "11:15 AM",
        date: "2025-07-04",
        status: "in_progress",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "25 mins"
      },
      {
        id: 3,
        patientName: "Robert Davis",
        medication: "Lisinopril 10mg - 30 tablets",
        priority: "Low Priority",
        time: "2:45 PM",
        date: "2025-07-04",
        status: "pending_review",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "10 mins"
      },
      {
        id: 4,
        patientName: "Linda Thompson",
        medication: "Atorvastatin 20mg - 90 tablets",
        priority: "Medium Priority",
        time: "3:20 PM",
        date: "2025-07-04",
        status: "clarification_needed",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "20 mins"
      },
      {
        id: 5,
        patientName: "Sarah Johnson",
        medication: "Omeprazole 40mg - 14 capsules",
        priority: "High Priority",
        time: "4:10 PM",
        date: "2025-07-04",
        status: "pending_review",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "12 mins"
      },
      {
        id: 6,
        patientName: "Michael Chen",
        medication: "Hydrochlorothiazide 25mg - 30 tablets",
        priority: "Low Priority",
        time: "4:45 PM",
        date: "2025-07-04",
        status: "ready_for_pickup",
        avatar: "/api/placeholder/40/40",
        estimatedTime: "Completed"
      }
    ];

    setPrescriptions(mockPrescriptions);
    setIsLoading(false);
  };

  const filterAndSortPrescriptions = () => {
    let filtered = [...prescriptions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(prescription =>
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(prescription => 
        prescription.priority.toLowerCase().includes(priorityFilter)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(prescription => prescription.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'High Priority': 3, 'Medium Priority': 2, 'Low Priority': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'patient':
          return a.patientName.localeCompare(b.patientName);
        case 'time':
        default:
          return new Date(`2025-07-04 ${a.time}`) - new Date(`2025-07-04 ${b.time}`);
      }
    });

    setFilteredPrescriptions(filtered);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High Priority':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200 priority-high';
      case 'Medium Priority':
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low Priority':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clarification_needed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready_for_pickup':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_review':
        return 'Pending Review';
      case 'in_progress':
        return 'In Progress';
      case 'clarification_needed':
        return 'Needs Clarification';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      default:
        return 'Unknown';
    }
  };

  const handleApprove = (id) => {
    console.log('Approve prescription:', id);
    // Update prescription status
    setPrescriptions(prev => 
      prev.map(p => p.id === id ? { ...p, status: 'in_progress' } : p)
    );
  };

  const handleReject = (id) => {
    console.log('Reject prescription:', id);
    // Remove from queue or mark as rejected
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  const handleClarify = (id) => {
    console.log('Request clarification:', id);
    // Update prescription status
    setPrescriptions(prev => 
      prev.map(p => p.id === id ? { ...p, status: 'clarification_needed' } : p)
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="sidebar-slide-in">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-1"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-2"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full loading-dot-3"></div>
              </div>
            </div>
            <p className="text-gray-600 font-medium animate-pulse">Loading Prescription Queue...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="sidebar-slide-in">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="dashboard-fade-in-1 flex-shrink-0">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Back button and Page Title */}
             <div className="dashboard-fade-in-1 mb-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigate('/pharmacist/dashboard')}
                  className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 px-4 py-2 rounded-lg group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="font-medium">Back to Dashboard</span>
                </button>
                
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-800">Prescription Queue</h1>
                  <p className="text-gray-600 mt-1">Review and process pending prescriptions</p>
                </div>
              
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-full shadow-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <p className="text-sm font-semibold text-purple-700">
                    {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''} in queue
                  </p>
                </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-xl -z-10"></div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-gradient-to-tl from-indigo-100/40 to-transparent rounded-full blur-lg -z-10"></div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="dashboard-fade-in-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search patients, medications, doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="clarification_needed">Needs Clarification</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                >
                  <option value="time">Sort by Time</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="patient">Sort by Patient</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prescription Cards */}
          <div className="dashboard-fade-in-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center animate-fade-in-left">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
                    Active Prescriptions
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 group nav-item">
                      <SortDesc className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                      <span className="text-sm font-medium">Sort</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 group nav-item">
                      <Filter className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                      <span className="text-sm font-medium">More Filters</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPrescriptions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">No prescriptions found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  ) : (
                    filteredPrescriptions.map((prescription, index) => (
                      <div
                        key={prescription.id}
                        className={`border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white group animate-fade-in-left`}
                        style={{
                          animationDelay: `${index * 150}ms`
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
                                <User className="h-7 w-7 text-gray-600" />
                              </div>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white status-indicator"></div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                  {prescription.patientName}
                                </h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(prescription.priority)} transition-all duration-200 hover:shadow-sm`}>
                                  {prescription.priority}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)} transition-all duration-200 hover:shadow-sm`}>
                                  {getStatusText(prescription.status)}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-500 mt-4">
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{prescription.time}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{prescription.date}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Est. {prescription.estimatedTime}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                            <Link
                              to={`/pharmacist/review/${prescription.id}`}
                              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-medium rounded-lg hover:from-blue-200 hover:to-blue-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                              <Eye className="h-3 w-3" />
                              <span>Review</span>
                            </Link>
                            <button
                              onClick={() => handleClarify(prescription.id)}
                              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-xs font-medium rounded-lg hover:from-yellow-200 hover:to-yellow-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>Clarify</span>
                            </button>
                            <button
                              onClick={() => handleReject(prescription.id)}
                              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-xs font-medium rounded-lg hover:from-red-200 hover:to-red-300 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                              <XCircle className="h-3 w-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescriptionQueue;