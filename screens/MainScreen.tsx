import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Section} from '../components/Section';
import ConnectButton from '../components/ConnectButton';
import AccountInfo from '../components/AccountInfo';
import {
  Account,
  useAuthorization,
} from '../components/providers/AuthorizationProvider';
import {useConnection} from '../components/providers/ConnectionProvider';
import SignMessageButton from '../components/SignMessageButton';
import SignTransactionButton from '../components/SignTransactionButton';
import {RootStackParamList} from '../util/types';

type MainScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const MainScreen: FC<MainScreenProps> = ({navigation}) => {
  const {connection} = useConnection();
  const {selectedAccount} = useAuthorization();
  const [balance, setBalance] = useState<number | null>(null);

  const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
      console.log('Fetching balance for: ' + account.publicKey);
      const fetchedBalance = await connection.getBalance(account.publicKey);
      console.log('Balance fetched: ' + fetchedBalance);
      setBalance(fetchedBalance);
    },
    [connection],
  );

  useEffect(() => {
    if (!selectedAccount) {
      return;
    }
    fetchAndUpdateBalance(selectedAccount);
  }, [fetchAndUpdateBalance, selectedAccount]);

  return (
    <>
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {selectedAccount ? (
            <>
              <Section title="Sign a transaction">
                <SignTransactionButton />
              </Section>

              <Section title="Sign a message">
                <SignMessageButton />
              </Section>
            </>
          ) : null}

          <Button
            title={'Go to NFTs'}
            onPress={() => navigation.navigate('NFTs')}
          />
        </ScrollView>
        {selectedAccount ? (
          <AccountInfo
            selectedAccount={selectedAccount}
            balance={balance}
            fetchAndUpdateBalance={fetchAndUpdateBalance}
          />
        ) : (
          <ConnectButton title="Connect wallet" />
        )}
        <Text>Selected cluster: {connection.rpcEndpoint}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    padding: 16,
    flex: 1,
  },
  scrollContainer: {
    height: '100%',
  },
  buttonGroup: {
    flexDirection: 'column',
    paddingVertical: 4,
  },
});

export default MainScreen;
