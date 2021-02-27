import React, { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';

import styles from '../styles/components/Profile.module.css';

const Profile: React.FC = () => {
  const { level } = useContext(ChallengesContext);

  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/lucfersan.png" alt="Lucas Fernandes" />

      <div>
        <strong>Lucas Fernandes</strong>
        <p>
          <img src="icons/level.svg" alt="Level Image" />
          Level <strong>{level}</strong>
        </p>
      </div>
    </div>
  );
};

export default Profile;
