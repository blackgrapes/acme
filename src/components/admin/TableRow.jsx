// File: src/components/admin/components/TableRow.jsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, Video, ImageIcon, MoreHorizontal, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const TableRow = ({ item, activeCategory, onToggleVisibility, onDeleteItem, onEditItem }) => {
  const [previewImages, setPreviewImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);
  const [deletingItem, setDeletingItem] = useState(false);

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

  const handleImageClick = (imageUrl, allImages = null, index = 0) => {
    if (allImages && allImages.length > 1) {
      setPreviewImages(allImages);
      setCurrentImageIndex(index);
    } else {
      setPreviewImages([imageUrl]);
      setCurrentImageIndex(0);
    }
  };

  const closePreview = () => {
    setPreviewImages(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (previewImages && previewImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % previewImages.length);
    }
  };

  const prevImage = () => {
    if (previewImages && previewImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!previewImages) return;
      
      if (e.key === 'Escape') {
        closePreview();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [previewImages]);

  const getImagesForItem = () => {
    switch (activeCategory.id) {
      case "weprovide":
        return item.img ? [item.img] : [];
      case "gallery":
        return item.mediaFiles || [];
      case "clients":
        return item.logo ? [item.logo] : [];
      case "testimonials":
        return item.authorAvatar ? [item.authorAvatar] : [];
      default:
        return [];
    }
  };

  // Handle visibility toggle with loading state
  const handleToggleVisibility = async () => {
    setTogglingVisibility(true);
    try {
      await onToggleVisibility(item._id, item.showOnHome);
    } catch (error) {
      console.error('Error toggling visibility:', error);
    } finally {
      setTogglingVisibility(false);
    }
  };

  // Handle delete with confirmation
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setDeletingItem(true);
    try {
      await onDeleteItem(item._id, getItemName());
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeletingItem(false);
      setShowDeleteDialog(false);
    }
  };

  // Handle edit
  const handleEditClick = () => {
    if (onEditItem) {
      onEditItem(item);
    }
  };

  return (
    <>
      <div className="border-b border-border hover:bg-muted/30 transition-colors">
        {/* Desktop View with Horizontal Scroll */}
        <div className="hidden sm:flex min-w-max">
          {renderDesktopRowContent(item, activeCategory, handleImageClick, getImagesForItem)}
          
          {/* Common Columns */}
          <CommonColumns 
            item={item}
            activeCategory={activeCategory}
            onToggleVisibility={handleToggleVisibility}
            onDeleteItem={handleDeleteClick}
            onEditItem={handleEditClick}
            getItemName={getItemName}
            formatDate={formatDate}
            togglingVisibility={togglingVisibility}
          />
        </div>

        {/* Mobile View - Stacked Layout */}
        <div className="sm:hidden p-4 space-y-3">
          {renderMobileRowContent(item, activeCategory, handleImageClick, getImagesForItem)}
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <StatusBadge showOnHome={item.showOnHome} />
              <VisibilityToggle 
                item={item}
                onToggleVisibility={handleToggleVisibility}
                togglingVisibility={togglingVisibility}
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
                onDeleteItem={handleDeleteClick}
                onEditItem={handleEditClick}
                togglingVisibility={togglingVisibility}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImages && previewImages.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div 
            className="bg-card rounded-xl max-w-4xl max-h-[90vh] w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white cursor-pointer hover:bg-white/20 z-10"
              onClick={closePreview}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Navigation Arrows for multiple images */}
            {previewImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute cursor-pointer left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            {/* Image Container */}
            <div className="p-4 max-h-[80vh] overflow-hidden">
              <img
                src={previewImages[currentImageIndex]}
                alt="Preview"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            
            {/* Image Counter for multiple images */}
            {previewImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {previewImages.length}
              </div>
            )}
            
            {/* Thumbnail Strip for multiple images */}
            {previewImages.length > 1 && (
              <div className="px-6 py-3 border-t border-border">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {previewImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-12 cursor-pointer h-12 rounded border-2 overflow-hidden transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary ring-2 ring-primary/50' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{getItemName()}"</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={deletingItem}
                className="flex-1"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deletingItem}
              className="flex-1"
            >
              {deletingItem ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Yes, Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Desktop Row Content with Fixed Widths
const renderDesktopRowContent = (item, activeCategory, onImageClick, getImagesForItem) => {
  switch (activeCategory.id) {
    case "weprovide":
      return <WeProvideDesktopRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    case "gallery":
      return <GalleryDesktopRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    case "clients":
      return <ClientsDesktopRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    case "testimonials":
      return <TestimonialsDesktopRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    default:
      return <WeProvideDesktopRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
  }
};

// Mobile Row Content - Stacked Layout
const renderMobileRowContent = (item, activeCategory, onImageClick, getImagesForItem) => {
  switch (activeCategory.id) {
    case "weprovide":
      return <WeProvideMobileRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    case "gallery":
      return <GalleryMobileRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    case "clients":
      return <ClientsMobileRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    case "testimonials":
      return <TestimonialsMobileRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
    default:
      return <WeProvideMobileRow item={item} onImageClick={onImageClick} getImagesForItem={getImagesForItem} />;
  }
};

// WeProvide Desktop Row
const WeProvideDesktopRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  
  return (
    <>
      {/* Image - w-16 */}
      <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
        {images.length > 0 ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-10 h-10 cursor-pointer rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 relative"
          >
            <img
              src={images[0]}
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
};

// WeProvide Mobile Row
const WeProvideMobileRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {images.length > 0 ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-12 h-12 cursor-pointer rounded-md border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 flex-shrink-0"
          >
            <img
              src={images[0]}
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
};

// Gallery Desktop Row
const GalleryDesktopRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  const hasMultipleImages = images.length > 1;
  
  return (
    <>
      {/* Media - w-16 */}
      <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
        {images.length > 0 && item.type === 'image' ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-10 h-10 rounded-md cursor-pointer border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 relative"
          >
            <img
              src={images[0]}
              alt={item.caption}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
            {hasMultipleImages && (
              <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {images.length}
              </div>
            )}
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
          {images.length || 0}
        </Badge>
      </div>
    </>
  );
};

// Gallery Mobile Row
const GalleryMobileRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  const hasMultipleImages = images.length > 1;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {images.length > 0 && item.type === 'image' ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-12 h-12 rounded-md cursor-pointer border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 relative flex-shrink-0"
          >
            <img
              src={images[0]}
              alt={item.caption}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
            {hasMultipleImages && (
              <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {images.length}
              </div>
            )}
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
              {images.length || 0} files
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

// Clients Desktop Row
const ClientsDesktopRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  
  return (
    <>
      {/* Logo - w-16 */}
      <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
        {images.length > 0 ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-10 h-10 rounded-md cursor-pointer border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200"
          >
            <img
              src={images[0]}
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
};

// Clients Mobile Row
const ClientsMobileRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {images.length > 0 ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-12 h-12 rounded-md border cursor-pointer border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 flex-shrink-0"
          >
            <img
              src={images[0]}
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
};

// Testimonials Desktop Row
const TestimonialsDesktopRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  
  return (
    <>
      {/* Video - w-16 */}
      <div className="w-16 px-3 sm:px-4 py-3 sm:py-4 flex items-center flex-shrink-0">
        {item.video ? (
          <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 border border-border">
            <Video className="h-4 w-4" />
          </div>
        ) : images.length > 0 ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-10 h-10 rounded-full border cursor-pointer border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200"
          >
            <img
              src={images[0]}
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
};

// Testimonials Mobile Row
const TestimonialsMobileRow = ({ item, onImageClick, getImagesForItem }) => {
  const images = getImagesForItem();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {item.video ? (
          <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 border border-border flex-shrink-0">
            <Video className="h-5 w-5" />
          </div>
        ) : images.length > 0 ? (
          <button
            onClick={() => onImageClick(images[0], images, 0)}
            className="w-12 h-12 rounded-full cursor-pointer border border-border overflow-hidden hover:ring-2 ring-primary/50 transition-all duration-200 flex-shrink-0"
          >
            <img
              src={images[0]}
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
};

// Common Columns Component - Status, Last Updated, Visibility, Actions
const CommonColumns = ({ item, onToggleVisibility, onDeleteItem, onEditItem, getItemName, formatDate, togglingVisibility }) => (
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
        togglingVisibility={togglingVisibility}
      />
    </div>

    {/* Actions - w-20 */}
    <div className="w-20 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-end flex-shrink-0">
      <div className="flex items-center gap-1">
        {/* <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 cursor-pointer"
          onClick={onEditItem}
          disabled={togglingVisibility}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button> */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive cursor-pointer hover:text-destructive"
          onClick={onDeleteItem}
          disabled={togglingVisibility}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  </>
);

// Mobile Actions Component
const MobileActions = ({ item, getItemName, onDeleteItem, onEditItem, togglingVisibility }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer" disabled={togglingVisibility}>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-white">
      {/* <DropdownMenuItem onClick={onEditItem} disabled={togglingVisibility}>
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem> */}
      <DropdownMenuItem 
        onClick={onDeleteItem}
        className="text-destructive"
        disabled={togglingVisibility}
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
const VisibilityToggle = ({ item, onToggleVisibility, togglingVisibility, mobile = false }) => (
  <Button
    variant={mobile ? "outline" : "ghost"}
    size="sm"
    onClick={onToggleVisibility}
    disabled={togglingVisibility}
    className={`${mobile ? "h-7 text-xs cursor-pointer" : "h-8 cursor-pointer justify-start text-xs"} ${
      togglingVisibility ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {togglingVisibility ? (
      <>
        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
        {mobile ? "Updating..." : "Updating..."}
      </>
    ) : item.showOnHome ? (
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