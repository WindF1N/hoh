import styles from './styles/Verify.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import { useSocket } from '../sockets';

function Verify() {

  const navigate = useNavigate();

  const { verifyCodeId, verifyType, verify, resendCode, loading, setLoading, error, logout, accessToken, refreshToken } = useSocket();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timoutSendAgain, setTimeoutSendAgain] = useState(60);

  useEffect(() => {
    if (!accessToken && !refreshToken && verifyType !== "email") {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  const handleChange = (value, index) => {
    // Если пользователь ввёл значение, перемещаем фокус на следующий блок
    const validDigits = /^[0-9]$/;
    var newCode = [...code];
    if (value) {
      if (validDigits.test(value[value.length - 1]) && value.length <= 2) {
        newCode[index] = value[value.length - 1];
        setCode(newCode);
        if (newCode[index] != code[index]) {
          const nextInput = document.getElementById(`input-${index + 1}`);
          if (nextInput) {
            nextInput.focus();
          }
        }
      } else if (value.length > 2) {
        document.getElementById(`input-${index}`).blur();
        newCode = ['', '', '', '', '', '']
        newCode.forEach((c, i) => {
          if (validDigits.test(value[i])) {
            newCode[i] = value[i];
          }
        })
        setCode(newCode);
      } else {
        newCode[index] = '';
        setCode(newCode);
      }
    } else {
      newCode[index] = '';
      setCode(newCode);

      const prevInput = document.getElementById(`input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await verify({code: Number(code.join('')), verify_type: verifyType, code_id: verifyCodeId}, navigate);
  }

  const sendCodeAgain = async () => {
    setTimeoutSendAgain(60);
    await resendCode({code_id: verifyCodeId})
  }

  useEffect(() => {
    if (timoutSendAgain > 0) {
      setTimeout(() => {
        setTimeoutSendAgain(timoutSendAgain - 1);
      }, 1000)
    }
  }, [timoutSendAgain])

  useEffect(() => {
    if (!verifyCodeId) {
      navigate('/', {replace: true})
    }
  }, [verifyType])

  return (
    <>
      {verifyType === "email" &&
        <HeaderHOH text="Email verification"/>}
      {verifyType === "create_wallet" &&
        <HeaderHOH text="Wallet Creation"/>}
      {verifyType === "import_wallet" &&
        <HeaderHOH text="Wallet Importation"/>}
      <div className={styles.main}>
        <h1>Verification</h1>
        <div className={styles.digits}>
          {code.map((digit, index) => (
            <input type="text"
                   key={index}
                   value={digit}
                   onChange={(e) => handleChange(e.target.value.toString(), index)}
                   onKeyUp={(e) => {
                     if (!e.target.value && e.key === "Backspace") {
                       const prevInput = document.getElementById(`input-${index - 1}`);
                       if (prevInput) {
                         prevInput.focus();
                       }
                     }
                   }}
                   id={`input-${index}`}
                   inputMode='numeric'
            />
          ))}
        </div>
        <div className={styles.text}>
          We have sent a <span style={{color: "var(--main-color)"}}>six-digit verification code</span>, please check your mailbox
        </div>
        {verifyType === "email" &&
          <ButtonHOH text="Continue" style={{marginTop: 100}} onClick={handleSubmit} blocked={loading}/>}
        {verifyType === "create_wallet" &&
          <ButtonHOH text="Create" style={{marginTop: 100}} onClick={handleSubmit} blocked={loading}/>}
        {verifyType === "import_wallet" &&
          <ButtonHOH text="Import" style={{marginTop: 100}} onClick={handleSubmit} blocked={loading}/>}
        <Question text="Didn’t get the code?"/>
        {timoutSendAgain > 0 ?
          <ButtonHOH text={`Send code again (${timoutSendAgain})`} blocked={true}/>
          : <ButtonHOH text={`Send code again`} reverse={true} onClick={sendCodeAgain}/>}
      </div>
    </>
  );
}

export default Verify;
