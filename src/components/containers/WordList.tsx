import React, { useState, useEffect, useCallback, useRef } from 'react';
import { wordListUk, wordListEn } from '../../utils/wordLists';
import { convertToUkrainianLayout } from '../../utils/layoutConverter';
import useTypingStats from '../../utils/useTypingStats';
// import ResultsDisplay from './ResultsDisplay';
import '../../styles/ResultDisplay.css';

const invalidKeys = new Set([
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'Escape',
  'Tab',
  'Shift',
  'Control',
  'Alt',
  'CapsLock',
  'Meta',
  'ArrowLeft',
  'ArrowRight',
  'ArrowDown',
  'ArrowUp',
  'Enter',
]);

const getRandomWords = (count: number): string[] => {
  return Array.from({ length: count }, () =>
    Math.random() < 0.5
      ? wordListUk[Math.floor(Math.random() * wordListUk.length)]
      : wordListEn[Math.floor(Math.random() * wordListEn.length)]
  );
};

interface WordListProps {
  elapsedTime: number;
  startTest: () => void;
  finishTest: () => void;
  resetTest: () => void;
}

interface Result {
  elapsedTime: number;
  errors: number;
  WPM: number;
  accuracy: number;
}

const WordList: React.FC<WordListProps> = ({
  elapsedTime,
  startTest,
  finishTest,
  resetTest,
}) => {
  const [currentWords, setCurrentWords] = useState<string[]>(
    getRandomWords(10)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState<string[]>([]);
  const [warning, setWarning] = useState('');
  const [isInputAllowed, setIsInputAllowed] = useState(true);
  const [previousResults, setPreviousResults] = useState<Result[]>([]);
  const [testFinished, setTestFinished] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const textDisplayRef = useRef<HTMLDivElement>(null);

  const [numberOfWords, setNumberOfWords] = useState(10);

  const {
    // startTest,
    addError,
    addKeystroke,
    // finishTest,
    resetStats,
    // elapsedTime,
    WPM,
    accuracy,
    errors,
    // finished,
  } = useTypingStats({ currentIndex });

  // const handleNumberOfWordsChange = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   setNumberOfWords(Number(event.target.value));
  // };

  const handleCustomNumberOfWordsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 200) {
      setNumberOfWords(value);
    }
  };

  useEffect(() => {
    setCurrentWords(getRandomWords(numberOfWords));
  }, [numberOfWords]);

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const textDisplay = textDisplayRef.current;

    if (textDisplay) {
      textDisplay.addEventListener('focus', handleFocus);
      textDisplay.addEventListener('blur', handleBlur);

      return () => {
        textDisplay.removeEventListener('focus', handleFocus);
        textDisplay.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      console.log('🎯 useEffect підключає обробник подій');

      if (!isInputAllowed && isFocused) {
        event.preventDefault();
        return;
      }
      if (!isFocused) return;
      if (invalidKeys.has(event.key)) return;
      // if (testFinished) return;
      if (event.getModifierState('CapsLock')) {
        setWarning('Увага! Увімкнено Caps Lock');
        document.querySelector('.warning')?.classList.add('show');
        document.querySelector('.warning')?.classList.remove('hide');
        return;
      }

      if (
        event.key !== ' ' &&
        event.key !== 'Backspace' &&
        !/^[a-zA-Z0-9,./;'[\]()\\`=+<>?:\\"-]$/.test(event.key)
      ) {
        setWarning('Переключіть розкладку на англійську');
        document.querySelector('.warning')?.classList.add('show');
        document.querySelector('.warning')?.classList.remove('hide');
        return;
      } else {
        setWarning('');
        document.querySelector('.warning')?.classList.remove('show');
        document.querySelector('.warning')?.classList.add('hide');
      }

      if (event.key === 'Backspace') {
        handleBackspace();
        return;
      }

      if (event.key === ' ') {
        event.preventDefault();
        moveToNextWord();
        return;
      }

      handleCharacterInput(event.key);
      if (typedText[0] === undefined && currentIndex === 0) {
        startTest();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      console.log('🚫 useEffect видаляє обробник подій');
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    currentWords,
    currentIndex,
    typedText,
    warning,
    isInputAllowed,
    isFocused,
    startTest,
  ]);

  useEffect(() => {
    if (currentIndex > -1 && currentIndex < currentWords.length) {
      const wordElement = document.querySelector(
        `.word:nth-child(${currentIndex + 1})`
      );

      if (wordElement) {
        const completedWord = currentWords[currentIndex];
        const typedWord = typedText[currentIndex] || '';

        const hasError =
          typedWord.split('').some((char, i) => {
            return char !== completedWord[i];
          }) || typedWord.length !== completedWord.length;
        if (currentIndex < currentWords.length && currentIndex < currentIndex) {
          if (hasError) {
            wordElement.classList.add('incorrect-word');
            wordElement.classList.add('show-underline');
          } else {
            wordElement.classList.remove('incorrect-word');
            wordElement.classList.remove('show-underline');
          }
        }
      }
    }
  }, [typedText, currentIndex, currentWords]);

  useEffect(() => {
    if (warning) {
      document.querySelector('.warning')?.classList.add('show');
      document.querySelector('.warning')?.classList.remove('hide');

      const timeout = setTimeout(() => {
        document.querySelector('.warning')?.classList.add('hide');
        document.querySelector('.warning')?.classList.remove('show');

        setTimeout(() => {
          setWarning('');
        }, 300);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [warning]);

  const handleBackspace = () => {
    setTypedText(prev => {
      const newTyped = [...prev];

      if (newTyped[currentIndex] && newTyped[currentIndex].length > 0) {
        newTyped[currentIndex] = newTyped[currentIndex].slice(0, -1);
      } else if (currentIndex > 0) {
        setCurrentIndex(prevIndex => prevIndex - 1);
        if (
          newTyped[currentIndex - 1] &&
          newTyped[currentIndex - 1].length > 0
        ) {
          newTyped[currentIndex - 1] = newTyped[currentIndex - 1].slice(0, -1);
        }
      }

      return newTyped;
    });
  };

  const moveToNextWord = () => {
    if (currentIndex === 0) startTest();
    if (currentIndex < currentWords.length - 1) {
      console.log(`🔄 Перехід до нового слова: ${currentWords[currentIndex]}`);
      setCurrentIndex(prev => prev + 1);
      setTypedText(prev => {
        const newTyped = [...prev];
        newTyped[currentIndex + 1] = '';
        return newTyped;
      });
    } else {
      setTestFinished(true);
      setIsInputAllowed(false); // 🔴 Блокуємо введення після завершення
      finishTest(); // ✅ Завершуємо тест
    }
  };

  const handleCharacterInput = useCallback(
    (key: string) => {
      let fixedKey = key;
      const isUkrainian = /^[а-яА-ЯіїєґҐ]$/.test(currentWords[currentIndex][0]);

      if (isUkrainian) {
        fixedKey = convertToUkrainianLayout(key);
      }

      addKeystroke(fixedKey);

      setTypedText(prev => {
        const newTyped = [...prev];
        const currentWord = currentWords[currentIndex] || '';
        const currentTypedWord = newTyped[currentIndex] || '';
        const expectedChar = currentWord[currentTypedWord.length] || null;

        const hasLetterError = fixedKey !== expectedChar;
        const hasExtra = currentTypedWord.length >= currentWord.length;

        if (hasLetterError || hasExtra) {
          addError();
        }
        // Додаємо символ до typedText завжди
        newTyped[currentIndex] = currentTypedWord + fixedKey;
        return newTyped;
      });
    },
    [currentWords, currentIndex, addError, addKeystroke, setTypedText]
  );

  const resetWords = () => {
    setPreviousResults(prev => {
      const newResults = [...prev, { elapsedTime, errors, WPM, accuracy }];
      return newResults.slice(-3); // Keep only the last two results
    });
    setCurrentWords(getRandomWords(numberOfWords));
    setCurrentIndex(0);
    setTypedText([]);
    setWarning('');
    resetStats();
    setIsInputAllowed(true);
    setTestFinished(false);
    resetTest();
  };

  useEffect(() => {
    if (testFinished) {
      finishTest();
    }
  }, [testFinished, finishTest]);

  // useEffect(() => {
  //   if (finished) {
  //     setIsInputAllowed(false);
  //   } else {
  //     setIsInputAllowed(true);
  //   }
  // }, [finished]);

  return (
    <div className="container">
      {warning && <div className="warning">{warning}</div>}

      <div>
        <label>Кількість слів:</label>
        <div className="word-count-buttons">
          <button
            className={`word-count-button ${
              numberOfWords === 5 ? 'active' : ''
            }`}
            onClick={() => setNumberOfWords(5)}
          >
            5
          </button>
          <button
            className={`word-count-button ${
              numberOfWords === 10 ? 'active' : ''
            }`}
            onClick={() => setNumberOfWords(10)}
          >
            10
          </button>
          <button
            className={`word-count-button ${
              numberOfWords === 20 ? 'active' : ''
            }`}
            onClick={() => setNumberOfWords(20)}
          >
            20
          </button>
          <button
            className={`word-count-button ${
              numberOfWords === 50 ? 'active' : ''
            }`}
            onClick={() => setNumberOfWords(50)}
          >
            50
          </button>
          <input
            type="number"
            id="customWordCount"
            placeholder="Власне значення"
            value={numberOfWords}
            onChange={handleCustomNumberOfWordsChange}
          />
        </div>
      </div>

      <div className="text-display" tabIndex={0} ref={textDisplayRef}>
        {currentWords.map((word, index) => {
          const isCurrent = index === currentIndex;
          const isCompleted = index < currentIndex;

          const hasError =
            isCompleted &&
            (() => {
              if (!typedText[index]) {
                return true;
              }

              // Перевірка на помилки в літерах та наявності 'pending' станів
              const hasLetterError = word.split('').some((char, i) => {
                return !typedText[index][i] || typedText[index][i] !== char;
              });

              // Перевірка на зайві символи ('extra')
              const hasExtra = typedText[index].length > word.length;

              return hasLetterError || hasExtra;
            })();

          return (
            <div key={index}>
              <span
                className={`word ${isCurrent ? ' active-word' : ''}${
                  isCompleted
                    ? ` completed-word${
                        hasError ? ' incorrect-word show-underline' : ''
                      }`
                    : ''
                }`}
              >
                {word.split('').map((char, i) => (
                  <span
                    key={i}
                    className={`letter ${
                      typedText[index] && typedText[index][i] === char
                        ? 'correct'
                        : typedText[index] && typedText[index][i]
                        ? 'incorrect'
                        : 'pending'
                    }`}
                  >
                    {char}
                  </span>
                ))}
                {typedText[index] && typedText[index].length > word.length && (
                  <span
                    key={`extra-${typedText[index].length}`}
                    className="letter extra"
                  >
                    {typedText[index].slice(word.length)}
                  </span>
                )}
              </span>
              <span className="space"> </span>
            </div>
          );
        })}
      </div>

      {testFinished && (
        <div className="results-container">
          {previousResults.map((result, index) => (
            <div key={index}>
              {' '}
              {/* Wrap each result in a div */}
              <p>⏱ Час: {result.elapsedTime.toFixed(2)} сек</p>
              <p>⌨️ Швидкість: {result.WPM} WPM</p>
              <p>❌ Помилки: {result.errors}</p>
              <p>✅ Точність: {result.accuracy}%</p>
            </div>
          ))}
          <div className="last-result">
            <p>⏱ Час: {elapsedTime.toFixed(2)} сек</p>
            <p>⌨️ Швидкість: {WPM} WPM</p>
            <p>❌ Помилки: {errors}</p>
            <p>✅ Точність: {accuracy}%</p>
          </div>
        </div>
      )}

      <button onClick={resetWords}>Оновити слова</button>
    </div>
  );
};

export default WordList;
