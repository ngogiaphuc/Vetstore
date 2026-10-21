import Swal from 'sweetalert2';

/**
 * Quick toast notification at top-end
 * @param {string} title - Message text
 * @param {'success'|'error'|'warning'|'info'} icon - Icon type
 */
export const showToast = (title, icon = 'success') => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: 'font-sans text-sm rounded-lg shadow-lg border border-border bg-card text-foreground',
    },
  });
};

/**
 * Confirm delete popup modal
 * @param {string} title - Item description or title
 * @param {string} itemName - Name of specific item being deleted
 * @returns {Promise<boolean>} Resolves true if confirmed
 */
export const confirmDeleteAlert = async (title = 'mục này', itemName = '') => {
  const result = await Swal.fire({
    title: `Xác nhận xóa ${title}?`,
    html: itemName
      ? `Bạn có chắc chắn muốn xóa <b class="text-red-600">"${itemName}"</b>?<br/><span class="text-xs text-slate-500">Hành động này không thể hoàn tác!</span>`
      : 'Hành động này không thể hoàn tác!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626', // red-600
    cancelButtonColor: '#6b7280', // gray-500
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Hủy bỏ',
    reverseButtons: true,
    customClass: {
      popup: 'font-sans rounded-xl',
      confirmButton: 'px-4 py-2 text-sm font-semibold rounded-lg',
      cancelButton: 'px-4 py-2 text-sm font-semibold rounded-lg',
    },
  });
  return result.isConfirmed;
};

/**
 * Success modal alert
 */
export const showSuccessAlert = (title, text = '') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonColor: '#059669', // emerald-600
    confirmButtonText: 'Đóng',
    customClass: {
      popup: 'font-sans rounded-xl',
    },
  });
};

/**
 * Error modal alert
 */
export const showErrorAlert = (title, text = '') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Hiểu rồi',
    customClass: {
      popup: 'font-sans rounded-xl',
    },
  });
};