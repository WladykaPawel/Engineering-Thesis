import React, { useEffect } from 'react';
import {Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './HomePage'; 
import Numbers from './numbers'; 
import FirstAid from './FirstAid.js'; 
import Medicines from './Medicines.js'; 
import History from './History.js'; 
import UpcomingVisits from './UpcomingVisits.js'; 
import Prevention from './Prevention.js'; 
import PushNotification from 'react-native-push-notification';




const Stack = createStackNavigator();

const App = () => {
  useEffect (() => {
    PushNotification.createChannel(
      {
        channelId: "channel-id",
        channelName: "My channel", 
        playSound: true,
        soundName: "alarm",
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`) 
    )
  },[]
  )
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="Numbers" component={Numbers} />
        <Stack.Screen name="FirstAid" component={FirstAid} />
        <Stack.Screen name="Medicines" component={Medicines} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="UpcomingVisits" component={UpcomingVisits} />
        <Stack.Screen name="Prevention" component={Prevention} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

