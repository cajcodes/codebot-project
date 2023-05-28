document.getElementById('message-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const messageInput = document.getElementById('message-input');
  const chatContainer = document.getElementById('chat-container');

  const message = messageInput.value;
  messageInput.value = '';

  chatContainer.innerHTML += `<p>You: ${message}</p>`;
  chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom

  // Display loading text
  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Bot is thinking...';
  chatContainer.append(loadingMessage);

  try {
    const response = await fetch('https://us-central1-codebot-project.cloudfunctions.net/chatBot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You help users code."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    chatContainer.innerHTML += `<p>Bot: ${responseData.message}</p>`;
  } catch (e) {
    chatContainer.innerHTML += `<p>Bot: Sorry, I couldn't process that request. Please try again.</p>`;
    console.error('There was an error:', e);
  } finally {
    // Remove loading text in all circumstances
    if (loadingMessage.parentNode) {
      loadingMessage.parentNode.removeChild(loadingMessage);
    }
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
  }
});
