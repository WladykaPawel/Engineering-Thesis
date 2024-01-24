import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const Prevention = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [selectedSection, setSelectedSection] = useState('userInfo');
  const [waga, setWaga] = useState('');
  const [tetno, setTetno] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [userRecords, setUserRecords] = useState([]);

  const db = SQLite.openDatabase({ name: 'UserInfo.db', location: 'default' });

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS UserInfo (id INTEGER PRIMARY KEY AUTOINCREMENT, waga TEXT, tetno TEXT, temperatura TEXT, znacznikCzasu TEXT)',
        [],
        () => {
          console.log('Tabela danych zdrowotnych została utworzona lub już istnieje.');
        },
        (error) => {
          console.error('Błąd podczas tworzenia tabeli:', error);
        }
      );
    });

    fetchUserRecords();
  }, []);

  const fetchUserRecords = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM UserInfo ORDER BY znacznikCzasu DESC',
        [],
        (tx, results) => {
          const len = results.rows.length;
          const records = [];
          for (let i = 0; i < len; i++) {
            records.push(results.rows.item(i));
          }
          setUserRecords(records);
        },
        (error) => {
          console.error('Błąd podczas pobierania danych użytkownika:', error);
        }
      );
    });
  };
  
  const confirmDeleteInfo = (id) => {
    Alert.alert(
      'Potwierdzenie',
      `Czy na pewno chcesz usunąć wpis?`,
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          onPress: () => DeleteInfo(id),
        },
      ],
      { cancelable: false }
    );
  };


  const DeleteInfo = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM UserInfo WHERE id = ?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('informacja została usunięta z bazy danych');
            fetchUserRecords();
          } else {
            console.log('Usunięcie informacji nie powiodło się');
          }
        },
        (error) => {
          console.error('Błąd SQL podczas usuwania informacji:', error);
        }
      );
    });
  };

  const calculateBMI = () => {
    if (weight && height) {
      const weightKg = parseFloat(weight);
      const heightM = parseFloat(height) / 100;
      const calculatedBMI = (weightKg / (heightM * heightM)).toFixed(2);
      setBMI(calculatedBMI);
    } else {
      setBMI(null);
    }
  };

  const getHealthStatus = () => {
    if (bmi) {
      if (bmi < 18.5) {
        return 'Niedowaga';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        return 'Waga prawidłowa';
      } else if (bmi >= 25 && bmi < 29.9) {
        return 'Nadwaga';
      }  else if (bmi >= 30 && bmi < 34.9) {
        return 'Otyłość';
      }  else {
        return 'Otyłość II stopnia';
      }
    }
    return '';
  };

  const healthStatus = getHealthStatus();


  const SafeToDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO UserInfo (waga, tetno, temperatura, znacznikCzasu) VALUES (?, ?, ?, ?)',
        [waga, tetno, temperatura, new Date().toISOString()],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Dane zdrowotne zostały zapisane do bazy danych');
            fetchUserRecords();
          } else {
            console.log('Nie udało się zapisać danych zdrowotnych do bazy danych');
          }
        },
        (error) => {
          console.error('Błąd wykonania zapytania SQL:', error);
        }
      );
    });
  };
  
  

  const renderInfo = () => {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profilaktyka Zdrowia</Text>

        <View style={styles.textcontainer}>
          <Text style={styles.subtitle}>Dlaczego profilaktyka jest ważna?</Text>
          <Text style={styles.content}>
            Profilaktyka zdrowia jest kluczowym aspektem dbania o własne zdrowie. Zapobieganie chorobom i utrzymanie
            dobrej kondycji fizycznej i psychicznej to cele profilaktyki. Oto kilka ważnych kwestii:
          </Text>
        </View>
        <View style={styles.textcontainer}>
          <Text style={styles.subtitle}>Zasady Profilaktyki:</Text>
          <Text style={styles.listItem}>1. Regularne wizyty u lekarza i badania kontrolne.</Text>
          <Text style={styles.listItem}>2. Zdrowa dieta oparta na warzywach, owocach, pełnoziarnistych produktach zbożowych i białkach.</Text>
          <Text style={styles.listItem}>3. Regularna aktywność fizyczna, np. 30 minut ćwiczeń dziennie.</Text>
          <Text style={styles.listItem}>4. Unikanie palenia papierosów i nadmiernego spożywania alkoholu.</Text>
          <Text style={styles.listItem}>5. Regularny sen i redukcja stresu.</Text>
        </View>
      
        <View style={styles.textcontainer}>
          <Text style={styles.subtitle}>Zdrowa Dieta:</Text>
          <Text style={styles.content}>
            Zdrowa dieta jest kluczowa dla profilaktyki. Staraj się spożywać różnorodne produkty, unikaj przetworzonej żywności
            i ogranicz sól, cukry i tłuszcze nasycone.
          </Text>
          </View>

        <View style={styles.textcontainer}>
          <Text style={styles.subtitle}>Aktywność Fizyczna:</Text>
          <Text style={styles.content}>
            Regularna aktywność fizyczna wspomaga utrzymanie zdrowia. Wybierz aktywność, którą lubisz, np. spacery, bieganie,
            jazdę na rowerze lub pływanie.
          </Text>
        </View>


        <View style={styles.textcontainer}>
          <Text style={styles.subtitle}>Badania Kontrolne:</Text>
          <Text style={styles.content}>
            Nie zapominaj o regularnych wizytach u lekarza i badaniach kontrolnych. Wczesne wykrycie chorób znacząco zwiększa
            szanse na skuteczne leczenie.
          </Text>
        </View>

      </ScrollView>
    );
  }

  const renderUserInfo = () => {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Informacje o Użytkowniku</Text>
  
        <Text style={styles.content}>Waga (kg):</Text>
        <TextInput
          style={styles.input}
          placeholder="Waga"
          keyboardType="numeric"
          onChangeText={(text) => setWaga(text)}
        />
  
        <Text style={styles.content}>Tętno:</Text>
        <TextInput
          style={styles.input}
          placeholder="Tętno"
          onChangeText={(text) => setTetno(text)}
        />
  
        <Text style={styles.content}>Temperatura (w Celcjuszach): </Text>
        <TextInput
          style={styles.input}
          placeholder="Temperatura"
          keyboardType="numeric"
          onChangeText={(text) => setTemperatura(text)}
        />
  
        <TouchableOpacity onPress={SafeToDatabase}>
         <Text style={styles.calculateButton}>Zapisz Dane Zdrowotne</Text>
        </TouchableOpacity>

      <Text style={styles.title}>Historia Danych Zdrowotnych</Text>

      {userRecords.map((item) => (
              <View key={item.id} style={styles.textcontainer}>
                <Text style={styles.content}>Data i czas pomiaru: {new Date(item.znacznikCzasu).toLocaleString()}</Text>
                <Text style={styles.content}>Waga (kg): {item.waga}</Text>
                <Text style={styles.content}>Tętno: {item.tetno}</Text>
                <Text style={styles.content}>Temperatura: {item.temperatura}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDeleteInfo(item.id)}
                >
                  <Image
                    source={require('./assets/trash.png')}
                    style={styles.iconKosza}
                  />
                </TouchableOpacity>
              </View>
              
            ))}
    </ScrollView>
    );
  };
  

  const renderCalculator = () => {
    return (
      <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Kalkulator BMI:</Text>
            <View style={styles.textcontainer}>
              <Text style={styles.content}>Podaj wagę (kg):</Text>
              <TextInput
                style={styles.input}
                placeholder="Waga"
                keyboardType="numeric"
                onChangeText={(text) => setWeight(text)}
              />
              <Text style={styles.content}>Podaj wzrost (cm):</Text>
              <TextInput
                style={styles.input}
                placeholder="Wzrost"
                keyboardType="numeric"
                onChangeText={(text) => setHeight(text)}
              />
              <TouchableOpacity onPress={calculateBMI}>
                <Text style={styles.calculateButton}>Oblicz BMI</Text>
              </TouchableOpacity>
              {bmi && <Text style={styles.result}>Twoje BMI: {bmi}</Text>}
              {bmi && <Text style={styles.result}>Stan zdrowia: {healthStatus}</Text>}
            </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {selectedSection === 'userInfo' && renderUserInfo()}
      {selectedSection === 'info' && renderInfo()}
      {selectedSection === 'calculator' && renderCalculator()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedSection === 'userInfo' && styles.selectedButton]}
          onPress={() => setSelectedSection('userInfo')}
        >
          <Text style={styles.toggleButtonText}>Informacje o użytkowniku</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, selectedSection === 'info' && styles.selectedButton]}
          onPress={() => setSelectedSection('info')}
        >
          <Text style={styles.toggleButtonText}>Porady Zdrowotne</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, selectedSection === 'calculator' && styles.selectedButton]}
          onPress={() => setSelectedSection('calculator')}
        >
          <Text style={styles.toggleButtonText}>Kalkulator BMI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#00ab99',
    marginBottom: 50,
    minHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16, 
  },
  textcontainer: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  calculateButton:{
    backgroundColor: '#008577',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
    fontSize: 20,
  },
  image:{
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#008577',
  },
});

export default Prevention;