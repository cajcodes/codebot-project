document.getElementById('message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
  
    const message = messageInput.value;
    messageInput.value = '';
  
    chatContainer.innerHTML += `<p>You: ${message}</p>`;
  
    const response = await fetch(' https://us-central1-codebot-project.cloudfunctions.net/chatBot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });
  
    const responseData = await response.json();
  
    chatContainer.innerHTML += `<p>Bot: ${responseData.message}</p>`;
  });
  