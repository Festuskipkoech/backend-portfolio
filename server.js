// server.js - A simple Node.js server to handle contact form submissions

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: function(origin, callback) {
      const allowedOrigins = [
        'https://portfolio-rho-gilt-29.vercel.app',
        'https://portfolio-rho-gilt-29.vercel.app/',
        'http://localhost:5173/'
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

// Create a transporter using nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS  // Your email password or app password
  }
});

// Endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message' });
  }

  try {
    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'koechfestus003@gmail.com',
        subject: `[IMPORTANT] Portfolio Contact: ${name}`,
        headers: {
          'Importance': 'high',
          'Priority': 'urgent'
        },
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Respond to client
    res.status(200).json({ success: true, message: 'Your message has been sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Contact form server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});