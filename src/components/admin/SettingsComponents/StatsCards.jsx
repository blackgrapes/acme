// File: src/components/admin/components/StatsCards.jsx
import { Mail, CheckCircle, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const StatsCards = ({ activeCategory, emailStats, fallbackStats, loading }) => {
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

  // ✅ EMAIL LIMITS
  if (activeCategory.id === "email-limits" && emailStats) {
    const cards = [
      {
        label: "Daily Limit",
        value: `${emailStats.dailyCount} / ${emailStats.dailyLimit}`,
        progress: Math.min(100, (emailStats.dailyCount / emailStats.dailyLimit) * 100),
        description: "Emails sent today",
        icon: Mail,
      },
      {
        label: "Remaining",
        value: emailStats.remainingDaily,
        description: "Emails available today",
        icon: CheckCircle,
      },
      {
        label: "Per User",
        value: emailStats.perUserLimit,
        description: "Emails per user per day",
        icon: User,
      },
      {
        label: "Last Reset",
        value: new Date(emailStats.lastReset).toLocaleDateString(),
        description: "Daily reset at midnight",
        icon: Clock,
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="group bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{card.label}</p>
                <h3 className="text-3xl font-bold text-foreground">{card.value}</h3>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-300">
                <card.icon className="h-6 w-6" />
              </div>
            </div>

            {card.progress !== undefined && (
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{card.description}</p>
          </div>
        ))}
      </div>
    );
  }

  // ✅ FALLBACK REQUESTS
  if (activeCategory.id === "fallback-requests" && fallbackStats) {
    const total = fallbackStats.totalRequests || 0;
    const pendingPercent =
      total > 0 ? Math.round((fallbackStats.pendingRequests / total) * 100) : 0;
    const processedPercent =
      total > 0
        ? Math.round(
            ((fallbackStats.completedRequests + fallbackStats.cancelledRequests) / total) * 100
          )
        : 0;

    const cards = [
      {
        label: "Total Requests",
        value: total,
        percentage: null,
        description: `In ${activeCategory.name}`,
        icon: Mail,
      },
      {
        label: "Pending",
        value: fallbackStats.pendingRequests,
        percentage: pendingPercent,
        description: "Awaiting action",
        icon: CheckCircle,
      },
      {
        label: "Processed",
        value: fallbackStats.completedRequests + fallbackStats.cancelledRequests,
        percentage: processedPercent,
        description: "Completed / Cancelled",
        icon: User,
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((stat, idx) => (
          <div
            key={idx}
            className="group bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                  {stat.percentage !== null && (
                    <span
                      className={cn(
                        "text-sm font-semibold px-2 py-1 rounded-full",
                        stat.percentage >= 70
                          ? "bg-green-500/10 text-green-600"
                          : stat.percentage >= 30
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-600"
                      )}
                    >
                      {stat.percentage}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-300">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default StatsCards;
