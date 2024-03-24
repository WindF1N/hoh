import styles from './styles/Button.module.css';

function Button({ text, style, onClick, icon }) {
  return (
    <div className={styles.button} style={style} onClick={onClick}>
      {text} {icon && <img src={icon} alt="" />}
    </div>
  );
}

export default Button;
