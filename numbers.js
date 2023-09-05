import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image, FlatList} from 'react-native';
import { ScrollView } from 'react-native';


const phoneNumber = '112';
const police = '997';
const firefighting = '998';
const emergency = '999';
const GOPR = '601-100-300';
const WOPR = '601-100-100';


const Numbers = () => {
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  return (
    <ScrollView>
      
      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>Numer Alarmowy</Text>
          <Text style={styles.title}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(phoneNumber)}>
          <Image
            source={require('./assets/phoneimg.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Numer 112 to europejski numer alarmowy,
        który umożliwia szybkie wezwanie pomocy w
        przypadku zagrożenia życia lub zdrowia. W
        wielu krajach jest dostępny jako bezpłatny
        numer alarmowy, który można wywołać z
        każdego telefonu komórkowego...</Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>Policja</Text>
          <Text style={styles.title}>{police}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(police)}>
          <Image
            source={require('./assets/phoneimg.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Numer 112 to europejski numer alarmowy,
        który umożliwia szybkie wezwanie pomocy w
        przypadku zagrożenia życia lub zdrowia. W
        wielu krajach jest dostępny jako bezpłatny
        numer alarmowy, który można wywołać z
        każdego telefonu komórkowego...</Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>GOPR</Text>
          <Text style={styles.title}>{GOPR}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(GOPR)}>
          <Image
            source={require('./assets/phoneimg.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Numer 112 to europejski numer alarmowy,
        który umożliwia szybkie wezwanie pomocy w
        przypadku zagrożenia życia lub zdrowia. W
        wielu krajach jest dostępny jako bezpłatny
        numer alarmowy, który można wywołać z
        każdego telefonu komórkowego...</Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>WOPR</Text>
          <Text style={styles.title}>{WOPR}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(WOPR)}>
          <Image
            source={require('./assets/phoneimg.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Numer 112 to europejski numer alarmowy,
        który umożliwia szybkie wezwanie pomocy w
        przypadku zagrożenia życia lub zdrowia. W
        wielu krajach jest dostępny jako bezpłatny
        numer alarmowy, który można wywołać z
        każdego telefonu komórkowego...</Text>
      </View>
      
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: '#000000'
  },
  buttoncontainer: {
    fontSize: 24,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3ba118',
    width: '100%', 
    padding: 20,
  },
  phonecontainer: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  image: {
    width: 60, 
    height: 60,
    margin: 3,
  },
  textcontainer: {
    backgroundColor: '#9fffc7',
    margin: 0,
    width: '100%', 
    padding: 20,
  },
  text: {
    fontSize: 15,
    color: '#000000'
  },
  
});

export default Numbers;
