// File: src/app/admin-dashboard/client-details/[id]/layout.jsx
export default function ClientDetailsLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* NO HEADER, NO SIDEBAR - Only content */}
      <div className="container mx-auto px-4 py-6">{children}</div>
    </div>
  );
}