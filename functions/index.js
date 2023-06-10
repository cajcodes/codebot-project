const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors');
const { google } = require('google-auth-library');

const whitelist = ['https://www.cajcodes.com', 'https://cajcodes.com', 'https://codebot-project.web.app', 'http://localhost:3000', 'http://localhost:5000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const corsMiddleware = cors(corsOptions);

exports.chatBotGpt4 = functions.https.onRequest(async (req, res) => {
  corsMiddleware(req, res, async () => {
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
      res.json({ message: chatResponse });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    }
  });
});

exports.chatBotGpt35Turbo = functions.https.onRequest(async (req, res) => {
  corsMiddleware(req, res, async () => {
    const { messages } = req.body;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${functions.config().openai.key}`
        }
      });

      const chatResponse = response.data.choices[0].message.content.trim();
      res.json({ message: chatResponse });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    }
  });
});

exports.chatBotGooglePaLM2 = functions.https.onRequest(async (req, res) => {
  corsMiddleware(req, res, async () => {
    const { instances, parameters } = req.body;

    try {
      const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
      const PROJECT_ID = "codebot-project";
      const MODEL_ID = "chat-bison@001";

      // Use google-auth-library to generate the access token
      const client = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });
      const accessToken = await client.getAccessToken();

      const response = await axios.post(`https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:predict`, {
        instances,
        parameters
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Extract relevant information from the response
      const messages = response.data.messages;
      const chatResponse = messages.map(message => ({
        author: message.author === '0' ? 'user' : 'chatbot',
        content: message.content,
      }));

      res.json(chatResponse); // send the chatResponse directly

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while processing your request' });
    }
  });
});
