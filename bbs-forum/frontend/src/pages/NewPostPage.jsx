import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = await createPost(title, content, category);
    if (data.error) {
      setError(data.error);
    } else {
      navigate(`/post/${data.id}`);
    }
  };

  return (
    <div className="page">
      <h1>// 发布新帖</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="帖子标题" value={title} onChange={e => setTitle(e.target.value)} required />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="general">综合</option>
          <option value="tech">技术</option>
          <option value="random">灌水</option>
        </select>
        <textarea placeholder="帖子内容..." value={content} onChange={e => setContent(e.target.value)} required />
        <button type="submit">发布</button>
      </form>
    </div>
  );
}
