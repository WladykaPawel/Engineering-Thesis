import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'FirstAid.db',
    location: 'default',
  },
  () => {
    // Baza danych jest otwarta
  },
  (error) => {
    console.error('Błąd podczas otwierania bazy danych', error);
  }
);

const Medicines = () => {
  const [categories, setCategories] = useState([]);
  const [steps, setSteps] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newStepCategoryId, setnewStepCategoryId] = useState('');
  const [newStepName, setNewStepName] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');

  useEffect(() => {
    // Tutaj możesz załadować dane z bazy danych przy uruchomieniu komponentu
    // Na przykład, załaduj kategorie i kroki
    loadCategories();
    loadSteps();
  }, []);

  const loadCategories = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Categories',
        [],
        (tx, results) => {
          const len = results.rows.length;
          if (len > 0) {
            const categoriesArray = [];
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              categoriesArray.push(row);
            }
            setCategories(categoriesArray);
          }
        },
        (error) => {
          console.error('Błąd podczas pobierania kategorii', error);
        }
      );
    });
  };

  const handleAddCategory = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Categories (name, description) VALUES (?, ?)',
        [newCategoryName, newCategoryDescription],
        (tx, results) => {
          console.log('Nowa kategoria została dodana');
          // Po dodaniu odśwież listę kategorii
          loadCategories();
          // Wyczyść pola formularza
          setNewCategoryName('');
          setNewCategoryDescription('');
        },
        (error) => {
          console.error('Błąd podczas dodawania kategorii', error);
        }
      );
    });
  };

  const handleEditCategory = (categoryId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Categories SET name = ?, description = ? WHERE category_id = ?',
        [newCategoryName, newCategoryDescription, categoryId],
        (tx, results) => {
          console.log('Kategoria została zaktualizowana');
          // Po edycji odśwież listę kategorii
          loadCategories();
          // Wyczyść pola formularza
          setNewCategoryName('');
          setNewCategoryDescription('');
        },
        (error) => {
          console.error('Błąd podczas edycji kategorii', error);
        }
      );
    });
  };

  const handleDeleteCategory = (categoryId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM Categories WHERE category_id = ?',
        [categoryId],
        (tx, results) => {
          console.log('Kategoria została usunięta');
          // Po usunięciu odśwież listę kategorii
          loadCategories();
        },
        (error) => {
          console.error('Błąd podczas usuwania kategorii', error);
        }
      );
    });
  };

  const loadSteps = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Steps',
        [],
        (tx, results) => {
          const len = results.rows.length;
          if (len > 0) {
            const stepsArray = [];
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              stepsArray.push(row);
            }
            setSteps(stepsArray);
          }
        },
        (error) => {
          console.error('Błąd podczas pobierania kroków', error);
        }
      );
    });
  };

  const handleAddStep = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Steps (category_id, name, description) VALUES (?, ?, ?)',
        [newStepCategoryId, newStepName, newStepDescription],
        (tx, results) => {
          console.log('Nowy krok został dodany');
          loadSteps();
          setNewStepName('');
          setNewStepDescription('');
        },
        (error) => {
          console.error('Błąd podczas dodawania kroku', error);
        }
      );
    });
  };

  const handleEditStep = (stepId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Steps SET name = ?, description = ? WHERE step_id = ?',
        ['Zaktualizowana nazwa kroku', 'Nowy opis kroku', stepId],
        (tx, results) => {
          console.log('Krok został zaktualizowany');
          // Po edycji odśwież listę kroków
          loadSteps();
        },
        (error) => {
          console.error('Błąd podczas edycji kroku', error);
        }
      );
    });
  };

  const handleDeleteStep = (stepId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM Steps WHERE step_id = ?',
        [stepId],
        (tx, results) => {
          console.log('Krok został usunięty');
          // Po usunięciu odśwież listę kroków
          loadSteps();
        },
        (error) => {
          console.error('Błąd podczas usuwania kroku', error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Podstrona leków</Text>
      <Text>Kategorie:</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.category_id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>ID: {item.category_id}</Text>
            <Text>Name: {item.name}</Text>
            <Text>Description: {item.description}</Text>
            <TouchableOpacity onPress={() => handleEditCategory(item.category_id)}>
              <Text>Edytuj</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteCategory(item.category_id)}>
              <Text>Usuń</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        placeholder="Nowa kategoria (nazwa)"
        onChangeText={(text) => setNewCategoryName(text)}
        value={newCategoryName}
      />
      <TextInput
        placeholder="Opis nowej kategorii"
        onChangeText={(text) => setNewCategoryDescription(text)}
        value={newCategoryDescription}
      />
      <Button title="Dodaj kategorię" onPress={handleAddCategory} />

      <Text>Kroki:</Text>
      <FlatList
        data={steps}
        keyExtractor={(item) => item.step_id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>ID: {item.step_id}</Text>
            <Text>CID: {item.category_id}</Text>
            <Text>Name: {item.name}</Text>
            <Text>Description: {item.description}</Text>
            <TouchableOpacity onPress={() => handleEditStep(item.step_id)}>
              <Text>Edytuj</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteStep(item.step_id)}>
              <Text>Usuń</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        placeholder="Nowe ID kroku (kategorii)"
        onChangeText={(text) => setnewStepCategoryId(text)}
        value={newStepCategoryId}
      />
      <TextInput
        placeholder="Nowy krok (nazwa)"
        onChangeText={(text) => setNewStepName(text)}
        value={newStepName}
      />
      <TextInput
        placeholder="Opis nowego kroku"
        onChangeText={(text) => setNewStepDescription(text)}
        value={newStepDescription}
      />
      <Button title="Dodaj krok" onPress={handleAddStep} />
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
