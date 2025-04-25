// app.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const mongoose = require ("mongoose");
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

const app = express();
const JWT_SECRET = "mySecretKey123";    
let mongo_url = process.env.ATLAS_DBURL || 'mongodb://127.0.0.1:27017/usertest';

app.use(cors());
app.use(express.json());

//Database
main().then(() => console.log("Database is Connected")).catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongo_url);
}

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);


//Socket
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle visitor sending a message
  socket.on('visitor_message', ({ id, message }) => {
    console.log(`Visitor ${id} sent: ${message}`);

    // Ensure visitor joins their own room
    socket.join(id);

    // Send this message to all dashboard agents
    io.emit('visitor_message', {
      id,
      message,
      name: 'Visitor',
    });

    // Also emit to the specific room for any agent who joined this visitor
    io.to(id).emit(`chat:${id}`, {
      message,
      from: 'visitor', // ✅ This line is crucial!
    });

  });

  // Handle agent joining a visitor's room
  socket.on('join_room', (roomId) => {
    console.log(`Agent ${socket.id} joined room: ${roomId}`);
    socket.join(roomId);
  });

  // Handle agent sending a message
  socket.on('agent_message', ({ to, message }) => {
    console.log(`Agent sent to ${to}: ${message}`);

    // Emit message to the specific visitor
    io.to(to).emit(`chat:${to}`, {
      message,
      from: 'agent',
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // ✅ Generate JWT
    // const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1d' });
    const token = jwt.sign({ id: newUser._id, name: newUser.name }, JWT_SECRET, { expiresIn: '1d' });


    // ✅ Return token + user info
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signin Route with JWT
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Route Example
app.get('/api/dashboard', authenticateToken, (req, res) => {
  const userName = req.user?.name || 'User'; 
  res.status(200).json({ message: `Welcome back, ${userName}!` });
});


// JWT Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}


server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});