import React, { useCallback, useContext, useState } from 'react';
import { CountdownContext } from '../contexts/CountdownContext';

import styles from '../styles/components/Countdown.module.css';

const Countdown: React.FC = () => {
  const {
    minutes,
    seconds,
    hasFinished,
    isActive,
    handleResetCountdown,
    handleStartCountdown,
  } = useContext(CountdownContext);

  const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
  const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

  const [isCloseImageHovered, setIsCloseImageHovered] = useState(true);

  const handleButtonCloseImageHover = useCallback(() => {
    setIsCloseImageHovered(true);
  }, []);

  const handleNotButtonCloseImageHover = useCallback(() => {
    setIsCloseImageHovered(false);
  }, []);

  return (
    <div>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>

        <span>:</span>

        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      {hasFinished ? (
        <button disabled className={styles.countdownButton}>
          Ciclo encerrado
          <img src="icons/completed.svg" alt="Completed Image" />
        </button>
      ) : (
        <>
          {isActive ? (
            <button
              onMouseEnter={handleButtonCloseImageHover}
              onMouseLeave={handleNotButtonCloseImageHover}
              onClick={handleResetCountdown}
              type="button"
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
            >
              Abandonar ciclo
              {isCloseImageHovered ? (
                <img src="icons/close-white.svg" alt="Close Image" />
              ) : (
                <img src="icons/close.svg" alt="Close Image" />
              )}
            </button>
          ) : (
            <button
              onClick={handleStartCountdown}
              type="button"
              className={styles.countdownButton}
            >
              Iniciar um ciclo
              <img src="icons/playArrow.svg" alt="Play Arrow Image" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Countdown;
