import styles from './styles/Game.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import MenuBar from '../components/MenuBar';
import Header from '../components/Header';
import EnergyBar from '../components/EnergyBar';
import Button from '../components/Button';
import ButtonHOH from '../components/ButtonHOH';
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
          setGameResult,
          account,
          jackpot,
          boosts,
          settings,
          leaders,
          partners,
          tasks } = useSocket();

  const [ gamePhase, setGamePhase ] = useState(null);
  const [ isFlipped, setIsFlipped ] = useState([false, false, false]);
  const [ selectedCardIndex, setSelectedCardIndex ] = useState(null);
  const [ selectedBoost, setSelectedBoost ] = useState(null);
  const [ selectedPartnerId, setSelectedPartnerId ] = useState();
  const [ timeLeft, setTimeLeft ] = useState('00:00');

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      logout(navigate);
    }
  }, [accessToken, refreshToken])

  const handleClick = (index) => {
    if (gamePhase === "started") {
      if (energy?.value > 0) {
        sendMessage(JSON.stringify(["game", energy._id, index]));
        setIsFlipped([true, true, true]);
        setSelectedCardIndex(index);
        setGamePhase("ended");
        setEnergy(prevEnergy => ({...prevEnergy, value: prevEnergy.value - 1}));
      }
    }
  };

  const handleBoost = (i) => {
    if (energy && settings) {
      if (i === 1) {
        if (energy.minutes > settings["min_energy_minutes"]) {
          sendMessage(JSON.stringify(["boost", "use", energy._id, selectedBoost._id]));
        }
      } else if (i === 2) {
        if (energy.limit < settings["max_energy_limit"]) {
          sendMessage(JSON.stringify(["boost", "use", energy._id, selectedBoost._id]));
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
      const nowUtc = new Date( now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds() );
      const targetDate = new Date(generationEnergy.end_at.replace(' ', 'T'));
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
        <div className={gamePhase ? styles.bgVideoHidden : (generationEnergy ? styles.bgVideo : styles.bgVideoHidden)}>       
          <video preload="auto" muted playsInline autoPlay loop>
              <source src="bg-generation.mp4" type="video/mp4" />
          </video>       
        </div>
        <div className={gamePhase ? styles.bgVideo : styles.bgVideoHidden}>       
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
                  <div className={`${styles.card} ${flipped && styles.flipped} ${selectedCardIndex === index && styles.selected}`} onClick={() => handleClick(index)} key={index} >
                    <div className={styles.cardFront}>
                      <img src={gameResult[index].sprite} alt="" />
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
        {(modal === 'yt' && jackpot) &&
          <Modal onClose={() => setModal(null)}>
            <div className={styles.ytImage}>
              <img src={require("./images/image.png")} alt="" />
              <div>LIVE</div>
            </div>
            <div className={styles.ytJackpotSum}>
              <img src={require("../components/images/HAMC2.svg").default} alt=""/>
              <span>{jackpot.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>
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
              <Link to={jackpot.link} >
                <Button text="Go to YouTube stream" style={{ fontWeight: "500" }} />
              </Link>
            </div>
          </Modal>}
        {modal === 'boosts' &&
          <Modal onClose={() => setModal(null)}>
            <div className={styles.boosts}>
              <div className={styles.boostsTitle}>
                <img src={require("../components/images/shield-up-line-duotone.svg").default} alt="" />
                <span>Boosts</span>
              </div>
              <div className={styles.boostsList}>
                {boosts?.map((boost) => (
                  <div className={styles.boostsItem} onClick={() => {
                    setModal("boost");
                    setSelectedBoost(boost);
                  }} key={boost._id}>
                    <div className={styles.boostsIcon}>
                      {boost.name === "minutes:-1" && <img src={require("./images/material-symbols_speed.svg").default} alt="" />}
                      {boost.name === "limit:+1" && <img src={require("../components/images/energy-active.svg").default} alt="" />}
                    </div>
                    <div className={styles.boostsInformation}>
                      <div className={styles.boostsItemTitle}>
                        {boost.name === "minutes:-1" && "Скорость хомяка"}
                        {boost.name === "limit:+1" && "Лимит энергии"}
                      </div>
                      <div className={styles.boostsItemDescription}>
                        {boost.name === "minutes:-1" && "-1 минута на добычу энергии"}
                        {boost.name === "limit:+1" && "+1 ячейка энергии для игры"}
                      </div>
                      {(boost.name === "minutes:-1" && energy?.minutes > settings["min_energy_minutes"]) &&
                        <div className={styles.boostsItemPrice}>
                          <img src={require("../components/images/HAMC.svg").default} alt="" />
                          <span>{ boost.price + boost.price * (settings["max_energy_minutes"] - (energy?.minutes || settings["max_energy_minutes"])) }</span>
                        </div>}
                      {(boost.name === "limit:+1" && energy?.limit < settings["max_energy_limit"]) &&
                        <div className={styles.boostsItemPrice}>
                          <img src={require("../components/images/HAMC.svg").default} alt="" />
                          <span>{ boost.price + boost.price * ((energy?.limit || settings["min_energy_limit"]) - settings["min_energy_limit"]) }</span>
                        </div>}
                    </div>
                    <div className={styles.boostsArrow}>
                      <img src={require("./images/alt-arrow-right-line-duotone.svg").default} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>}
        {modal === 'boost' &&
          <Modal onClose={() => {
            setModal("boosts");
            setSelectedBoost(null);
          }}>
            <div className={styles.boostIcon}>
              {selectedBoost.name === "minutes:-1" && <img src={require("./images/material-symbols_speed.svg").default} alt="" />}
              {selectedBoost.name === "limit:+1" && <img src={require("../components/images/energy-active.svg").default} alt="" />}
            </div>
            <div className={styles.boostTitle}>
              {selectedBoost.name === "minutes:-1" && "Скорость хомяка"}
              {selectedBoost.name === "limit:+1" && "Лимит энергии"}
            </div>
            <div className={styles.boostDescription}>
              {selectedBoost.name === "minutes:-1" && "Уменьшайте количество минут\nна добычу энергии"}
              {selectedBoost.name === "limit:+1" && "Увеличивайте максимально доступное количество энергии"}
            </div>
            <div className={styles.boostBaff}>
              {selectedBoost.name === "minutes:-1" && "-1 минута на добычу энергии"}
              {selectedBoost.name === "limit:+1" && "+1  ячейка энергии для игры"}
            </div>
            {selectedBoost.name === "minutes:-1" && energy?.minutes > settings["min_energy_minutes"] &&
                <div className={styles.boostPriceLevel}>
                  <img src={require("../components/images/HAMC.svg").default} alt="" />
                  <b>{ selectedBoost.price + selectedBoost.price * (settings["max_energy_minutes"] - (energy?.minutes || settings["max_energy_minutes"])) }</b>
                  <span>/ Level {settings["max_energy_minutes"] - (energy?.minutes || settings["max_energy_minutes"])}</span>
                </div>}
            {selectedBoost.name === "minutes:-1" && energy?.minutes <= settings["min_energy_minutes"] &&
                <div className={styles.boostPriceLevel}>
                  <span>Level {settings["max_energy_minutes"] - (energy?.minutes || settings["max_energy_minutes"])}</span>
                </div>}
            {selectedBoost.name === "minutes:-1" && energy?.minutes > settings["min_energy_minutes"] &&
              <div className={styles.boostButton}>
                <Button text="GET" onClick={() => handleBoost(1)} style={account?.game_balance >= selectedBoost.price + selectedBoost.price * (settings["max_energy_minutes"] - (energy?.minutes || settings["max_energy_minutes"])) ? { fontWeight: "500" } : { fontWeight: "500", color: "4F4F4F", backgroundColor: "#202020", border: 0 }} />
              </div>}
            {selectedBoost.name === "limit:+1" && energy?.limit < settings["max_energy_limit"] &&
              <div className={styles.boostPriceLevel}>
                <img src={require("../components/images/HAMC.svg").default} alt="" />
                <b>{ selectedBoost.price + selectedBoost.price * ((energy?.limit || settings["min_energy_limit"]) - settings["min_energy_limit"]) }</b>
                <span>/ Level {(energy?.limit || settings["min_energy_limit"]) - settings["min_energy_limit"]}</span>
              </div>}
            {selectedBoost.name === "limit:+1" && energy?.limit >= settings["max_energy_limit"] &&
              <div className={styles.boostPriceLevel}>
                <span>Level {(energy?.limit || settings["min_energy_limit"]) - settings["min_energy_limit"]}</span>
              </div>}
            {selectedBoost.name === "limit:+1" && energy?.limit < settings["max_energy_limit"] &&
            <div className={styles.boostButton}>
              <Button text="GET" onClick={() => handleBoost(2)} style={account?.game_balance >= selectedBoost.price + selectedBoost.price * ((energy?.limit || settings["min_energy_limit"]) - settings["min_energy_limit"]) ? { fontWeight: "500" } : { fontWeight: "500", color: "4F4F4F", backgroundColor: "#202020", border: 0 }} />
            </div>}
          </Modal>}
        {modal === 'tasks' &&
          <Modal onClose={() => setModal(null)}>
            <div className={styles.boosts}>
              <div className={styles.boostsTitle}>
                <img src={require("./images/book.svg").default} alt="" />
                <span>Tasks</span>
              </div>
              <div className={styles.boostsList}>
                {partners?.map((partner) => (
                  <div className={styles.boostsItem} onClick={() => {
                    setSelectedPartnerId(partner._id);
                    setModal("task");
                  }}>
                    <div className={styles.tasksIcon}>
                      <img src={partner.icon} alt="" />
                    </div>
                    <div className={styles.boostsInformation}>
                      <div className={styles.boostsItemTitle}>{partner.name}</div>
                      <div className={styles.boostsItemPrice}>
                        <span>+{partner.price}</span>
                        <img src={require("../components/images/energy-active.svg").default} alt="" />
                      </div>
                    </div>
                    <div className={styles.boostsArrow}>
                      <img src={require("./images/alt-arrow-right-line-duotone.svg").default} alt="" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>}
         {modal === 'task' &&
          <Modal onClose={() => setModal("tasks")}>
            <div className={styles.boostIcon}>
              <img src={require("../components/images/HAMC.svg").default} alt="" />
            </div>
            <div className={styles.boostTitle}>
              {partners.filter((partner) => partner._id === selectedPartnerId)[0].name}
            </div>
            <div className={styles.taskDescription}>
              {partners.filter((partner) => partner._id === selectedPartnerId)[0].description}
            </div>
            <div className={styles.boostPriceLevel}>
              <b>+{partners.filter((partner) => partner._id === selectedPartnerId)[0].price}</b>
              <img src={require("../components/images/energy-active.svg").default} alt="" />
            </div>
            <div className={styles.taskList}>
              {tasks.filter((task) => task.partner_id === selectedPartnerId).map((task) => (
                <Link to={task.link}>
                  <div className={styles.taskItem} key={task._id}>
                    <div>
                      <div className={styles.taskIcon}>
                        <img src={require("./images/alt-arrow-right-line-duotone.svg").default} alt="" />
                      </div>
                      <div className={styles.taskInformation}>
                        <div className={styles.taskItemTitle}>{task.name}</div>
                        <div className={styles.taskItemDescription}>{task.description}</div>
                      </div>
                    </div>
                    {task.upload &&
                      <ButtonHOH text="Upload" reverse={true} />}
                  </div>
                </Link>
              ))}
            </div>
          </Modal>}
        {modal === 'leaders' &&
          <Modal onClose={() => setModal(null)}>
            <div className={styles.leaders}>
              <div className={styles.leadersTitle}>
                <img src={require("../components/images/cup-star-line-duotone.svg").default} alt="" />
                <span>Leaderboard</span>
              </div>
              <div className={styles.leadersList}>
                {leaders?.map((leader) => (
                <div className={styles.leader} key={leader._id}>
                  <div className={styles.leaderUsername}>{leader.username}</div>
                  <div className={styles.leaderBalance}>
                    <span>{leader.game_balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>
                    <img src={require("../components/images/HAMC.svg").default} alt="" />
                  </div>
                </div>
                ))}
              </div>
            </div>
          </Modal>}
        <MenuBar />
      </div>
    </>
  );
}

export default Game;
