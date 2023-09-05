import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import SQLite from 'react-native-sqlite-storage';

const Medicines = () => {
  const [selectedTab, setSelectedTab] = useState('leki');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoseCount, setSelectedDoseCount] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [medicineName, setMedicineName] = useState('');
  const [medicineDosage, setMedicineDosage] = useState('');
  const [doseCountInput, setDoseCountInput] = useState('');
  const [dosingSchedule, setDosingSchedule] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dosingTimes, setDosingTimes] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [inactiveMedicines, setInactiveMedicines] = useState([]);

  const db = SQLite.openDatabase({ name: 'medicines.db', location: 'default' });

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS medicines (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          dosage TEXT,
          start_date TEXT,
          end_date TEXT,
          dose_count INTEGER,
          dosing_schedule TEXT,
          dosing_times TEXT
        )`,
        [],
        () => {
          console.log('Tabela została utworzona lub już istnieje.');
        },
        (error) => {
          console.error('Błąd podczas tworzenia tabeli:', error);
        }
      );
    });
    getActiveMedicines();
    getInactiveMedicines();
  }, []);

  const addMedicineToDatabase = (medicineData) => {
    console.log('Dodawanie leku do bazy danych:', medicineData);
  
    // Sprawdź, czy przynajmniej jedna godzina przyjmowania została podana
    if (medicineData.dosing_times.some((time) => time !== '')) {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO medicines (name, dosage, start_date, end_date, dose_count, dosing_schedule, dosing_times) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            medicineData.name,
            medicineData.dosage,
            medicineData.start_date,
            medicineData.end_date,
            selectedDoseCount,
            medicineData.dosing_schedule,
            medicineData.dosing_times.join(','), // Połącz godziny przyjmowania w jeden ciąg
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Lek został dodany do bazy danych');
              getActiveMedicines();
              getInactiveMedicines();
            } else {
              console.log('Dodawanie leku do bazy danych nie powiodło się');
            }
          },
          (error) => {
            console.error('Błąd SQL:', error);
          }
        );
      });
    } else {
      console.log('Nie wprowadzono odpowiedniej ilości godzin przyjmowania.');
    }
  };
  

  const deleteMedicine = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM medicines WHERE id = ?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Lek został usunięty z bazy danych');
            getActiveMedicines();
            getInactiveMedicines();
          } else {
            console.log('Usunięcie leku nie powiodło się');
          }
        },
        (error) => {
          console.error('Błąd SQL podczas usuwania leku:', error);
        }
      );
    });
  };

  const getActiveMedicines = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM medicines WHERE start_date <= ? AND end_date >= ?',
        [currentDate, currentDate],
        (tx, results) => {
          const activeMedicines = [];
          for (let i = 0; i < results.rows.length; i++) {
            activeMedicines.push(results.rows.item(i));
          }
          setMedicines(activeMedicines);
        }
      );
    });
  };

  const getInactiveMedicines = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM medicines WHERE (start_date > ? OR end_date < ?)',
        [currentDate, currentDate],
        (tx, results) => {
          const inactiveMedicines = [];
          for (let i = 0; i < results.rows.length; i++) {
            inactiveMedicines.push(results.rows.item(i));
          }
          setInactiveMedicines(inactiveMedicines);
        },
        (error) => {
          console.error('Błąd SQL podczas pobierania nieaktywnych leków:', error);
        }
      );
    });
  };

  const handleDayPress = (day) => {
    if (!startDate) {
      // Wybór pierwszej daty zakresu
      setStartDate(day.dateString);
      setMarkedDates({
        [day.dateString]: { selected: true, startingDay: true, endingDay: true },
      });
    } else if (!endDate) {
      // Wybór drugiej daty zakresu
      const range = getDatesRange(startDate, day.dateString);
      const markedDatesCopy = { ...markedDates };

      range.forEach((date) => {
        markedDatesCopy[date] = { selected: true, color: 'blue' };
      });

      setEndDate(day.dateString);
      setMarkedDates(markedDatesCopy);
    } else {
      // Resetowanie wyboru
      setStartDate('');
      setEndDate('');
      setMarkedDates({});
    }
  };

  const getDatesRange = (startDate, endDate) => {
    const range = [];
    const currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      range.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return range;
  };

  const handleDosingTimeChange = (index, text) => {
    const updatedDosingTimes = [...dosingTimes];
    updatedDosingTimes[index] = text;
    setDosingTimes(updatedDosingTimes);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'leki':
        return (
          <ScrollView style={styles.scrollView}>
            <Text>Aktywne</Text>
            {medicines.map((medicine) => (
              <View key={medicine.id} style={styles.medicineItem}>
                <Text>Nazwa leku: {medicine.name}</Text>
                <Text>Dawka: {medicine.dosage}</Text>
                <Text>Sposób przyjmowania: {medicine.dosing_schedule}</Text>
                <Text>Ilość dawek: {medicine.dose_count}</Text>
                <Text>Data rozpoczęcia: {medicine.start_date}</Text>
                <Text>Data zakończenia: {medicine.end_date}</Text>
                <Text>Godziny przyjmowania: {medicine.dosing_times}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteMedicine(medicine.id)}
                >
                  <Text style={styles.deleteButtonText}>Usuń lek</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        );
      case 'inne':
        return (
          <ScrollView style={styles.scrollView}>
            <Text>Nieaktywne</Text>
            {inactiveMedicines.map((medicine) => (
              <View key={medicine.id} style={styles.medicineItem}>
                <Text>Nazwa leku: {medicine.name}</Text>
                <Text>Dawka: {medicine.dosage}</Text>
                <Text>Sposób przyjmowania: {medicine.dosing_schedule}</Text>
                <Text>Ilość dawek: {medicine.dose_count}</Text>
                <Text>Data rozpoczęcia: {medicine.start_date}</Text>
                <Text>Data zakończenia: {medicine.end_date}</Text>
                <Text>Godziny przyjmowania: {medicine.dosing_times}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteMedicine(medicine.id)}
                >
                  <Text style={styles.deleteButtonText}>Usuń lek</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        );
      case 'inne2':
        return (
          <ScrollView style={styles.scrollView}>
            <TextInput
              placeholder="Nazwa leku"
              onChangeText={(text) => setMedicineName(text)}
              value={medicineName}
              style={styles.filing_place}
            />
            <TextInput
              placeholder="Dawka leku"
              onChangeText={(text) => setMedicineDosage(text)}
              value={medicineDosage}
              style={styles.filing_place}
            />
            <Picker
              selectedValue={doseCountInput}
              onValueChange={(itemValue) => setDoseCountInput(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Wybierz ilość dawek" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              {/* Dodaj więcej opcji w zależności od potrzeb */}
            </Picker>

            {doseCountInput && parseInt(doseCountInput) > 0 && (
              <View>
                <Text>Godziny przyjmowania:</Text>
                {[...Array(parseInt(doseCountInput))].map((_, index) => (
                  <TextInput
                    key={index}
                    placeholder={`Godzina ${index + 1}`}
                    onChangeText={(text) => handleDosingTimeChange(index, text)}
                    value={dosingTimes[index] || ''}
                    style={styles.filing_place}
                  />
                ))}
              </View>
            )}

            <Text>Wybierz zakres dat:</Text>
            <Calendar
              current={selectedDate}
              markedDates={markedDates}
              onDayPress={handleDayPress}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                addMedicineToDatabase({
                  name: medicineName,
                  dosage: medicineDosage,
                  start_date: startDate,
                  end_date: endDate,
                  dose_count: doseCountInput,
                  dosing_schedule: dosingSchedule,
                  dosing_times: dosingTimes,
                })
              }
            >
              <Text style={styles.addButtonText}>Dodaj lek</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podstrona leków</Text>
      {renderContent()}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'leki' && styles.selectedTab,
          ]}
          onPress={() => {
            setSelectedTab('leki');
            getActiveMedicines();
          }}
        >
          <Text style={styles.tabText}>Aktywne</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'inne' && styles.selectedTab,
          ]}
          onPress={() => {
            setSelectedTab('inne');
            getInactiveMedicines();
          }}
        >
          <Text style={styles.tabText}>Nieaktywne</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'inne2' && styles.selectedTab,
          ]}
          onPress={() => setSelectedTab('inne2')}
        >
          <Text style={styles.tabText}>Dodaj nowy lek</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#3ba118',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    width: '95%',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedTab: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 50,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  medicineItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#9dfbb2',
  },
  filing_place: {
    width: '100%',
    backgroundColor: '#9dfbb2',
    marginBottom: 10,
  },
});

export default Medicines;
