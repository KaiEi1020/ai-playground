import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = await login(username, password);
    if (data.error) {
      setError(data.error);
    } else {
      loginUser(data.token, data.user);
      navigate('/');
    }
  };

  return (
    <div className="page">
      <h1>// 登录</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">登录</button>
      </form>
      <p style={{ padding: '0 2rem 1.5rem' }}>
        没有账号？<Link to="/register">注册</Link>
      </p>
    </div>
  );
}
