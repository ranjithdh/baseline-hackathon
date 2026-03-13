import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import GoalPage from './components/GoalPage';
import ActionPlan from './components/ActionPlan';
import ContributorDetail from './components/ContributorDetail';
import BookConsultation from './components/BookConsultation';
import ActionPlanTimeline from './components/ActionPlanTimeline';
import DetailedActionPlan from './components/DetailedActionPlan';
import Settings from './components/Settings';

function App() {
  const [view, setView] = useState('dashboard');
  const [detailTab, setDetailTab] = useState('positive');
  const [actionPlanData, setActionPlanData] = useState(null);
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
              onBack={() => setView('action-plan')} 
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
