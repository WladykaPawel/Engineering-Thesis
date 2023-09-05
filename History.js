import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDate: '',
      selectedEndDate: '',
      markedDates: {},
    };
  }

  handleDayPress = (day) => {
    const { selectedStartDate, selectedEndDate } = this.state;

    if (!selectedStartDate) {
      // Wybór pierwszej daty zakresu
      this.setState({
        selectedStartDate: day.dateString,
        selectedEndDate: '',
        markedDates: {
          [day.dateString]: { selected: true, startingDay: true, endingDay: true },
        },
      });
    } else if (!selectedEndDate) {
      // Wybór drugiej daty zakresu
      const range = this.createDateRange(selectedStartDate, day.dateString);
      const markedDates = {};

      range.forEach((date) => {
        markedDates[date] = { selected: true, color: 'blue' };
      });

      this.setState({
        selectedEndDate: day.dateString,
        markedDates: {
          ...this.state.markedDates,
          ...markedDates,
        },
      });
    } else {
      // Resetowanie wyboru
      this.setState({
        selectedStartDate: day.dateString,
        selectedEndDate: '',
        markedDates: {
          [day.dateString]: { selected: true, startingDay: true, endingDay: true },
        },
      });
    }
  };

  createDateRange = (start, end) => {
    const startDate = moment(start);
    const endDate = moment(end);
    const range = [];

    while (startDate <= endDate) {
      range.push(startDate.format('YYYY-MM-DD'));
      startDate.add(1, 'days');
    }

    return range;
  };

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;

    return (
      <View style={styles.container}>
        <Calendar
          onDayPress={this.handleDayPress}
          markedDates={this.state.markedDates}
        />
        <View style={styles.selectionContainer}>
          <Text>Wybrany zakres dat:</Text>
          <Text>
            {selectedStartDate && selectedEndDate
              ? `${selectedStartDate} - ${selectedEndDate}`
              : 'Brak wybranego zakresu'}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  selectionContainer: {
    padding: 16,
  },
});

export default History;
