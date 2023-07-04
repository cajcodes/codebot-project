const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatContainer = document.getElementById('chat-container');
const switchEngineBtnGpt35 = document.getElementById('engine-gpt-3.5');
const switchEngineBtnGpt4 = document.getElementById('engine-gpt-4');
const switchEngineBtnPalm = document.getElementById('engine-palm');

// Initialize the Markdown converter with custom rendering for links
const converter = new showdown.Converter({
  extensions: [
    function() {
      return [
        {
          type: 'lang',
          regex: /\[([^\]]+)\]\(([^)]+)\)/g,
          replace: '<button class="dynamic-button" data-href="$2">$1</button>'
        }
      ];
    }
  ]
});

let convHist = [
  {
    role: "system",
    content: "You're the cheeky AI Helpdesk on Christopher's chatbot demo website, webchats.ai. You are tasked with showing off how awesome chatbots are. Prefer markdown format for explanations. Make short, concise responses, and ask users if they want additional information. If asked, you can provide users with links to other chatbot demos on the website, such as the widget chatbot [here](https://cajcodes.com/bot.html), and the standalone chatbot [here](https://cajcodes.com/webchats.html)."
  },
];

let currentEngine = "gpt-4";

function switchEngine(engine) {
  currentEngine = engine;
  
  // Remove 'active' class from all buttons
  switchEngineBtnGpt35.classList.remove('active');
  switchEngineBtnGpt4.classList.remove('active');
  switchEngineBtnPalm.classList.remove('active');

  // Add 'active' class to the clicked button
  if (engine === 'gpt-3.5') {
    switchEngineBtnGpt35.classList.add('active');
  } else if (engine === 'gpt-4') {
    switchEngineBtnGpt4.classList.add('active');
  } else if (engine === 'palm') {
    switchEngineBtnPalm.classList.add('active');
  }
}

switchEngineBtnGpt35.addEventListener('click', () => switchEngine('gpt-3.5'));
switchEngineBtnGpt4.addEventListener('click', () => switchEngine('gpt-4'));
switchEngineBtnPalm.addEventListener('click', () => switchEngine('palm'));

// Initialize first button as 'active'
switchEngine(currentEngine);

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
      messageElement.append(pre, copyBtn);
    } else {
      const p = document.createElement('p');
      p.innerHTML = converter.makeHtml(part);
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
  } else if(e.target.classList.contains('hyperlink-button')) {
    window.open(e.target.dataset.href, '_blank');
  }
    // handle clicks on dynamic buttons
    if(e.target.classList.contains('dynamic-button')) {
      const url = e.target.dataset.href;
      window.open(url, '_blank');
    }
});

function getFetchUrl() {
  if (currentEngine === "gpt-4") {
    return 'https://us-central1-codebot-project.cloudfunctions.net/chatBotGpt4';
  } else if (currentEngine === "gpt-3.5") {
    return 'https://us-central1-codebot-project.cloudfunctions.net/chatBotGpt35Turbo';
  } else if (currentEngine === "palm") {
    // Add the URL for your PaLM engine
    return 'https://us-central1-codebot-project.cloudfunctions.net/chatBotGpt35TurboLarge';
  }
}

messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value;
  messageInput.value = '';
  // Add this line to blur the input field and close the keyboard
  messageInput.blur();

  appendMessage(message, 'You', 'user');

  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Bot is thinking...';
  chatContainer.append(loadingMessage);

  // Scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const requestBody = JSON.stringify({ messages: convHist });

    const response = await fetch(getFetchUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const responseData = await response.json();

    // Handle response from GPT engines
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
