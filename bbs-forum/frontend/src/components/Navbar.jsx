import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">NEONBOARD</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/new">+ 发帖</Link>
            <Link to="/profile">个人</Link>
            {user.role === 'admin' && <Link to="/admin">管理</Link>}
            <button onClick={logout}>退出</button>
          </>
        ) : (
          <>
            <Link to="/login">登录</Link>
            <Link to="/register">注册</Link>
          </>
        )}
      </div>
    </nav>
  );
}
