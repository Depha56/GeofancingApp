import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { FaSpinner } from 'react-icons/fa';

interface ProtectedProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedProps) => {
    const { user, loading } = useAuth();

    // Wait until auth state is loaded
    if (loading) 
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <FaSpinner className="animate-spin text-4xl text-blue-500 mb-2" />
                <span>Loading...</span>
            </div>
        );

    // If user exists and has allowed role
    if (user && user.role && allowedRoles.includes(user.role.toLowerCase()))
        return <>{children}</>;

    // Not authorized or not logged in
    return <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
