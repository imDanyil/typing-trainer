import React, { useState, ReactNode } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import styles from '../../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Instructions = () => (
  <div className={styles.instructions}>
    <h2>Як користуватись?</h2>
    <p>Друкуйте слова так швидко, як тільки можете.</p>
    <p>Натискайте "Пробіл", щоб перейти до наступного слова.</p>
    <p>Помилки підкреслюються червоним.</p>
    <p>Перемикати розкладку не потрібно</p>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <>
      {' '}
      {/* Використовуємо React.Fragment */}
      <header className={styles.header}>
        <div
          className={styles.helpIcon}
          onMouseEnter={() => setShowInstructions(true)}
          onMouseLeave={() => setShowInstructions(false)}
          aria-label="Інструкція з використання"
          tabIndex={0} // Щоб зробити іконку доступною для клавіатури
        >
          ?{showInstructions && <Instructions />}
        </div>
        <h1>Тренажер швидкого друку</h1>
        <ThemeSwitcher />
      </header>
      <div className={styles.wrapper}>
        {' '}
        {/* Wrapper тільки для контенту */}
        <main className={styles.content}>{children}</main>
      </div>
      <footer className={styles.footer}>
        <p>Зроблено з ❤️ для тих, хто хоче друкувати швидко</p>
        <a
          href="https://github.com/imDanyil"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </>
  );
};

export default Layout;
