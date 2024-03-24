import styles from './styles/Account.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import { useSocket } from '../sockets';
import { getBalance } from '../crypto';

function Account() {

  const navigate = useNavigate();

  const { publicKey, secretKey, account, logout, accessToken, refreshToken } = useSocket();

  const [ balance, setBalance ] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      if (!balance && secretKey) {
        const b = await getBalance(secretKey);
        if (isMounted) {
          setBalance(b);
        }
      }
    };

    fetchBalance();

    // Очистка: вызывается при размонтировании компонента
    return () => {
      isMounted = false;
    };
  }, [balance, publicKey])

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  return (
    <>
      <div className={styles.main}>
        <h1>Your Account</h1>
        <div className={styles.text}>
          {account?.username}
        </div>
        <div className={styles.text}>
          {account?.email}
        </div>
        <div className={styles.text}>
          {account?.email_verified && "Email verified"}
        </div>
        <div className={styles.text}>
          {account?.invite_code}
        </div>
        <div className={styles.text}>
          {account?.wallet}
        </div>
        {balance >= 0 &&
          <div className={styles.text}>
            {balance} SOL
          </div>}
        <div className={styles.text}>
          {account?.wallet_verified ? ( secretKey ? "Wallet verified" : "Need recover Wallet") : "Need add Wallet"}
        </div>
        {((!publicKey && !secretKey) || (publicKey && !secretKey)) &&
        <ButtonHOH text={(account?.wallet_verified && !secretKey) ? "Recover wallet" : "Add Wallet" } reverse={true} style={{marginTop: 16}} onClick={() => navigate('/crypto', {replace: true})}/>}
        <div className={styles.fixedBottom}>
          <ButtonHOH text="Logout" reverse={true} onClick={() => logout(navigate)}/>
        </div>
      </div>
    </>
  );
}

export default Account;
