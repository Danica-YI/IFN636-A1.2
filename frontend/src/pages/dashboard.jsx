import { useAuth } from '../context/AuthContext';
import AdminDashboard from './adminDashboard';
import StaffDashboard from './staffDashboard';

function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            {user?.role === 'admin' ? <AdminDashboard /> : <StaffDashboard />}
        </>
    );
}

export default Dashboard;