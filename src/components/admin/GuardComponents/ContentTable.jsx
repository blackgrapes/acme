import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit2, User, Mail, Phone, MapPin, CheckCircle, Clock, XCircle } from "lucide-react";

const ContentTable = ({ 
  activeCategory, 
  filteredItems, 
  loading, 
  onGuardClick,
   onEditGuard,
  statsData 
}) => {
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (item, action, ...args) => {
    setActionLoading(item._id || item.email);
    try {
      await action(item, ...args);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Available':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'On Leave':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Assigned':
      case 'Active':
        return <CheckCircle className="h-3 w-3" />;
      case 'Available':
        return <Clock className="h-3 w-3" />;
      case 'On Leave':
        return <XCircle className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {activeCategory.name} Management
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Loading...
          </p>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          {activeCategory.name} Management
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredItems.length} {activeCategory.id === 'all-guards' ? 'guards' : activeCategory.name.toLowerCase()} found
        </p>
      </div>

      <div className="overflow-x-auto">
        <GuardsTable 
          items={filteredItems}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          onGuardClick={onGuardClick}
          actionLoading={actionLoading}
          handleAction={handleAction}
          onEditGuard={onEditGuard}
          totalGuards={statsData.totalGuards}
        />
      </div>
    </div>
  );
};

// Guards Table Component
const GuardsTable = ({ 
  items, 
  getStatusColor, 
  getStatusIcon, 
  onGuardClick,
  onEditGuard, // ✅ YEH PROP ADD KI HAI
  actionLoading,
  handleAction,
  totalGuards
}) => (
  <table className="w-full">
    <thead className="bg-muted/50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guard</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Contact</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Type</th>
        <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Location</th>
        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      {items.map((guard) => (
        <tr 
          key={guard._id} 
          className="hover:bg-muted/50 transition-colors cursor-pointer group"
          onClick={() => onGuardClick(guard._id)}
        >
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{guard.name}</div>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  ID: {guard.guardId}
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3 w-3 text-primary" />
                {guard.email}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-primary" />
                {guard.phone}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
            <Badge variant="outline" className="text-xs border-primary/20">
              {guard.type}
            </Badge>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex justify-center">
              <Badge 
                className={`inline-flex items-center gap-1 ${getStatusColor(guard.status)}`}
              >
                {getStatusIcon(guard.status)}
                <span className="hidden sm:inline">{guard.status}</span>
              </Badge>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {guard.location || "Main Office"}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center justify-end gap-1 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onGuardClick(guard._id);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditGuard(guard); // ✅ YEH LINE CHANGE KI HAI - onEditGuard call karo
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
      {items.length === 0 && (
        <tr>
          <td colSpan={6} className="px-6 py-12 text-center">
            <div className="text-muted-foreground">
              <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="mt-2 text-sm font-medium text-foreground">No guards found</p>
              <p className="text-sm text-muted-foreground">
                {totalGuards === 0 ? "No guards have been added yet" : "Try adjusting your search or filters"}
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default ContentTable;