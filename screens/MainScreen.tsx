import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  Button,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import {Header} from '../components/Header';

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
      <Header title={'Solana Mobile'} />
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

              <Section title="View Events">
                <Button
                  title={'Go to Events'}
                  onPress={() => navigation.navigate('Events')}
                />
              </Section>

              <Section title="Ticket Scanner">
                <Button
                  title={'Go to Ticket Scanner'}
                  onPress={() => navigation.navigate('TicketScanner')}
                />
              </Section>
            </>
          ) : (
            <>
              <Text style={styles.title}>
                Connect your wallet and start interacting with Solana Mobile
              </Text>
              <ImageBackground
                accessibilityRole="image"
                source={require('../img/sms.png')}
                style={styles.logo}
                imageStyle={styles.logo}
              />
            </>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: 'column',
    paddingVertical: 4,
  },
  logo: {
    width: '100%',
    height: '90%',
    marginBottom: 32,
  },
});

export default MainScreen;
