import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetails from './pages/RecipeDetails';

const EmptyState = () => (
  <div className="empty-msg">Select a drink to see the recipe</div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeBrowser />}>
          <Route index element={<EmptyState />} />
          <Route path="recipe/:id" element={<RecipeDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;