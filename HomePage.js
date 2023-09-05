import React from 'react';
import { View, TouchableOpacity, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const MainScreen = ({ navigation }) => {
    const openNumbers = () => {
      navigation.navigate('Numbers');
    };
    const openFirstAid = () => {
      navigation.navigate('FirstAid');
    };
    const openMedicines = () => {
      navigation.navigate('Medicines');
    };
    const openHistory = () => {
      navigation.navigate('History');
    };
    const openUpcomingVisits = () => {
      navigation.navigate('UpcomingVisits');
    };
    const openPrevention = () => {
      navigation.navigate('Prevention');
    };

  return (
    <View style={styles.container} >
      <LinearGradient
        colors={['#9dfbb2', '#7ad98f', '#9dfbb2', '#7ad98f']}
        locations={[0.4, 0.6, 0.70, 0.9]}
        style={styles.background}
      >
      {/* <ImageBackground
          source={require('./assets/backnew.png')} // Ścieżka do obrazu
          style={styles.background}
          resizeMode="cover" // Możesz dostosować sposób wyświetlania obrazu
      > */}
        
      <Text style={styles.name}>E<Text style={styles.name2}>Zdrowie</Text></Text>
      <View style={styles.container2} >
        <TouchableOpacity style={styles.button_cont} onPress={openNumbers}>
          <Image
            source={require('./assets/phone.png')} // Ścieżka do obrazu
            style={styles.image}
            resizeMode="contain" // Możesz dostosować sposób wyświetlania obrazu
          />
          <Text style={styles.title}>WAŻNE NUMERY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_cont} onPress={openFirstAid}>
          <Image
            source={require('./assets/ambulance.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>PIERWSZA POMOC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_cont} onPress={openMedicines}>
          <Image
            source={require('./assets/leki.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>PRZYPOMNIENIE</Text>
          <Text style={styles.title}>O LEKACH</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container2} >
        <TouchableOpacity style={styles.button_cont} onPress={openHistory}>
          <Image
            source={require('./assets/history.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>HISTORIA LECZENIA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_cont} onPress={openUpcomingVisits}>
          <Image
            source={require('./assets/doctor.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>NADCHODZĄCE</Text>
          <Text style={styles.title}>WIZYTY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button_cont} onPress={openPrevention}>
          <Image
            source={require('./assets/profilaktyka.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>PROFILAKTYKA</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.name}></View>

      {/* </ImageBackground> */}
      </LinearGradient>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    margin: 15,
    // backgroundColor: 'red',
  },
  button_cont:{
    height: 100,
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  background: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 56,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#33a34b',
    textAlign: 'center',
    paddingTop: 70,
    textShadowColor: 'black', // Kolor obramowania (czarny)
    textShadowOffset: { width: 1, height: 1 }, // Szerokość obramowania
    textShadowRadius: 2, // Rozmycie obramowania
   },
  title: {
    fontSize: 12,
    fontFamily: 'Inter', 
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
   },
  name2: {
    color: '#4aef6e',
   },
  image: {
    width: 82, 
    height: 82,
    margin: 5,
  },
  
});

export default MainScreen;
