/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';


import App from './mainpage.js';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";


// import { FirebaseApp, initializeApp } from 'firebase/app';

// FirebaseApp.initializeApp();

// PushNotification.configure({
//     onNotification: function (notification) {
//         console.log("NOTIFICATION:", notification);
//         PushNotification.requestPermissions();
//       },
// });

AppRegistry.registerComponent(appName, () => App);
