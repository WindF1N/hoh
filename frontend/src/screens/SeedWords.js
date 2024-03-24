import styles from './styles/SeedWords.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import { generateMnemonic } from 'bip39';
import { useSocket } from '../sockets';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function SeedWords() {

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
    if (!words) {
      setWords(generateMnemonic().split(" "));
    }
  }, [words])

  return (
    <>
      <HeaderHOH text="Wallet Creation"/>
      <div className={styles.main}>
        <h1>Your New Wallet</h1>
        <div className={styles.text}>
          Don't risk losing your funds. Protect your Wallet by saving your Seed Phrase in a place you trust.
        </div>
        <div className={styles.words}>
          {words?.map((word, index) => (
            <div><span>{index + 1}. </span>{word}</div>
          ))}
        </div>
        <CopyToClipboard text={words?.join(" ")}
          onCopy={() => alert("Copied")}>
          <ButtonHOH text="Copy to clipboard" style={{backgroundColor: "#111113", padding: "10px 24px", fontSize: "var(--font16px)", marginTop: 16}} reverse={true}/>
        </CopyToClipboard>

        <div className={styles.fixedBottom}>
          <ButtonHOH text="I have written down" onClick={() => navigate('/repeatwords', {replace: true})}/>
        </div>
      </div>
    </>
  );
}

export default SeedWords;
