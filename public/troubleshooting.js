document.addEventListener("DOMContentLoaded", function () {
    const chatbotForm = document.getElementById("chatbot-form");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatContainer = document.getElementById("chatbot-container");  // Updated from "chat-container"
  
    let conversationHistory = [
      {
        role: "system",
        content: "You're the courteous Phonoscope Fiber AI Helpdesk on the website support page, dedicated to providing prompt and polite 24/7 technical support and troubleshooting services for Phonoscope Fiber's business and residential customers. Links to setup instructions, troubleshooting guides, and speed test are below the chat. Keep all answers concise. For queries that you are unable to assist with, kindly suggest that customers click on the red chat icon at the bottom right of the screen to chat with a member of our support team 24/7. For phone or email, icons are at the top of the chat window. To check availability or sign up for service, kindly suggest clicking the red magnifying glass icon above the chat. When providing troubleshooting steps or detailed explanations, use Markdown formatting for clearer communication. Provide troubleshooting steps one at a time and ask the user to confirm they are ready before providing the next step. In the event of a reported outage, ask the user if they wish to troubleshoot. If not, direct them to use the 'Report Outage' button below."
      }
    ];
  
    // Display greeting message
    addMessageToContainer("assistant", "Welcome to Phonoscope Fiber! I'm your AI assistant, here to assist with troubleshooting and answering your questions. What can I help you with today?", chatbotMessages);
  
    async function sendMessageToAssistant(userMessage) {
      conversationHistory.push({ role: "user", content: userMessage });
      // Typing indicator
      const typingIndicator = document.createElement("div");
      typingIndicator.id = "ti";
      typingIndicator.classList.add("typing-indicator");
      const typingText = document.createElement("span");
      typingText.textContent = "I'm typing";
      typingIndicator.appendChild(typingText);
  
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        typingIndicator.appendChild(dot);
      }
  
      chatContainer.appendChild(typingIndicator);
      typingIndicator.style.display = "inline-flex"; // set the display property to make the indicator visible
  
      try {
        const response = await axios.post(
          "https://us-central1-codebot-project.cloudfunctions.net/chatBotGpt4",
          { messages: conversationHistory }
        );
  
        chatContainer.removeChild(typingIndicator);  // Updated from "chatbotMessages"
  
        conversationHistory.push({ role: "assistant", content: response.data.message });
  
        return response.data.message;
      } catch (error) {
        console.error("Error while sending message to assistant:", error);
        chatContainer.removeChild(typingIndicator);  // Updated from "chatbotMessages"
        return "Error: Unable to process your request.";
      }
    }
  
    function addMessageToContainer(role, message, container) {
      const converter = new showdown.Converter();
      const htmlContent = converter.makeHtml(message);
  
      const messageElement = document.createElement("div");
  
      if (role === "user") {
        messageElement.classList.add("user-message");
        messageElement.setAttribute('style', 'color: white;');
      } else if (role === "assistant") {
        messageElement.classList.add("assistant-message");
        messageElement.setAttribute('style', 'color: black;');
      }
  
      messageElement.innerHTML = htmlContent;
      container.appendChild(messageElement);
  
      // Scroll the chat to the bottom
      container.scrollTop = container.scrollHeight;
    }
  
    chatbotForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const userMessage = chatbotInput.value.trim();
      if (userMessage === "") return;
  
      addMessageToContainer("user", userMessage, chatbotMessages);
  
      chatbotInput.value = "";
      
      // Hide the dropdowns after the user sends a message
      document.getElementById("dropdowns-container").style.display = "none";
  
      try {
        const assistantResponse = await sendMessageToAssistant(userMessage);
        addMessageToContainer("assistant", assistantResponse, chatbotMessages);
      } catch (error) {
        console.error("Error in sendMessageToAssistant:", error);
        addMessageToContainer("assistant", "Error: Unable to process your request.", chatbotMessages);
      }
    });
  });
  