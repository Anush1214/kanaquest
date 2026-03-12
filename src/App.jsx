import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import SakuraPetals from './components/SakuraPetals';
import CastleHome from './components/CastleHome';
import LoginPage from './components/LoginPage';
import LearningHall from './components/LearningHall';
import ResourcePage from './components/ResourcePage';
import QuizPage from './components/QuizPage';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

const VIEWS = {
  HOME: 'home',
  LOGIN: 'login',
  HALL: 'hall',
  RESOURCE: 'resource',
  QUIZ: 'quiz',
};

function App() {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userName, setUserName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleEnterCastle = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(VIEWS.LOGIN);
      setIsTransitioning(false);
    }, 1800);
  }, [isTransitioning]);

  const handleLogin = useCallback((name, isNew = false) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUserName(name);
    setIsNewUser(isNew);
    setTimeout(() => {
      setCurrentView(VIEWS.HALL);
      setIsTransitioning(false);
    }, 2000);
  }, [isTransitioning]);

  const handleLogout = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setUserName('');
    setIsNewUser(false);
    // Transition back to exterior castle page
    setTimeout(() => {
      setCurrentView(VIEWS.HOME);
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  const handleSelectCategory = useCallback((categoryId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedCategory(categoryId);
    setTimeout(() => {
      if (categoryId === 'quiz') {
        setCurrentView(VIEWS.QUIZ);
      } else {
        setCurrentView(VIEWS.RESOURCE);
      }
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  const handleBackToHall = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(VIEWS.HALL);
      setSelectedCategory(null);
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  const handleBackToCastle = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(VIEWS.HOME);
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  return (
    <div className="app">
      <Analytics />
      <SpeedInsights />
      <SakuraPetals count={60} />

      <AnimatePresence mode="wait">
        {currentView === VIEWS.HOME && !isTransitioning && (
          <CastleHome key="home" onEnter={handleEnterCastle} />
        )}

        {currentView === VIEWS.LOGIN && !isTransitioning && (
          <LoginPage key="login" onLogin={handleLogin} />
        )}

        {currentView === VIEWS.HALL && !isTransitioning && (
          <LearningHall
            key="hall"
            userName={userName}
            isNewUser={isNewUser}
            onSelectCategory={handleSelectCategory}
            onBack={handleBackToCastle}
            onLogout={handleLogout}
          />
        )}

        {currentView === VIEWS.RESOURCE && !isTransitioning && (
          <ResourcePage
            key={`resource-${selectedCategory}`}
            categoryId={selectedCategory}
            onBack={handleBackToHall}
          />
        )}

        {currentView === VIEWS.QUIZ && !isTransitioning && (
          <QuizPage
            key="quiz"
            userName={userName}
            onBack={handleBackToHall}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
