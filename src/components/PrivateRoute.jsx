import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, roleRequired }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 'admin' ou 'user'

  if (!token) {
    return <Navigate to="/" />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/public" />;
  }

  return children;
}