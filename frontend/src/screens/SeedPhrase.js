import styles from './styles/CryptoWallet.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ButtonHOH from '../components/ButtonHOH';
import { useSocket } from '../sockets';
import icon from './images/key-outline.svg';

function SeedPhrase() {

  const navigate = useNavigate();

  const { words, setWords, publicKey, secretKey, logout, accessToken, refreshToken } = useSocket();

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  useEffect(() => {
    if (publicKey && secretKey) {
      navigate('/account', {replace: true})
    }
  }, [publicKey, secretKey])

  useEffect(() => {
    if (words) {
      setWords(null);
    }
  }, [words])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.poster}>
          <img src={icon} alt="" />
        </div>
        <div className={styles.title}>
          <img src={icon} alt="" />
          <h1>Seed phrase</h1>
        </div>
        <div className={styles.description}>
          Get ready to write down your phrases. They will be the key to your wallet. Without them you will not be able to access your wallet.
        </div>
        <div className={styles.fixedBottom}>
          <ButtonHOH text="I'm ready" onClick={() => navigate('/seedwords', {replace: true})}/>
        </div>
      </div>
    </>
  );
}

export default SeedPhrase;
