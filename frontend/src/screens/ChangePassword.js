import styles from './styles/ChangeUsername.module.css';
import InputHOH from '../components/InputHOH';
import ButtonHOH from '../components/ButtonHOH';
import HeaderHOH from '../components/HeaderHOH';
import Question from '../components/Question';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSocket } from '../sockets';

const validationSchema = Yup.object().shape({
  current_password: Yup.string()
    .min(8, 'Пароль должен быть не короче 8 символов')
    .max(100, 'Имя пользователя содержит больше 100 символов'),
  new_password: Yup.string()
    .min(8, 'Пароль должен быть не короче 8 символов')
    .max(100, 'Имя пользователя содержит больше 100 символов'),
  new_password_repeat: Yup.string()
    .min(8, 'Пароль должен быть не короче 8 символов')
    .max(100, 'Имя пользователя содержит больше 100 символов')
});

function ChangePassword() {

  const navigate = useNavigate();

  const { socket, login, loading, setLoading, error, account } = useSocket();
  const [ currentPassword, setCurrentPassword ] = useState(null);

  const handleSubmit = async (values) => {
    if (!currentPassword) {
      setCurrentPassword(values.current_password);
    } else {

    }
  }

  return (
    <>
      <HeaderHOH text="Change Password" />
      <div className={styles.main}>
        {!currentPassword ?
          <h1>Current Password</h1>
        : 
          <h1>New Password</h1>}
        <Formik
          initialValues={{ current_password: '', new_password: '', new_password_repeat: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form>
              {!currentPassword ?
                <>
                  <InputHOH label="Current password" name="current_password" type="password" errors={errors} style={{marginBottom: 8}}/>
                  <ButtonHOH text="Continue" type="submit" style={{marginTop: 8}} blocked={!values.current_password.length > 0 || errors.current_password || loading}/>
                </>
              : 
                <>
                  <InputHOH label="New password" name="new_password" type="password" errors={errors} style={{marginBottom: 8}}/>
                  <InputHOH label="Repeat new password" name="new_password_repeat" type="password" errors={errors} style={{marginBottom: 8}}/>
                  <ButtonHOH text="Change password" type="submit" style={{marginTop: 8}} blocked={!values.new_password.length > 0 || !values.new_password_repeat.length > 0 || errors.new_password || errors.new_password_repeat || loading}/>
                </>}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ChangePassword;
