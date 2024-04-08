import styles from './styles/Header.module.css';
import { useNavigate } from "react-router-dom";
import { useSocket } from '../sockets';

function Header() {

  const navigate = useNavigate();

  const { setModal, account, jackpot } = useSocket();

  return (
    <div className={styles.header}>
      <div className={styles.user}>
        <div className={styles.avatar} onClick={() => navigate("/account")}>
          <img src={require("./images/avatar.png")} alt="" />
        </div>
        <div className={styles.wallet}>
          <div>
            <img src={require("./images/HAMC.svg").default} alt="" />
            <span>{account?.game_balance || 0 }</span>
          </div>
          <div>
            <img src={require("./images/HAMC2.svg").default} alt="" />
            <span>{account?.balance || 0 }</span>
          </div>
          <div>
            <img src={require("./images/solana.svg").default} alt="" />
          </div>
        </div>
      </div>
      {jackpot &&
      <div className={styles.jackpot} onClick={() => setModal("yt")}>
        <div>
          <div>
            <img src={require("./images/HAMC2.svg").default} alt="" />
            <span>{jackpot.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>
          </div>
          <div>
            JACKPOT
          </div>
        </div>
        <div>
          <img src={require("./images/image.png")} alt="" />
          <div>LIVE</div>
        </div>
      </div>}
    </div>
  );
}

export default Header;
