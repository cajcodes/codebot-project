This project showcases the power of innovative prompt engineering by providing a suite of Firebase Cloud Functions that offer advanced chatbot and image generation capabilities. By leveraging the latest models from OpenAI, this project demonstrates how thoughtfully crafted prompts can unlock the full potential of large language models, enabling a diverse range of intelligent conversational experiences and creative imagery.
The cloud functions and web applications are designed to be highly customizable and easily integrated into a variety of projects, showcasing the versatility and power of the underlying technology.

# Backend 

## Functions 
[Firebase Functions](/functions/index.html)
    These are the Firebase Cloud Functions that provides a chatbot service and image generation using models from OpenAI. It is designed to be used with the public web applications and includes CORS (Cross-Origin Resource Sharing) middleware to allow requests from specific domains. Provides error handling and response formatting.

# Frontend

## CAJcodes
[CAJcodes Demo](/public/index.html)
    This is a chatbot demo that includes functionality for switching between different personalities and AI models, as well as rendering markdown and handling form submissions.
    The code initializes several variables, including a Markdown converter with a custom rendering for links and code, and an object of personality parameters that map personality names to specific values for temperature, frequency penalty, top p, and presence penalty.
    The conversation history is initialized as an array with one object, which includes a system message that introduces the chatbot and its current personality.

![Screenshot of cajcodes chatbot demo.](/screenshots/cajcodes.png)

## pegbot
[Pegbot](/public/pegbot.html)
    This is an expanded version of the CAJcodes chatbot demo with branding and system role for Phonoscope Fiber. 
    The conversation history is initialized as an array with one object, which includes a system message that introduces the chatbot and its current personality. The system message also includes a detailed description of the chatbot's functionality, including generating a step-back question to gather contextual information, using chain-of-thought reasoning to integrate the background information, and providing a step-by-step answer to the specific question.
    If the message starts with "Imagine", a request is sent to generate an image using the DALL-E 3 model.
    Like the original demo, it includes functionality for switching between personalities, Markdown rendering for links and code - with 'copy code' and direct link buttons.

![Screenshot of pegbot chatbot demo.](/screenshots/pegbot.png) 

## Enigmatic Chatbot
[Enigmatic Bot](/public/enigmatic-bot.html)
    This is a web-based AI chatbot that provides hints and teasers about an upcoming breakthrough in cutting-edge AI integration. The chatbot is designed to be cheeky and enigmatic, providing brief and concise responses that keep the user engaged and curious.
            * The chatbot is triggered by clicking on the droid icon in the bottom right corner of the screen.
            * The chatbot provides hints and teasers about an upcoming AI integration breakthrough.
            * The chatbot responds to user messages that include keywords such as "hint", "clue", "GPT", "OpenAI", "sign up", and various social media and contact-related keywords.
            * The chatbot provides a special response when asked about GPT or OpenAI.
            * The chatbot encourages users to sign up for updates and follow me on social media.
            * The chatbot includes a typing indicator to show when it is processing a user message.

![Screenshot of enigmatic chatbot closed.](/screenshots/droids.png) 

![Screenshot of enigmatic chatbot open.](/screenshots/droids-open.png) 
    
## Troubleshooting Chat
[Troubleshooting Demo](/public/troubleshooting.html)
    This is a chatbot designed to provide technical support and troubleshooting services for Phonoscope Fiber's business and residential customers. The chatbot is designed to be courteous and helpful, providing clear and concise answers to customer queries. The chatbot also provides links to setup instructions, troubleshooting guides, and speed tests.
    The chatbot is built using JavaScript and the Axios library for making HTTP requests. The chatbot uses a conversation history array to keep track of the conversation and uses the showdown library to convert Markdown formatted text into HTML for clearer communication.
    The chatbot is designed to be helpful and efficient, providing quick and concise answers to customer queries. The chatbot is also designed to be polite and courteous, providing a positive customer experience.

![Screenshot of Troubleshooting interface.](/screenshots/troubleshooting.png) 
