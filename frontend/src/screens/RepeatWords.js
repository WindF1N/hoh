import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import styles from './styles/RepeatWords.module.css';
import { useSocket } from '../sockets';
import { createAccount } from '../crypto';

function RepeatWords() {
  const navigate = useNavigate();
  const { words, setWords, sendMessage, message, setMessage, setVerifyType, setVerifyCodeId, publicKey, setPublicKey, secretKey, setSecretKey, loading, setLoading, logout, accessToken, refreshToken } = useSocket();
  const [ words_, setWords_ ] = useState([]);
  const [ selectedWords, setSelectedWords ] = useState([]);

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  const handleWordClick = (word, wordIndex, fromList, toList, setFromList, setToList) => {
    setFromList(fromList.filter((w, index) => wordIndex !== index));
    setToList(prevWords => [...prevWords, word]);
  };

  const areListsEqual = (list1, list2) => {
    // Проверяем, имеют ли оба списка одинаковую длину
    if (list1.length !== list2.length) {
      return false;
    }
    // Сравниваем элементы списков
    for (var i = 0; i < list1.length; i++) {
      if (list1[i] !== list2[i]) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    if (words) {
      setWords_([...words.filter((word) => !selectedWords.includes(word))].sort(function() {
        return Math.random() - 0.5;
      }));
    } else {
      navigate('/crypto', {replace: true})
    }
  }, [words])

  const createWallet = () => {
    setLoading(true);
    const data = createAccount(words.join(" "));
    sendMessage(JSON.stringify(["user", "add_wallet", data.publicKey, "create_wallet"]));
    setSecretKey(data.secretKey);
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
      <HeaderHOH text="Wallet Creation" />
      <div className={styles.main}>
        <h1>Repeat the word order</h1>
        <div className={styles.text}>
          Please choose Seed Phrase in order and make sure your Seed Phrase was correct written, once forgotten, it cannot be recovered.
        </div>
        <div className={styles.repeat}>
          <div className={styles.selectedWords}>
            {selectedWords.map((word, index) => (
              <div key={index} onClick={() => handleWordClick(word, index, selectedWords, words_, setSelectedWords, setWords_)}>
                {word}
              </div>
            ))}
          </div>
          <div className={styles.words}>
            {words_.map((word, index) => (
              <div key={index} onClick={() => handleWordClick(word, index, words_, selectedWords, setWords_, setSelectedWords)}>
                {word}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.fixedBottom}>
          <ButtonHOH text="Continue" onClick={createWallet} blocked={!loading ? !areListsEqual(selectedWords, words ? words : []) : loading}/>
        </div>
      </div>
    </>
  );
}

export default RepeatWords;
