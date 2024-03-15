import React, {FC} from 'react';
import {Button, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../util/types';

type NFTsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NFTs'>;
};

const NFTsScreen: FC<NFTsScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default NFTsScreen;
