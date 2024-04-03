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
  username: Yup.string()
    .max(12, 'Имя пользователя содержит больше 12 символов')
    .matches(/^[a-zA-Z0-9._]*$/, 'Имя пользователя может содержать только латиницу, нижние пробелы и точки')
    .required('Обязательное поле'),
});

function ChangeUsername() {

  const navigate = useNavigate();

  const { socket, login, loading, setLoading, error } = useSocket();

  const handleSubmit = async (values) => {}

  return (
    <>
      <HeaderHOH text="Change username" />
      <div className={styles.main}>
        <h1>New username</h1>
        <div className={styles.text}>
          The username must contain <span>up to 12 letters</span>
        </div>
        <Formik
          initialValues={{ username: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form>
              <InputHOH label="New username" name="username" type="text" errors={errors} style={{marginBottom: 8}}/>
              <ButtonHOH text="Continue" type="submit" style={{marginTop: 8}} blocked={!values.username.length > 0 || errors.username || loading}/>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ChangeUsername;
