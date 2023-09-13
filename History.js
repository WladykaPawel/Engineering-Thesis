import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const PastAppointments = () => {
  const [pastAppointments, setPastAppointments] = useState([]);
  const db = SQLite.openDatabase({ name: 'appointments.db', location: 'default' });

  useEffect(() => {
    getPastAppointments();
  }, []);

  const getPastAppointments = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM appointments WHERE date < ?',
        [currentDate],
        (tx, results) => {
          const appointments = [];
          for (let i = 0; i < results.rows.length; i++) {
            appointments.push(results.rows.item(i));
          }
          setPastAppointments(appointments);
        },
        (error) => {
          console.error('Błąd SQL:', error);
        }
      );
    });
  };

  const renderPastAppointments = () => {
    if (pastAppointments.length === 0) {
      return <Text>Brak przeszłych wizyt</Text>;
    }

    return (
      <ScrollView style={styles.scrollView}>
        <Text>Twoje przeszłe wizyty</Text>
        {pastAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <Text>Data wizyty: {appointment.date}</Text>
            <Text>Lekarz: {appointment.doctor_name}</Text>
            <Text>Lokalizacja: {appointment.location}</Text>
            <Text>Numer gabinetu/pokoju: {appointment.room_number}</Text>
            <Text>Informacje dodatkowe: {appointment.additional_info}</Text>
            <Text>Godzina wizyty: {appointment.appointment_time}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderPastAppointments()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
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
});

export default PastAppointments;
