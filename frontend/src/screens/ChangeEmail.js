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
  current_email: Yup.string()
    .email('Некорректный email')
    .max(100, 'Имя пользователя содержит больше 100 символов'),
  new_email: Yup.string()
    .email('Некорректный email')
    .max(100, 'Имя пользователя содержит больше 100 символов')
});

function ChangeEmail() {

  const navigate = useNavigate();

  const { socket, login, loading, setLoading, error, account } = useSocket();
  const [ currentEmail, setCurrentEmail ] = useState(null);

  const handleSubmit = async (values) => {
    if (!currentEmail) {
      setCurrentEmail(values.current_email);
    } else {

    }
  }

  return (
    <>
      <HeaderHOH text="Change e-mail" />
      <div className={styles.main}>
        {!currentEmail ?
          <h1>Current E-mail</h1>
        : 
          <h1>New E-mail</h1>}
        <Formik
          initialValues={{ current_email: '', new_email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form>
              {!currentEmail ?
                <>
                  <InputHOH label="Current e-mail" name="current_email" type="text" errors={errors} style={{marginBottom: 8}}/>
                  <ButtonHOH text="Continue" type="submit" style={{marginTop: 8}} blocked={!values.current_email.length > 0 || errors.current_email || account?.email !== values.current_email || loading}/>
                </>
              : 
                <>
                  <InputHOH label="New e-mail" name="new_email" type="text" errors={errors} style={{marginBottom: 8}}/>
                  <ButtonHOH text="Change e-mail" type="submit" style={{marginTop: 8}} blocked={!values.new_email.length > 0 || errors.new_email || loading}/>
                </>}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ChangeEmail;
