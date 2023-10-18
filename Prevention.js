import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from '@react-native-community/datetimepicker';

const UpcomingVisits = () => {
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (notificationTime > new Date()) {
        const timeDiff = notificationTime - new Date();
        const minutes = Math.floor((timeDiff % 3600000) / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [notificationTime]);

  const scheduleNotification = () => {
    PushNotification.localNotificationSchedule({
      title: 'Przypomnienie',
      message: 'Czas na wizytę lekarską!',
      date: notificationTime,
    });
    console.log('Ustawiono powiadomienie na czas' + notificationTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ustal godzinę powiadomienia</Text>
      <View style={styles.dateTimePicker}>
        <Button title="Ustaw godzinę" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={notificationTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              if (event.type === 'set') {
                setShowDatePicker(false);
                setNotificationTime(selectedTime);
              } else {
                setShowDatePicker(false);
              }
            }}
          />
        )}
      </View>
      <Text style={styles.notificationTime}>Czas powiadomienia: {notificationTime.toLocaleTimeString()}</Text>
      <Text style={styles.timeLeft}>Czas do powiadomienia: {timeLeft}</Text>
      <Button title="Ustaw powiadomienie" onPress={scheduleNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateTimePicker: {
    marginVertical: 20,
  },
  notificationTime: {
    fontSize: 18,
  },
  timeLeft: {
    fontSize: 18,
  },
});

export default UpcomingVisits;
