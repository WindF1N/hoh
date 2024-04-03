import styles from './styles/Auth.module.css';
import InputHOH from '../components/InputHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSocket } from '../sockets';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Некорректный email')
    .max(100, 'Имя пользователя содержит больше 100 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(8, 'Пароль должен быть не короче 8 символов')
    .required('Обязательное поле'),
});

function SignIn() {

  const navigate = useNavigate();

  const { socket, login, loading, setLoading, error } = useSocket();

  useEffect(() => {
    if (socket) {
      navigate('/crypto', {replace: true})
    }
  }, [socket])

  const handleSubmit = async (values) => {
    setLoading(true);
    await login(values, navigate);
  }

  return (
    <div className={styles.main}>
      <div className={styles.bgImage}>
        <div className={styles.auth}>
          <div className={styles.header}>
            <img src="/logo.svg" alt="log" />
          </div>
          <div className={styles.form}>
            <h1>Welcome! Sign in.</h1>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values)
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <InputHOH label="E-mail" name="email" type="text" errors={errors} style={{marginBottom: 8}}/>
                  <InputHOH label="Password" name="password" type="password" errors={errors} style={{marginBottom: 8}}/>

                  <ButtonHOH text="Log in" type="submit" style={{marginTop: 8}} blocked={loading}/>
                </Form>
              )}
            </Formik>
            <Question text="Don't have an account yet?"/>
            <ButtonHOH text="Sign Up" reverse={true} onClick={() => navigate('/signup', {replace: true})} blocked={loading}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
