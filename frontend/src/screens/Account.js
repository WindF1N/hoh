import styles from './styles/Account.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import Item from '../components/Item';
import { useSocket } from '../sockets';
import { getBalance } from '../crypto';

function Account() {

  const navigate = useNavigate();

  const { account, logout, accessToken, refreshToken } = useSocket();

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  return (
    <>
      <HeaderHOH text="Settings" />
      <div className={styles.main}>
        <div className={styles.user}>
          <div className={styles.data}>
            <div className={styles.avatar}>
              <img src={require("../components/images/avatar.png")} alt="" />
            </div>
            <div>
              <div className={styles.username}>{account?.username}</div>
              <div className={styles.stats}>
                <div>5 200 games</div>
              </div>
            </div>
          </div>
          <ButtonHOH text="Personal data and security" reverse={true} onClick={() => navigate("/settings")} />
        </div>
        <div className={styles.block}>
          <Item label="Statistics" icon={require("./images/medal-ribbons-star-line-duotone.svg").default} onClick={() => navigate('/account/statistics')} />
          <Item label="Your games" icon={require("./images/history-line-duotone.svg").default} onClick={() => navigate('/account/games')} />
          <Item label="Referral program" icon={require("./images/star-shine-line-duotone.svg").default} onClick={() => navigate('/account/promo')} />
        </div>
        <div className={styles.block}>
          <Item label="Language" icon={require("./images/global-line-duotone.svg").default} />
        </div>
      </div>
    </>
  );
}

export default Account;
