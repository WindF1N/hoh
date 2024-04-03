import { useEffect, useState } from 'react';
import styles from './styles/Auth.module.css';
import InputHOH from '../components/InputHOH';
import ButtonHOH from '../components/ButtonHOH';
import Question from '../components/Question';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../sockets';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Некорректный email')
    .max(100, 'Имя пользователя содержит больше 100 символов')
    .required('Обязательное поле'),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9._]*$/, 'Имя пользователя может содержать только латиницу, нижние пробелы и точки')
    .max(30, 'Имя пользователя содержит больше 30 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(8, 'Пароль должен быть не короче 8 символов')
    .required('Обязательное поле'),
});

function SignUp() {

  const navigate = useNavigate();

  const { socket, signup, loading, setLoading, error } = useSocket();

  const handleSubmit = async (values) => {
    setLoading(true);
    await signup(values, navigate);
  }

  useEffect(() => {
    if (socket) {
      navigate('/crypto', {replace: true})
    }
  }, [socket])

  return (
    <div className={styles.main}>
      <div className={styles.bgImage}>
        <div className={styles.auth}>
          <div className={styles.header}>
            <img src="/logo.svg" alt="log" />
          </div>
          <div className={styles.form}>
            <h1>Create an account!</h1>
            <Formik
              initialValues={{ email: '', username: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleSubmit(values)
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <InputHOH label="E-mail" name="email" type="text" errors={errors} style={{marginBottom: 8}}/>
                  <InputHOH label="Username" name="username" type="text" errors={errors} style={{marginBottom: 8}}/>
                  <InputHOH label="Password" name="password" type="password" errors={errors} style={{marginBottom: 8}}/>
                  <InputHOH label="Invite code (for new players)" name="inviteCode" type="text" errors={errors} style={{marginBottom: 8}}/>
                  <ButtonHOH text="Sign Up" type="submit" style={{marginTop: 8}} blocked={loading}/>
                </Form>
              )}
            </Formik>
            <Question text="Already have an account?"/>
            <ButtonHOH text="Log In" reverse={true} onClick={() => navigate('/', {replace: true})} blocked={loading}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
