/**
 * @format
 */

import {AppRegistry} from 'react-native';

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import App from './App';
import {name as appName} from './app.json';

global.Buffer = require('buffer').Buffer;
global.TextEncoder = require('text-encoding').TextEncoder;

AppRegistry.registerComponent(appName, () => App);
