// File: src/components/admin/components/StatsCards.jsx
import React from "react";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";

const StatsCards = ({ statsData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="w-10 h-10 bg-muted rounded-lg"></div>
            </div>
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-24 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Guards",
      value: statsData.totalGuards,
      description: "All security personnel",
      icon: Users,
    },
    {
      label: "Assigned",
      value: statsData.assignedGuards,
      description: "Currently on duty",
      icon: CheckCircle,
    },
    {
      label: "Available",
      value: statsData.availableGuards,
      description: "Ready for assignment",
      icon: Clock,
    },
    {
      label: "On Leave",
      value: statsData.onLeaveGuards,
      description: "Currently unavailable",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="group bg-card border border-border/50 hover:border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Label */}
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {stat.label}
              </p>

              {/* Value */}
              <h3 className="text-3xl font-bold text-primary mb-2 transition-colors duration-200">
                {stat.value}
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>

            {/* Icon */}
            <div className="p-3 rounded-xl bg-primary/5 text-primary flex-shrink-0 ml-4 transition-colors duration-300 group-hover:bg-primary/10 group-hover:scale-105">
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
