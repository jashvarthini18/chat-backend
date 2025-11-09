// import jwt from "jsonwebtoken";

// export const getReplySuggestions = async (messages) => {
//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You suggest 3 short smart replies. Return only a JSON array of EXACTLY 3 strings.",
//           },
//           ...messages.map((msg) => ({
//             role: msg.senderId === "system" ? "system" : "user",
//             content: msg.text,
//           })),
//           {
//             role: "user",
//             content:
//               "Generate 3 short reply options. Return ONLY JSON array, no explanation.",
//           },
//         ],
//         temperature: 0.7,
//         max_tokens: 150,
//         response_format: { type: "json_object" },
//       }),
//     });

//     if (!response.ok) return [];

//     const data = await response.json();
//     const content = data.choices[0]?.message?.content;

//     try {
//       const suggestions = JSON.parse(content);
//       return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
//     } catch {
//       return [];
//     }
//   } catch {
//     return [];
//   }
// };


// export const generateToken = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
//     path: "/", 
//     maxAge: 7 * 24 * 60 * 60 * 1000, 
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
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    const suggestions = JSON.parse(content);
    return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
  } catch {
    return [];
  }
};

// ✅ Secure cookie with Render + Vercel
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // ✅ Always true since Render is HTTPS
    sameSite: "none", // ✅ Required for cross-site cookies (Render <-> Vercel)
    path: "/",
    domain: ".onrender.com", // ✅ VERY IMPORTANT for Render cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};