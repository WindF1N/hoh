import styles from './styles/Promo.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderHOH from '../components/HeaderHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import Item from '../components/Item';
import { useSocket } from '../sockets';
import { getBalance } from '../crypto';

function Promo() {

  const navigate = useNavigate();

  const { account, logout, accessToken, refreshToken } = useSocket();

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  return (
    <>
      <HeaderHOH text="Referral program" />
      <div className={styles.main}>
        <div className={styles.block}>
          <div className={styles.title}>
            <div>Your promo</div>
          </div>
          <div className={styles.text}>The user who comes at your invitation will receive <span>special clothing</span>.</div>
          <div className={styles.input}>
            <div>
              <span>Invite code</span>
              <span>gre-hvx-dwe</span>
            </div>
            <div>
              <img src={require("./images/copy-line-duotone.svg").default} alt="" />
            </div>
          </div>
          <ButtonHOH text="Share" />
          <div className={styles.textCenter}>You will receive <span>0.1% of your referral's earnings</span>.</div>
        </div>
        <div className={styles.block}>
          <div className={styles.title}>
            <div>Referrals</div>
          </div>
          <div className={styles.items}>
            <div className={styles.item}>
              <div>Name 1</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 2</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 3</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 4</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 5</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 6</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 7</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 8</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 9</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 10</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 11</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 12</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
            <div className={styles.item}>
              <div>Name 13</div>
              <div>+2 000 <img src={require("../components/images/HAMC.svg").default} alt="" /></div>
            </div>
          </div>
          <ButtonHOH text="Load more" reverse={true} />
        </div>
      </div>
    </>
  );
}

export default Promo;
