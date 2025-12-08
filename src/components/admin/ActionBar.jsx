// File: src/components/admin/components/ActionBar.jsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import RequirePermission from "@/components/RequirePermission";

const ActionBar = ({
  searchQuery,
  onSearchChange,
  searchInputRef,
  activeCategory,
  dialogOpen,
  onDialogChange,
  renderDialogContent,
}) => (
  <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="flex-1 w-full lg:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={`Search ${activeCategory.name.toLowerCase()}...`}
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full lg:w-auto">
        <Dialog open={dialogOpen} onOpenChange={onDialogChange}>
          <RequirePermission permission="frontend-create">
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary cursor-pointer text-primary-foreground flex-1 lg:flex-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {activeCategory.name}
              </Button>
            </DialogTrigger>
          </RequirePermission>
          {renderDialogContent()}
        </Dialog>
      </div>
    </div>
  </div>
);

export default ActionBar;