import styles from './styles/ButtonHOH.module.css';

function ButtonHOH({text, type, style, reverse, onClick, blocked}) {
  if (!blocked) {
    return (
      <button type={type} className={!reverse ? styles.button : styles.buttonReverse} style={style} onClick={type !== "submit" ? onClick : null}>{text}</button>
    );
  } else {
    return (
      <button className={styles.buttonReverse} style={{...style, color: "#4F4F4F", border: 0}}>{text}</button>
    );
  }
}

export default ButtonHOH;
