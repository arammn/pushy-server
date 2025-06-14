const express = require('express');
const bodyParser = require('body-parser');
const Pushy = require('pushy');

const app = express();
app.use(bodyParser.json());

// 🔒 Используйте свой Secret API Key из dashboard
const pushyAPI = new Pushy(process.env.PUSHY_API_KEY);

app.post('/send', async (req, res) => {
  const { to, title, message } = req.body;
  if (!to || !title || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await pushyAPI.sendPushNotification(
      { title, message },
      [to],
      {
        notification: {
          badge: 1,
          sound: 'ping.aiff',
          title,
          body: message,
        },
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Pushy error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
