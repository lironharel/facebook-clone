import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feed({ token }) {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/api/posts', { headers });
    setPosts(res.data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const submit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/posts', { content }, { headers });
    setContent('');
    fetchPosts();
  };

  return (
    <div>
      <h2>Feed</h2>
      <form onSubmit={submit}>
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" />
        <button type="submit">Post</button>
      </form>
      <ul>
        {posts.map(p => (
          <li key={p._id}>{p.author.username}: {p.content}</li>
        ))}
      </ul>
    </div>
  );
}
