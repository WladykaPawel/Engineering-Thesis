import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const History = () => {
  const [appointments, setAppointments] = useState([]);

  const db = SQLite.openDatabase({ name: 'appointments.db', location: 'default' });

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, doctor_name TEXT, location TEXT, room_number TEXT, additional_info TEXT, appointment_time TEXT)'
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS appointment_images (id INTEGER PRIMARY KEY AUTOINCREMENT, appointment_id INTEGER, image_uri TEXT)'
      );
    });

    getAppointments();
  }, []);

  const getAppointments = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT appointments.*, appointment_images.image_uri FROM appointments LEFT JOIN appointment_images ON appointments.id = appointment_images.appointment_id',
        [],
        (tx, results) => {
          const appointmentsWithImages = [];
          let currentAppointment = null;

          for (let i = 0; i < results.rows.length; i++) {
            const appointment = results.rows.item(i);

            if (currentAppointment === null || currentAppointment.id !== appointment.id) {
              currentAppointment = {
                ...appointment,
                images: appointment.image_uri ? [appointment.image_uri] : [],
              };
              appointmentsWithImages.push(currentAppointment);
            } else if (appointment.image_uri) {
              currentAppointment.images.push(appointment.image_uri);
            }
          }

          setAppointments(appointmentsWithImages);
        }
      );
    });
  };

  const deleteImage = (appointmentId, imageUri) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM appointment_images WHERE appointment_id = ? AND image_uri = ?',
        [appointmentId, imageUri],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Zdjęcie zostało usunięte.');
            getAppointments();
          } else {
            console.log('Usunięcie zdjęcia nie powiodło się');
          }
        },
        (error) => {
          console.error('Błąd SQL podczas usuwania zdjęcia:', error);
        }
      );
    });
  };

  const addImage = (appointmentId) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (result) => {
        if (!result.didCancel) {
          db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO appointment_images (appointment_id, image_uri) VALUES (?, ?)',
              [appointmentId, result.assets[0].uri],
              (tx, queryResult) => {
                if (queryResult.rowsAffected > 0) {
                  console.log('Zdjęcie zostało dodane.');
                  getAppointments();
                } else {
                  console.log('Dodawanie zdjęcia nie powiodło się');
                }
              },
              (error) => {
                console.error('Błąd SQL podczas dodawania zdjęcia:', error);
              }
            );
          });
        }
      }
    );
  };

  const renderAppointments = () => {
    return (
      <ScrollView style={styles.scrollView}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <Text>Data wizyty: {appointment.date}</Text>
            <Text>Lekarz: {appointment.doctor_name}</Text>
            <Text>Lokalizacja: {appointment.location}</Text>
            <Text>Numer gabinetu/pokoju: {appointment.room_number}</Text>
            <Text>Informacje dodatkowe: {appointment.additional_info}</Text>
            <Text>Godzina wizyty: {appointment.appointment_time}</Text>

            <View style={styles.imageContainer}>
              {appointment.images.map((imageUri, index) => (
                <View key={index}>
                  <Image source={{ uri: imageUri }} style={styles.appointmentImage} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteImage(appointment.id, imageUri)}
                  >
                    <Text style={styles.deleteButtonText}>Usuń zdjęcie</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => addImage(appointment.id)}>
              <Text style={styles.addButtonText}>Dodaj zdjęcie</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderAppointments()}
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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  appointmentImage: {
    width: 150,
    height: 100,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default History;
