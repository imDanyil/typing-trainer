import React, { useEffect, useState, useCallback } from 'react';
import './global.css';
import WordList from './components/containers/WordList';
import Layout from './components/ui/Layout';
import TimeTracker from './components/containers/TimeTracker';

const App: React.FC = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const startTimer = useCallback(() => {
    setIsTyping(true);
    setElapsedTime(0);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTyping(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsTyping(false);
    setElapsedTime(0);
  }, []);

  return (
    <div className="App">
      <Layout>
        <p>Elapsed Time: {elapsedTime.toFixed(2)} sec</p>

        {/* Передаємо час у WordList */}
        <WordList
          elapsedTime={elapsedTime}
          startTest={startTimer}
          finishTest={stopTimer}
          resetTest={resetTimer}
        />

        {/* Окремий компонент для підрахунку часу */}
        <TimeTracker isRunning={isTyping} onTimeUpdate={setElapsedTime} />
      </Layout>
    </div>
  );
};

export default App;
