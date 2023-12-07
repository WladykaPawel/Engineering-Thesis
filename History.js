import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  Button
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ImageZoom from 'react-native-image-pan-zoom';

const History = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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
    const today= new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().slice(0, 10);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT appointments.*, appointment_images.image_uri FROM appointments LEFT JOIN appointment_images ON appointments.id = appointment_images.appointment_id WHERE date <= ? ORDER BY date DESC ',
      [tomorrowString],
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


  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const renderAppointments = () => {
    if (appointments.length === 0) {
      return <Text>Brak przeszłych wizyt</Text>;
    }
    return (
      <ScrollView style={styles.scrollView}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <Text>Data wizyty: {new Date(appointment.date).toLocaleDateString()}</Text>
            <Text>Lekarz: {appointment.doctor_name}</Text>
            <Text>Lokalizacja: {appointment.location}</Text>
            <Text>Numer gabinetu/pokoju: {appointment.room_number}</Text>
            <Text>Informacje dodatkowe: {appointment.additional_info}</Text>
            <Text>Godzina wizyty: {appointment.appointment_time}</Text>

            {/* <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteAppointment(appointment.id)}
            >
              <Image
                source={require('./assets/trash.png')}
                style={styles.iconKosza} 
              />
            </TouchableOpacity> */}

            <View style={styles.imageContainer}>
              {appointment.images.map((imageUri, index) => (
                <View key={index}>
                  <TouchableOpacity key={index} onPress={() => openImageModal(imageUri)}>
                   <Image source={{ uri: imageUri }} style={styles.appointmentImage} />
                  </TouchableOpacity>

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
      <Modal visible={selectedImage !== null} transparent={true}>
          <View style={styles.modalContainer}>
            <ImageZoom
              cropWidth={Dimensions.get('window').width}
              cropHeight={Dimensions.get('window').height}
              imageWidth={Dimensions.get('window').width-20}
              imageHeight={Dimensions.get('window').height-100}
            >
              <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            </ImageZoom>
            <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00ab99',
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
    backgroundColor: '#008577',
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
    backgroundColor: '#005249',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    flex: 1,

  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default History;
