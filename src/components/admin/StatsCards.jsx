// File: src/components/admin/components/StatsCards.jsx
import { Eye, EyeOff, Package } from "lucide-react";

const StatsCards = ({ items, activeCategory }) => {
  // Calculate dynamic stats
  const totalItems = items?.length || 0;
  const visibleItems = items?.filter((i) => i.showOnHome).length || 0;
  const hiddenItems = totalItems - visibleItems;

  // Calculate percentages
  const visiblePercentage = totalItems > 0 ? Math.round((visibleItems / totalItems) * 100) : 0;
  const hiddenPercentage = totalItems > 0 ? Math.round((hiddenItems / totalItems) * 100) : 0;

  const CategoryIcon = activeCategory?.icon;

  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      percentage: null,
      icon: CategoryIcon || Package,
      description: `In ${activeCategory?.name || "Category"}`,
      trend: totalItems > 0 ? "stable" : "none"
    },
    {
      label: "Visible",
      value: visibleItems,
      percentage: visiblePercentage,
      icon: Eye,
      description: "Active on website",
      trend: visiblePercentage >= 70 ? "positive" : visiblePercentage >= 30 ? "neutral" : "negative"
    },
    {
      label: "Hidden",
      value: hiddenItems,
      percentage: hiddenPercentage,
      icon: EyeOff,
      description: "Not visible",
      trend: hiddenPercentage >= 70 ? "negative" : hiddenPercentage >= 30 ? "neutral" : "positive"
    },
  ];

  // Don't render if no active category
  if (!activeCategory) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="group bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50 hover:border-border"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Label */}
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {stat.label}
              </p>
              
              {/* Value and Percentage */}
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-3xl font-bold text-foreground">
                  {stat.value}
                </h3>
                {stat.percentage !== null && (
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.trend === "positive" 
                      ? "bg-green-500/10 text-green-600" 
                      : stat.trend === "negative"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-blue-500/10 text-blue-600"
                  }`}>
                    {stat.percentage}%
                  </span>
                )}
              </div>
              
              {/* Description */}
              {stat.description && (
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              )}
            </div>
            
            {/* Icon */}
            <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-300 flex-shrink-0 ml-4">
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default StatsCards;