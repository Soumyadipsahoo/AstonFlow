export default async function handler(req, res) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === 'astonflow123') {
      return res.status(200).send(challenge);
    }
    return res.status(200).send('Webhook Active!');
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (body.object === 'instagram') {
      for (const entry of body.entry) {
        const messaging = entry.messaging || [];
        for (const event of messaging) {
          if (event.message && !event.message.is_echo) {
            const senderId = event.sender.id;
            const text = event.message.text || "";
            await sendReply(senderId, text);
          }
        }
      }
    }
    return res.status(200).send('EVENT_RECEIVED');
  }
  return res.status(200).send('Webhook Running!');
}

async function sendReply(userId, message) {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const INSTAGRAM_ID = process.env.INSTAGRAM_ID;
  let reply = "Shukriya! 😊";
  const msg = message.toLowerCase();
  if (msg.includes("price")) reply = "Basic ₹499/month! 🎯";
  if (msg.includes("hello") || msg.includes("hi")) reply = "Namaste! 🙏";
  if (msg.includes("help")) reply = "Zaroor help karunga! 😊";

  await fetch(
    `https://graph.facebook.com/v18.0/${INSTAGRAM_ID}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: userId },
        message: { text: reply },
        access_token: ACCESS_TOKEN
      })
    }
  );
}
