import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data);
      setEmail(data.email || '');
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const data = {};
    if (email !== profile.email) data.email = email;
    if (password) data.password = password;

    if (Object.keys(data).length === 0) {
      setMessage('没有变更');
      return;
    }

    const result = await updateProfile(data);
    if (result.error) {
      setMessage(result.error);
    } else {
      setProfile(result);
      setPassword('');
      setMessage('资料已更新');
    }
  };

  if (!profile) return <div className="page"><p>加载中...</p></div>;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('zh-CN');

  return (
    <div className="page">
      <h1>// 个人资料</h1>
      {message && <p className="error" role="alert" style={{ color: message.includes('更新') ? 'var(--accent-green)' : undefined }}>{message}</p>}
      <p><strong style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>用户名</strong><br />{profile.username}</p>
      <p><strong style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>角色</strong><br />{profile.role}</p>
      <p><strong style={{ color: 'var(--text-dim)', fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>注册时间</strong><br />{formatDate(profile.createdAt)}</p>

      <h2>编辑资料</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="新密码（可选）" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">更新</button>
      </form>
    </div>
  );
}
