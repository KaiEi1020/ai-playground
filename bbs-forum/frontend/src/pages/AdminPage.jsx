import { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, toggleBanUser } from '../api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('stats');

  useEffect(() => {
    getAdminStats().then(data => {
      if (!data.error) setStats(data);
    });
    getAdminUsers().then(data => {
      if (Array.isArray(data)) setUsers(data);
    });
  }, []);

  const handleBan = async (userId) => {
    const updated = await toggleBanUser(userId);
    if (!updated.error) {
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    }
  };

  return (
    <div className="page">
      <h1>// 管理面板</h1>

      <div className="tabs">
        <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>统计</button>
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>用户</button>
      </div>

      {tab === 'stats' && stats && (
        <div className="stats">
          <div className="stat-card"><h3>用户数</h3><p>{stats.users}</p></div>
          <div className="stat-card"><h3>帖子数</h3><p>{stats.posts}</p></div>
          <div className="stat-card"><h3>评论数</h3><p>{stats.comments}</p></div>
        </div>
      )}

      {tab === 'users' && (
        <table>
          <thead>
            <tr><th>ID</th><th>用户名</th><th>邮箱</th><th>角色</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td style={{ color: 'var(--accent-cyan)' }}>@{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td style={{ color: u.banned ? 'var(--accent-pink)' : 'var(--accent-green)' }}>
                  {u.banned ? '已封禁' : '正常'}
                </td>
                <td>
                  {u.role !== 'admin' && (
                    <button
                      className={u.banned ? '' : 'danger'}
                      onClick={() => handleBan(u.id)}
                    >
                      {u.banned ? '解封' : '封禁'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
