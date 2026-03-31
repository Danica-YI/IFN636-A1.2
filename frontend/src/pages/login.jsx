import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../service/api';

const FormContent = ({ email, setEmail, password, setPassword, error, handleSubmit }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
                <p style={{ margin: 0, fontSize: '16px' }}>
                    Welcome to <span style={{ color: '#ECBC76', fontWeight: 'bold' }}>WIMS</span>
                </p>
                <h1 style={{ margin: '5px 0', fontSize: '32px', fontWeight: 'bold' }}>Sign in</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>No Account?</p>
                <Link to="/register" style={{ color: '#ECBC76', fontWeight: 'bold', textDecoration: 'none' }}>Sign up</Link>
            </div>
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', color: '#333', display: 'block',textAlign: 'left' }}>
                    Enter your email address
                </label>
                <input
                    type="email"
                    placeholder="email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        display: 'block', width: '100%', padding: '14px',
                        marginTop: '8px', border: '1.5px solid #ECBC76',
                        borderRadius: '8px', fontSize: '14px',
                        boxSizing: 'border-box', outline: 'none',
                    }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '14px', color: '#333', display: 'block',textAlign: 'left' }}>
                    Enter your Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        display: 'block', width: '100%', padding: '14px',
                        marginTop: '8px', border: '1.5px solid #ddd',
                        borderRadius: '8px', fontSize: '14px',
                        boxSizing: 'border-box', outline: 'none',
                    }}
                />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '30px' }}>
                <span style={{ color: '#ECBC76', fontSize: '14px', cursor: 'pointer' }}>Forgot Password</span>
            </div>

            <button type="submit" style={{
                width: '100%', padding: '16px',
                backgroundColor: '#ECBC76', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            }}>
                Sign in
            </button>
        </form>
    </div>
);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    // mobile
    if (isMobile) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#ECBC76',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    padding: '40px 30px',
                    width: '100%',
                    maxWidth: '400px',
                }}>
                    <FormContent
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        error={error}
                        handleSubmit={handleSubmit}
                    />
                </div>
            </div>
        );
    }

    // web
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '60px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
                <FormContent
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    error={error}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}

export default Login;