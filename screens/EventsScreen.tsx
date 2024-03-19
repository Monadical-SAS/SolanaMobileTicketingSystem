import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from '../components/Header';
import {useUmi} from '../components/providers/UmiProvider';
import {
  fetchAllDigitalAssetByOwner,
  fetchJsonMetadata,
} from '@metaplex-foundation/mpl-token-metadata';

type NFTsScreenProps = {};

const EventsScreen: FC<NFTsScreenProps> = () => {
  const umi = useUmi();
  const [events, setEvents] = useState<any[]>([]);

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

  const generateQRCode = useCallback(() => {
    console.log('generateQRCode');
  }, []);

  return (
    <ScrollView style={styles.mainContainer}>
      <Header title="Your Events" />
      <View style={styles.mainContent}>
        {events.map(event => (
          <View key={event.metadata.mint}>
            <Text style={styles.title}>{event.metadata.name}</Text>
            <Image
              source={{uri: event.metadata.image}}
              style={styles.image}
              alt={event.name}
            />

            <View style={styles.qrButton}>
              <Button title={'Generate QR Code'} onPress={generateQRCode} />
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  qrButton: {
    marginTop: 10,
  },
});

export default EventsScreen;
