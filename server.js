const express = require('express');
const bodyParser = require('body-parser');
const Pushy = require('pushy');

const app = express();
app.use(bodyParser.json());

// ⚠️ Замените на ваш Secret API Key из pushy.me
const pushyAPI = new Pushy(process.env.f068b73fda6a7b7bcf9fe5b95dbabc510b0989243cd06cdcc6650fb171642424);

// POST /send
app.post('/send', async (req, res) => {
    const { to, title, message } = req.body;

    if (!to || !title || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await pushyAPI.sendPushNotification({ title, message }, to, {
            notification: {
                badge: 1,
                sound: 'ping.aiff',
                body: message,
                title: title,
            },
        });
        res.json({ success: true });
    } catch (err) {
        console.error('Pushy error:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Pushy server running on port ${PORT}`);
});
