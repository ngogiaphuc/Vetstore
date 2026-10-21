import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

/**
 * Reusable Confirm Delete Modal across all admin/management pages
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close modal
 * @param {string} title - Item type being deleted (e.g. "Địa điểm", "Sân thi đấu", "Người dùng")
 * @param {string} itemName - Name of the specific item being deleted
 * @param {function} onConfirm - Callback when user confirms deletion
 * @param {boolean} isLoading - Loading state during API deletion
 */
export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  title = 'mục này',
  itemName = '',
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center text-center pt-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Xác nhận xóa {title}?
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Bạn có chắc chắn muốn xóa{' '}
            {itemName ? (
              <span className="font-semibold text-slate-800">"{itemName}"</span>
            ) : (
              title
            )}
            ? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center gap-3 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Đang xóa...' : 'Xóa dữ liệu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
