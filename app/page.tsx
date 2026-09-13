'use client';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [query, setQuery] = useState(''); // Country or Recipe Name
  const [errorMessage, setErrorMessage] = useState('');

  const generateRecipe = async () => {
    if (!query.trim()) {
      setErrorMessage('Please enter a country or recipe name!');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setRecipe(null);
    
    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      
      if (res.ok && !data.error) {
        setRecipe(data);
      } else {
        setErrorMessage(data.error || 'Failed to fetch recipe.');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage('Network error or server failed to respond.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">🌍 Worldwide AI Recipe Generator</h1>
        
        <div className="flex flex-col sm:flex-row justify-center gap-2 mb-8">
          <input
            type="text"
            placeholder="Enter Country or Dish Name (e.g. Japan, Kottu, Pasta)"
            className="p-3 border border-slate-300 rounded-lg w-full sm:w-80 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={generateRecipe}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50 transition"
          >
            {loading ? 'Cooking up Recipe...' : 'Get Recipe'}
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}

        {recipe && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-left border border-slate-200">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-72 object-cover rounded-lg mb-6 shadow-sm" 
            />
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{recipe.title}</h2>
            <span className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              {recipe.country}
            </span>
            
            <p className="text-slate-500 font-medium mb-6 flex gap-4 border-b pb-4">
              <span>⏱️ Prep: {recipe.prepTime}</span> 
              <span>🔥 Cook: {recipe.cookTime}</span>
              <span>🍽️ Servings: {recipe.servings}</span>
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-3 text-orange-600">Ingredients:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {recipe.ingredients.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-3 text-orange-600">Instructions:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                  {recipe.instructions.map((step: string, i: number) => <li key={i}>{step}</li>)}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}