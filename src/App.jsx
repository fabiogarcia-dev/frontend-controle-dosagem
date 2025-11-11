import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicView from './pages/PublicView';
import Search from './pages/Search';
import UserRegister from './pages/UserRegister';


// 🔐 Componente de rota protegida
function PrivateRoute({ children, roleRequired }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 'admin' ou 'user'

  if (!token) return <Navigate to="/" />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/public" />;

  return children;
}

export default function App() {
  // ⏳ Expiração de login
  useEffect(() => {
    const loginDateRaw = localStorage.getItem('loginDate');
    if (!loginDateRaw) return;

    const loginDate = new Date(loginDateRaw);
    const now = new Date();
    const diff = (now - loginDate) / (1000 * 60 * 60 * 24);

    if (diff > 5) {
      localStorage.clear();
      window.location.href = '/';
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roleRequired="admin">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute roleRequired="admin">
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/public"
          element={
            <PrivateRoute>
              <PublicView />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute roleRequired="admin">
              <UserRegister />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}