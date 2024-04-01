import styles from './styles/MenuBar.module.css';
import { useSocket } from '../sockets';

function MenuBar() {

  const { setModal } = useSocket();

  return (
    <div className={styles.menubar}>
      <div onClick={() => setModal("tasks")}>
        <img src={require("../screens/images/book.svg").default} alt="" />
        <span>Задания</span>
      </div>
      <div onClick={() => setModal("boosts")}>
        <img src={require("./images/shield-up-line-duotone.svg").default} alt="" />
        <span>Буст</span>
      </div>
      <div onClick={() => setModal("leaders")}>
        <img src={require("./images/cup-star-line-duotone.svg").default} alt="" />
        <span>Лидеры</span>
      </div>
    </div>
  );
}

export default MenuBar;
