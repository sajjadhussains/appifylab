import DashboardLayout from '@/components/layouts/DashboardLayout';
import LeftSidebar from '@/components/LeftSidebar';
import FeedMiddle from '@/components/FeedMiddle';
import RightSidebar from '@/components/RightSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="row">
          <LeftSidebar />
          <FeedMiddle />
          <RightSidebar />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
