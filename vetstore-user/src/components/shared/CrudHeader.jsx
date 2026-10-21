import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';

/**
 * Reusable CRUD Header bar with Title, Search, Filter, and Add Button
 */
export const CrudHeader = ({
  title,
  subtitle,
  searchTerm = '',
  onSearchChange,
  onAddClick,
  addLabel = 'Thêm mới',
  extraActions = null,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {onSearchChange && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        )}

        {extraActions}

        {onAddClick && (
          <Button
            onClick={onAddClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{addLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
