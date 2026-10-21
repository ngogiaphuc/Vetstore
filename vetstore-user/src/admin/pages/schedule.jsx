import { PageHeader } from '@/components/shared';
import { ScheduleGrid } from '@/admin/components/schedule/schedule-grid';
export default function SchedulePage() {
    return (<>
      <PageHeader title="Lịch sân" description="Bảng court_schedules × time_slots · nhấn vào ô trống để tạo phiếu đặt, nhấn ô đã đặt để xem chi tiết"/>
      <ScheduleGrid />
    </>);
}
