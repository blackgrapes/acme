"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function EmailLimitsPage() {
  const [limitsData, setLimitsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLimitsData();
  }, []);

  const fetchLimitsData = async () => {
    try {
      const res = await fetch('/api/admin/email-limits');
      console.log('Fetching email limits data...',res);
      const data = await res.json();
      if (res.ok) {
        setLimitsData(data);
      }
    } catch (error) {
      console.error('Error fetching limits data:', error);
      toast({
        title: "Error",
        description: "Failed to load email limits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetLimits = async () => {
    if (!confirm('Are you sure you want to reset today\'s email limits? This cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch('/api/admin/email-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchLimitsData();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reset limits",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error resetting limits:', error);
      toast({
        title: "Error",
        description: "Failed to reset limits",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="p-6">Loading email limits...</div>;
  if (!limitsData) return <div className="p-6">Error loading email limits</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Limits Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchLimitsData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button
            onClick={resetLimits}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset Today's Limits
          </button>
        </div>
      </div>

      {/* Daily Limits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Daily Email Limit</h3>
          <div className="text-3xl font-bold text-blue-600">
            {limitsData.dailyCount} / {limitsData.dailyLimit}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Emails sent today
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${Math.min(100, (limitsData.dailyCount / limitsData.dailyLimit) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Remaining Today</h3>
          <div className={`text-3xl font-bold ${
            limitsData.remainingDaily > 50 ? 'text-green-600' : 
            limitsData.remainingDaily > 10 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {limitsData.remainingDaily}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Emails available today
          </p>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Per User Limit</h3>
          <div className="text-3xl font-bold text-purple-600">
            {limitsData.perUserLimit}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Emails per user per day
          </p>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tracking Date</h3>
          <div className="text-xl font-semibold text-gray-700">
            {new Date(limitsData.lastReset).toLocaleDateString()}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Limits reset daily
          </p>
        </div>
      </div>

      {/* User Activity Table */}
      <div className="bg-white border rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">User Email Activity Today</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Emails Sent</th>
                <th className="px-4 py-3 text-left">Limit</th>
                <th className="px-4 py-3 text-left">Remaining</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {limitsData.userCounts.map((user, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.count}</td>
                  <td className="px-4 py-3">{user.limit}</td>
                  <td className="px-4 py-3">{Math.max(0, user.limit - user.count)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.count >= user.limit 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
              {limitsData.userCounts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                    No email activity today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}