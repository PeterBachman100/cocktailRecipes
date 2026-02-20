import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeBrowser from './pages/RecipeBrowser';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login'; 
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecipeEditor from './pages/RecipeEditor'; 
import Navbar from './components/Navbar';
import './app.css';

const EmptyState = () => (
  <div></div>
);

function App() {
  return (
    <Router>
      <div className='App_wrapper'>
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


          </Routes>
        </main>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;