import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';
interface challenge {
  type: 'body' | 'eye'
  description: string;
  amount: number;
}

interface ChallangesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  experiencToNextLevel: number;
  activeChallenge: challenge;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;

}

interface ChallengesProviderProps {
  children: ReactNode;
  level: number
  currentExperience: number
  challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallangesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
  const [level, setlevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrenteExperience] = useState(rest.currentExperience ?? 0);
  const [challengesCompleted, setchallengesCompleted] = useState(rest.challengesCompleted ?? 0);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpMOdalOpen] = useState(false);

  const experiencToNextLevel = Math.pow((level + 1) * 4, 2)
  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted])
  useEffect(() => {
    Notification.requestPermission();
  }, [])

  function levelUp() {
    setlevel(level + 1)
    setIsLevelUpMOdalOpen(true);
  }

  function closeLevelUpModal() {
    setIsLevelUpMOdalOpen(false);
  }

  function startNewChallenge() {
    const randoChallangeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randoChallangeIndex];

    setActiveChallenge(challenge)

    new Audio('/notification.mp3').play();


    if (Notification.permission === 'granted') {
      new Notification('Novo desafio 🎉', {
        body: `Valendo ${challenge.amount}xp!`
      })
    }
  }

  function resetChallenge() {
    setActiveChallenge(null)
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return;
    }
    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experiencToNextLevel) {
      finalExperience = finalExperience - experiencToNextLevel;
      levelUp();
    }
    setCurrenteExperience(finalExperience);
    setActiveChallenge(null);
    setchallengesCompleted(challengesCompleted + 1);
  }
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
        completeChallenge,
        experiencToNextLevel,
        closeLevelUpModal
      }}
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}

