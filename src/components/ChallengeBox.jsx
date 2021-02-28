import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import { CountdowContext } from '../contexts/CountdowContext';
import styles from '../styles/components/ChallangeBox.module.css';

export function ChallangeBox() {
  const { activeChallenge, resetChallenge, completeChallenge } = useContext(ChallengesContext);
  const { resetCountDown } = useContext(CountdowContext);
  function handleChallengeSucceeded() {
    completeChallenge();
    resetCountDown();
  }

  function handleChallengeFailed() {
    resetChallenge();
    resetCountDown();
  }

  return (
    <div className={styles.challangeBoxContainer}>

      {activeChallenge ? (
        <div className={styles.challangeActive}>
          <header>Ganhe {activeChallenge.amount}</header>

          <main>
            <img src={`icons/${activeChallenge.type}.svg `} />
            <strong>Novo desafio</strong>
            <p>{activeChallenge.description}</p>
          </main>

          <footer>
            <button
              type="buttom"
              onClick={handleChallengeFailed}
              className={styles.challengeFailedButton}
            >Falhei
            </button>
            <button
              type="buttom"
              onClick={handleChallengeSucceeded}
              className={styles.challangeSucceedButton}
            >Completei
            </button>
          </footer>

        </div>
      ) : (
          <div className={styles.challangeNotActive}>
            <strong> Finalize um ciclo para receber um desafio</strong>

            <p>
              <img src="icons/level-up.svg" alt="level Up" />
          Avance de level concluindo os desafios.
        </p>

          </div>
        )}

    </div>
  )
}