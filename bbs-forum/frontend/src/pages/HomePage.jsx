import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';
import { useAuth } from '../AuthContext';

const CATEGORIES = [
  { value: '', label: '全部分类' },
  { value: 'general', label: '综合' },
  { value: 'tech', label: '技术' },
  { value: 'random', label: '灌水' },
];

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    getPosts(page, category).then(data => {
      setPosts(data.posts || []);
      setPagination(data.pagination || {});
    });
  }, [page, category]);

  const getCategoryTag = (cat) => {
    const map = {
      tech: { label: '技术', cls: 'tag-tech' },
      general: { label: '综合', cls: 'tag-general' },
      random: { label: '灌水', cls: 'tag-random' },
    };
    const info = map[cat] || { label: cat, cls: 'tag-general' };
    return <span className={`thread-tag ${info.cls}`}>{info.label}</span>;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} 分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} 天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="page">
      <div className="header-row">
        <h1>// 全部主题</h1>
        {user && <Link to="/new"><button>+ 发帖</button></Link>}
      </div>

      <div className="filters">
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="post-list">
        {posts.length === 0 && <p>暂无帖子 — 来发第一个吧</p>}
        {posts.map((post, i) => (
          <div
            key={post.id}
            className={`post-card ${post.pinned ? 'pinned' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="post-card-meta-top">
              {getCategoryTag(post.category)}
              {post.pinned && <span className="pin-badge">置顶</span>}
            </div>
            <Link to={`/post/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p className="meta">
              <span className="author-link">@{post.authorName}</span>
              {' · '}
              {formatDate(post.createdAt)}
            </p>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← 上一页</button>
          <span>{page} / {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>下一页 →</button>
        </div>
      )}
    </div>
  );
}
