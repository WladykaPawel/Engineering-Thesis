import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const databaseName = 'FirstAid.db';

const db = SQLite.openDatabase(
  {
    name: databaseName,
    location: 'default',
  },
  () => {
    // Inicjalizacja bazy danych
  },
  (error) => {
    console.error('Błąd podczas otwierania bazy danych', error);
  }
);

function FirstAid() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryDescription, setCategoryDescription] = useState('');
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    loadCategories(); // Załaduj kategorie przy uruchomieniu komponentu
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
        (error) => {
          console.error('Błąd podczas pobierania kroków', error);
        }
      );
    });
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
    loadCategoryDescriptionAndSteps(categoryId);
  };

  return (
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
  );
}

export default FirstAid;
