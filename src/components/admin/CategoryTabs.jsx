// File: src/components/admin/components/CategoryTabs.jsx
const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => (
  <div className="w-full bg-muted/40 border border-border rounded-2xl p-1.5 shadow-sm overflow-x-auto">
    <div className="flex gap-1 sm:gap-2 min-w-max justify-between">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory.id === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category)}
            className={`flex cursor-pointer items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 
            ${
              isActive
                ? "bg-white shadow-sm text-primary border border-border"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            <Icon
              className={`h-4 w-4 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span className="whitespace-nowrap">{category.name}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default CategoryTabs;