export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { message } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "API Key not found." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a powerful AI assistant. Answer clearly about pH, acids, bases and also any general topic."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ reply: JSON.stringify(data) });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response from AI."
    });

  } catch (error) {
    return res.status(500).json({ reply: "Server error: " + error.message });
  }
}
