export const sendMessage = async (message: string) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // checking the response in the console
    console.log("OpenAI Response:", data);

    // ensure OpenAI response contains a valid choice
    if (data.choices && data.choices.length > 0) {
      const botResponse = data.choices[0]; // inspect bot response

      // access the text or content field from the first choice object
      const text =
        botResponse.message?.content || botResponse.text || "No response";
      return text.trim();
    } else {
      return "I'm not sure about that. Can you try rephrasing?";
    }
  } catch (err) {
    console.error("Error communicating with OpenAI:", err);
    return "Sorry, I couldn't generate an answer.";
  }
};
