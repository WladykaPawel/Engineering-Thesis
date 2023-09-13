import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { Linking } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorName, setDoctorName] = useState('');
  const [location, setLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isAddAppointmentFormVisible, setIsAddAppointmentFormVisible] = useState(false);
  const [selectedPdfUri, setSelectedPdfUri] = useState(''); 
  const [selectedPdfName, setSelectedPdfName] = useState('');
  


  const db = SQLite.openDatabase({ name: 'appointments.db', location: 'default' });

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT,
          doctor_name TEXT,
          location TEXT,
          room_number TEXT,
          additional_info TEXT,
          appointment_time TEXT,
          images TEXT
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

    getUpcomingAppointments();
  }, []);
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Specify the allowed file types
      });
  
      if (result) {
        setSelectedPdfUri(result.uri);
        setSelectedPdfName(result.name);
        console.log(
          'Document picked: ' + result.uri,
          result.type, // mime type
          result.name, // file name
          result.size // file size (in bytes)
        );
      } else {
        console.log('No document picked');
      }
    } catch (err) {
      console.error('Error picking document:', err);
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picking canceled');
      } else {
        throw err;
      }
    }
  };
  
  

  const insertAppointment = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO appointments (date, doctor_name, location, room_number, additional_info, appointment_time, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          selectedDate.toISOString(),
          doctorName,
          location,
          roomNumber,
          additionalInfo,
          selectedTime,
          selectedPdfUri, // Dodaj ścieżkę do pliku PDF do bazy danych
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Wizyta została dodana do bazy danych');
            getUpcomingAppointments();
            resetForm();
          } else {
            console.error('Dodawanie wizyty do bazy danych nie powiodło się');
          }
        },
        (error) => {
          console.error('Błąd SQL podczas wstawiania wizyty:', error);
        }
      );
    });
  };
  const openPdf = (pdfUri) => {
    // Upewnij się, że pdfUri jest poprawnym adresem URL do pliku PDF
    if (pdfUri && typeof pdfUri === 'string') {
      Linking.openURL(pdfUri)
        .then(() => {
          console.log('Plik PDF został otwarty');
        })
        .catch((error) => {
          console.error('Błąd podczas otwierania pliku PDF:', error);
        });
    } else {
      console.error('Nieprawidłowy adres URL pliku PDF');
    }
  };
  const deleteAppointment = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM appointments WHERE id = ?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Wizyta została usunięta z bazy danych');
            getUpcomingAppointments();
          } else {
            console.log('Usunięcie wizyty nie powiodło się');
          }
        },
        (error) => {
          console.error('Błąd SQL podczas usuwania wizyty:', error);
        }
      );
    });
  };

  const getUpcomingAppointments = () => {
    const currentDate = new Date();
    const nextWeekDate = new Date();
    nextWeekDate.setDate(currentDate.getDate() + 7);
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(currentDate.getMonth() + 1);

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM appointments',
        [],
        (tx, results) => {
          const allAppointments = [];
          for (let i = 0; i < results.rows.length; i++) {
            const appointment = results.rows.item(i);
            allAppointments.push(appointment);
          }

          const nearest7Days = allAppointments.filter((appointment) =>
            new Date(appointment.date) <= nextWeekDate
          );
          const nearestMonth = allAppointments.filter((appointment) =>
            new Date(appointment.date) > nextWeekDate &&
            new Date(appointment.date) <= nextMonthDate
          );
          const further = allAppointments.filter((appointment) =>
            new Date(appointment.date) > nextMonthDate
          );

          setAppointments({
            nearest7Days: nearest7Days.sort((a, b) => new Date(a.date) - new Date(b.date)),
            nearestMonth: nearestMonth.sort((a, b) => new Date(a.date) - new Date(b.date)),
            further: further.sort((a, b) => new Date(a.date) - new Date(b.date)),
          });
        }
      );
    });
  };

  const resetForm = () => {
    setDoctorName('');
    setLocation('');
    setRoomNumber('');
    setAdditionalInfo('');
    setSelectedTime('');
  };

  const handleTimeChange = (event, selected) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selected) {
      const hours = selected.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 });
      const minutes = selected.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 });
      const formattedTime = `${hours}:${minutes}`;
      setSelectedTime(formattedTime);
    }
  };

  const renderAppointments = () => {
    return (
      <ScrollView style={styles.scrollView}>
        <Text>Najbliższe 7 dni</Text>
        {renderAppointmentsSection(appointments.nearest7Days)}

        <Text>Najbliższy miesiąc</Text>
        {renderAppointmentsSection(appointments.nearestMonth)}

        <Text>Dalsze</Text>
        {renderAppointmentsSection(appointments.further)}
      </ScrollView>
    );
  };

  const renderAppointmentsSection = (sectionAppointments) => {
    return (
      <View>
        {sectionAppointments && sectionAppointments.length > 0 && sectionAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <Text>Data wizyty: {appointment.date}</Text>
            <Text>Lekarz: {appointment.doctor_name}</Text>
            <Text>Lokalizacja: {appointment.location}</Text>
            <Text>Numer gabinetu/pokoju: {appointment.room_number}</Text>
            <Text>Informacje dodatkowe: {appointment.additional_info}</Text>
            <Text>Godzina wizyty: {appointment.appointment_time}</Text>
              <View>
                <Text>Wybrany plik PDF: {selectedPdfName}</Text>
                <TouchableOpacity onPress={() => openPdf(selectedPdfUri)}>
                  <Text style={styles.openPdfButton}>Otwórz PDF</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteAppointment(appointment.id)}
            >
              <Text style={styles.deleteButtonText}>Usuń wizytę</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderAddAppointmentForm = () => {
    return (
      <ScrollView style={styles.formContainer}>
        <Text style={styles.formTitle}>Dodaj nową wizytę</Text>
        <TextInput
          style={styles.input}
          placeholder="Imię i nazwisko lekarza"
          value={doctorName}
          onChangeText={(text) => setDoctorName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Lokalizacja"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Numer gabinetu/pokoju"
          value={roomNumber}
          onChangeText={(text) => setRoomNumber(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Informacje dodatkowe"
          value={additionalInfo}
          onChangeText={(text) => setAdditionalInfo(text)}
        />

        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={styles.timePickerButton}>Wybierz godzinę wizyty</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}
        <Text style={styles.input}>Wybrana godzina: {selectedTime}</Text>

        <Text>Wybierz datę wizyty</Text>
        <Calendar
          current={selectedDate.toISOString().split('T')[0]}
          onDayPress={(day) => setSelectedDate(new Date(day.timestamp))}
          minDate={new Date().toISOString().split('T')[0]}
          markedDates={{
            [selectedDate.toISOString().split('T')[0]]: { selected: true, selectedColor: 'blue' },
          }}
          theme={{
            calendarBackground: 'white',
            textSectionTitleColor: 'blue',
            selectedDayBackgroundColor: 'blue',
            selectedDayTextColor: 'white',
          }}
        />

        <TouchableOpacity onPress={pickDocument}>
          <Text style={styles.pickPdfButton}>Wybierz plik PDF</Text>
        </TouchableOpacity>
        <Text>Wybrany plik PDF: {selectedPdfName}</Text>


        <TouchableOpacity style={styles.addButton} onPress={() => insertAppointment()}>
          <Text style={styles.addButtonText}>Dodaj wizytę</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {isAddAppointmentFormVisible ? renderAddAppointmentForm() : renderAppointments()}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsAddAppointmentFormVisible(!isAddAppointmentFormVisible)}
        >
          <Text style={styles.toggleButtonText}>
            {isAddAppointmentFormVisible ? 'Pokaż wizyty' : 'Pokaż formularz'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: 'blue',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  appointmentItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
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
  pickPdfButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: 'blue',
  },
  openPdfButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: 'blue',
  },
  
  
});

export default Appointments;
