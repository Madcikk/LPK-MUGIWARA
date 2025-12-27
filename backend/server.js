import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import programRoutes from './routes/program.js';
import beritaRoute from './routes/berita.js';
import galeriRoute from './routes/galeri.js';
import kontakRoute from './routes/kontak.js';
import memberRoute from './routes/member.js';
import JepangRoute from './routes/jepang.js';
import paymentRoute from './routes/payment.js';
import usersRoute from './routes/users.js';
// import mentorRoute from './routes/mentor.js';
import mentorRoute from './routes/mentor.js';


// Verify import
console.log('=== Server Startup ===');
console.log('usersRoute imported:', typeof usersRoute);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Debug middleware - log semua request ke /api/users
app.use((req, res, next) => {
  if (req.path.startsWith('/api/users')) {
    console.log(`[DEBUG] Request to: ${req.method} ${req.path}`);
  }
  next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/program', programRoutes);
app.use('/api/berita', beritaRoute);
app.use('/api/galeri', galeriRoute);
app.use('/api/kontak', kontakRoute);
app.use('/api/member', memberRoute);
app.use('/register', memberRoute);

// Users route - HARUS sebelum JepangRoute yang menggunakan /api
// Urutan sangat penting: route spesifik harus didefinisikan sebelum route umum
console.log('=== Registering /api/users route ===');
console.log('usersRoute type:', typeof usersRoute);
console.log('usersRoute:', usersRoute);
if (typeof usersRoute === 'function') {
  app.use('/api/users', usersRoute);
  console.log('✓ /api/users route registered successfully');
} else {
  console.error('✗ ERROR: usersRoute is not a function!', usersRoute);
}

// Test endpoint langsung di server untuk debugging (SEBELUM JepangRoute)
// Endpoint ini harus didefinisikan SEBELUM app.use('/api', JepangRoute)
app.get('/api/users/test-direct', (req, res) => {
  console.log('✓ Direct test endpoint called - route is working!');
  res.json({ 
    message: 'Direct test endpoint is working!', 
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
});

// Midtrans
app.use('/api/payment', paymentRoute);

// Mentor routes
app.use('/api/mentor', mentorRoute);

// JepangRoute harus di akhir setelah semua route spesifik
// Tapi kita perlu memastikan route /api/users sudah terdaftar sebelum ini
console.log('Registering JepangRoute at /api (should be last)');
app.use('/api', JepangRoute);

const PORT = process.env.PORT || 5000;
console.log('Attempting to start server on port:', PORT);
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log('✅ Server successfully started and listening on http://127.0.0.1:' + PORT);
  console.log('Routes registered:');
  console.log('  - /api/users (users route)');
  console.log('  - /api/users/test (test endpoint)');
  console.log('  - /api/mentor (mentor routes)');
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
});

server.on('listening', () => {
  console.log('✅ Server is now listening on port', PORT);
});

// Global error handlers to prevent server from crashing
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit the process
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process
});
