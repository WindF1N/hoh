import { mnemonicToSeedSync } from 'bip39';
import * as bs58 from 'bs58';

import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const createConnection = () => {
  return new Connection(clusterApiUrl("devnet"));
};

const createAccount = (mnemonic) => {
  const keypair = Keypair.fromSeed(mnemonicToSeedSync(mnemonic, "").slice(0, 32));
  // alert({publicKey: bs58.encode(keypair.publicKey), secretKey: bs58.encode(keypair.secretKey)})
  return {publicKey: keypair.publicKey.toBase58(), secretKey: bs58.encode(keypair.secretKey).toString()}
};

const getBalance = async (secretKey) => {
  const connection = createConnection();

  const wallet = Keypair.fromSecretKey(
    bs58.decode(secretKey)
  );

  const lamports = await connection.getBalance(wallet.publicKey).catch((err) => {
    console.error(`Error: ${err}`);
  });

  return lamports / LAMPORTS_PER_SOL;
};

export {createConnection, createAccount, getBalance};
