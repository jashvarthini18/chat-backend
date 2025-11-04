// import jwt from "jsonwebtoken";
// import fetch from 'node-fetch';

// export const getReplySuggestions = async (messages) => {
//   try {
//     const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: 'llama-3.3-70b-versatile',
//         messages: [
//           {
//             role: 'system',
//             content: 'You are a helpful assistant that suggests 3 possible short and concise reply options based on the conversation history. Return only a JSON array of exactly 3 strings, no other text or explanation.'
//           },
//           ...messages.map(msg => ({
//             role: msg.senderId === 'system' ? 'system' : 'user',
//             content: msg.text
//           })),
//           {
//             role: 'user',
//             content: 'Generate 3 possible short and concise reply options based on the above conversation. Return only a JSON array of exactly 3 strings, no other text or explanation.'
//           }
//         ],
//         temperature: 0.7,
//         max_tokens: 150,
//         response_format: { type: 'json_object' }
//       })
//     });

//     if (!response.ok) {
//       const error = await response.text();
//       console.error('Groq API error:', error);
//       return [];
//     }

//     const data = await response.json();
//     const content = data.choices[0]?.message?.content;
    
//     try {
//       const suggestions = JSON.parse(content);
//       return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
//     } catch (e) {
//       console.error('Error parsing Groq API response:', e);
//       return [];
//     }
//   } catch (error) {
//     console.error('Error in getReplySuggestions:', error);
//     return [];
//   }
// };

// export const generateToken = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   res.cookie("jwt", token, {
//     maxAge: 7 * 24 * 60 * 60 * 1000, // MS
//     httpOnly: true, // prevent XSS attacks cross-site scripting attacks
//     sameSite: "strict", // CSRF attacks cross-site request forgery attacks
//     secure: process.env.NODE_ENV !== "development",
//   });

//   return token;
// };
import jwt from "jsonwebtoken";

export const getReplySuggestions = async (messages) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You suggest 3 short smart replies. Return only a JSON array of EXACTLY 3 strings.",
          },
          ...messages.map((msg) => ({
            role: msg.senderId === "system" ? "system" : "user",
            content: msg.text,
          })),
          {
            role: "user",
            content:
              "Generate 3 short reply options. Return ONLY JSON array, no explanation.",
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    try {
      const suggestions = JSON.parse(content);
      return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
    } catch {
      return [];
    }
  } catch {
    return [];
  }
};

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // ✅ required on Render
    sameSite: "none", // ✅ cross-domain cookies for Vercel <-> Render
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
