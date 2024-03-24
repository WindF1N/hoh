import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import styles from './styles/EnterSeedPhrase.module.css';
import { useSocket } from '../sockets';
import { createAccount } from '../crypto';

function EnterSeedPhrase() {

  const navigate = useNavigate();

  const { sendMessage, message, setMessage, setVerifyType, setVerifyCodeId, publicKey, setPublicKey, secretKey, setSecretKey, loading, setLoading, logout, accessToken, refreshToken } = useSocket();

  const [ mnemonic, setMnemonic ] = useState(null);
  const [ canContinue, setCanContinue ] = useState(false);
  const [ wallet, setWallet ] = useState(null);

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  const handleChange = (e) => {
    if (e.target.value !== '' && e.target.value) {
      setMnemonic(e.target.value);
      var acc = createAccount(e.target.value);
      setWallet(acc);
      if (publicKey) {
        if (publicKey === acc.publicKey) {
          setCanContinue(true);
        } else {
          setCanContinue(false);
        }
      } else {
        setCanContinue(true);
      }
    } else {
      setCanContinue(false);
    }
  }

  useEffect(() => {
    if (secretKey && publicKey) {
      navigate('/account', {replace: true})
    }
  }, [secretKey, publicKey])

  const importWallet = () => {
    if (publicKey) {
      setSecretKey(wallet.secretKey);
      localStorage.setItem('secretKey', wallet.secretKey)
    } else {
      setLoading(true);
      setPublicKey(null);
      setSecretKey(wallet.secretKey);
      sendMessage(JSON.stringify(["user", "add_wallet", wallet.publicKey, "import_wallet"]));
    }
  }

  useEffect(() => {
    if (message) {
      if (message[0] === 'user') {
        if (message[1] === 'add_wallet') {
          setLoading(false);
          setVerifyCodeId(message[2]["code_id"]);
          setVerifyType(message[2]["verify_type"]);
          navigate(message[2]["follow"]["link"],
                   { replace: message[2]["follow"]["replace"]});
        };
      }
      setMessage(null);
    };
  }, [message]);

  return (
    <>
      <HeaderHOH text={"Import Wallet"} />
      <div className={styles.main}>
        <h1>Seed Phrase</h1>
        {publicKey &&
        <div className={styles.text}>Enter the seed you saved when creating your wallet to restore it.</div>}
        <div className={styles.phrase}>
          <textarea rows={8} placeholder="Enter the Seed Phrase word and separate with space" onChange={handleChange}>
            { mnemonic }
          </textarea>
        </div>
        <div className={styles.fixedBottom}>
          <ButtonHOH text={publicKey ? "Recover" : "Continue"} blocked={!loading ? !canContinue : loading} onClick={importWallet}/>
        </div>
      </div>
    </>
  );
}

export default EnterSeedPhrase;
