const getOpenAIResponse = async (message) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "OpenAI API request failed");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting OpenAI response:", error.message);
    throw error;
  }
};

export default getOpenAIResponse;