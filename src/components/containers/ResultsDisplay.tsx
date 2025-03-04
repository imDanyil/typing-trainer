import React from 'react';

interface ResultsDisplayProps {
  elapsedTime: number;
  errors: number;
  WPM: number;
  accuracy: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  elapsedTime,
  errors,
  WPM,
  accuracy,
}) => {
  return (
    <div>
      <p>Час: {elapsedTime} сек</p>
      <p>Помилки: {errors}</p>
      <p>WPM: {WPM}</p>
      <p>Точність: {accuracy}%</p>
    </div>
  );
};

export default ResultsDisplay;
