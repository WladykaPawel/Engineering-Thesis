import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';

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
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const db = SQLite.openDatabase({ name: 'appointments.db', location: 'default' });

  useEffect(() => {
    db.transaction((tx) => {
      // Create the "appointments" table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS appointments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT,
          doctor_name TEXT,
          location TEXT,
          room_number TEXT,
          additional_info TEXT,
          appointment_time TEXT
        )`,
        [],
        () => {
          console.log('Table "appointments" was created or already exists.');
        },
        (error) => {
          console.error('Error creating "appointments" table:', error);
        }
      );

      // Create the "appointment_images" table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS appointment_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          appointment_id INTEGER,
          image_uri TEXT
        )`,
        [],
        () => {
          console.log('Table "appointment_images" was created or already exists.');
        },
        (error) => {
          console.error('Error creating "appointment_images" table:', error);
        }
      );
    });

    getUpcomingAppointments();
  }, []);

  const insertAppointment = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO appointments (date, doctor_name, location, room_number, additional_info, appointment_time) VALUES (?, ?, ?, ?, ?, ?)',
        [selectedDate.toISOString(), doctorName, location, roomNumber, additionalInfo, selectedTime],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Appointment added to the database. Details:');
            console.log('Date: ' + selectedDate.toISOString());
            console.log('Doctor: ' + doctorName);
            console.log('Location: ' + location);
            console.log('Room Number: ' + roomNumber);
            console.log('Additional Info: ' + additionalInfo);
            console.log('Appointment Time: ' + selectedTime);

            getUpcomingAppointments();
            resetForm();
          } else {
            console.error('Adding appointment to the database failed');
          }
        },
        (error) => {
          console.error('SQL error while inserting appointment:', error);
        }
      );
    });
  };

  const getUpcomingAppointments = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM appointments ORDER BY date',
        [],
        (tx, results) => {
          const appointmentsData = [];
          for (let i = 0; i < results.rows.length; i++) {
            appointmentsData.push(results.rows.item(i));
          }
          setAppointments(appointmentsData);
        }
      );
    });
  };

  const deleteAppointment = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM appointments WHERE id = ?',
        [id],
        (tx, results) => {
          console.log('Appointment deleted from the database.');
          getUpcomingAppointments();
        },
        (error) => {
          console.error('SQL error while deleting appointment:', error);
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
      const hours = selected.getHours().toString().padStart(2, '0');
      const minutes = selected.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      setSelectedTime(formattedTime);
    }
  };

  const renderAppointments = () => {
    const currentDate = new Date();
    const upcomingAppointments = appointments.filter(appointmentDate => new Date(appointmentDate.date) >= currentDate);
    const oneWeekFromNow = new Date(currentDate);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const oneMonthFromNow = new Date(currentDate);
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  
    const upcomingAppointmentsThisWeek = upcomingAppointments.filter(appointmentDate => {
      return new Date(appointmentDate.date) >= currentDate && new Date(appointmentDate.date) < oneWeekFromNow;
    });
  
    const upcomingAppointmentsThisMonth = upcomingAppointments.filter(appointmentDate => {
      return new Date(appointmentDate.date) >= oneWeekFromNow && new Date(appointmentDate.date) < oneMonthFromNow;
    });
  
    const upcomingAppointmentsLater = upcomingAppointments.filter(appointmentDate => {
      return new Date(appointmentDate.date) >= oneMonthFromNow;
    });
  
    return (
      <ScrollView style={styles.scrollView}>
        <Section title="Najbliższy Tydzień" data={upcomingAppointmentsThisWeek} />
        <Section title="Najbliższy Miesiąc" data={upcomingAppointmentsThisMonth} />
        <Section title="Późniejsze" data={upcomingAppointmentsLater} />
      </ScrollView>
    );
  };
  
  
  const Section = ({ title, data }) => {
    return (
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <Text>Data wizyty: {new Date(appointment.date).toLocaleDateString()}</Text>
            <Text>Lekarz: {appointment.doctor_name}</Text>
            <Text>Lokalizacja: {appointment.location}</Text>
            <Text>Numer gabinetu/pokoju: {appointment.room_number}</Text>
            <Text>Informacje dodatkowe: {appointment.additional_info}</Text>
            <Text>Godzina wizyty: {appointment.appointment_time}</Text>
  
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteAppointment(appointment.id)}
          >
            <Image
              source={require('./assets/trash.png')} // Zaktualizuj ścieżkę do swojego pliku PNG
              style={styles.iconKosza} 
            />
          </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };
  

  const renderAddAppointmentForm = () => {
    return (
      <ScrollView style={styles.formContainer}>
        <Text style={styles.formTitle}>Add New Appointment</Text>
        <TextInput
          style={styles.input}
          placeholder="Doctor's Name"
          value={doctorName}
          onChangeText={(text) => setDoctorName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Room Number"
          value={roomNumber}
          onChangeText={(text) => setRoomNumber(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Additional Info"
          value={additionalInfo}
          onChangeText={(text) => setAdditionalInfo(text)}
        />

        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={styles.timePickerButton}>Select Appointment Time</Text>
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
        <Text style={styles.input}>Selected Time: {selectedTime}</Text>

        <Text>Select Appointment Date</Text>
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

        <TouchableOpacity style={styles.addButton} onPress={() => insertAppointment()}>
          <Text style={styles.addButtonText}>Add Appointment</Text>
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
    marginBottom: 13,
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
    margin: 20,
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
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appointmentImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
  },
  closeModalButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeModalText: {
    color: 'white',
  },
  imageContainer: {
    flexDirection: 'row',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '75%',
  },
  iconKosza: {
    width: 70, // Dostosuj szerokość ikony kosza do własnych potrzeb
    height: 70, // Dostosuj wysokość ikony kosza do własnych potrzeb
    resizeMode: 'contain', // Zachowuje proporcje i skaluje do określonych wymiarów
    marginLeft: 5, // Odstęp między ikoną a tekstem
  },
});

export default Appointments;
