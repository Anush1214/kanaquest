import { motion } from 'framer-motion';
import interiorImg from '../assets/castle_interior.png';
import './LearningHall.css';

const categories = [
    { id: 'hiragana', icon: 'あ', label: 'Hiragana/Katakana', description: 'Master the Japanese writing systems' },
    { id: 'kanji', icon: '漢', label: 'Kanji', description: 'Learn the Chinese characters used in Japanese' },
    { id: 'grammar', icon: '文', label: 'Grammar', description: 'Understand Japanese sentence structure' },
    { id: 'vocabulary', icon: '語', label: 'Vocabulary', description: 'Build your Japanese word bank' },
    { id: 'verbs', icon: '動', label: 'Verbs', description: 'Conjugate and use Japanese verbs' },
    { id: 'culture', icon: '化', label: 'Culture', description: 'Explore Japanese traditions and customs' },
    { id: 'quiz', icon: '試', label: 'Quiz', description: 'Test your N5 knowledge' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.3,
        },
    },
};

const cardVariants = {
    hidden: { y: -80, opacity: 0, rotateZ: -5 },
    visible: {
        y: 0,
        opacity: 1,
        rotateZ: 0,
        transition: {
            type: 'spring',
            stiffness: 80,
            damping: 12,
        },
    },
};

const LearningHall = ({ onSelectCategory, onBack, userName, isNewUser, onLogout }) => {
    return (
        <motion.div
            className="learning-hall"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
            {/* Background */}
            <div className="hall-bg">
                <img src={interiorImg} alt="Castle Interior" className="hall-bg-img" />
                <div className="hall-overlay" />
            </div>

            {/* Back button */}
            <motion.button
                className="back-btn"
                onClick={onBack}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, color: '#f5deb3' }}
                whileTap={{ scale: 0.95 }}
            >
                ← 戻る Back to Castle
            </motion.button>

            {/* Logout button */}
            <motion.button
                className="logout-btn"
                onClick={onLogout}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, color: '#f5deb3' }}
                whileTap={{ scale: 0.95 }}
            >
                ログアウト Logout →
            </motion.button>

            {/* Header section */}
            <motion.div
                className="hall-header"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
            >
                <h1 className="hall-title">学びの間</h1>
                <p className="hall-subtitle">
                    {isNewUser
                        ? `The Learning Hall — Welcome for the first time, ${userName}`
                        : `The Learning Hall — Welcome back, ${userName}`}
                </p>
            </motion.div>

            {/* Sakura Tree Branch */}
            <motion.div
                className="sakura-branch-container"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.2, duration: 1, ease: [0.16, 0.85, 0.45, 1] }}
            >
                <svg className="sakura-branch-svg" viewBox="0 0 960 120" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        {/* Bark gradient — dark wood with highlights */}
                        <linearGradient id="bark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6B4226" />
                            <stop offset="40%" stopColor="#4A2D14" />
                            <stop offset="70%" stopColor="#3B2210" />
                            <stop offset="100%" stopColor="#5C3A1E" />
                        </linearGradient>
                        {/* Thin branch gradient */}
                        <linearGradient id="twig" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#5C3A1E" />
                            <stop offset="100%" stopColor="#8B6B4A" />
                        </linearGradient>
                        {/* Petal gradients */}
                        <radialGradient id="petalPink" cx="40%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#FFE0E8" />
                            <stop offset="50%" stopColor="#FFB7C5" />
                            <stop offset="100%" stopColor="#F497A8" />
                        </radialGradient>
                        <radialGradient id="petalLight" cx="40%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#FFF0F3" />
                            <stop offset="50%" stopColor="#FFDCE5" />
                            <stop offset="100%" stopColor="#FFB7C5" />
                        </radialGradient>
                        <radialGradient id="petalWhite" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="40%" stopColor="#FFF5F7" />
                            <stop offset="100%" stopColor="#FFE0E8" />
                        </radialGradient>
                        {/* Subtle shadow for depth */}
                        <filter id="branchShadow" x="-5%" y="-5%" width="110%" height="130%">
                            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a0a05" floodOpacity="0.35" />
                        </filter>
                    </defs>

                    {/* Main thick branch — organic shape with varying width */}
                    <path
                        d="M -10 75 C 60 72, 100 55, 180 58 C 250 60, 300 50, 380 48 C 440 46, 500 42, 560 40 C 640 37, 700 42, 770 38 C 830 35, 890 45, 970 35"
                        fill="none" stroke="url(#bark)" strokeWidth="10" strokeLinecap="round"
                        filter="url(#branchShadow)"
                    />
                    {/* Bark texture line on top */}
                    <path
                        d="M -10 73 C 60 70, 100 53, 180 56 C 250 58, 300 48, 380 46 C 440 44, 500 40, 560 38 C 640 35, 700 40, 770 36 C 830 33, 890 43, 970 33"
                        fill="none" stroke="#7B5230" strokeWidth="2" strokeLinecap="round" opacity="0.4"
                    />

                    {/* Forking sub-branches — organic curves tapering to thin tips */}
                    <path d="M 100 56 C 85 40, 65 22, 40 12" fill="none" stroke="url(#twig)" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 40 12 C 30 7, 18 8, 8 3" fill="none" stroke="url(#twig)" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 250 52 C 235 35, 215 18, 200 8" fill="none" stroke="url(#twig)" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 420 47 C 410 30, 395 14, 385 5" fill="none" stroke="url(#twig)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 385 5 C 375 0, 370 2, 360 8" fill="none" stroke="url(#twig)" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 600 39 C 610 22, 625 10, 640 3" fill="none" stroke="url(#twig)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 770 38 C 785 20, 800 8, 815 2" fill="none" stroke="url(#twig)" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 815 2 C 825 -2, 840 3, 850 -1" fill="none" stroke="url(#twig)" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Drooping sub-branches (cards hang from these) */}
                    <path d="M 160 58 C 165 72, 160 90, 155 105" fill="none" stroke="url(#twig)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 360 48 C 355 62, 358 82, 355 105" fill="none" stroke="url(#twig)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 560 40 C 562 54, 558 76, 560 105" fill="none" stroke="url(#twig)" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 700 41 C 698 55, 702 78, 700 105" fill="none" stroke="url(#twig)" strokeWidth="2.5" strokeLinecap="round" />

                    {/* === Cherry Blossom Flowers === */}
                    {/* A realistic 5-petal sakura flower */}
                    {[
                        { x: 42, y: 12, s: 1, g: 'petalPink' },
                        { x: 95, y: 50, s: 0.7, g: 'petalLight' },
                        { x: 200, y: 8, s: 0.9, g: 'petalWhite' },
                        { x: 240, y: 40, s: 0.6, g: 'petalPink' },
                        { x: 330, y: 50, s: 0.7, g: 'petalLight' },
                        { x: 388, y: 5, s: 0.85, g: 'petalPink' },
                        { x: 440, y: 44, s: 0.6, g: 'petalWhite' },
                        { x: 510, y: 38, s: 0.75, g: 'petalLight' },
                        { x: 580, y: 42, s: 0.65, g: 'petalPink' },
                        { x: 640, y: 3, s: 0.8, g: 'petalWhite' },
                        { x: 720, y: 38, s: 0.7, g: 'petalLight' },
                        { x: 810, y: 4, s: 0.9, g: 'petalPink' },
                        { x: 860, y: 38, s: 0.55, g: 'petalWhite' },
                        { x: 920, y: 36, s: 0.65, g: 'petalLight' },
                    ].map(({ x, y, s, g }, i) => (
                        <g key={`flower-${i}`} transform={`translate(${x},${y}) scale(${s}) rotate(${i * 37 % 360})`}>
                            {/* 5 petals arranged radially */}
                            {[0, 72, 144, 216, 288].map((angle, pi) => (
                                <path
                                    key={pi}
                                    d="M 0 0 C -3 -6, -2 -12, 0 -14 C 2 -12, 3 -6, 0 0"
                                    fill={`url(#${g})`}
                                    opacity={0.88}
                                    transform={`rotate(${angle})`}
                                />
                            ))}
                            {/* Center stamen cluster */}
                            <circle cx="0" cy="0" r="2.5" fill="#FFEB3B" opacity="0.9" />
                            <circle cx="0" cy="0" r="1.2" fill="#E65100" opacity="0.7" />
                            {/* Tiny stamen dots */}
                            {[0, 60, 120, 180, 240, 300].map((a, si) => (
                                <circle
                                    key={si}
                                    cx={Math.cos(a * Math.PI / 180) * 3.5}
                                    cy={Math.sin(a * Math.PI / 180) * 3.5}
                                    r="0.8"
                                    fill="#D84315"
                                    opacity="0.6"
                                />
                            ))}
                        </g>
                    ))}

                    {/* Small buds (unopened or half-open) */}
                    {[
                        [65, 28], [170, 62], [290, 44], [470, 42], [550, 36],
                        [660, 30], [750, 35], [850, -1], [130, 36], [490, 40],
                    ].map(([bx, by], bi) => (
                        <g key={`bud-${bi}`} transform={`translate(${bx},${by})`}>
                            <ellipse cx="0" cy="0" rx="3" ry="5" fill={bi % 2 === 0 ? '#FFB7C5' : '#FFDCE5'} opacity="0.85" transform={`rotate(${bi * 25})`} />
                            <path d="M 0 -4 C -1 -6, 1 -6, 0 -4" fill="#5C3A1E" opacity="0.6" />
                        </g>
                    ))}

                    {/* Falling petals (a few detached) */}
                    {[
                        [300, 85, 45], [500, 90, -30], [700, 95, 60], [150, 100, -15],
                    ].map(([px, py, rot], fi) => (
                        <path
                            key={`fall-${fi}`}
                            d="M 0 0 C -2 -4, -1 -7, 0 -8 C 1 -7, 2 -4, 0 0"
                            fill="#FFB7C5"
                            opacity="0.5"
                            transform={`translate(${px},${py}) rotate(${rot}) scale(0.8)`}
                        />
                    ))}
                </svg>
            </motion.div>

            {/* Category Cards */}
            <motion.div
                className="cards-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.id}
                        className="hanging-card-wrapper"
                        variants={cardVariants}
                        style={{ '--hang-delay': `${index * 0.15}s` }}
                    >
                        {/* Hanging string */}
                        <div className="hanging-string" />

                        <motion.div
                            className="category-card"
                            onClick={() => onSelectCategory(cat.id)}
                            whileHover={{
                                scale: 1.08,
                                rotateZ: [0, -2, 2, 0],
                                boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                                transition: { duration: 0.4 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Card nail */}
                            <div className="card-nail" />

                            <span className="card-icon">{cat.icon}</span>
                            <span className="card-label">{cat.label}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default LearningHall;
