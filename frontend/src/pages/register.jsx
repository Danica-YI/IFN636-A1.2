import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../service/api';

const FormContent = ({ formData, handleChange, handleSubmit, error, success }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
                <p style={{ margin: 0, fontSize: '16px' }}>
                    Welcome to <span style={{ color: '#ECBC76', fontWeight: 'bold' }}>WIMS</span>
                </p>
                <h1 style={{ margin: '5px 0', fontSize: '32px', fontWeight: 'bold' }}>Sign up</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>Have an Account?</p>
                <Link to="/login" style={{ color: '#ECBC76', fontWeight: 'bold', textDecoration: 'none' }}>Sign in</Link>
            </div>
        </div>

        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
        {success && <p style={{ color: 'green', fontSize: '14px', marginBottom: '16px' }}>{success}</p>}

        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#333', display: 'block',textAlign: 'left' }}>
                    Enter your email address
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                        display: 'block', width: '100%', padding: '14px',
                        marginTop: '8px', border: '1.5px solid #ECBC76',
                        borderRadius: '8px', fontSize: '14px',
                        boxSizing: 'border-box', outline: 'none',
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                    <label style={{ fontSize: '14px', color: '#333', display: 'block',textAlign: 'left' }}>User name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="User name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                            display: 'block', width: '100%', padding: '14px',
                            marginTop: '8px', border: '1.5px solid #ddd',
                            borderRadius: '8px', fontSize: '14px',
                            boxSizing: 'border-box', outline: 'none',
                        }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '14px', color: '#333', display: 'block',textAlign: 'left' }}>Contact Number</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Contact Number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                            display: 'block', width: '100%', padding: '14px',
                            marginTop: '8px', border: '1.5px solid #ddd',
                            borderRadius: '8px', fontSize: '14px',
                            boxSizing: 'border-box', outline: 'none',
                        }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#333', display: 'block',textAlign: 'left' }}>Enter your Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{
                        display: 'block', width: '100%', padding: '14px',
                        marginTop: '8px', border: '1.5px solid #ddd',
                        borderRadius: '8px', fontSize: '14px',
                        boxSizing: 'border-box', outline: 'none',
                    }}
                />
            </div>

            <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '14px', color: '#333', display: 'block',textAlign: 'left' }}>Confirm your Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Your Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{
                        display: 'block', width: '100%', padding: '14px',
                        marginTop: '8px', border: '1.5px solid #ddd',
                        borderRadius: '8px', fontSize: '14px',
                        boxSizing: 'border-box', outline: 'none',
                    }}
                />
            </div>

            <button type="submit" style={{
                width: '100%', padding: '16px',
                backgroundColor: '#ECBC76', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            }}>
                Sign up
            </button>
        </form>
    </div>
);

function Register() {
    const [formData, setFormData] = useState({
        email: '', name: '', phone: '', password: '', confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       
        // validate password correction
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
            });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        error={error}
                        success={success}
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
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    error={error}
                    success={success}
                />
            </div>
        </div>
    );
}

export default Register;