import React, {
  ActivityIndicator,
  Button,
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FC, useCallback, useMemo, useState} from 'react';
import {
  generateSigner,
  publicKey,
  PublicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  fetchCandyMachine,
  mintV2,
  safeFetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine';
import {
  DigitalAsset,
  fetchDigitalAsset,
  fetchJsonMetadata,
  JsonMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {setComputeUnitLimit} from '@metaplex-foundation/mpl-toolbox';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {toWeb3JsLegacyTransaction} from '@metaplex-foundation/umi-web3js-adapters';
import {Buffer} from 'buffer';
import {Keypair, VersionedTransaction} from '@solana/web3.js';
import {base58} from '@metaplex-foundation/umi-serializers';
import {useUmi} from './providers/UmiProvider';
import constants from '../util/constants';
import {useConnection} from './providers/ConnectionProvider';
import {useAuthorization} from './providers/AuthorizationProvider';

const CANDY_MACHINE_ID = constants.PUBLIC_CANDY_MACHINE_ID;
const TREASURY = constants.PUBLIC_TREASURY;

const MintButton: FC = () => {
  const umi = useUmi();
  const {connection} = useConnection();
  const {authorizeSession} = useAuthorization();

  const [loading, setLoading] = useState(false);
  const [digitalAsset, setDigitalAsset] = useState<DigitalAsset | null>(null);
  const [jsonMetadata, setJsonMetadata] = useState<JsonMetadata | null>(null);

  const candyMachineId = useMemo(() => {
    return CANDY_MACHINE_ID
      ? publicKey(CANDY_MACHINE_ID)
      : publicKey('11111111111111111111111111111111');
  }, []);

  const treasury = publicKey(TREASURY);

  const signTransaction = useCallback(
    async (transaction: any, signer: any) => {
      return await transact(async (wallet: Web3MobileWallet) => {
        const authorizationResult = await authorizeSession(wallet);
        const newTransaction = {
          ...transaction,
          feePayer: authorizationResult.publicKey,
        };
        const web3Transaction = toWeb3JsLegacyTransaction(newTransaction);
        web3Transaction.partialSign(
          Keypair.fromSecretKey(Buffer.from(signer.secretKey)),
        );
        const signedTransactions = await wallet.signTransactions({
          transactions: [web3Transaction],
        });
        return signedTransactions[0];
      });
    },
    [authorizeSession],
  );

  const verifySignature = useCallback(
    async (signature: string): Promise<any> => {
      let transaction;
      const u8signature = base58.serialize(signature);
      for (let i = 0; i < 30; i++) {
        transaction = await umi.rpc.getTransaction(u8signature);
        if (transaction) {
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction.message.accounts[1];
    },
    [umi.rpc],
  );

  const fetchNft = useCallback(
    async (nftAddress: PublicKey): Promise<any> => {
      const asset = await fetchDigitalAsset(umi, nftAddress);
      const metadata = await fetchJsonMetadata(umi, asset.metadata.uri);
      if (!asset || !metadata) {
        throw new Error('NFT not found');
      }
      return {asset, metadata};
    },
    [umi],
  );

  const onClick = useCallback(async () => {
    setLoading(true);
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    const candyMachine = await fetchCandyMachine(umi, candyMachineId);
    const latestBlockhash = (await umi.rpc.getLatestBlockhash()).blockhash;
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority,
    );

    try {
      const nftMint = generateSigner(umi);
      let tx = transactionBuilder().add(
        mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: candyMachine.authority,
          nftMint: nftMint,
          candyGuard: candyGuard ? candyGuard.publicKey : undefined,
          mintArgs: {
            mintLimit: some({id: 1}),
            solPayment: some({destination: treasury}),
          },
          tokenStandard: candyMachine.tokenStandard,
        }),
      );
      tx = tx.prepend(setComputeUnitLimit(umi, {units: 800_000}));
      tx = tx.setBlockhash(latestBlockhash);
      const transaction = tx.build(umi);
      const signedTransaction = await signTransaction(transaction, nftMint);
      const txSignature = await connection.sendTransaction(
        VersionedTransaction.deserialize(signedTransaction.serialize()),
      );
      const mint = await verifySignature(txSignature);
      const {asset, metadata} = await fetchNft(publicKey(mint));
      setDigitalAsset(asset);
      setJsonMetadata(metadata);
      setLoading(false);
    } catch (error) {
      console.error('Error creating NFT', error);
      setLoading(false);
    }
  }, [umi, candyMachineId, treasury]);

  const openInSolanaExplorer = useCallback(async () => {
    if (digitalAsset) {
      const url = `https://explorer.solana.com/address/${digitalAsset.mint.publicKey}/?cluster=devnet`;
      Linking.openURL(url);
    }
  }, [digitalAsset]);

  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title={'Mint NFT'} onPress={onClick} />
      )}

      {digitalAsset && (
        <View>
          <Text style={styles.title}>{digitalAsset.metadata.name}</Text>
          <Text style={styles.mint}>{digitalAsset.mint.publicKey}</Text>
          {jsonMetadata && (
            <Image
              source={{uri: jsonMetadata?.image || ''}}
              style={styles.image}
            />
          )}

          <Button
            title={'Open in Solana Explorer'}
            onPress={openInSolanaExplorer}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  mint: {
    fontSize: 12,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default MintButton;
