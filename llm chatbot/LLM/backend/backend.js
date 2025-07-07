const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 4000;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, model, apiKey } = req.body;

    // Input validation
    if (!message || !model || !apiKey) {
      return res.status(400).json({
        error: 'Message, model, and API key are required.'
      });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:4000',
        'X-Title': 'LLM_ChatBot'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch response from the model.';
      const errorData = await response.json().catch(() => null);
      if (errorData && errorData.error && errorData.error.message) {
        errorMessage = errorData.error.message;
      } else if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your OpenRouter API key.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      }
      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({
        error: 'Invalid response from AI model.'
      });
    }

    return res.status(200).json({
      message: data.choices[0].message.content,
      model: data.model || model,
      timestamp: new Date().toISOString() 
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'An error occurred while processing your request.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
