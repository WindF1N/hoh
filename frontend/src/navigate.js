import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Verify from './screens/Verify';
import CryptoWallet from './screens/CryptoWallet';
import SeedPhrase from './screens/SeedPhrase';
import SeedWords from './screens/SeedWords';
import RepeatWords from './screens/RepeatWords';
import Account from './screens/Account';
import EnterSeedPhrase from './screens/EnterSeedPhrase';
import Game from './screens/Game';

const Navigate = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/crypto" element={<CryptoWallet />} />
          <Route path="/seedphrase" element={<SeedPhrase />} />
          <Route path="/seedwords" element={<SeedWords />} />
          <Route path="/repeatwords" element={<RepeatWords />} />
          <Route path="/enterseedphrase" element={<EnterSeedPhrase />} />
          <Route path="/account" element={<Account />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
  );
};

export default Navigate;
