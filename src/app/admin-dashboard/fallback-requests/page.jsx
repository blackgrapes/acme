"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function FallbackRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  // ✅ FIXED: Get actual admin user ID from session/localStorage
  const getAdminUserId = () => {
    // In real app, get from authentication context/session
    // For now, we'll use a placeholder or get from localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.id || user._id;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
    return null; // Return null if no user ID found
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/fallback-requests');
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests);
      } else {
        throw new Error(data.error || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load fallback requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status, notes = '', newPassword = '') => {
    setActionLoading(requestId);
    
    try {
      // ✅ FIXED: Get actual admin user ID
      const adminUserId = getAdminUserId();
      
      const res = await fetch('/api/admin/fallback-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          status, 
          adminNotes: notes,
          newPassword,
          completedBy: adminUserId // ✅ Now using actual user ID or null
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Request Updated",
          description: `Request marked as ${status}`,
        });
        fetchRequests(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to update request");
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = (request) => {
    if (!request.userExists) {
      toast({
        title: "Cannot Complete",
        description: "User does not exist. Cannot set password.",
        variant: "destructive",
      });
      return;
    }

    const newPassword = prompt('Enter new password for user (min 6 characters):');
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const notes = prompt('Add admin notes (optional):') || '';
    
    handleUpdateStatus(request._id, 'completed', notes, newPassword);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReasonText = (reason) => {
    return reason.replace(/_/g, ' ').toLowerCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Fallback Password Reset Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage password reset requests when email service fails or limits are exceeded
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchRequests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Request Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{request.email}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.userExists 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.userExists ? 'User Exists' : 'User Not Found'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Reason:</span>
                        <p className="text-gray-900 capitalize">{getReasonText(request.reason)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Requested:</span>
                        <p className="text-gray-900">{new Date(request.createdAt).toLocaleString()}</p>
                      </div>
                      {request.completedAt && (
                        <div>
                          <span className="font-medium text-gray-700">Completed:</span>
                          <p className="text-gray-900">{new Date(request.completedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {request.completedBy && (
                      <div>
                        <span className="font-medium text-gray-700">Completed by:</span>
                        <p className="text-gray-900">
                          {request.completedBy.name} ({request.completedBy.email})
                        </p>
                      </div>
                    )}

                    {request.adminNotes && (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes:</p>
                        <p className="text-sm text-gray-900">{request.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    {request.status === 'pending' && request.userExists && (
                      <button
                        onClick={() => handleComplete(request)}
                        disabled={actionLoading === request._id}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {actionLoading === request._id ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Complete & Set Password
                          </>
                        )}
                      </button>
                    )}
                    
                    {request.status === 'pending' && (
                      <button
                        onClick={() => {
                          const notes = prompt('Add cancellation notes (optional):') || '';
                          if (notes !== null) {
                            handleUpdateStatus(request._id, 'cancelled', notes);
                          }
                        }}
                        disabled={actionLoading === request._id}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Request
                      </button>
                    )}

                    {request.status !== 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'pending', 'Reopened by admin')}
                        disabled={actionLoading === request._id}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {requests.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No fallback requests</h3>
              <p className="mt-1 text-sm text-gray-500">All password reset requests are handled automatically via email.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}