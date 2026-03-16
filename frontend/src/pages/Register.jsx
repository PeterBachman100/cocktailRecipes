import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    
    const [error, setError] = useState('');
    const [valErrors, setValErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (formData.username.length < 3) errors.username = "Username must be at least 3 characters.";
        if (formData.password.length < 6) errors.password = "Password must be at least 6 characters.";
        if (formData.password !== formData.confirmPassword) errors.confirm = "Passwords do not match.";
        
        setValErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return; 

        setIsLoading(true);
        try {
            await register(formData.username, formData.password);
            navigate('/recipes');
        } catch (err) {
            setError(err); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Auth_root">
            <form onSubmit={handleSubmit} className="Auth_form">
                <h2 className='Auth_title'>Create Account</h2>

                {/* Global Server Error Message */}
                {error && <div className="Auth_error">{error}</div>}

                <div className="Auth_row">
                    <div className='Auth_field'>
                        <label className='Auth_label'>Username</label>
                        <input 
                            type="text" 
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className={`Auth_input ${valErrors.username ? 'Auth_errorInput' : ''}`}
                        />
                    </div>
                    {valErrors.username && <span className="Auth_errorMessage">{valErrors.username}</span>}
                </div>

                <div className="Auth_row">
                    <div className='Auth_field'>
                        <label className='Auth_label'>Password</label>
                        <input 
                            type="text" 
                            placeholder="Password"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className={`Auth_input ${valErrors.password ? 'Auth_errorInput' : ''}`}
                        />
                    </div>
                    {valErrors.password && <span className="Auth_errorMessage">{valErrors.password}</span>}
                </div>

                <div className="Auth_row">
                    <div className='Auth_field'>
                        <label className='Auth_label'>Confirm Password</label>
                        <input 
                            type="text" 
                            placeholder="Confirm Password"
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className={`Auth_input ${valErrors.confirm ? 'Auth_errorInput' : ''}`}
                        />
                    </div>
                    {valErrors.confirm && <span className="Auth_errorMessage">{valErrors.confirm}</span>}
                </div>

                <button type="submit" disabled={isLoading} className='Auth_button'>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>

                <p className='Auth_tip'>Already have an account? <Link className='Link' to="/login">Log In</Link></p>
            </form>
        </div>
    );
};

export default Register;