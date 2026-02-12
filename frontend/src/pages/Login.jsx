import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials.username, credentials.password);
      navigate('/'); // Redirect home on success
    } catch (err) {
      setError(err || 'Invalid login attempt');
    }
  };

  return (
    <div className="Login_root">
      <form className="Login_form" onSubmit={handleSubmit}>
        <h2 className="Login_title">Admin Login</h2>
        {error && <p className="Login_error">{error}</p>}
        
        <div className="Login_field">
          <label>Username</label>
          <input 
            type="text" 
            required 
            onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
          />
        </div>

        <div className="Login_field">
          <label>Password</label>
          <input 
            type="password" 
            required 
            onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
          />
        </div>

        <button type="submit" className="Login_button">Enter Library</button>
      </form>
    </div>
  );
};

export default Login;