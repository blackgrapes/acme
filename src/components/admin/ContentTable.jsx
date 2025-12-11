// File: src/components/admin/components/ContentTable.jsx
import { Loader2, Search } from "lucide-react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const ContentTable = ({
  activeCategory,
  filteredItems,
  loading,
  onToggleVisibility,
  onDeleteItem,
  canUpdate,
  canDelete,
}) => (
  <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
    <div className="px-4 sm:px-6 py-4 border-b border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {activeCategory.name} Management
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {/* Scroll hint for mobile */}
        <div className="sm:hidden flex items-center gap-2 text-xs text-muted-foreground">
          <div className="animate-bounce">←→</div>
          <span>Scroll horizontally to see more</span>
        </div>
      </div>
    </div>

    {loading ? (
      <LoadingState />
    ) : filteredItems.length > 0 ? (
      <TableContent
        activeCategory={activeCategory}
        filteredItems={filteredItems}
        onToggleVisibility={onToggleVisibility}
        onDeleteItem={onDeleteItem}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    ) : (
      <EmptyState />
    )}
  </div>
);

// Sub-components for ContentTable
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">Loading content...</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 px-4">
    <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
    <p className="text-muted-foreground">
      Try adjusting your search criteria or add new items to get started.
    </p>
  </div>
);

const TableContent = ({ activeCategory, filteredItems, onToggleVisibility, onDeleteItem, canUpdate, canDelete }) => (
  <div className="overflow-x-auto">
    {/* Horizontal scroll container */}
    <div className="min-w-max">
      <TableHeader activeCategory={activeCategory} />
      <div className="min-w-max">
        {filteredItems.map((item) => (
          <TableRow
            key={item._id}
            item={item}
            activeCategory={activeCategory}
            onToggleVisibility={onToggleVisibility}
            onDeleteItem={onDeleteItem}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        ))}
      </div>
    </div>
  </div>
);

export default ContentTable;