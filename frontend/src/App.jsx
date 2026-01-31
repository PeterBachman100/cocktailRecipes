import { useEffect, useState } from 'react';
import api from './api/axios';
import RecipeCard from './components/recipeCard';

function App() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem', backgroundColor: '#f7f4f4ff', minHeight: '100vh'}}>
      <RecipeCard recipeId={'69754c5d7213e6504a66750a'} />
      <RecipeCard recipeId={'697400619788896e26d82cba'} />
      <RecipeCard recipeId={'69754ba17213e6504a667501'} />
      <RecipeCard recipeId={'69754aa87213e6504a6674f1'} />
    </div>
  );
}

export default App;