const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatContainer = document.getElementById('chat-container');

// Maintain a conversation history array
let convHist = [
  {
    role: "system",
    content: "You help users code."
  }
];

function appendMessage(content, sender, role, isCode = false) {
  // Add the new message to the conversation history
  convHist.push({ role: role, content: content });

  const messageElement = document.createElement('div');

  const parts = content.split('```');
  parts.forEach((part, index) => {
    const isCodePart = index % 2 !== 0;

    if (isCodePart) {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.id = `code-${Date.now()}`;
      code.textContent = part;

      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy code';
      copyBtn.classList.add('copy-button');
      copyBtn.dataset.codeId = code.id;

      pre.append(code);
      messageElement.append(`${sender} (code):\n`, pre, copyBtn);
    } else {
      const p = document.createElement('p');
      p.textContent = `${sender}: ${part}`;
      messageElement.append(p);
    }
  });

  messageElement.classList.add(sender.toLowerCase());
  chatContainer.append(messageElement);
}

chatContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains('copy-button')) {
    const codeId = e.target.dataset.codeId;
    const codeSnippet = document.getElementById(codeId);

    const range = document.createRange();
    range.selectNode(codeSnippet);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    e.target.textContent = 'Copied!';
    setTimeout(() => e.target.textContent = 'Copy code', 2000);
  }
});

messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value;
  messageInput.value = '';

  appendMessage(message, 'You', 'user');

  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Bot is thinking...';
  chatContainer.append(loadingMessage);

  try {
    const response = await fetch('https://us-central1-codebot-project.cloudfunctions.net/chatBot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: convHist }) // Send the conversation history instead
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    appendMessage(responseData.message, 'Bot', 'assistant');
  } catch (e) {
    appendMessage("Sorry, I couldn't process that request. Please try again.", 'Bot', 'assistant');
    console.error('There was an error:', e);
  } finally {
    if (loadingMessage.parentNode) {
      loadingMessage.parentNode.removeChild(loadingMessage);
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});
