import React, {FC, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import QRScanner from '../components/QRScanner';
import Modal from '../components/Modal';
import {useUmi} from '../components/providers/UmiProvider';
import {
  fetchCandyMachineData,
  fetchEventsByOwner,
  fetchMetadataByMint,
} from '../util/metaplex';
import {publicKey} from '@metaplex-foundation/umi';

const TicketScannerScreen: FC = () => {
  const umi = useUmi();
  const [scanned, setScanned] = React.useState('');
  const [result, setResult] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [collectionMint, setCollectionMint] = React.useState('');

  useEffect(() => {
    fetchCandyMachineData(umi).then(data => {
      setCollectionMint(data.collectionMint);
    });
  }, [umi]);

  useEffect(() => {
    if (!scanned) {
      return;
    }

    try {
      publicKey(scanned);
    } catch (error) {
      setResult('Invalid ticket');
      setShowModal(true);
      return;
    }

    fetchMetadataByMint(umi, publicKey(scanned)).then(mintData => {
      if (!mintData) {
        setResult('Ticket metadata not found');
        return;
      }
      if (mintData.metadata.collection.value.key !== collectionMint) {
        setResult('Ticket not found in collection');
        return;
      }

      fetchEventsByOwner(umi).then((ownerData: any) => {
        const foundInWallet = ownerData.find(
          (event: any) => event.publicKey === scanned,
        );
        if (!foundInWallet) {
          setResult('Ticket not found in user wallet');
          return;
        }

        setResult('Ticket found in user wallet and collection');
        setShowModal(true);
      });
    });
  }, [umi, collectionMint, scanned]);

  const handleClose = () => {
    setScanned('');
    setResult('');
    setShowModal(false);
  };

  return (
    <ScrollView>
      <Header title="Ticket Scanner" subtitle="Validate your NFT ticket" />
      <View style={styles.mintButton}>
        <QRScanner setScanned={setScanned} />

        <Modal modalVisible={showModal} setModalVisible={handleClose}>
          <View style={styles.result}>
            <Text style={styles.title}>Scanner Result</Text>
            <Text style={styles.text}>{scanned}</Text>
            <Text style={styles.text}>{result}</Text>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mintButton: {
    width: '100%',
    padding: 20,
  },
  result: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TicketScannerScreen;
