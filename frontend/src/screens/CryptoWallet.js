import { useState, useEffect } from 'react';
import styles from './styles/CryptoWallet.module.css';
import { useNavigate } from 'react-router-dom';
import ButtonHOH from '../components/ButtonHOH';
import { useSocket } from '../sockets';
import icon from './images/wallet-money-outline.svg';

function CryptoWallet() {

  const navigate = useNavigate();

  const { publicKey, secretKey, accessToken, refreshToken, logout } = useSocket();

  useEffect(() => {
    if (publicKey && secretKey) {
      navigate('/account', {replace: true})
    }
  }, [publicKey, secretKey])

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.poster}>
          <img src={icon} alt="" />
        </div>
        <div className={styles.title}>
          <img src={icon} alt="" />
          <h1>Crypto-wallet</h1>
        </div>
        {((!publicKey && !secretKey) || (!publicKey && secretKey)) &&
          <div className={styles.description}>
            In order to make money playing poker you need to have your own crypto wallet.
          </div>}
        {(publicKey && !secretKey) &&
          <div className={styles.description}>
            You need to gain access to your wallet {publicKey}. You can enter seed phrases to restore your wallet
          </div>}
        {((!publicKey && !secretKey) || (!publicKey && secretKey)) &&
        <div>
          <ButtonHOH text="Create a new wallet" reverse={true} style={{marginTop: 24}} onClick={() => navigate('/seedphrase')}/>
          <ButtonHOH text="Import your wallet" onClick={() => navigate('/enterseedphrase')} style={(!publicKey && !secretKey) ? {marginTop: 16} : {marginTop: 24}}/>
        </div>}
        {(publicKey && !secretKey) &&
          <ButtonHOH text="Recover your wallet" style={{marginTop: 24}} onClick={() => navigate('/enterseedphrase')}/>}
        <div className={styles.fixedBottom}>
          <ButtonHOH text="Skip" reverse={true} style={{backgroundColor: "#111113"}} onClick={() => navigate('/game')}/>
        </div>
      </div>
    </>
  );
}

export default CryptoWallet;
