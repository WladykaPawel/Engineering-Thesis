/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { LogBox } from 'react-native';



import App from './mainpage.js';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";



 PushNotification.configure({
     onNotification: function (notification) {
         console.log("NOTIFICATION:", notification);
       },
       permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
       requestPermissions: Platform.OS === 'ios'
 });


AppRegistry.registerComponent(appName, () => App);

LogBox.ignoreLogs(['Remote debugger']);