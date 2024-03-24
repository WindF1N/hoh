import styles from './styles/EnergyBar.module.css';
import { useSocket } from '../sockets';

function EnergyBar() {
  const { energy } = useSocket();

  // Создаем массив из элементов, равных limit
  const energyLimitArray = Array.from({ length: energy?.limit }, (_, index) => index);

  return (
    <div className={styles.energies}>
      {energyLimitArray.map((_, index) => (
        <div key={index} className={index < energy.value ? styles.energyActive : styles.energy}>
          <img src={index < energy.value ? require("./images/energy-active.svg").default : require("./images/energy.svg").default} alt="" />
        </div>
      ))}
    </div>
  );
}

export default EnergyBar;
