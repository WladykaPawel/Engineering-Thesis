import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './HomePage'; // Importujemy ekran główny
import Numbers from './numbers'; // Importujemy podstronę
import FirstAid from './FirstAid.js'; 
import Medicines from './Medicines.js'; 
import History from './History.js'; 
import UpcomingVisits from './UpcomingVisits.js'; 
import Prevention from './Prevention.js'; 




const Stack = createStackNavigator();

const App = () => {
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

