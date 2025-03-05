import { useState, useEffect, useRef } from 'react';

interface TimeTrackerProps {
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
}

const TimeTracker = ({ isRunning, onTimeUpdate }: TimeTrackerProps) => {
  const startTimeRef = useRef<number | null>(null);
  const [_elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    startTimeRef.current = performance.now();
    const updateElapsedTime = () => {
      if (!startTimeRef.current) return;
      const newElapsedTime = (performance.now() - startTimeRef.current) / 1000;
      setElapsedTime(newElapsedTime);
      onTimeUpdate(newElapsedTime);
      requestAnimationFrame(updateElapsedTime);
    };

    requestAnimationFrame(updateElapsedTime);

    return () => {
      startTimeRef.current = null;
    };
  }, [isRunning, onTimeUpdate]);

  return null; // Компонент не рендерить UI, лише рахує час
};

export default TimeTracker;
