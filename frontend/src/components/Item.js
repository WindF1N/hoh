import styles from './styles/Item.module.css';

function Item({ label, icon, value, style, onClick }) {
  return (
    <div className={styles.item} style={style} onClick={onClick}>
      <div className={styles.left}>
        <img src={icon} alt="" />
        <span>{label}</span>
      </div>
      <div className={styles.right}>
        <span>{value}</span>
        <img src={require("./images/arrow-right-line-duotone.svg").default} alt="" />
      </div>
    </div>
  );
}

export default Item;
