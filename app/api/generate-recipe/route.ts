import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing in server' }, { status: 500 });
    }

    const { query } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    // Dynamic prompt to handle both country names and recipe/dish names
    const prompt = `Generate a detailed authentic food recipe based on the user's input: "${query || 'a random famous dish'}".
    - If the input is a Country name, generate a popular authentic dish from that country.
    - If the input is a Specific Dish/Food name, generate the authentic recipe for that exact dish.
    
    Return ONLY a valid JSON object matching this structure (no markdown formatting, no text before or after):
    {
      "title": "Recipe Name",
      "country": "Origin Country",
      "prepTime": "20 mins",
      "cookTime": "40 mins",
      "servings": "4",
      "ingredients": ["item 1", "item 2"],
      "instructions": ["step 1", "step 2"],
      "imagePrompt": "A highly descriptive food photography prompt for this dish"
    }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    const recipeData = JSON.parse(cleanedJson);

    const encodedPrompt = encodeURIComponent(`${recipeData.imagePrompt}, professional food photography, 4k`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true`;

    return NextResponse.json({ ...recipeData, imageUrl });
  } catch (error: any) {
    console.error('SERVER ERROR DETAILS:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate recipe' }, { status: 500 });
  }
}