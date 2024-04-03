import styles from './styles/Settings.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import Item from '../components/Item';
import { useSocket } from '../sockets';
import { getBalance } from '../crypto';

function Settings() {

  const navigate = useNavigate();

  const { account, logout, accessToken, refreshToken } = useSocket();

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  return (
    <>
      <HeaderHOH text="Personal data and security" />
      <div className={styles.main}>
        <div className={styles.userAvatar}>
          <div className={styles.avatar}>
            <img src={require("../components/images/avatar.png")} alt="" />
          </div>
          <div>
            <span>Change profile picture</span>
            <img src={require("./images/pen-line-duotone.svg").default} alt="" />
          </div>
        </div>
        <div className={styles.block}>
          <Item label="Username" value={account?.username} icon={require("./images/user-id-line-duotone.svg").default} onClick={() => navigate('/change/username')} />
          <Item label="E-mail" value={account?.email} icon={require("./images/letter-line-duotone.svg").default} onClick={() => navigate('/change/email')} />
        </div>
        <div className={styles.block}>
          <Item label="Password" icon={require("./images/key-square-2-line-duotone.svg").default} onClick={() => navigate('/change/password')} />
        </div>
      </div>
    </>
  );
}

export default Settings;
