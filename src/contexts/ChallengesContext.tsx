import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import LevelUpModal from '../components/LevelUpModal';

interface ChallengeProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  experienceToNextLevel: number;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengeProps) {
  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(
    rest.currentExperience ?? 0,
  );
  const [challengesCompleted, setChallengesCompleted] = useState(
    rest.challengesCompleted ?? 0,
  );
  const [activeChallenge, setActiveChallenge] = useState(null);

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    Cookies.set('level', String(level), {
      expires: 31536000,
    });
    Cookies.set('currentExperience', String(currentExperience), {
      expires: 31536000,
    });
    Cookies.set('challengesCompleted', String(challengesCompleted), {
      expires: 31536000,
    });
  }, [level, currentExperience, challengesCompleted]);

  const levelUp = useCallback(() => {
    setLevel(currentLevel => currentLevel + 1);
    setIsLevelModalOpen(true);
  }, []);

  const startNewChallenge = useCallback(() => {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio 😄', {
        body: `Valendo ${challenge.amount}xp!`,
      });
    }
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setIsLevelModalOpen(false);
  }, []);

  const resetChallenge = useCallback(() => {
    setActiveChallenge(null);
  }, []);

  const completeChallenge = useCallback(() => {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge as Challenge;

    let finalExperience = currentExperience + amount;

    while (finalExperience >= experienceToNextLevel) {
      finalExperience -= experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(currentChallenges => currentChallenges + 1);
  }, [activeChallenge]);

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        levelUp,
        startNewChallenge,
        activeChallenge,
        resetChallenge,
        experienceToNextLevel,
        completeChallenge,
        closeLevelUpModal,
      }}
    >
      {children}

      {isLevelModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  );
}
