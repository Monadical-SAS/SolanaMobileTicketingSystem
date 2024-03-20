import React, {FC, useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import {useUmi} from '../components/providers/UmiProvider';
import {
  fetchAllDigitalAssetByOwner,
  fetchJsonMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import QRGenerator from '../components/QRGenerator';
import AppModal from '../components/Modal';
import AppButton from '../components/AppButton';

type NFTsScreenProps = {};

const EventsScreen: FC<NFTsScreenProps> = () => {
  const umi = useUmi();
  const [events, setEvents] = useState<any[]>([]);
  const [showQR, setShowQR] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventsByOwner = async (): Promise<any[]> => {
      try {
        const assets = await fetchAllDigitalAssetByOwner(
          umi,
          umi.payer.publicKey,
        );
        return await Promise.all(
          assets.map(async asset => {
            const metadata = await fetchJsonMetadata(umi, asset.metadata.uri);
            return {
              ...asset,
              metadata,
            };
          }),
        );
      } catch (error) {
        console.error('fetchEventsByOwner', error);
        throw new Error('Error fetching my events');
      }
    };

    fetchEventsByOwner().then(data => {
      setEvents(data);
    });
  }, [umi]);

  return (
    <ScrollView style={styles.mainContainer}>
      <Header title="Your Events" />
      <View style={styles.mainContent}>
        {events.map(event => (
          <View key={event.edition.publicKey} style={styles.card}>
            <Text style={styles.title}>{event.metadata.name}</Text>
            <Image
              source={{uri: event.metadata.image}}
              style={styles.image}
              alt={event.name}
            />

            <View style={styles.qrButton}>
              {showQR ? (
                <AppModal modalVisible={showQR} setModalVisible={setShowQR}>
                  <View style={styles.qrView}>
                    <Text style={styles.title}>{event.metadata.name}</Text>
                    <QRGenerator value={event.edition.publicKey} />
                  </View>
                </AppModal>
              ) : (
                <AppButton text={'Show QR'} onPress={() => setShowQR(true)} />
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  qrView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  qrButton: {
    marginTop: 10,
  },
});

export default EventsScreen;
