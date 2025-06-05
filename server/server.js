const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'secretkey';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/facebook_clone';
if (process.env.SKIP_DB_CONNECT !== '1') {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    res.json({ id: user._id, username: user.username });
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  res.json({ token });
});

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const data = jwt.verify(token.split(' ')[1], JWT_SECRET);
    req.userId = data.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/posts', authMiddleware, async (req, res) => {
  const post = await Post.create({ author: req.userId, content: req.body.content });
  res.json(post);
});

app.get('/api/posts', authMiddleware, async (req, res) => {
  const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
  res.json(posts);
});

if (require.main === module) {
  app.listen(5000, () => console.log('Server started on port 5000'));
}

module.exports = { app, User, Post };
