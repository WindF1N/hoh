import styles from './styles/HeaderHOH.module.css';
import { useNavigate } from 'react-router-dom';
import arrow from './images/arrow.svg';

function HeaderHOH({text}) {

  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div onClick={() => navigate(-1, {replace: true})}><img src={arrow} alt=""/></div>
      <div>{text}</div>
      <div></div>
    </div>
  );
}

export default HeaderHOH;
