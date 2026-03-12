import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IS_DESKTOP } from './config';
import Dashboard        from './components/Dashboard';
import DesktopDashboard from './components/desktop/DesktopDashboard';
import GoalPage from './components/GoalPage';
import ActionPlan from './components/ActionPlan';
import ContributorDetail from './components/ContributorDetail';
import BookConsultation from './components/BookConsultation';
import ActionPlanTimeline from './components/ActionPlanTimeline';
import Settings from './components/Settings';

function App() {
  const [view, setView] = useState('dashboard');
  const [detailTab, setDetailTab] = useState('positive');
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  React.useLayoutEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply layout mode once on launch based on IS_DESKTOP in config.js
  React.useLayoutEffect(() => {
    document.body.classList.toggle('desktop', IS_DESKTOP);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };


  const onHandleDetail = (tab) => {
    setDetailTab(tab);
    setView('detail');
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }
  };

  // ── If desktop mode, render the full desktop layout directly ──
  if (IS_DESKTOP) {
    return <DesktopDashboard />;
  }

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Dashboard
              onSetGoal={() => setView('goal')}
              onDetail={onHandleDetail}
              onSettings={() => setView('settings')}
            />
          </motion.div>
        )}
        {view === 'settings' && (
          <motion.div key="settings" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Settings 
              onBack={() => setView('dashboard')} 
              currentTheme={theme}
              onToggleTheme={toggleTheme}
            />
          </motion.div>
        )}

        {view === 'goal' && (
          <motion.div key="goal" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <GoalPage
              onBack={() => setView('dashboard')}
              onNext={() => setView('action-plan')}
            />
          </motion.div>
        )}
        {view === 'action-plan' && (
          <motion.div key="action-plan" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <ActionPlan 
              onBack={() => setView('goal')} 
              onAnalyze={() => setView('book-consultation')}
            />
          </motion.div>
        )}
        {view === 'book-consultation' && (
          <motion.div key="book-consultation" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <BookConsultation 
              onBack={() => setView('action-plan')} 
              onShowTimeline={() => setView('timeline')}
            />
          </motion.div>
        )}
        {view === 'timeline' && (
          <motion.div key="timeline" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <ActionPlanTimeline 
              onBack={() => setView('dashboard')} 
            />
          </motion.div>
        )}
        {view === 'detail' && (
          <motion.div key="detail" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <ContributorDetail
              initialTab={detailTab}
              onBack={() => setView('dashboard')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
