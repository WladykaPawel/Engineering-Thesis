import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const databaseName = 'FirstAid.db';

const db = SQLite.openDatabase(
  {
    name: databaseName,
    location: 'default',
  },
  () => {
    // Inicjalizacja bazy danych
    createTables(); // Dodane: Tworzenie tabel, jeśli nie istnieją
  },
  (error) => {
    console.error('Błąd podczas otwierania bazy danych', error);
  }
);

// Dodane: Funkcja tworząca tabele, jeśli nie istnieją
const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Categories (category_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)',
      [],
      () => {
        console.log('Tabela Categories została utworzona lub już istnieje.');
      },
      (error) => {
        console.error('Błąd podczas tworzenia tabeli Categories', error);
      }
    );

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Steps (step_id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER, name TEXT, description TEXT)',
      [],
      () => {
        console.log('Tabela Steps została utworzona lub już istnieje.');
      },
      (error) => {
        console.error('Błąd podczas tworzenia tabeli Steps', error);
      }
    );
  });
};

function FirstAid() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryDescription, setCategoryDescription] = useState('');
  const [steps, setSteps] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Aktywne');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newStepCategoryId, setNewStepCategoryId] = useState('');
  const [newStepName, setNewStepName] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');

  useEffect(() => {
    loadCategories(); // Załaduj kategorie przy uruchomieniu komponentu
    loadSteps();
  }, []);

  // Dodane: Funkcja tworząca tabele, jeśli nie istnieją
  const createTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Categories (category_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)',
        [],
        () => {
          console.log('Tabela Categories została utworzona lub już istnieje.');
        },
        (error) => {
          console.error('Błąd podczas tworzenia tabeli Categories', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Steps (step_id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER, name TEXT, description TEXT)',
        [],
        () => {
          console.log('Tabela Steps została utworzona lub już istnieje.');
        },
        (error) => {
          console.error('Błąd podczas tworzenia tabeli Steps', error);
        }
      );
    });
  };

  // Dodane: Funkcja sprawdzająca istnienie tabeli Categories
  const checkCategoriesTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT 1 FROM Categories LIMIT 1',
        [],
        createTables, // Jeśli tabela nie istnieje, utwórz ją
        (error) => {
          console.error('Błąd podczas sprawdzania istnienia tabeli Categories', error);
        }
      );
    });
  };

  // Dodane: Wywołaj funkcję sprawdzająca istnienie tabeli przy uruchomieniu komponentu
  useEffect(() => {
    checkCategoriesTable();
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

  const loadCategoryDescriptionAndSteps = (categoryId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Categories WHERE category_id = ?',
        [categoryId],
        (tx, results) => {
          if (results.rows.length > 0) {
            const category = results.rows.item(0);
            setCategoryDescription(category.description);
          }
        },
        (error) => {
          console.error('Błąd podczas pobierania opisu kategorii', error);
        }
      );

      tx.executeSql(
        'SELECT * FROM Steps WHERE category_id = ?',
        [categoryId],
        (tx, results) => {
          const len = results.rows.length;
          if (len > 0) {
            const stepsArray = [];
            for (let i = 0; i < len; i++) {
              const step = results.rows.item(i);
              stepsArray.push(step);
            }
            setSteps(stepsArray);
          }
        },
        (error) => {          console.error('Błąd podczas pobierania kroków', error);
      }
    );
  });
};

const handleCategoryPress = (categoryId) => {
  setSelectedCategory(categoryId);
  loadCategoryDescriptionAndSteps(categoryId);
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
        setNewStepCategoryId('');
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
      [newStepName, newStepDescription, stepId],
      (tx, results) => {
        console.log('Krok został zaktualizowany');
        // Po edycji odśwież listę kroków
        loadSteps();
        // Wyczyść pola formularza
        setNewStepName('');
        setNewStepDescription('');
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

const renderContent = () => {
  switch (selectedTab) {
    case 'Aktywne':
      return (
        <View style={styles.scrollView}>
          <View>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.category_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCategoryPress(item.category_id)}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          {selectedCategory !== null && (
            <View>
              <Text>Opis kategorii:</Text>
              <Text>{categoryDescription}</Text>
              <Text>Kroki do podjęcia:</Text>
              <FlatList
                data={steps}
                keyExtractor={(item) => item.step_id.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Text>{item.name}</Text>
                    <Text>{item.description}</Text>
                  </View>
                )}
              />
            </View>
          )}
          </View>
        </View>
      );
    case 'Nieaktywne':
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
      onChangeText={(text) => setNewStepCategoryId(text)}
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
    default:
      return null;
  }
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>Podstrona leków</Text>
    {renderContent()}
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === 'Aktywne' && styles.selectedTab,
        ]}
        onPress={() => {
          setSelectedTab('Aktywne');
        }}
      >
        <Text style={styles.tabText}>Aktywne</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === 'Nieaktywne' && styles.selectedTab,
        ]}
        onPress={() => {
          setSelectedTab('Nieaktywne');
        }}
      >
        <Text style={styles.tabText}>Nieaktywne</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#3ba118',
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
},
scrollView: {
  flex: 1,
  backgroundColor: '#f0f0f0',
  padding: 16,
  width: '95%',
},
tabBar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%',
  backgroundColor: '#eee',
  paddingVertical: 10,
},
tabButton: {
  paddingHorizontal: 20,
  paddingVertical: 10,
},
selectedTab: {
  backgroundColor: '#007AFF',
  borderRadius: 20,
},
tabText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'black',
},
});

export default FirstAid;

         
