import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image, FlatList} from 'react-native';
import { ScrollView } from 'react-native';


const phoneNumber = '112';
const police = '997';
const firefighting = '998';
const emergency = '999';
const GOPR = '601-100-300';
const WOPR = '601-100-100';
const TIP = '800-190-590';
const TPK = '800-137-200';


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
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Numer alarmowy 112 wybieraj w sytuacjach alarmowych, w których niezbędna jest pomoc Policji, Państwowej Straży Pożarnej lub pogotowia
        ratunkowego i gdy wymagane są natychmiastowe działania tych służb.</Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>Pogotowie Ratunkowe</Text>
          <Text style={styles.title}>{emergency}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(emergency)}>
          <Image
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Numer Pogotowia Ratunkowego wybieraj w sytuacjach alarmowych, w których niezbędna 
        jest pomoc pogotowia ratunkowego i wymagane jest natychmiastowe działanie tych służb. </Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>Telefoniczna Informacja Pacjenta</Text>
          <Text style={styles.title}>{TIP}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(TIP)}>
          <Image
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Dzwoniąc pod bezpłatny numer TIP - 800 190 590 - uzyskasz szybką i kompleksową informację dotyczącą praw pacjenta 
        oraz funkcjonowania systemu 
        ochrony zdrowia w Polsce</Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>Teleplatforma Pierwszego Kontaktu</Text>
          <Text style={styles.title}>{TPK}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(TPK)}>
          <Image
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
        Dzwoniąc pod bezpłatny numer TPK - 800 137 200 - otrzymasz niezbędną pomoc medyczną poza godzinami pracy lekarzy rodzinnych, w weekendy oraz święta</Text>
      </View>


      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>Policja</Text>
          <Text style={styles.title}>{police}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(police)}>
          <Image
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
      Gdy zachodzi potrzeba interwencji policyjnej w sytuacjach związanych z przestępstwem, 
      awanturą lub innymi pilnymi incydentami, skontaktuj się z lokalnym numerem alarmowym Policji: 997.</Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>Straż Pożarna</Text>
          <Text style={styles.title}>{firefighting}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(firefighting)}>
          <Image
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
      W przypadku zagrożenia pożarem, wybuchu lub innego niebezpiecznego zdarzenia związanego z ogniem, 
      zadzwoń na numer alarmowy Straży Pożarnej, który wynosi 998.</Text>
      </View>


      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>GOPR</Text>
          <Text style={styles.title}>{GOPR}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(GOPR)}>
          <Image
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
      W obszarach górskich, w przypadku wypadków w trudno dostępnych terenach, skorzystaj z numeru alarmowego GOPR, 
      który jest dostępny pod numerem 601-100-300. Opisz dokładnie sytuację oraz swoją lokalizację, 
      aby ekipa GOPR mogła udzielić pomocy w terenie.</Text>
      </View>

      <View style={styles.buttoncontainer} >
        <View style={styles.phonecontainer}>
          <Text style={styles.title}>WOPR</Text>
          <Text style={styles.title}>{WOPR}</Text>
        </View>
        <TouchableOpacity onPress={() => handleCall(WOPR)}>
          <Image
            source={require('./assets/phone2.png')}
            style={styles.image}
            resizeMode="contain"
          />
          </TouchableOpacity>
      </View>
      <View style={styles.textcontainer}>
      <Text style={styles.text}>
      Podczas incydentów związanych z tonięciem, utonięciami lub innymi sytuacjami nad wodą, zadzwoń na numer alarmowy WOPR, 
      który jest dostępny pod numerem  601-100-100. 
      Szybko przekazaj informacje dotyczące lokalizacji i rodzaju zagrożenia, aby WOPR mogło skierować odpowiednie siły na ratunek. </Text>
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
    color: '#f9dbd2',
    maxWidth: 300,
  },
  buttoncontainer: {
    fontSize: 24,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#008577',
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
    backgroundColor: '#ffffff',
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
