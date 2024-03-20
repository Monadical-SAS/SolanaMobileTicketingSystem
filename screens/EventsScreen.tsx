import React, {FC} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../util/types';
import CollectionNFTs from '../components/CollectionNFTs';
import {Header} from '../components/Header';
import MintButton from '../components/MintButton';
import AppButton from '../components/AppButton';

type NFTsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Events'>;
};

const EventsScreen: FC<NFTsScreenProps> = ({navigation}) => {
  return (
    <ScrollView style={styles.mainContainer}>
      <Header title="NFT Events" subtitle="Collection NFTs" />
      <View style={styles.actionButtons}>
        <MintButton />

        <AppButton
          text={'View my tickets'}
          onPress={() => navigation.navigate('MyTickets')}
        />
      </View>
      <CollectionNFTs />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  actionButtons: {
    width: '100%',
    padding: 20,
    display: 'flex',
    gap: 20,
  },
});

export default EventsScreen;
