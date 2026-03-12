import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import bgImg from '../assets/castle_exterior.png'; // Or interior, whatever fits best
import './QuizPage.css';

const QUESTION_BANK = [
    { question: "What is the reading of '水' (Water)?", options: ["Mizu", "Hi", "Ki", "Kin"], answer: "Mizu" },
    { question: "Watashi ___ gakusei desu. (I am a student). Which particle goes in the blank?", options: ["は (wa)", "が (ga)", "を (wo)", "に (ni)"], answer: "は (wa)" },
    { question: "Which of these is the Katakana for 'Ka'?", options: ["カ", "サ", "タ", "ア"], answer: "カ" },
    { question: "How do you say 'Good morning' in Japanese?", options: ["Ohayou gozaimasu", "Konnichiwa", "Konbanwa", "Sayounara"], answer: "Ohayou gozaimasu" },
    { question: "What does '食べる' (Taberu) mean?", options: ["To eat", "To drink", "To run", "To sleep"], answer: "To eat" },
    { question: "What is the reading of '山' (Mountain)?", options: ["Yama", "Kawa", "Umi", "Sora"], answer: "Yama" },
    { question: "Kyou wa ___ ga ii desu ne. (The weather is nice today, isn't it?)", options: ["Tenki", "Denki", "Genki", "Ninki"], answer: "Tenki" },
    { question: "Which color is 'Aka'?", options: ["Red", "Blue", "Black", "White"], answer: "Red" },
    { question: "Hon wa tsukue no ___ ni arimasu. (The book is ON the desk.)", options: ["Ue", "Shita", "Naka", "Mae"], answer: "Ue" },
    { question: "What is the reading of '新しい' (New)?", options: ["Atarashii", "Furui", "Takai", "Yasui"], answer: "Atarashii" },
    { question: "Mainichi hachi-ji ___ okimasu. (I wake up at 8 o'clock everyday). Which particle?", options: ["に (ni)", "で (de)", "へ (e)", "と (to)"], answer: "に (ni)" },
    { question: "What is the meaning of '大きい' (Ookii)?", options: ["Big", "Small", "Fast", "Slow"], answer: "Big" },
    { question: "What is the reading of '行く' (To go)?", options: ["Iku", "Kuru", "Kaeru", "Matsu"], answer: "Iku" },
    { question: "What is the reading of '本' (Book)?", options: ["Hon", "Kami", "Pen", "Ji"], answer: "Hon" },
    { question: "Ashita wa ___ desu. (Tomorrow is Sunday.)", options: ["Nichiyoubi", "Getsuyoubi", "Suiyoubi", "Kinyoubi"], answer: "Nichiyoubi" },
    { question: "What does '飲む' (Nomu) mean?", options: ["To drink", "To read", "To speak", "To write"], answer: "To drink" },
    { question: "Toshokan ___ hon o yomimasu. (I read books AT the library.)", options: ["で (de)", "に (ni)", "は (wa)", "を (wo)"], answer: "で (de)" },
    { question: "What is the reading of '上' (Up/Above)?", options: ["Ue", "Shita", "Hidari", "Migi"], answer: "Ue" },
    { question: "Which word means 'Teacher'?", options: ["Sensei", "Gakusei", "Isha", "Kaishain"], answer: "Sensei" },
    { question: "Kono kaban wa ___ desu ka. (WHOSE bag is this?)", options: ["Dare no", "Nani no", "Itsu", "Doko"], answer: "Dare no" },
    { question: "What is the reading of '人' (Person)?", options: ["Hito", "Otoko", "Onna", "Kodomo"], answer: "Hito" },
    { question: "Which of these means 'Today'?", options: ["Kyou", "Ashita", "Kinou", "Asatte"], answer: "Kyou" },
    { question: "Eki made basu ___ ikimasu. (I go to the station BY bus.)", options: ["で (de)", "に (ni)", "は (wa)", "が (ga)"], answer: "で (de)" },
    { question: "What is the Hiragana for 'Shi'?", options: ["し", "ち", "つ", "す"], answer: "し" },
    { question: "What is the reading of '車' (Car)?", options: ["Kuruma", "Densha", "Jitensha", "Fune"], answer: "Kuruma" },
    { question: "What does '高い' (Takai) mean?", options: ["High/Expensive", "Low", "Cheap", "New"], answer: "High/Expensive" },
    { question: "Sumimasen, toire wa ___ desu ka. (Excuse me, WHERE is the toilet?)", options: ["Doko", "Nani", "Itsu", "Dare"], answer: "Doko" },
    { question: "What is the Katakana for 'To'?", options: ["ト", "テ", "チ", "タ"], answer: "ト" },
    { question: "What is the reading of '百' (100)?", options: ["Hyaku", "Sen", "Man", "Juu"], answer: "Hyaku" },
    { question: "Kore wa ___ shinbun desu. (This is a JAPANESE newspaper.)", options: ["Nihongo no", "Nihongo na", "Nihongo", "Nihon"], answer: "Nihongo no" },
    { question: "What does '見る' (Miru) mean?", options: ["To see", "To hear", "To talk", "To walk"], answer: "To see" },
    { question: "Which color is 'Kuro'?", options: ["Black", "White", "Green", "Yellow"], answer: "Black" },
    { question: "What is the reading of '男' (Man)?", options: ["Otoko", "Onna", "Hito", "Tomodachi"], answer: "Otoko" },
    { question: "Watashi no yasumi wa Doyoubi ___ Nichiyoubi desu. (My days off are Saturday AND Sunday.)", options: ["と (to)", "や (ya)", "に (ni)", "で (de)"], answer: "と (to)" },
    { question: "Which of these is the Katakana for 'Shi'?", options: ["シ", "ツ", "ン", "ソ"], answer: "シ" }
];

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const getNewQuizSet = () => {
    return shuffleArray(QUESTION_BANK).slice(0, 10).map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));
};

const QuizPage = ({ onBack, userName }) => {
    const [quizQuestions, setQuizQuestions] = useState(getNewQuizSet);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    const handleAnswerOptionClick = (option) => {
        setSelectedAnswer(option);
        
        const isCorrect = option === quizQuestions[currentQuestion].answer;
        if (isCorrect) {
            setScore(score + 1);
        }

        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < quizQuestions.length) {
                setCurrentQuestion(nextQuestion);
                setSelectedAnswer(null);
            } else {
                finishQuiz(score + (isCorrect ? 1 : 0));
            }
        }, 800);
    };

    const finishQuiz = async (finalScore) => {
        setShowScore(true);
        setSelectedAnswer(null);
        
        if (!auth.currentUser) {
            setSaveStatus("Trial mode: Score not saved.");
            return;
        }

        setIsSaving(true);
        setSaveStatus("Saving score...");
        
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            const userDoc = await getDoc(userRef);
            
            const scoreData = {
                score: finalScore,
                total: quizQuestions.length,
                date: new Date().toISOString()
            };

            if (userDoc.exists()) {
                await updateDoc(userRef, {
                    quizHistory: arrayUnion(scoreData)
                });
            } else {
                await setDoc(userRef, {
                    quizHistory: [scoreData]
                }, { merge: true });
            }
            setSaveStatus("Score saved successfully!");
        } catch (error) {
            console.error("Error saving score:", error);
            setSaveStatus("Failed to save score.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            className="quiz-page"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="quiz-bg">
                <img src={bgImg} alt="Background" />
                <div className="quiz-overlay" />
            </div>

            <motion.button
                className="quiz-back-btn"
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                ← 戻る Back
            </motion.button>

            <div className="quiz-card">
                {showScore ? (
                    <motion.div 
                        className="score-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>修行完了 Training Complete</h2>
                        <div className="score-display">
                            <span className="score-number">{score}</span>
                            <span className="score-divider">/</span>
                            <span className="score-total">{quizQuestions.length}</span>
                        </div>
                        <p className="score-message">
                            {score === quizQuestions.length ? "完璧! Perfect!" : 
                             score >= quizQuestions.length / 2 ? "よくできました! Well done!" : 
                             "がんばれ! Keep practicing!"}
                        </p>
                        <p className={`save-status ${isSaving ? 'saving' : ''}`}>
                            {saveStatus}
                        </p>
                        <motion.button 
                            className="play-again-btn"
                            onClick={() => {
                                setQuizQuestions(getNewQuizSet());
                                setCurrentQuestion(0);
                                setScore(0);
                                setShowScore(false);
                                setSaveStatus('');
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            もう一度 Try Again
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="question-section">
                        <div className="quiz-header">
                            <h2>小テスト Quiz</h2>
                            <div className="question-count">
                                <span>Question {currentQuestion + 1}</span>/{quizQuestions.length}
                            </div>
                        </div>
                        
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
                            ></div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="question-text"
                            >
                                {quizQuestions[currentQuestion].question}
                            </motion.div>
                        </AnimatePresence>

                        <div className="answer-section">
                            {quizQuestions[currentQuestion].options.map((option, index) => {
                                let buttonClass = "answer-btn";
                                if (selectedAnswer) {
                                    if (option === quizQuestions[currentQuestion].answer) {
                                        buttonClass += " correct";
                                    } else if (option === selectedAnswer) {
                                        buttonClass += " incorrect";
                                    } else {
                                        buttonClass += " disabled";
                                    }
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        className={buttonClass}
                                        onClick={() => !selectedAnswer && handleAnswerOptionClick(option)}
                                        disabled={selectedAnswer !== null}
                                        whileHover={!selectedAnswer ? { scale: 1.02, backgroundColor: "rgba(204, 0, 0, 0.1)" } : {}}
                                        whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                                    >
                                        <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                        <span className="option-text">{option}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default QuizPage;
