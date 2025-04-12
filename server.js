// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ WhatsApp API Tool is running.');
});

// Send Message
app.post('/send', async (req, res) => {
  const { to, message } = req.body;
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Send error:', err.response?.data || err.message);
    res.status(400).json({ error: err.response?.data || err.message });
  }
});

// Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook Receiver (POST)
app.post('/webhook', (req, res) => {
  console.log('📩 Incoming message:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
