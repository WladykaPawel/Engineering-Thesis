import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FirstAid = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podstrona pierwszej pomocy</Text>
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

export default FirstAid;
