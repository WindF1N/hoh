import styles from './styles/Games.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import Item from '../components/Item';
import { useSocket } from '../sockets';
import { getBalance } from '../crypto';

function Games() {

  const navigate = useNavigate();

  const { account, logout, accessToken, refreshToken } = useSocket();

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  return (
    <>
      <HeaderHOH text="Your Games" />
      <div className={styles.main}>
        <div className={styles.block}>
          <div className={styles.title}>
            <div>History</div>
          </div>
          <div className={styles.history}>
            <div className={styles.itemsTitle}>Today, <span>4 games</span></div>
            <div className={styles.items}>
              <div className={styles.item}>
                <div>+10 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
                <div>01:55</div>
              </div>
              <div className={styles.item}>
                <div>+400 <img src={require("../components/images/HAMC2.svg").default} alt="" /></div>
                <div>08:33</div>
              </div>
              <div className={styles.item}>
                <div>+10 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
                <div>12:37</div>
              </div>
              <div className={styles.item}>
                <div>+400 <img src={require("../components/images/HAMC2.svg").default} alt="" /></div>
                <div>17:59</div>
              </div>
            </div>
          </div>
          <div className={styles.history}>
            <div className={styles.itemsTitle}>Yesterday, <span>5 games</span></div>
            <div className={styles.items}>
              <div className={styles.item}>
                <div>+10 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
                <div>01:55</div>
              </div>
              <div className={styles.item}>
                <div>+400 <img src={require("../components/images/HAMC2.svg").default} alt="" /></div>
                <div>08:33</div>
              </div>
              <div className={styles.item}>
                <div>+10 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
                <div>12:37</div>
              </div>
              <div className={styles.item}>
                <div>+400 <img src={require("../components/images/HAMC2.svg").default} alt="" /></div>
                <div>17:59</div>
              </div>
              <div className={styles.item}>
                <div>+600 <img src={require("../components/images/HAMC2.svg").default} alt="" /></div>
                <div>23:59</div>
              </div>
            </div>
          </div>
          <ButtonHOH text="Load more" reverse={true} />
        </div>
      </div>
    </>
  );
}

export default Games;
