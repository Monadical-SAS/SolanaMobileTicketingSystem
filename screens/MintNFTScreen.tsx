import React, {FC} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../components/Header';
import MintButton from '../components/MintButton';

type NFTsScreenProps = {};

const MintNFTScreen: FC<NFTsScreenProps> = () => {
  return (
    <ScrollView style={styles.mainContainer}>
      <Header title="Mint a new NFT" />
      <View style={styles.mintButton}>
        <MintButton />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mintButton: {
    width: '100%',
    padding: 20,
  },
});

export default MintNFTScreen;
