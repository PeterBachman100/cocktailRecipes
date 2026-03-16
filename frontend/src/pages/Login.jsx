import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="Auth_root">
      <form className="Auth_form" onSubmit={handleSubmit}>
        <h2 className="Auth_title">Login</h2>
        {error && <p className="Auth_error">{error}</p>}
        
        <div className="Auth_field">
          <label>Username</label>
          <input 
            type="text" 
            required 
            onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
          />
        </div>

        <div className="Auth_field">
          <label>Password</label>
          <input 
            type="text" 
            required 
            onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
          />
        </div>

        <button type="submit" className="Auth_button">Login</button>

        <div>
          <p>Don't have an account? <Link className='Link' to={'/register'} >Register here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;