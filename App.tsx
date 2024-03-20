import {clusterApiUrl} from '@solana/web3.js';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ConnectionProvider,
  RPC_ENDPOINT,
} from './components/providers/ConnectionProvider';
import {AuthorizationProvider} from './components/providers/AuthorizationProvider';
import {UmiProvider} from './components/providers/UmiProvider';
import MainScreen from './screens/MainScreen';
import EventsScreen from './screens/EventsScreen';
import MyTicketsScreen from './screens/MyTicketsScreen';
import TicketScannerScreen from './screens/TicketScannerScreen';
import constants from './util/constants';

const Stack = createNativeStackNavigator();
const endpoint = constants.PUBLIC_RPC || 'https://api.devnet.solana.com';

export default function App() {
  return (
    <NavigationContainer>
      <ConnectionProvider
        config={{commitment: 'processed'}}
        endpoint={clusterApiUrl(RPC_ENDPOINT)}>
        <AuthorizationProvider>
          <UmiProvider endpoint={endpoint}>
            <SafeAreaView style={styles.shell}>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={MainScreen} />
                <Stack.Screen name="Events" component={EventsScreen} />
                <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
                <Stack.Screen
                  name="TicketScanner"
                  component={TicketScannerScreen}
                />
              </Stack.Navigator>
            </SafeAreaView>
          </UmiProvider>
        </AuthorizationProvider>
      </ConnectionProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: '100%',
  },
});
