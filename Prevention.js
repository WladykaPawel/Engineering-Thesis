import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from '@react-native-community/datetimepicker';

const Prevention = () => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [SwithButton, setSwithButton] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Tworzenie kanału powiadomień (tylko na Android)
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'channel-id',
          channelName: 'Nazwa kanału',
        },
        () => {}
      );
    }
  }, []);

  const handleTimeChange = (event, selected) => {
    if (event.type === 'dismissed') {
      // Użytkownik zamknął wybór czasu, nie rób nic
      return;
    }

    setShowTimePicker(false);

    if (selected) {
      setSelectedTime(selected);
    }
  };

  const sendImmediateNotification = () => {
    PushNotification.localNotification({
      channelId: 'channel-id', // Nazwa kanału
      title: 'Powiadomienie',
      message: 'To jest przykładowe natychmiastowe powiadomienie w React Native.',
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
    });

    console.log('Natychmiastowe powiadomienie wysłane');
  };

  const scheduleNotification = () => {
    if (selectedTime <= new Date()) {
      alert('Wybierz przyszłą godzinę.');
      return;
    }

    PushNotification.localNotificationSchedule({
      channelId: 'channel-id', // Nazwa kanału
      title: 'Powiadomienie',
      message: 'To jest przykładowe powiadomienie w React Native o konkretnej porze.',
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      date: new Date(selectedTime.getTime() + 3000),
      allowWhileIdle: true,
    });

    console.log('Powiadomienie zaplanowane na:', selectedTime);
    alert(`Powiadomienie zostanie wyświetlone o ${selectedTime.getHours()}:${selectedTime.getMinutes()}`);

    // Rozpocznij odliczanie
    startCountdown();
  };

  const switchButton = () => {
    setShowTimePicker(true);
    setSwithButton(true);
  };

  const startCountdown = () => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDifference = selectedTime - now;

      if (timeDifference <= 0) {
        clearInterval(intervalId);
        setCountdown(0);
      } else {
        setCountdown(Math.floor(timeDifference / 1000));
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test powiadomień</Text>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      
      {SwithButton ? (
        <TouchableOpacity onPress={() => switchButton()}>
         <Text style={styles.title} >Wybrana godzina: {selectedTime.getHours()}:{selectedTime.getMinutes()}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => switchButton()}>
          <Text style={styles.title2} >Wybierz godzinę</Text>
        </TouchableOpacity>
      )}
      <Button title="Natychmiastowe powiadomienie" onPress={sendImmediateNotification} />
      <Button title="Zaplanuj powiadomienie" onPress={scheduleNotification} />
      {countdown > 0 && <Text>Odliczanie: {countdown} sekund</Text>}
      {/* Tutaj umieść resztę zawartości podstrony */}
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
    fontSize: 36,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 24,
    backgroundColor: '#26c96a',
  },
});

export default Prevention;
