import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Medicines = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podstrona leków</Text>
      {/* Tutaj umieść zawartość podstrony */}
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
});

export default Medicines;
