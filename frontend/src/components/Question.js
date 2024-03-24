import styles from './styles/Question.module.css';

function Question({text}) {
  return (
    <div className={styles.question}>
      <div><div></div></div>
      <div>{text}</div>
      <div><div></div></div>
    </div>
  );
}

export default Question;
