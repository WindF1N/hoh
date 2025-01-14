import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [ loading, setLoading ] = useState(false);
  const [ socket, setSocket ] = useState(null);
  const [ accessToken, setAccessToken ] = useState(localStorage.getItem('accessToken'));
  const [ refreshToken, setRefreshToken ] = useState(localStorage.getItem('refreshToken'));
  const [ publicKey, setPublicKey ] = useState(localStorage.getItem('publicKey'));
  const [ secretKey, setSecretKey ] = useState(localStorage.getItem('secretKey'));
  const [ message, setMessage ] = useState(null);
  const [ messages, setMessages ] = useState([]);
  const [ error, setError ] = useState(null);

  const [ verifyCodeId, setVerifyCodeId ] = useState(null);
  const [ verifyType, setVerifyType ] = useState(null);

  const [ words, setWords ] = useState(null)
  const [ account, setAccount ] = useState(null);
  const [ modal, setModal ] = useState(null);

  const [ energy, setEnergy ] = useState(null);
  const [ generationEnergy, setGenerationEneregy ] = useState(null);
  const [ gameResult, setGameResult ] = useState([1, 1, 1]);

  const [ jackpot, setJackpot ] = useState();
  const [ boosts, setBoosts ] = useState();
  const [ settings, setSettings ] = useState();
  const [ leaders, setLeaders ] = useState();
  const [ partners, setPartners ] = useState();
  const [ tasks, setTasks ] = useState([]);

  const createSocket = (token) => {
    setSocket(io(process.env.REACT_APP_FLASK_ENDPOINT.replace("http", "ws"), {
      transportOptions: {
        polling: {
          maxHttpBufferSize: 1e8,
          extraHeaders: {
            Authorization: "Bearer " + token
          }
        },
      }
    }));
  };

  const login = async (data, navigate) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_ENDPOINT}/login`, data);
      if ('error' in response.data) {
        alert(response.data.error);
        setError(response.data.error);
      } else {
        if ('code_id' in response.data) {
          setVerifyCodeId(response.data.code_id);
          setVerifyType(response.data.verify_type);
        } else {
          setAccessToken(response.data.access_token);
          setRefreshToken(response.data.refresh_token);
          createSocket(response.data.access_token);
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        navigate(response.data.follow.link,
                 { replace: response.data.follow.replace});
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
      setError(error.message);
    }
  };

  const signup = async (data, navigate) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_ENDPOINT}/signup`, data);
      if ('error' in response.data) {
        alert(response.data.error);
        setError(response.data.error);
      } else {
        setVerifyCodeId(response.data.code_id);
        setVerifyType(response.data.verify_type);
        navigate(response.data.follow.link,
                 { replace: response.data.follow.replace});
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
      setError(error.message);
    }
  };

  const verify = async (data, navigate) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_ENDPOINT}/verify`, data);
      if ('error' in response.data) {
        alert(response.data.error);
        setError(response.data.error);
      } else {
        if (data.verify_type === "email") {
          setAccessToken(response.data.access_token);
          setRefreshToken(response.data.refresh_token);
          createSocket(response.data.access_token);
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
        } else if (data.verify_type === "create_wallet") {
          setPublicKey(response.data.wallet);
          setAccount({...account, wallet: response.data.wallet, wallet_verified: true});
          localStorage.setItem('publicKey', response.data.wallet);
          localStorage.setItem('secretKey', secretKey);
        } else if (data.verify_type === "import_wallet") {
          setPublicKey(response.data.wallet);
          setAccount({...account, wallet: response.data.wallet, wallet_verified: true});
          localStorage.setItem('publicKey', publicKey);
          localStorage.setItem('secretKey', secretKey);
        }
        setVerifyCodeId(null);
        setVerifyType(null);
        navigate(response.data.follow.link,
                 { replace: response.data.follow.replace});
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
      setError(error.message);
    }
  };

  const resendCode = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_ENDPOINT}/resend-code`, data);
      if ('error' in response.data) {
        alert(response.data.error);
        setError(response.data.error);
      }
    } catch (error) {
      alert(error.message);
      setError(error.message);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_FLASK_ENDPOINT}/refresh`, null, {
        headers: {
          Authorization: "Bearer " + refreshToken
        }
      });
      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
      createSocket(response.data.access_token);
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
    } catch (error) {
      setError(error.message);
      logout();
    }
  };

  const logout = (navigate) => {
    setLoading(false);
    localStorage.removeItem('publicKey');
    localStorage.removeItem('secretKey');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setPublicKey(null);
    setSecretKey(null);
    setAccessToken(null);
    setRefreshToken(null);
    if (socket) {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
      setSocket(null);
    }
    if (navigate) {
      navigate('/', {replace: true});
    }
  }

  useEffect(() => {
    if (accessToken) {
      createSocket(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Подключились к серверу');
      });

      socket.on('disconnect', () => {
        console.log('Отключились от сервера');
        logout();
      });

      socket.on('message', (msg) => {
        setMessages(prevMessages => [...prevMessages, JSON.parse(msg)]);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('message');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (!message) {
      if (messages.length > 0) {
        setMessage(messages[0]);
        setMessages(prevMessages => prevMessages.slice(1));
      }
    }
  }, [message, messages]);

  const sendMessage = (msg) => {
    if (socket) {
      socket.emit('message', msg);
    }
  };

  useEffect(() => {
    const handleRefresh = async () => {
      await refreshAccessToken();
    };
    if (message) {
      if (message[0] === 'user') {
        if (message[1] === 'get') {
          if (message[2]) {
            setAccount(message[2]);
            if (message[2].wallet_verified) {
              setPublicKey(message[2].wallet);
              localStorage.setItem('publicKey', message[2].wallet);
            }
          } else {
            logout();
          }
        } else if (message[1] === 'leaders') {
          console.log(JSON.stringify(message[2]));
          setLeaders(message[2]);
        };
      } else if (message[0] === 'energy') {
        if (message[1] === 'get') {
          setEnergy(message[2]);
          sendMessage(JSON.stringify(["generation", "get", message[2]._id]));
          setLoading(false);
        }
      } else if (message[0] === 'generation') {
        if (message[1] === 'get') {
          setGenerationEneregy(message[3]);
        } else if (message[1] === 'add') {
          setGenerationEneregy(message[3]);
        }
      } else if (message[0] === 'boost') {
        if (message[1] === 'use') {
          setAccount(prevState => ({...prevState, game_balance: message[3]}));
        } else if (message[1] === 'get') {
          setBoosts(message[2])
        }
      } else if (message[0] === 'game') {
        setGameResult(message[3]);
        setAccount(prevState => ({...prevState, game_balance: message[4], balance: message[5]}));
      } else if (message[0] === 'jackpot') {
        setJackpot(message[2]);
      } else if (message[0] === 'settings') {
        setSettings(message[2]);
      } else if (message[0] === 'partner') {
        if (message[1] === 'get') {
          setPartners(message[2])
        }
      } else if (message[0] === 'task') {
        if (message[1] === 'get') {
          setTasks(prevState => ([...prevState, ...message[2]]));
        }
      } else if (message[0] === 'error') {
        if (message[1] === 'Token has expired') {
          handleRefresh();
        }
      }
      setMessage(null);
    };
  }, [message]);

  useEffect(() => {
    if (socket && !account) {
      sendMessage(JSON.stringify(["user", "get"]));
    }
  }, [socket, account])

  useEffect(() => {
    if (socket && !energy) {
      sendMessage(JSON.stringify(["energy", "get"]));
    }
  }, [socket, energy])

  useEffect(() => {
    if (socket && !jackpot) {
      sendMessage(JSON.stringify(["jackpot", "get"]));
    }
  }, [socket, jackpot])

  useEffect(() => {
    if (socket && !boosts) {
      sendMessage(JSON.stringify(["boost", "get"]));
    }
  }, [socket, boosts])

  useEffect(() => {
    if (socket && !settings) {
      sendMessage(JSON.stringify(["settings", "get"]));
    }
  }, [socket, settings])

  useEffect(() => {
    if (socket && !leaders) {
      sendMessage(JSON.stringify(["user", "leaders"]));
    }
  }, [socket, leaders])

  useEffect(() => {
    if (socket && !partners) {
      sendMessage(JSON.stringify(["partner", "get"]));
    }
  }, [socket, partners])

  useEffect(() => {
    if (socket && partners && tasks.length === 0) {
      partners.forEach((partner) => {
        sendMessage(JSON.stringify(["task", "get", partner._id]));
      })
    }
  }, [socket, partners, tasks])

  return (
    <SocketContext.Provider value={{ sendMessage,
                                     message,
                                     setMessage,
                                     socket,
                                     accessToken,
                                     refreshToken,
                                     login,
                                     signup,
                                     verify,
                                     logout,
                                     resendCode,
                                     error,
                                     setError,
                                     loading,
                                     setLoading,
                                     verifyCodeId,
                                     setVerifyCodeId,
                                     verifyType,
                                     setVerifyType,
                                     words,
                                     setWords,
                                     publicKey,
                                     setPublicKey,
                                     secretKey,
                                     setSecretKey,
                                     account,
                                     setAccount,

                                     modal,
                                     setModal,

                                     energy,
                                     setEnergy,
                                     generationEnergy,
                                     setGenerationEneregy,
                                     gameResult,
                                     setGameResult,

                                     jackpot,
                                     boosts,
                                     settings, 
                                     leaders,
                                     partners,
                                     tasks
                                   }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export { SocketProvider, useSocket };
