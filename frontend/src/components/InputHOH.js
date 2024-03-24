import styles from './styles/InputHOH.module.css';
import { Field, ErrorMessage } from 'formik';
import { useState, useRef } from 'react';

import eyeClosed from './images/eye_closed.svg';
import eyeOpened from './images/eye_opened.svg';

function InputHOH({label, name, type, errors, style}) {

  const inputRef = useRef(null);

  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(false);
  const [passwordShowed, setPasswordShowed] = useState(false);

  const handleBlur = (e) => {
    if (e.target.value === '' || e.target.value === null) {
      setFocused(false);
    };
    setActive(false);
  }

  const handleFocus = (e) => {
    setFocused(true);
    setActive(true);
  }

  const handleClick = (e) => {
    e.stopPropagation();
    inputRef.current.focus();
  }

  return (
    <div className={`${name}` in errors ? `${styles.input} ${styles.inputError}` : active ? `${styles.input} ${styles.inputFocused}` : styles.input}
         style={style}
         onClick={handleClick}
    >

      <label htmlFor={name} className={!focused ? styles.off : null}>{label}</label>

      <Field name={name}>
        {({ field }) => (
          <div>
            <input
              {...field}
              type={passwordShowed ? "text" : type}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef}
            />
          </div>
          )}
      </Field>

      {type === 'password' &&
      <div className={styles.showPassword} onClick={() => setPasswordShowed(!passwordShowed)}>
        <img src={passwordShowed ? eyeOpened : eyeClosed} alt="" />
      </div>}

    </div>
  );
}

export default InputHOH;
