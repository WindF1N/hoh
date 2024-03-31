import styles from './styles/Game.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import MenuBar from '../components/MenuBar';
import Header from '../components/Header';
import EnergyBar from '../components/EnergyBar';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useSocket } from '../sockets';

function Game() {

  const navigate = useNavigate();

  const { modal,
          setModal,
          logout,
          accessToken,
          refreshToken,
          energy,
          setEnergy,
          generationEnergy,
          setGenerationEneregy,
          sendMessage,
          gameResult,
          setGameResult } = useSocket();

  const [ gamePhase, setGamePhase ] = useState(null);
  const [ isFlipped, setIsFlipped ] = useState([false, false, false]);
  const [ selectedCardIndex, setSelectedCardIndex ] = useState(null);

  const [ timeLeft, setTimeLeft ] = useState('00:00');

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  const handleClick = (index) => {
    if (gamePhase === "started") {
      if (energy) {
        if (energy.value > 0) {
          setIsFlipped([true, true, true]);
          setSelectedCardIndex(index);
          setGamePhase("ended");
          setEnergy(prevEnergy => ({...prevEnergy, value: prevEnergy.value - 1}));
          sendMessage(JSON.stringify(["game", energy._id, index]));
        }
      }
    }
  };

  const handleBoost = (i) => {
    if (energy) {
      if (i === 1) {
        if (energy.minutes > 5) {
          sendMessage(JSON.stringify(["boost", i, energy._id]));
        }
      } else if (i === 2) {
        if (energy.limit < 10) {
          sendMessage(JSON.stringify(["boost", i, energy._id]));
        }
      }
    }
  }

  const restartGame = () => {
    setIsFlipped([false, false, false]);
    setSelectedCardIndex(null);
    setGamePhase("started");
    setGameResult([1, 1, 1])
  }

  const addGeneration = () => {
    if (energy) {
      sendMessage(JSON.stringify(["generation", "add", energy._id]));
    }
  }

  useEffect(() => {
    if (!gamePhase) {
      setIsFlipped([false, false, false]);
      setSelectedCardIndex(null);
    }
  }, [gamePhase])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nowUtc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const targetDate = new Date(generationEnergy.end.replace(' ', 'T'));
      const diff = targetDate - nowUtc;

      if (diff < 0) {
        setTimeLeft('00:00');
        setGenerationEneregy(null);
        setEnergy(prevEnergy => ({...prevEnergy, value: prevEnergy.value + 1}));
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

      setTimeLeft(`${formattedMinutes}:${formattedSeconds}`);
    };
    if (generationEnergy) {
      calculateTimeLeft();
      const intervalId = setInterval(calculateTimeLeft, 1000);
      return () => {
        clearInterval(intervalId)
      };
    }
  }, [generationEnergy]);

  return (
    <>
      <div className={styles.main} style={{backgroundImage: 'url("bg.png")'}}>
        <div class={gamePhase ? styles.bgVideoHidden : (generationEnergy ? styles.bgVideo : styles.bgVideoHidden)}>       
          <video preload="auto" muted playsInline autoPlay loop>
              <source src="bg-generation.mp4" type="video/mp4" />
          </video>       
        </div>
        <div class={gamePhase ? styles.bgVideo : styles.bgVideoHidden}>       
          <video preload="auto" muted playsInline autoPlay loop>
              <source src="bg-game.mp4" type="video/mp4" />
          </video>       
        </div>
        <Header />
        {!gamePhase &&
          <>
            {!generationEnergy &&
              <div className={styles.hamster}>
                <img src={require("./images/hamster.png")} alt="" />
              </div>}
            <EnergyBar />
            <div className={styles.buttons}>
              {energy?.limit > energy?.value &&
                <Button text={generationEnergy ? `${timeLeft} +1` : "СТАРТ +1"} onClick={() => !generationEnergy && addGeneration()} icon={generationEnergy ? require("../components/images/energy-active.svg").default : require("../components/images/energy.svg").default} style={{
                  color: generationEnergy ? "#9DFF12" : "#fff",
                  background: "rgba(0, 0, 0, 0.3)",
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.3)"
                }} />}
              {energy?.value > 0 &&
                <Button text="ИГРАТЬ" onClick={() => setGamePhase("started")} style={null} />}
            </div>
          </>}
        {gamePhase &&
          <>
            <div className={styles.center}>
              {energy?.value > 0 ?
                <div className={styles.whiteText}>Выберите 1 из 3 карт что бы<br/>получить награду</div>
                : <div className={styles.whiteText}>Восполните ячейки энергии,<br/>чтобы продолжить игру</div>}
              <div className={styles.cards}>
                {isFlipped.map((flipped, index) => (
                  <div className={`${styles.card} ${flipped && styles.flipped} ${selectedCardIndex === index && styles.selected}`} onClick={() => handleClick(index)}>
                    <div className={styles.cardFront}>
                      <img src={require(`./images/card-front${gameResult[index]}.png`)} alt="" />
                    </div>
                    <div className={styles.cardBack}>
                      <img src={require("./images/card-back.png")} alt="" />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.energyLimit}>
                <b>{energy?.value || 0}/{energy?.limit || 0}</b> <img src={require("../components/images/energy-active.svg").default} alt="" /> энергии осталось
              </div>
            </div>
            <div className={styles.buttons} style={{marginTop: "auto"}}>
              <Button text="НАЗАД" onClick={() => setGamePhase(null)} style={{
                color: "#fff",
                background: "rgba(0, 0, 0, 0.3)",
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.3)"
              }} />
              {(gamePhase === "ended" && energy?.value > 0) &&
                <Button text="ИГРАТЬ ЕЩЁ -1" icon={require("../components/images/energy-black.svg").default} onClick={restartGame} />}
            </div>
          </>}
        {modal === 'yt' &&
          <Modal onClose={() => setModal(null)}>
            <div className={styles.ytImage}>
              <img src={require("./images/image.png")} alt="" />
              <div>LIVE</div>
            </div>
            <div className={styles.ytJackpotSum}>
              <img src={require("../components/images/HAMC2.svg").default} alt=""/>
              <span>100 000 000</span>
            </div>
            <div className={styles.ytTitle}>
              JACKPOT
            </div>
            <div className={styles.ytDescription}>
              Увеличивайте максимально доступное количество энергии
            </div>
            <div className={styles.ytBaff}>
              +1  ячейка энергии для игры
            </div>
            <div className={styles.ytButton}>
              <Button text="Go to YouTube stream" onClick={() => alert('123')} style={{ fontWeight: "500"}} />
            </div>
          </Modal>}
        {modal === 'boosts' &&
          <Modal onClose={() => setModal(null)}>
            <div className={styles.boosts}>
              <div className={styles.boostsTitle}>
                <img src={require("./images/book.svg").default} alt="" />
                <span>Boosts</span>
              </div>
              <div className={styles.boostsList}>
                <div className={styles.boostsItem} onClick={() => setModal("boosts-1")}>
                  <div className={styles.boostsIcon}>
                    <img src={require("./images/material-symbols_speed.svg").default} alt="" />
                  </div>
                  <div className={styles.boostsInformation}>
                    <div className={styles.boostsItemTitle}>Скорость хомяка</div>
                    <div className={styles.boostsItemDescription}>-1 минута на добычу энергии</div>
                    {energy?.minutes > 5 &&
                      <div className={styles.boostsItemPrice}>
                        <img src={require("../components/images/HAMC2.svg").default} alt="" />
                        <span>{ 100 + 100 * (12 - (energy?.minutes || 12)) }</span>
                      </div>}
                  </div>
                  <div className={styles.boostsArrow}>
                    <img src={require("./images/alt-arrow-right-line-duotone.svg").default} alt="" />
                  </div>
                </div>
                <div className={styles.boostsItem} onClick={() => setModal("boosts-2")}>
                  <div className={styles.boostsIcon}>
                    <img src={require("../components/images/energy-active.svg").default} alt="" />
                  </div>
                  <div className={styles.boostsInformation}>
                    <div className={styles.boostsItemTitle}>Лимит энергии</div>
                    <div className={styles.boostsItemDescription}>+1  ячейка энергии для игры</div>
                    {energy?.limit < 10 &&
                      <div className={styles.boostsItemPrice}>
                        <img src={require("../components/images/HAMC2.svg").default} alt="" />
                        <span>{ 100 + 100 * ((energy?.limit || 3) - 3) }</span>
                      </div>}
                  </div>
                  <div className={styles.boostsArrow}>
                    <img src={require("./images/alt-arrow-right-line-duotone.svg").default} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </Modal>}
        {modal === 'boosts-1' &&
          <Modal onClose={() => setModal("boosts")}>
            <div className={styles.boostIcon}>
              <img src={require("./images/material-symbols_speed.svg").default} alt="" />
            </div>
            <div className={styles.boostTitle}>
              Скорость хомяка
            </div>
            <div className={styles.boostDescription}>
              Уменьшайте количество минут<br/>на добычу энергии
            </div>
            <div className={styles.boostBaff}>
              -1 минута на добычу энергии
            </div>
            {energy?.minutes > 5 ?
                <div className={styles.boostPriceLevel}>
                  <img src={require("../components/images/HAMC2.svg").default} alt="" />
                  <b>{ 100 + 100 * (12 - (energy?.minutes || 12)) }</b>
                  <span>/ Level {12 - (energy?.minutes || 12)}</span>
                </div>
              :
                <div className={styles.boostPriceLevel}>
                  <span>Level {12 - (energy?.minutes || 12)}</span>
                </div>}
            {energy?.minutes > 5 &&
              <div className={styles.boostButton}>
                <Button text="GET" onClick={() => handleBoost(1)} style={{ fontWeight: "500" }} />
              </div>}
          </Modal>}
        {modal === 'boosts-2' &&
          <Modal onClose={() => setModal("boosts")}>
            <div className={styles.boostIcon}>
              <img src={require("../components/images/energy-active.svg").default} alt="" />
            </div>
            <div className={styles.boostTitle}>
              Лимит энергии
            </div>
            <div className={styles.boostDescription}>
              Увеличивайте максимально доступное количество энергии
            </div>
            <div className={styles.boostBaff}>
              +1  ячейка энергии для игры
            </div>
            {energy?.limit < 10 ?
              <div className={styles.boostPriceLevel}>
                <img src={require("../components/images/HAMC2.svg").default} alt="" />
                <b>{ 100 + 100 * ((energy?.limit || 3) - 3) }</b>
                <span>/ Level {(energy?.limit || 3) - 3}</span>
              </div>
            :
              <div className={styles.boostPriceLevel}>
                <span>Level {(energy?.limit || 3) - 3}</span>
              </div>}
            {energy?.limit < 10 &&
            <div className={styles.boostButton}>
              <Button text="GET" onClick={() => handleBoost(2)} style={{ fontWeight: "500" }} />
            </div>}
          </Modal>}
        {modal === 'tasks' &&
          <Modal onClose={() => setModal(null)}>

          </Modal>}
        {modal === 'leaders' &&
          <Modal onClose={() => setModal(null)}>

          </Modal>}
        <MenuBar />
      </div>
    </>
  );
}

export default Game;
