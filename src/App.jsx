import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import ContributorDetail from './components/ContributorDetail';
import BookConsultation from './components/BookConsultation';
import ActionPlanTimeline from './components/ActionPlanTimeline';
import DetailedActionPlan from './components/DetailedActionPlan';
import Settings from './components/Settings';
import Home from './components/Home';
import GoalActionCombined from './components/GoalActionCombined';
import BaselineScoreDeepDive from './components/BaselineScoreDeepDive';
import BottomNav from './components/BottomNav';

function App() {
  const [view, setView] = useState('home');
  const [detailTab, setDetailTab] = useState('positive');
  const [showConsultation, setShowConsultation] = useState(true);
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  React.useLayoutEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Home
              onDetail={onHandleDetail}
              onSetGoal={() => setView('goal')}
              onScoreClick={() => setView('baseline-deep-dive')}
              showConsultation={showConsultation}
            />
          </motion.div>
        )}
        {view === 'dashboard' && (
          <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Dashboard
              onSetGoal={() => setView('goal')}
              onDetail={onHandleDetail}
              onSettings={() => setView('settings')}
              isEmpty={true}
            />
          </motion.div>
        )}
        {view === 'settings' && (
          <motion.div key="settings" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Settings
              onBack={() => setView('home')}
              currentTheme={theme}
              onToggleTheme={toggleTheme}
              showConsultation={showConsultation}
              onToggleConsultation={() => setShowConsultation(prev => !prev)}
            />
          </motion.div>
        )}

        {view === 'action-plan' && (
          <motion.div key="action-plan" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <GoalActionCombined
              onBack={() => setView('home')}
              onAnalyze={() => setView('book-consultation')}
              onViewDetailed={(data) => {
                setActionPlanData(data);
                setView('detailed-action-plan');
              }}
              isEmpty={true}
            />
          </motion.div>
        )}
        {view === 'goal' && (
          <motion.div key="goal" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <GoalActionCombined
              onBack={() => setView('home')}
              onAnalyze={() => setView('book-consultation')}
              onViewDetailed={(data) => {
                setActionPlanData(data);
                setView('detailed-action-plan');
              }}
            />
          </motion.div>
        )}
        {view === 'detailed-action-plan' && (
          <motion.div key="detailed-action-plan" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <DetailedActionPlan
              data={actionPlanData}
              onBack={() => setView('goal')}
            />
          </motion.div>
        )}
        {view === 'book-consultation' && (
          <motion.div key="book-consultation" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <BookConsultation
              onBack={() => setView('goal')}
              onShowTimeline={() => setView('timeline')}
            />
          </motion.div>
        )}
        {view === 'timeline' && (
          <motion.div key="timeline" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <ActionPlanTimeline
              onBack={() => setView('home')}
            />
          </motion.div>
        )}
        {view === 'detail' && (
          <motion.div key="detail" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <ContributorDetail
              initialTab={detailTab}
              onBack={() => setView('home')}
            />
          </motion.div>
        )}
        {view === 'baseline-deep-dive' && (
          <motion.div key="baseline-deep-dive" variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <BaselineScoreDeepDive
              onClose={() => setView('home')}
              onSetGoal={() => setView('goal')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav 
        activeView={view} 
        onNavigate={(newView) => setView(newView)} 
      />
    </div>
  );
}

export default App;
