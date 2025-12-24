import { useState } from "react";

const API_KEY = "4215e2d1e09c497f90aae48d0ccfb84f";

function App() {
  const [ingredient, setIngredient] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    if (!ingredient.trim()) return;

    try {
      setLoading(true);
      setError("");

      const encodedIngredient = encodeURIComponent(ingredient);

      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodedIngredient}&diet=vegetarian&number=6&addRecipeInformation=true&apiKey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data.results);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setRecipes([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-6">
         Recipe Finder 🌱
      </h1>

      {/* Search */}
      <div className="flex justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter ingredient (e.g. potato)"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
          className="border p-3 rounded w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={fetchRecipes}
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-500"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600">Loading recipes...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-500 font-medium">{error}</p>
      )}

      {/* No Results */}
      {!loading && !error && recipes.length === 0 && ingredient && (
        <p className="text-center text-gray-500">
          No recipes found. Try another ingredient.
        </p>
      )}

      {/* Recipes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="rounded mb-4 w-full h-40 object-cover"
            />

            <h2 className="text-lg font-semibold mb-2">
              {recipe.title}
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              ⏱ Ready in {recipe.readyInMinutes} minutes
            </p>

            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              View Recipe →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
