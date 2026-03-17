import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, addComment, deletePost } from '../api';
import { useAuth } from '../AuthContext';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getPost(id).then(data => {
      if (data.error) setError(data.error);
      else setPost(data);
    });
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const data = await addComment(id, comment);
    if (!data.error) {
      setPost(prev => ({ ...prev, comments: [...prev.comments, data] }));
      setComment('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('确定删除此帖？此操作不可撤销。')) {
      await deletePost(id);
      navigate('/');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!post) return <div className="page"><p>加载中...</p></div>;

  const canModify = user && (user.id === post.authorId || user.role === 'admin');

  return (
    <div className="page">
      <h1>{post.title}</h1>
      <p className="meta" style={{ padding: '0.75rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--accent-cyan)' }}>@{post.authorName}</span>
        {' · '}
        {post.category}
        {' · '}
        {formatDate(post.createdAt)}
      </p>

      <div className="content">{post.content}</div>

      {canModify && (
        <div className="actions">
          <button onClick={handleDelete} className="danger">删除帖子</button>
        </div>
      )}

      <h2>回复 ({post.comments?.length || 0})</h2>

      {post.comments?.map(c => (
        <div key={c.id} className="comment">
          <p>{c.content}</p>
          <p className="meta">
            <span style={{ color: 'var(--accent-cyan)' }}>@{c.authorName}</span>
            {' · '}
            {formatDate(c.createdAt)}
          </p>
        </div>
      ))}

      {user ? (
        <form onSubmit={handleComment}>
          <textarea
            placeholder="写下你的回复..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
          />
          <button type="submit">发布回复</button>
        </form>
      ) : (
        <p style={{ padding: '1.5rem 2rem' }}>
          请 <Link to="/login">登录</Link> 后发表回复
        </p>
      )}
    </div>
  );
}
