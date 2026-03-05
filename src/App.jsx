import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import GoalPage from './components/GoalPage';
import ActionPlan from './components/ActionPlan';
import ContributorDetail from './components/ContributorDetail';

function App() {
  const [view, setView] = useState('dashboard');
  const [detailTab, setDetailTab] = useState('positive');

  const onHandleDetail = (tab) => {
    setDetailTab(tab);
    setView('detail');
  };

  return (
    <div className="App">
      {view === 'dashboard' && (
        <Dashboard
          onSetGoal={() => setView('goal')}
          onDetail={onHandleDetail}
        />
      )}
      {view === 'goal' && (
        <GoalPage
          onBack={() => setView('dashboard')}
          onNext={() => setView('action-plan')}
        />
      )}
      {view === 'action-plan' && (
        <ActionPlan onBack={() => setView('goal')} />
      )}
      {view === 'detail' && (
        <ContributorDetail
          initialTab={detailTab}
          onBack={() => setView('dashboard')}
        />
      )}
    </div>
  );
}

export default App;
