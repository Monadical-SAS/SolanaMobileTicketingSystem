import React, {FC, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import QRScanner from '../components/QRScanner';
import Modal from '../components/Modal';

const ScannerScreen: FC = () => {
  const [scanned, setScanned] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    if (scanned) {
      setShowModal(true);
    }
  }, [scanned]);

  return (
    <ScrollView>
      <Header title="Scanner" subtitle="Validate your NFT" />
      <View style={styles.mintButton}>
        <QRScanner setScanned={setScanned} />

        <Modal modalVisible={showModal} setModalVisible={setShowModal}>
          <View style={styles.result}>
            <Text style={styles.title}>Scan QR Result</Text>
            <Text style={styles.text}>{scanned}</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ScannerScreen;
