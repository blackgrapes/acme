//File: src/app/client-dashboard/guard-details/[id]/layout.jsx
export default function ClientGuardDetailsLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* NO HEADER, NO SIDEBAR - Only content */}
      <div className="container mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
