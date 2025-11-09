// File: src/components/admin/components/TableRow.jsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Video, ImageIcon, MoreHorizontal, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const TableRow = ({ item, activeCategory, onToggleVisibility, onDeleteItem }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const getItemName = () => {
    switch (activeCategory.id) {
      case "weprovide": return item.title || "Untitled Service";
      case "gallery": return item.caption || "Untitled Gallery Item";
      case "clients": return item.name || "Untitled Client";
      case "testimonials": return item.quote ? `"${item.quote.substring(0, 30)}..."` : "Untitled Testimonial";
      default: return "Untitled";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
      <div className="border-b border-border hover:bg-muted/30 transition-colors">
        {/* Desktop View with Horizontal Scroll */}
        <div className="hidden sm:flex min-w-max">
          {renderDesktopRowContent(item, activeCategory, handleImageClick)}
          
          {/* Common Columns */}
          <CommonColumns 
            item={item}
            activeCategory={activeCategory}
            onToggleVisibility={onToggleVisibility}
            onDeleteItem={onDeleteItem}
            getItemName={getItemName}
            formatDate={formatDate}
          />
        </div>

        {/* Mobile View - Stacked Layout */}
        <div className="sm:hidden p-4 space-y-3">
          {renderMobileRowContent(item, activeCategory, handleImageClick)}
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <StatusBadge showOnHome={item.showOnHome} />
              <VisibilityToggle 
                item={item}
                onToggleVisibility={onToggleVisibility}
                mobile={true}
              />
            </div>
            
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">
                {item.updatedAt ? formatDate(item.updatedAt) : 'Recently'}
              </p>
              <MobileActions 
                item={item}
                getItemName={getItemName}
                onDeleteItem={onDeleteItem}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl max-w-4xl max-h-[90vh] w-full relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20 z-10"
              onClick={closePreview}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Image */}
            <div className="p-4">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
            
            {/* Image Info */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Click outside or press ESC to close
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closePreview}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Desktop Row Content with Fixed Widths
const renderDesktopRowContent = (item, activeCategory, onImageClick) => {
  switch (activeCategory.id) {
    case "weprovide":
      return <WeProvideDesktopRow item={item} onImageClick={onImageClick} />;
    case "gallery":
      return <GalleryDesktopRow item={item} onImageClick={onImageClick} />;
    case "clients":
      return <ClientsDesktopRow item={item} onImageClick={onImageClick} />;
    case "testimonials":
      return <TestimonialsDesktopRow item={item} onImageClick={onImageClick} />;
    default:
      return <WeProvideDesktopRow item={item} onImageClick={onImageClick} />;
  }
};

// Mobile Row Content - Stacked Layout
const renderMobileRowContent = (item, activeCategory, onImageClick) => {
  switch (activeCategory.id) {
    case "weprovide":
      return <WeProvideMobileRow item={item} onImageClick={onImageClick} />;
    case "gallery":
      return <GalleryMobileRow item={item} onImageClick={onImageClick} />;
    case "clients":
      return <ClientsMobileRow item={item} onImageClick={onImageClick} />;
    case "testimonials":
      return <TestimonialsMobileRow item={item} onImageClick={onImageClick} />;
    default:
      return <WeProvideMobileRow item={item} onImageClick={onImageClick} />;
  }
};

// WeProvide Desktop Row
const WeProvideDesktopRow = ({ item, onImageClick }) => (
  <>
    {/* Image - w-16 */}
    <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      {item.img ? (
        <button
          onClick={() => onImageClick(item.img)}
          className="w-10 h-10 rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200"
        >
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
    </div>

    {/* Title - w-48 */}
    <div className="w-48 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      <div className="min-w-0">
        <h4 className="font-medium text-foreground truncate text-sm">
          {item.title}
        </h4>
      </div>
    </div>

    {/* Summary - w-64 */}
    <div className="w-64 px-3 sm:px-4 py-3 sm:py-4 hidden sm:flex items-center flex-shrink-0">
      <p className="text-sm text-muted-foreground truncate">
        {item.summary}
      </p>
    </div>

    {/* Benefits - w-48 */}
    <div className="w-48 px-3 sm:px-4 py-3 sm:py-4 hidden md:flex items-center flex-shrink-0">
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-xs">
          {item.benefits?.length || 0}
        </Badge>
        {item.benefits?.length > 0 && (
          <span className="text-xs text-muted-foreground truncate">
            {item.benefits[0]}
          </span>
        )}
      </div>
    </div>

    {/* Slug - w-32 */}
    <div className="w-32 px-3 sm:px-4 py-3 sm:py-4 hidden lg:flex items-center flex-shrink-0">
      <p className="text-sm text-muted-foreground font-mono truncate">
        {item.slug}
      </p>
    </div>

    {/* Order - w-20 */}
    <div className="w-20 px-3 sm:px-4 py-3 sm:py-4 hidden sm:flex items-center flex-shrink-0">
      <Badge variant="secondary" className="text-xs">
        #{item.order || 0}
      </Badge>
    </div>
  </>
);

// WeProvide Mobile Row
const WeProvideMobileRow = ({ item, onImageClick }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      {item.img ? (
        <button
          onClick={() => onImageClick(item.img)}
          className="w-12 h-12 rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 flex-shrink-0"
        >
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border flex-shrink-0">
          <ImageIcon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-base">
          {item.title}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          {item.summary}
        </p>
      </div>
    </div>
    
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant="outline" className="text-xs">
        Slug: {item.slug}
      </Badge>
      <Badge variant="secondary" className="text-xs">
        Order: #{item.order || 0}
      </Badge>
      <Badge variant="outline" className="text-xs">
        {item.benefits?.length || 0} Benefits
      </Badge>
    </div>
  </div>
);

// Gallery Desktop Row
const GalleryDesktopRow = ({ item, onImageClick }) => (
  <>
    {/* Media - w-16 */}
    <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      {item.mediaFiles && item.mediaFiles.length > 0 && item.type === 'image' ? (
        <button
          onClick={() => onImageClick(item.mediaFiles[0])}
          className="w-10 h-10 rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200"
        >
          <img
            src={item.mediaFiles[0]}
            alt={item.caption}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border">
          {item.type === 'video' ? (
            <Video className="h-4 w-4" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </div>
      )}
    </div>

    {/* Caption - w-64 */}
    <div className="w-64 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      <h4 className="font-medium text-foreground truncate text-sm">
        {item.caption}
      </h4>
    </div>

    {/* Tag - w-32 */}
    <div className="w-32 px-3 sm:px-4 py-3 sm:py-4 hidden sm:flex items-center flex-shrink-0">
      <Badge variant="outline" className="text-xs capitalize">
        {item.tag}
      </Badge>
    </div>

    {/* Type - w-24 */}
    <div className="w-24 px-3 sm:px-4 py-3 sm:py-4 hidden md:flex items-center flex-shrink-0">
      <Badge variant="secondary" className="text-xs capitalize">
        {item.type}
      </Badge>
    </div>

    {/* Files - w-20 */}
    <div className="w-20 px-3 sm:px-4 py-3 sm:py-4 hidden sm:flex items-center flex-shrink-0">
      <Badge variant="outline" className="text-xs">
        {item.mediaFiles?.length || 0}
      </Badge>
    </div>
  </>
);

// Gallery Mobile Row
const GalleryMobileRow = ({ item, onImageClick }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      {item.mediaFiles && item.mediaFiles.length > 0 && item.type === 'image' ? (
        <button
          onClick={() => onImageClick(item.mediaFiles[0])}
          className="w-12 h-12 rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 flex-shrink-0"
        >
          <img
            src={item.mediaFiles[0]}
            alt={item.caption}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border flex-shrink-0">
          {item.type === 'video' ? (
            <Video className="h-5 w-5" />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-base">
          {item.caption}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs capitalize">
            {item.tag}
          </Badge>
          <Badge variant="secondary" className="text-xs capitalize">
            {item.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {item.mediaFiles?.length || 0} files
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

// Clients Desktop Row
const ClientsDesktopRow = ({ item, onImageClick }) => (
  <>
    {/* Logo - w-16 */}
    <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      {item.logo ? (
        <button
          onClick={() => onImageClick(item.logo)}
          className="w-10 h-10 rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200"
        >
          <img
            src={item.logo}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
    </div>

    {/* Name - w-48 */}
    <div className="w-48 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      <div className="min-w-0">
        <h4 className="font-medium text-foreground truncate text-sm">
          {item.name}
        </h4>
      </div>
    </div>

    {/* Quote - w-96 */}
    <div className="w-96 px-3 sm:px-4 py-3 sm:py-4 hidden sm:flex items-center flex-shrink-0">
      <p className="text-sm text-muted-foreground truncate">
        {item.quote || item.description || "No description"}
      </p>
    </div>
  </>
);

// Clients Mobile Row
const ClientsMobileRow = ({ item, onImageClick }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      {item.logo ? (
        <button
          onClick={() => onImageClick(item.logo)}
          className="w-12 h-12 rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 flex-shrink-0"
        >
          <img
            src={item.logo}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground border border-border flex-shrink-0">
          <ImageIcon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-base">
          {item.name}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          {item.quote || item.description || "No description"}
        </p>
      </div>
    </div>
  </div>
);

// Testimonials Desktop Row
const TestimonialsDesktopRow = ({ item, onImageClick }) => (
  <>
    {/* Video - w-16 */}
    <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      {item.video ? (
        <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 border border-border">
          <Video className="h-4 w-4" />
        </div>
      ) : item.authorAvatar ? (
        <button
          onClick={() => onImageClick(item.authorAvatar)}
          className="w-10 h-10 rounded-full border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200"
        >
          <img
            src={item.authorAvatar}
            alt={item.author}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
          <ImageIcon className="h-4 w-4" />
        </div>
      )}
    </div>

    {/* Quote - w-96 */}
    <div className="w-96 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
      <p className="text-sm text-muted-foreground truncate">
        {item.quote ? `"${item.quote}"` : "No quote"}
      </p>
    </div>

    {/* Author - w-48 */}
    <div className="w-48 px-3 sm:px-4 py-3 sm:py-4 hidden sm:flex items-center flex-shrink-0">
      <div className="min-w-0">
        <h4 className="font-medium text-foreground truncate text-sm">
          {item.author}
        </h4>
        <p className="text-xs text-muted-foreground truncate">
          {item.position || "No position"}
        </p>
      </div>
    </div>
  </>
);

// Testimonials Mobile Row
const TestimonialsMobileRow = ({ item, onImageClick }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-3">
      {item.video ? (
        <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 border border-border flex-shrink-0">
          <Video className="h-5 w-5" />
        </div>
      ) : item.authorAvatar ? (
        <button
          onClick={() => onImageClick(item.authorAvatar)}
          className="w-12 h-12 rounded-full border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 flex-shrink-0"
        >
          <img
            src={item.authorAvatar}
            alt={item.author}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </button>
      ) : (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border flex-shrink-0">
          <ImageIcon className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-base">
          {item.author}
        </h4>
        <p className="text-sm text-muted-foreground">
          {item.position || "No position"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {item.quote ? `"${item.quote.substring(0, 80)}..."` : "No quote"}
        </p>
      </div>
    </div>
  </div>
);

// Common Columns Component - Status, Last Updated, Visibility, Actions
const CommonColumns = ({ item, onToggleVisibility, onDeleteItem, getItemName, formatDate }) => (
  <>
    {/* Status - w-24 */}
    <div className="w-24 px-3 sm:px-4 py-3 sm:py-4 hidden sm:flex items-center flex-shrink-0">
      <StatusBadge showOnHome={item.showOnHome} />
    </div>

    {/* Last Updated - w-32 */}
    <div className="w-32 px-3 sm:px-4 py-3 sm:py-4 hidden md:flex items-center flex-shrink-0">
      <p className="text-xs text-muted-foreground">
        {item.updatedAt ? formatDate(item.updatedAt) : formatDate(new Date())}
      </p>
    </div>

    {/* Visibility - w-32 */}
    <div className="w-32 px-3 sm:px-4 py-3 sm:py-4 hidden md:flex items-center flex-shrink-0">
      <VisibilityToggle 
        item={item}
        onToggleVisibility={onToggleVisibility}
      />
    </div>

    {/* Actions - w-20 */}
    <div className="w-20 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-end flex-shrink-0">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => onDeleteItem(item._id, getItemName())}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  </>
);

// Mobile Actions Component
const MobileActions = ({ item, getItemName, onDeleteItem }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => onDeleteItem(item._id, getItemName())}
        className="text-destructive"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Common Status Badge Component
const StatusBadge = ({ showOnHome }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
      showOnHome
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    <div
      className={`h-1.5 w-1.5 rounded-full ${
        showOnHome ? "bg-green-600" : "bg-gray-600"
      }`}
    />
    {showOnHome ? "Active" : "Inactive"}
  </span>
);

// Common Visibility Toggle Component
const VisibilityToggle = ({ item, onToggleVisibility, mobile = false }) => (
  <Button
    variant={mobile ? "outline" : "ghost"}
    size="sm"
    onClick={() => onToggleVisibility(item._id, item.showOnHome)}
    className={mobile ? "h-7 text-xs" : "h-8 justify-start text-xs"}
  >
    {item.showOnHome ? (
      <>
        <Eye className="h-3.5 w-3.5 mr-1" />
        {mobile ? "Visible" : "Visible"}
      </>
    ) : (
      <>
        <EyeOff className="h-3.5 w-3.5 mr-1" />
        {mobile ? "Hidden" : "Hidden"}
      </>
    )}
  </Button>
);

export default TableRow;