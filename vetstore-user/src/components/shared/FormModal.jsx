import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getVietnamProvinces } from '@/services/vietnam-address';

/**
 * Reusable Form Modal for Add and Edit operations across all entities (Venue, Court, User, Sport...)
 * Supports Vietnam Address API (Provinces & Districts) out of the box.
 */
export const FormModal = ({
  isOpen,
  onClose,
  title = '',
  initialValues = null,
  fields = [],
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const isEditMode = Boolean(initialValues && initialValues.id);

  // Load Vietnam Administrative API data if form contains province/district or address fields
  useEffect(() => {
    let isMounted = true;
    const hasAddressField = fields.some(
      (f) => f.name === 'province' || f.name === 'district' || f.type === 'province' || f.type === 'district'
    );

    if (isOpen && hasAddressField && provinces.length === 0) {
      setLoadingAddress(true);
      getVietnamProvinces()
        .then((data) => {
          if (isMounted) {
            setProvinces(data);
            setLoadingAddress(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingAddress(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, fields, provinces.length]);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      const defaultState = {};
      fields.forEach((field) => {
        defaultState[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
      });
      setFormData(defaultState);
    }
    setErrors({});
  }, [initialValues, isOpen, fields]);

  const handleChange = (name, value) => {
    setFormData((prev) => {
      const nextData = { ...prev, [name]: value };
      // If province changes, clear selected district if it no longer belongs to new province
      if (name === 'province' || name === 'provinceCode') {
        nextData.district = '';
        nextData.districtCode = '';
      }
      return nextData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && (!formData[field.name] || String(formData[field.name]).trim() === '')) {
        newErrors[field.name] = `${field.label} không được để trống`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData, isEditMode);
  };

  // Helper to compute field options dynamically
  const getFieldOptions = (field) => {
    if (typeof field.options === 'function') {
      return field.options(formData, provinces);
    }

    if (field.name === 'province' || field.type === 'province') {
      return provinces.map((p) => ({ value: p.name, label: p.name, code: p.code }));
    }

    if (field.name === 'district' || field.type === 'district') {
      const selectedProvinceName = formData.province;
      const currentProv = provinces.find((p) => p.name === selectedProvinceName);
      if (!currentProv) {
        return [{ value: '', label: selectedProvinceName ? 'Đang tải quận/huyện...' : 'Chọn Tỉnh/Thành trước' }];
      }
      return currentProv.districts.map((d) => ({ value: d.name, label: d.name }));
    }

    return field.options || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {isEditMode ? `Chỉnh sửa ${title}` : `Thêm mới ${title}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {fields.map((field) => {
            const value = formData[field.name] !== undefined ? formData[field.name] : '';
            const errorMsg = errors[field.name];
            const isSelectType = field.type === 'select' || field.type === 'province' || field.type === 'district' || field.name === 'province' || field.name === 'district';
            const currentOptions = isSelectType ? getFieldOptions(field) : [];
            const selectedOpt = currentOptions.find((opt) => String(opt.value) === String(value));

            return (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name} className="text-sm font-semibold text-slate-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>

                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}...`}
                    rows={field.rows || 3}
                  />
                ) : isSelectType ? (
                  <Select
                    value={String(value)}
                    onValueChange={(val) => handleChange(field.name, val)}
                    disabled={loadingAddress && (field.name === 'province' || field.name === 'district')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field.placeholder || `Chọn ${field.label.toLowerCase()}...`}>
                        {selectedOpt ? selectedOpt.label : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[260px] overflow-y-auto min-w-[var(--anchor-width)] w-auto max-w-full">
                      {currentOptions.map((opt) => (
                        <SelectItem key={opt.value || opt.label} value={String(opt.value)} label={opt.label}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type || 'text'}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}...`}
                  />
                )}

                {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
              </div>
            );
          })}

          <DialogFooter className="pt-4 border-t mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              {isLoading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};