import styles from './styles/Statistics.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import Item from '../components/Item';
import { useSocket } from '../sockets';
import { getBalance } from '../crypto';

function Statistics() {

  const navigate = useNavigate();

  const { account, logout, accessToken, refreshToken } = useSocket();

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  return (
    <>
      <HeaderHOH text="Statistics" />
      <div className={styles.main}>
        <div className={styles.block}>
          <div className={styles.title}>
            <div>Games</div>
            <div>5200</div>
          </div>
          <div className={styles.items}>
            <div className={styles.item}>
              <div>Games</div>
              <div>5 200</div>
            </div>
            <div className={styles.item}>
              <div>Wins</div>
              <div>4 056 (78,5%)</div>
            </div>
            <div className={styles.item}>
              <div>Win $HOH</div>
              <div>388 (4,2%)</div>
            </div>
            <div className={styles.item}>
              <div>Win $HAMC</div>
              <div>2 899 (52,4%)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Statistics;
