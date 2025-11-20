import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
const ContentTable = ({
  activeCategory,
  filteredItems,
  loading,
  onComplete,
  onUpdateStatus,
  statsData,
}) => {
  const [actionLoading, setActionLoading] = useState(null);

//   const handleAction = async (item, action, ...args) => {
//     setActionLoading(item._id || item.email);
//     try {
//       await action(item, ...args);
//     } finally {
//       setActionLoading(null);
//     }
//   };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Limit Reached":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReasonText = (reason) => {
    return reason?.replace(/_/g, " ").toLowerCase() || "";
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {activeCategory.name} Management
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {statsData?.totalItems || 0} items found
          </p>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
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
          {filteredItems.length} items found
        </p>
      </div>

      <div className="overflow-x-auto">
        {activeCategory.id === "email-limits" ? (
          <EmailLimitsTable
            items={filteredItems}
            getStatusColor={getStatusColor}
          />
        ) : (
          <FallbackRequestsTable
            items={filteredItems}
            getStatusColor={getStatusColor}
            getReasonText={getReasonText}
            onUpdateStatus={onUpdateStatus}
            actionLoading={actionLoading}
            setActionLoading={setActionLoading} // Sirf setter function pass karo
          />
        )}
      </div>
    </div>
  );
};

// Email Limits Table
const EmailLimitsTable = ({ items, getStatusColor }) => (
  <table className="w-full">
    <thead className="bg-muted/50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Email
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Sent
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Limit
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Remaining
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      {items.map((user, index) => (
        <tr key={index} className="hover:bg-muted/50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
            {user.email}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {user.count}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {user.limit}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
            {Math.max(0, user.limit - user.count)}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                user.status
              )}`}
            >
              {user.status}
            </span>
          </td>
        </tr>
      ))}
      {items.length === 0 && (
        <tr>
          <td colSpan="5" className="px-6 py-12 text-center">
            <div className="text-muted-foreground">
              <svg
                className="mx-auto h-12 w-12 text-muted-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-foreground">
                No email activity today
              </p>
              <p className="text-sm text-muted-foreground">
                User email activity will appear here
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

// Fallback Requests Table Component
const FallbackRequestsTable = ({
  items,
  getStatusColor,
  getReasonText,
  onUpdateStatus,
  actionLoading,
  setActionLoading,
}) => {
  // State for modals
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "", // 'complete' or 'cancel'
    currentRequest: null,
    notes: "",
    password: "",
    showPassword: false,
  });

  // Open modal function
  const openModal = (type, request) => {
    setModalState({
      isOpen: true,
      type,
      currentRequest: request,
      notes: "",
      password: "",
      showPassword: false,
    });
  };

  // Close modal function
  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: "",
      currentRequest: null,
      notes: "",
      password: "",
      showPassword: false,
    });
  };

  // Direct action handler
  const handleDirectAction = async (request, status, notes = '', password = '') => {
    setActionLoading(request._id);
    try {
      await onUpdateStatus(request._id, status, notes, password);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle modal actions
  const handleModalAction = () => {
    const { type, currentRequest, notes, password } = modalState;

    if (type === "complete") {
      // Password validation
      if (!password || password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters",
          variant: "destructive"
        });
        return;
      }
      handleDirectAction(currentRequest, 'completed', notes, password);
    } else if (type === "cancel") {
      handleDirectAction(currentRequest, 'cancelled', notes);
    }

    closeModal();
  };

  // Reopen action
  const handleReopen = (request) => {
    handleDirectAction(request, 'pending', 'Reopened by admin');
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {items.map((request) => (
          <div
            key={request._id}
            className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              
              {/* Request Information Section */}
              <div className="flex-1 space-y-4">
                {/* Header with Email and Status Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <h3 className="text-lg font-semibold text-foreground">
                        {request.email}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        request.userExists
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {request.userExists ? "User Exists" : "User Not Found"}
                    </span>
                  </div>
                </div>

                {/* Request Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Reason
                    </p>
                    <p className="text-foreground font-medium capitalize">
                      {getReasonText(request.reason)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Requested
                    </p>
                    <p className="text-foreground font-medium">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {request.completedAt && (
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Completed
                      </p>
                      <p className="text-foreground font-medium">
                        {new Date(request.completedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                {request.completedBy && (
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Completed by
                    </p>
                    <p className="text-foreground font-medium">
                      {request.completedBy.name} ({request.completedBy.email})
                    </p>
                  </div>
                )}

                {/* Admin Notes */}
                {request.adminNotes && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      Admin Notes
                    </p>
                    <p className="text-sm text-primary/90">
                      {request.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons Section */}
              <div className="flex flex-col gap-3 min-w-[220px]">
                {request.status === "pending" && request.userExists && (
                  <Button
                    type="button"
                    onClick={() => openModal("complete", request)}
                    disabled={actionLoading === request._id}
                    variant="default"
                    className="w-full cursor-pointer flex items-center justify-center gap-2"
                    permission="requests-update"
                  >
                    {actionLoading === request._id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Complete & Set Password
                      </>
                    )}
                  </Button>
                )}

                {request.status === "pending" && (
                  <Button
                    type="button"
                    onClick={() => openModal("cancel", request)}
                    disabled={actionLoading === request._id}
                    variant="destructive"
                    className="w-full flex cursor-pointer items-center justify-center gap-2"
                    permission="requests-delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel Request
                  </Button>
                )}

                {request.status !== "pending" && (
                  <Button
                    type="button"
                    onClick={() => handleReopen(request)}
                    disabled={actionLoading === request._id}
                    variant="outline"
                    className="w-full cursor-pointer"
                    permission="requests-update"
                  >
                    Reopen Request
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-16 bg-card rounded-lg border-2 border-dashed border-border">
            <div className="flex justify-center">
              <svg
                className="h-16 w-16 text-muted-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No fallback requests
            </h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              All password reset requests are being handled automatically via
              email. Fallback requests will appear here when users need manual
              assistance.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Complete Action */}
      <Dialog
        open={modalState.isOpen && modalState.type === "complete"}
        onOpenChange={closeModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              Set New Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for{" "}
              <span className="font-semibold text-foreground">
                {modalState.currentRequest?.email}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={modalState.showPassword ? "text" : "password"}
                  value={modalState.password}
                  onChange={(e) =>
                    setModalState((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter secure password (min 6 characters)"
                  className="w-full pr-10"
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setModalState((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  className="absolute cursor-pointer right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  {modalState.showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {modalState.password && modalState.password.length < 6 && (
                <p className="text-sm text-destructive mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
          </div>

            <DialogFooter>
            <Button 
              type="button"
              onClick={closeModal} 
              className="cursor-pointer" 
              variant="outline"
            >
              Cancel
            </Button>
              <Button
                type="button"
                onClick={handleModalAction}
                disabled={
                  !modalState.password ||
                  modalState.password.length < 6 ||
                  actionLoading === modalState.currentRequest?._id
                }
                className="cursor-pointer"
                permission="requests-update"
              >
              {actionLoading === modalState.currentRequest?._id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting Password...
                </>
              ) : (
                "Set Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal for Cancel Action */}
      <Dialog
        open={modalState.isOpen && modalState.type === "cancel"}
        onOpenChange={closeModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              Cancel Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the request for{" "}
              <span className="font-semibold text-foreground">
                {modalState.currentRequest?.email}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Cancellation Notes (Optional)
            </label>
            <textarea
              value={modalState.notes}
              onChange={(e) =>
                setModalState((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add reason for cancellation..."
              rows="3"
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button"
              onClick={closeModal} 
              className="cursor-pointer" 
              variant="outline"
            >
              Go Back
            </Button>
            <Button
              type="button"
              onClick={handleModalAction}
              disabled={actionLoading === modalState.currentRequest?._id}
              variant="destructive"
              className="cursor-pointer"
              permission="requests-delete"
            >
              {actionLoading === modalState.currentRequest?._id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Confirm Cancel"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentTable;
