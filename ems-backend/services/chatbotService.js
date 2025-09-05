// services/chatbotService.js
// This file is a placeholder for a service that would interact with a real LLM API,
// such as Google's Gemini API.

/**
 * Sends a user's message to an LLM and returns the AI's response.
 * @param {string} userMessage - The user's question or statement.
 * @returns {Promise<string>} A promise that resolves with the chatbot's response.
 */
exports.getResponseFromLLM = async (userMessage) => {
  try {
    // This is where you would make a real API call to an LLM.
    // The Gemini API can be called with a fetch request.
    const prompt = `You are a helpful HR chatbot for an Employee Management System. Provide concise answers to questions about HR policies, leave, and general company information.
    
    User: ${userMessage}
    
    Response:`;

    // For now, we will return a simple mock response.
    console.log(`Sending prompt to mock LLM: "${userMessage}"`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const mockResponses = [
      "I am an HR chatbot here to help with your questions.",
      "Please refer to the company's official policy document for more details.",
      "That is a good question! I will look into it for you.",
      "I can help with common questions about leave, payroll, and tasks."
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return randomResponse;

  } catch (err) {
    console.error('Error calling LLM service:', err.message);
    return 'I am sorry, I am unable to process your request at this time.';
  }
};
