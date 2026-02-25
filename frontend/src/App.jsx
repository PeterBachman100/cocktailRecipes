import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login'; 
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecipeEditor from './pages/RecipeEditor'; 
import Navbar from './components/Navbar';
import './app.css';

const EmptyState = ({message}) => (
  <div>{message}</div>
);

function App() {
  return (
    <Router>
      <div className='App_wrapper'>
        <Navbar />
        <main className='App_content'>
          <Routes>

            <Route path="/" element={<RecipeBrowser />}>
              <Route index element={<EmptyState />} />
              <Route path="recipe/:id" element={<RecipeDetails />} />
              <Route element={<ProtectedRoute adminOnly={true} />}>
                  <Route path="new" element={<RecipeEditor key='new' />} />
                  <Route path="recipe/:id/edit" element={<RecipeEditor isEdit={true} key={window.location.pathname} />} />
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/my-recipes" element={<RecipeBrowser isPersonal={true} />}>
                <Route index element={<EmptyState message="You haven't saved any recipes yet!" />} />
                <Route path=":id" element={<RecipeDetails />} />
                <Route path=":id/edit" element={<RecipeEditor isEdit={true} />} />
              </Route>
            </Route>

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;