// File: src/components/admin/components/TableHeader.jsx
const TableHeader = ({ activeCategory }) => {
  // Enhanced header configuration with fixed widths for better scrolling
  const headerConfig = {
    weprovide: [
      { label: "Image", span: "w-16", showMobile: true },
      { label: "Title", span: "w-48", showMobile: true },
      { label: "Summary", span: "w-64", showMobile: false },
      { label: "Benefits", span: "w-48", showMobile: false },
      { label: "Slug", span: "w-32", showMobile: false },
      { label: "Order", span: "w-20", showMobile: false },
      { label: "Status", span: "w-24", showMobile: false },
      { label: "Last Updated", span: "w-32", showMobile: false },
      { label: "Visibility", span: "w-32", showMobile: false },
      { label: "Actions", span: "w-20", showMobile: true }
    ],
    gallery: [
      { label: "Media", span: "w-16", showMobile: true },
      { label: "Caption", span: "w-64", showMobile: true },
      { label: "Tag", span: "w-32", showMobile: false },
      { label: "Type", span: "w-24", showMobile: false },
      { label: "Files", span: "w-20", showMobile: false },
      { label: "Status", span: "w-24", showMobile: false },
      { label: "Last Updated", span: "w-32", showMobile: false },
      { label: "Visibility", span: "w-32", showMobile: false },
      { label: "Actions", span: "w-20", showMobile: true }
    ],
    clients: [
      { label: "Logo", span: "w-16", showMobile: true },
      { label: "Name", span: "w-48", showMobile: true },
      { label: "Quote", span: "w-96", showMobile: false },
      { label: "Status", span: "w-24", showMobile: false },
      { label: "Last Updated", span: "w-32", showMobile: false },
      { label: "Visibility", span: "w-32", showMobile: false },
      { label: "Actions", span: "w-20", showMobile: true }
    ],
    testimonials: [
      { label: "Video", span: "w-16", showMobile: true },
      { label: "Quote", span: "w-96", showMobile: true },
      { label: "Author", span: "w-48", showMobile: false },
      { label: "Status", span: "w-24", showMobile: false },
      { label: "Last Updated", span: "w-32", showMobile: false },
      { label: "Visibility", span: "w-32", showMobile: false },
      { label: "Actions", span: "w-20", showMobile: true }
    ]
  };

  const currentHeaders = headerConfig[activeCategory.id] || headerConfig.weprovide;

  return (
    <div className="bg-muted/50 border-b border-border">
      <div className="flex min-w-max">
        {currentHeaders.map((header, index) => (
          <div
            key={index}
            className={`${header.span} px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-muted-foreground flex-shrink-0 ${
              header.showMobile ? '' : 'hidden sm:flex'
            } items-center`}
          >
            {header.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableHeader;