import React, {useEffect, useMemo, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {publicKey} from '@metaplex-foundation/umi';
import {fetchCandyMachine} from '@metaplex-foundation/mpl-candy-machine';
import {useUmi} from './providers/UmiProvider';
import {fetchNFTData} from '../util/metaplex';
import constants from '../util/constants';

const collectionId = constants.PUBLIC_CANDY_MACHINE_ID;

const CollectionNFTs = () => {
  const umi = useUmi();
  const [collectionData, setCollectionData] = useState<any>(null);
  const [itemsData, setItemsData]: any = useState(null);

  const candyMachineId = useMemo(() => {
    return collectionId
      ? publicKey(collectionId)
      : publicKey('11111111111111111111111111111111');
  }, []);

  console.log('candyMachineId', candyMachineId);

  useEffect(() => {
    async function loadCandyMachineData() {
      try {
        const candyData = await fetchCandyMachine(umi, candyMachineId);
        setCollectionData(candyData);
        const newItems = await Promise.all(
          candyData.items.map(item => fetchNFTData(item.uri)),
        );
        setItemsData(newItems);
      } catch (error) {
        console.log('Error fetching candy machine ' + error);
      }
    }

    loadCandyMachineData().catch(() => {
      console.log('Error fetching candy machine');
    });
  }, [candyMachineId, umi]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>
          Collection NFTs {collectionData.data.symbol}
        </Text>

        {itemsData &&
          itemsData.map((nft: any, index: number) => (
            <View key={index}>
              <Image
                source={{uri: nft.image}}
                style={styles.image}
                alt={nft.name}
              />
              <Text style={styles.name}>{nft.name}</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  image: {
    width: 150,
    height: 150,
  },
  name: {
    marginTop: 5,
  },
});

export default CollectionNFTs;
