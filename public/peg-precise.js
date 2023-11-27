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

let currentPersonality = 'sarcastic';
const personalityParameters = {
  coaching: {
    temperature: 0.50,
    frequency_penalty: 0.30,
    top_p: 0.90,
    presence_penalty: 0.20
  },
  creative: {
    temperature: 1.00,
    frequency_penalty: 0.10,
    top_p: 0.70,
    presence_penalty: 0.10
  },
  sarcastic: {
    temperature: 0.80,
    frequency_penalty: 0.10,
    top_p: 0.90,
    presence_penalty: 0.10
  },
  truthful: {
    temperature: 0.50,
    frequency_penalty: 0.10,
    top_p: 0.90,
    presence_penalty: 0.20
  },
  witty: {
    temperature: 0.70,
    frequency_penalty: 0.10,
    top_p: 0.90,
    presence_penalty: 0.10
  },
  formal: {
    temperature: 0.60, 
    frequency_penalty: 0.10, 
    top_p: 0.90, 
    presence_penalty: 0.20
  },
  friendly: {
    temperature: 0.80, 
    frequency_penalty: 0.10, 
    top_p: 0.90, 
    presence_penalty: 0.10
  }
};

let convHist = [
    {
      role: "system",
      content: `name: Pegbot\n` +
               `description: >\n` +
               `  You are the AI chatbot demo on phonoscopefiber.com. You're currently using the ${currentPersonality} personality. Your primary objective is to demonstrate cutting-edge technology as part of Phonoscope Fiber's educational outreach. Your role is to assist users by providing responses based on your current personality setting. Showcase the capabilities and nuances of the ${currentPersonality} personality to the user. Your responses should be in markdown format for clarity, concise, and tailored to user needs. Engage users by asking if they need additional information, and always ask clarifying questions to refine your understanding of their queries. An essential part of your functionality is to autonomously generate a step-back question to gather contextual information before addressing the specific user query. Following this, use chain-of-thought reasoning to integrate the background information and provide a step-by-step answer to the specific question.\n` +
               `inputs:\n` +
               `  - name: specific_question\n` +
               `    description: The specific user query to be answered.\n` +
               `processing_steps:\n` +
               `  - name: GenerateStepBackQuestion\n` +
               `    description: >\n` +
               `      Automatically generate a step-back question that is broader and contextually related to the specific question. This question aims to gather relevant background information.\n` +
               `    action: Use the model's understanding of the specific question to formulate a relevant step-back question.\n` +
               `  - name: RetrieveBackgroundInformation\n` +
               `    description: >\n` +
               `      Ask the model the generated step-back question to retrieve pertinent background information.\n` +
               `    action: Ask the LLM the step-back question and record the answer.\n` +
               `  - name: IntegrateInformation\n` +
               `    description: >\n` +
               `      Integrate the information obtained from the step-back answer into the reasoning process for the specific question.\n` +
               `    action: Use chain-of-thought reasoning to break down the specific question, incorporating the background information.\n` +
               `  - name: FormulateResponse\n` +
               `    description: >\n` +
               `      Formulate a comprehensive and step-by-step response to the specific question, using insights from both the step-back prompting and the chain-of-thought process.\n` +
               `    action: Combine the insights from the previous steps to generate a final answer.\n` +
               `outputs:\n` +
               `  - name: final_answer\n` +
               `    description: The step-by-step answer to the specific question, informed by the autonomously generated background information and reasoning process.`
    },
  ];
  
  let currentEngine = "palm";  

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

function switchPersonality(personality) {
  currentPersonality = personality;
  document.getElementById('personality-button').textContent = personality.charAt(0).toUpperCase() + personality.slice(1);
  convHist[0].content = `You are the AI assistant of cajcodes.com chatbot demo. You're currently using the ${currentPersonality} personality. Your role is to assist users, providing responses based on your current personality setting. Showcase the capabilities and nuances of the ${currentPersonality} personality to the user. Remember to prefer markdown format for explanations, make short, concise responses, ask users if they want additional information, and always ask clarifying questions and make suggestions that will improve the quality of your responses.`;
}

switchEngineBtnGpt35.addEventListener('click', () => switchEngine('gpt-3.5'));
switchEngineBtnGpt4.addEventListener('click', () => switchEngine('gpt-4'));
switchEngineBtnPalm.addEventListener('click', () => switchEngine('palm'));

// Initialize first button as 'active'
switchEngine(currentEngine);

document.querySelectorAll('#personality-dropdown a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    switchPersonality(e.target.dataset.personality);
  });
});

function appendMessage(content, sender, role, isCode = false, isImageUrl = false) {
    convHist.push({ role: role, content: content });
  
    const messageElement = document.createElement('div');
  
    if (isImageUrl) {
      const img = document.createElement('img');
      img.src = content;
      img.alt = "Generated image";
      img.style.maxWidth = "100%";
      messageElement.append(img);
    } else {
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
    }
  
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
    return 'https://us-central1-codebot-project.cloudfunctions.net/chatBotGpt4Large';
  }
}

function isImageGenerationRequest(message) {
  return message.startsWith('Imagine');
}

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const message = messageInput.value;
    messageInput.value = '';
    messageInput.blur();
  
    appendMessage(message, 'You', 'user');
  
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Bot is thinking...';
    chatContainer.append(loadingMessage);
  
    chatContainer.scrollTop = chatContainer.scrollHeight;
  
    try {
      if (isImageGenerationRequest(message)) {
        const requestBody = JSON.stringify({
          prompt: message.replace('Imagine', '').trim(),
          size: "1024x1024"
        });
  
        const response = await fetch('https://us-central1-codebot-project.cloudfunctions.net/generateImageDallE3', {
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
  
        appendMessage(responseData.url, 'Bot', 'assistant', false, true);
      } else {
        const requestBody = JSON.stringify({
          messages: convHist,
          parameters: personalityParameters[currentPersonality]
        });
  
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
  
        appendMessage(responseData.message, 'Bot', 'assistant');
      }
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
  