export default async function handler(request, response) {

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = request.body;
    if (!prompt) {
      return response.status(400).json({ error: 'Prompt tidak boleh kosong' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      throw new Error(`Google API Error: ${errorData}`);
    }

    const data = await geminiResponse.json();
    const aiText = data.candidates[0].content.parts[0].text;
    
    return response.status(200).json({ text: aiText });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Gagal berkomunikasi dengan AI' });
  }
}