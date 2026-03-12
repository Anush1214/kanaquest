import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [loginName, setLoginName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Trial mode check (no firebase context or empty password)
        if (!auth && email && !password) {
            triggerGateAnimation(email.split('@')[0] || 'Traveler', false);
            return;
        }

        if (!auth && password) {
            setError('Firebase is not configured. Using trial mode? Leave password empty.');
            return;
        }

        try {
            if (isRegister) {
                if (!displayName || !email || !password) {
                    setError('All fields are required');
                    return;
                }
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save to Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    displayName,
                    email,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });

                triggerGateAnimation(displayName, true); // True because it's a new registration
            } else {
                if (!email) {
                    setError('Email is required');
                    return;
                }
                if (!password) {
                    // Fallback to trial mode if no password provided
                    triggerGateAnimation(email.split('@')[0] || 'Traveler', false);
                    return;
                }

                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Fetch displayName from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const name = userDoc.exists() ? userDoc.data().displayName : (user.displayName || email.split('@')[0]);

                // Update last login
                await setDoc(doc(db, 'users', user.uid), { lastLogin: new Date().toISOString() }, { merge: true });

                triggerGateAnimation(name, false); // False because it's a returning login
            }
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    const handleSocialLogin = async (providerName) => {
        if (!auth) {
            setError('Firebase is not configured. Set up .env.local first.');
            return;
        }

        try {
            const provider = googleProvider;
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            const name = user.displayName || user.email.split('@')[0];

            // Check if user exists to determine if new
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const isNewUser = !userDoc.exists();

            // Save or update user in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                displayName: name,
                email: user.email,
                photoURL: user.photoURL,
                lastLogin: new Date().toISOString(),
                ...(isNewUser ? { createdAt: new Date().toISOString() } : {})
            }, { merge: true });

            triggerGateAnimation(name, isNewUser);
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    const triggerGateAnimation = (name, isNew = false) => {
        setLoginName(name);
        setIsLoggingIn(true);
        setTimeout(() => setShowWelcome(true), 800);
        setTimeout(() => onLogin(name, isNew), 2000);
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setDisplayName('');
        setError('');
    };

    return (
        <motion.div
            className="login-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background */}
            <div className="login-bg" />

            {/* Torii Gate Structure */}
            <div className={`torii-gate ${isLoggingIn ? 'gate-open' : ''}`}>
                <div className="torii-top">
                    <div className="torii-kasagi" />
                    <div className="torii-nuki" />
                </div>
                <div className="torii-pillars">
                    <div className="torii-pillar left" />
                    <div className="torii-pillar right" />
                </div>
            </div>

            {/* Lanterns */}
            <motion.div
                className="lantern left-lantern"
                animate={{ rotateZ: [0, 3, -3, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
                <div className="lantern-body">灯</div>
                <div className="lantern-glow" />
            </motion.div>
            <motion.div
                className="lantern right-lantern"
                animate={{ rotateZ: [0, -3, 3, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
            >
                <div className="lantern-body">灯</div>
                <div className="lantern-glow" />
            </motion.div>

            {/* Welcome Message (after login/register) */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        className="welcome-overlay"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 0.85, 0.45, 1] }}
                    >
                        <motion.div
                            className="welcome-kanji"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            ようこそ
                        </motion.div>
                        <motion.div
                            className="welcome-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            Welcome, {loginName}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login/Register Form */}
            <AnimatePresence mode="wait">
                {!isLoggingIn && (
                    <motion.div
                        className="login-container"
                        key={isRegister ? 'register' : 'login'}
                        initial={{ y: 40, opacity: 0, rotateY: isRegister ? 10 : -10 }}
                        animate={{ y: 0, opacity: 1, rotateY: 0 }}
                        exit={{ y: -30, opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease: [0.16, 0.85, 0.45, 1] }}
                    >
                        <div className="login-card">
                            {/* Card header */}
                            <div className="login-header">
                                <div className="login-stamp">{isRegister ? '登' : '城'}</div>
                                <h2 className="login-title">
                                    {isRegister ? '新規登録' : '門を開けよ'}
                                </h2>
                                <p className="login-subtitle">
                                    {isRegister ? 'Create Your Account' : 'Open the Gate'}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="login-form">
                                {/* Display Name — Register only */}
                                {isRegister && (
                                    <motion.div
                                        className="input-group"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <label className="input-label">名前 — Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Enter your display name"
                                            className="login-input"
                                            autoComplete="name"
                                        />
                                    </motion.div>
                                )}

                                <div className="input-group">
                                    <label className="input-label">
                                        {isRegister ? 'メール — Email' : '名前 — Name / Email'}
                                    </label>
                                    <input
                                        type={isRegister ? 'email' : 'text'}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={isRegister ? 'Enter your email' : 'Enter your name or email'}
                                        className="login-input"
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">秘密 — Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={isRegister ? 'Create a password' : 'Enter your password'}
                                        className="login-input"
                                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                                    />
                                </div>

                                {/* Confirm Password — Register only */}
                                {isRegister && (
                                    <motion.div
                                        className="input-group"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                    >
                                        <label className="input-label">確認 — Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your password"
                                            className="login-input"
                                            autoComplete="new-password"
                                        />
                                        {confirmPassword && password !== confirmPassword && (
                                            <span className="input-error">Passwords do not match</span>
                                        )}
                                    </motion.div>
                                )}

                                {/* Global Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{
                                            color: 'var(--color-red)',
                                            fontSize: '0.85rem',
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(204, 0, 0, 0.1)',
                                            padding: '10px',
                                            borderRadius: '6px',
                                            margin: '10px 0 4px 0',
                                            border: '1px solid rgba(204, 0, 0, 0.2)'
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <motion.button
                                    type="submit"
                                    className="login-btn"
                                    whileHover={{ scale: 1.02, boxShadow: '0 6px 25px rgba(204, 0, 0, 0.4)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="login-btn-jp">{isRegister ? '登録' : '入門'}</span>
                                    <span className="login-btn-en">{isRegister ? 'Register' : 'Sign In'}</span>
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div className="login-divider">
                                <span className="divider-line" />
                                <span className="divider-text">または — or</span>
                                <span className="divider-line" />
                            </div>

                            {/* Social buttons */}
                            <div className="social-buttons">
                                <motion.button
                                    className="social-btn google-btn"
                                    onClick={() => handleSocialLogin('google')}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>{isRegister ? 'Sign up with Google' : 'Sign in with Google'}</span>
                                </motion.button>


                            </div>

                            {/* Toggle Login/Register */}
                            <div className="login-toggle">
                                <span className="toggle-text">
                                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                                </span>
                                <button className="toggle-btn" onClick={toggleMode} type="button">
                                    {isRegister ? 'ログイン Sign In' : '新規登録 Register'}
                                </button>
                            </div>

                            <p className="login-footer">
                                {isRegister
                                    ? '無料 — Free to join, start learning today'
                                    : '体験版 — No account needed, just enter a name'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LoginPage;
