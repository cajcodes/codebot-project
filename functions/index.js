const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.chatBot = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { messages } = req.body;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${functions.config().openai.key}`
        }
      });

      const chatResponse = response.data.choices[0].message.content.trim();
      
      // Add the headers to the response before sending it
      res.set('Access-Control-Allow-Origin', "https://codebot-project.web.app");
      res.set('Access-Control-Allow-Methods', 'GET, POST');

      res.json({ message: chatResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    }
  });
});
