const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
//const { google } = require('googleapis'); // Not needed for Microsoft, but for reference
const { ClientCredentials } = require('simple-oauth2');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Configure the transporter for Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'daviddhatch2001@gmail.com',
      pass: 'yzwp jltm efvv hcqu ' // Use the app password you generated
    }
  });

  const mailOptions = {
    from: 'daviddhatch2001@gmail.com',
    to: 'daviddhatch2001@gmail.com',
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// Placeholder for stats route
app.get('/api/stats', (req, res) => {
  res.status(501).send('Not implemented');
});

// Placeholder for admin route
app.get('/admin', (req, res) => {
  res.status(501).send('Not implemented');
});

const client = new ClientCredentials({
  client: {
    id: 'f4d706c8-298a-4087-9ce9-e5d981f12e5d',
    secret: 'Jlq8Q~T2eb6bNBnBhBplaySzUOrunu6lfka4gb-S',
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    tokenPath: '/7c858259-2fd3-4e2a-b34a-72a3ff754a9d/oauth2/v2.0/token',
  },
});

async function getAccessToken() {
  const tokenParams = {
    scope: 'https://graph.microsoft.com/.default',
  };
  const accessToken = await client.getToken(tokenParams);
  return accessToken.token.access_token;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});