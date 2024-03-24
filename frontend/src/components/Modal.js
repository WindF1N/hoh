import React from 'react';
import styles from './styles/Modal.module.css';

const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modal}>
        <div className={styles.closeModal} onClick={onClose}>
          <img src={require("./images/close-circle-bold-duotone.svg").default} alt="" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
