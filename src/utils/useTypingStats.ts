import { useState, useRef, useEffect } from 'react';

interface TypingStatsProps {
  currentIndex: number;
}

const useTypingStats = ({ currentIndex }: TypingStatsProps) => {
  const [errors, setErrors] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [finished, setFinished] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef(0);

  useEffect(() => {
    if (!finished && startTimeRef.current) {
      const interval = setInterval(() => {
        elapsedTimeRef.current = (Date.now() - startTimeRef.current!) / 1000;
      }, 50); // Оновлюємо раз на 50мс

      return () => clearInterval(interval);
    }
  }, [finished]);

  const startTest = () => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      elapsedTimeRef.current = 0;
      setFinished(false);
    }
  };

  const finishTest = () => {
    if (startTimeRef.current) {
      elapsedTimeRef.current = (Date.now() - startTimeRef.current) / 1000;
      setFinished(true);
    }
  };

  const resetStats = () => {
    startTimeRef.current = null;
    elapsedTimeRef.current = 0;
    setErrors(0);
    setKeystrokes(0);
    setFinished(false);
  };

  const addError = () => setErrors(prev => prev + 1);
  const addKeystroke = (key: string) => {
    if (key !== ' ' && key !== 'Backspace') setKeystrokes(prev => prev + 1);
  };

  const elapsedTime = elapsedTimeRef.current;
  const WPM =
    elapsedTime > 0
      ? Math.max(
          0,
          Math.ceil(
            (currentIndex + 1) / (elapsedTime / 60) -
              errors / (elapsedTime / 60)
          )
        )
      : 0;

  const accuracy =
    keystrokes > 0
      ? Math.max(0, Math.round(((keystrokes - errors) / keystrokes) * 100))
      : 100;

  return {
    startTest,
    addError,
    addKeystroke,
    finishTest,
    elapsedTime,
    WPM,
    accuracy,
    errors,
    finished,
    resetStats,
  };
};

export default useTypingStats;
