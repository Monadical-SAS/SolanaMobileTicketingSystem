import React, {FC} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../util/types';
import CollectionNFTs from '../components/CollectionNFTs';
import {Header} from '../components/Header';
import MintButton from '../components/MintButton';

type NFTsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NFTs'>;
};

const NFTsScreen: FC<NFTsScreenProps> = ({navigation}) => {
  return (
    <View style={styles.mainContainer}>
      <Header title="NFTs" subtitle="Collection NFTs" />
      <View style={styles.mintButton}>
        <MintButton />
        <Button
          title={'Events'}
          onPress={() => navigation.navigate('Events')}
        />
      </View>
      <CollectionNFTs />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mintButton: {
    width: '100%',
    padding: 20,
  },
});

export default NFTsScreen;
