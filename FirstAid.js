import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const databaseName = 'FirstAid.db';

const db = SQLite.openDatabase(
  {
    name: databaseName,
    location: 'default',
  },
  () => {
    createTables();
  },
  (error) => {
    console.error('Błąd podczas otwierania bazy danych', error);
  }
);

const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Categories (category_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT)',
      [],
      () => {
        console.log('Tabela Categories została utworzona lub już istnieje.');

        // Sprawdzenie, czy tabela "Categories" jest pusta
        tx.executeSql(
          'SELECT * FROM Categories',
          [],
          (tx, results) => {
            const len = results.rows.length;
            if (len === 0) {
              tx.executeSql(
                'INSERT INTO Categories (name, description) VALUES (?, ?)',
                ['Rozmowa z dyspozytorem ', 'Poniżej przedstawiamy, jak przebiega rozmowa z dyspozytorem pogotowia ratunkowego - istotna jest kolejność przekazywania informacji']
              );
              tx.executeSql(
                'INSERT INTO Categories (name, description) VALUES (?, ?)',
                ['Pozycja boczna ustalona', 'Ułóż poszkodowanego w pozycji bocznej ustalonej, aby zabespieczyć go przed ewentualnym zachłyśnięciem oraz ułatwić oddychanie.']
              );
              tx.executeSql(
                'INSERT INTO Categories (name, description) VALUES (?, ?)',
                ['Ból w klatce piersiowej', ' Kategoria ta zawiera informacje na temat postępowania w sytuacji, gdy osoba doświadcza bólu w klatce piersiowej. Dowiesz się, jak rozpoznać objawy i jakie kroki podjąć, aby udzielić pomocy.']
              );
              tx.executeSql(
                'INSERT INTO Categories (name, description) VALUES (?, ?)',
                ['Wypadek komunikacyjny', '  W przypadku wypadku komunikacyjnego istnieje wiele aspektów, które warto wziąć pod uwagę. Ta sekcja zawiera szczegółowe informacje na temat postępowania w przypadku wypadku drogowego, włączając ocenę sytuacji, udzielanie pierwszej pomocy i zabezpieczanie miejsca wypadku.']
              );
              tx.executeSql(
                'INSERT INTO Categories (name, description) VALUES (?, ?)',
                ['Udar mózgu', '  Udary mózgu to poważne zagrożenie zdrowia i życia. W tej sekcji znajdziesz informacje dotyczące rozpoznawania objawów udaru, pilnych kroków do podjęcia i jak zapewnić szybką reakcję medyczną.']
              );
              tx.executeSql(
                'INSERT INTO Categories (name, description) VALUES (?, ?)',
                ['Omdlenia i zasłabnięcia', '  Omdlenia i zasłabnięcia mogą zdarzyć się każdemu. Tutaj dowiesz się, jakie są przyczyny i jak udzielić pomocy osobie, która straciła przytomność lub zasłabła.']
              );
              tx.executeSql(
                'INSERT INTO Categories (name, description) VALUES (?, ?)',
                ['Używanie Defibrylatora AED', ' Automatyczny defibrylator zewnętrzny (AED) może uratować życie w przypadku zatrzymania krążenia. W tej sekcji znajdziesz informacje na temat korzystania z AED, włączając instrukcje krok po kroku i jak działa ten urządzenie w nagłych przypadkach.']
              );
            }
          },
          (error) => {
            console.error('Błąd podczas sprawdzania istnienia tabeli Categories', error);
          }
        );
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

        // Sprawdzenie, czy tabela "Steps" jest pusta
        tx.executeSql(
          'SELECT * FROM Steps',
          [],
          (tx, results) => {
            const len = results.rows.length;
            if (len === 0) {
              tx.executeSql(
                'INSERT INTO Steps (category_id, name, description) VALUES (?, ?, ?)',
                [1, 'Powiedz, gdzie jesteś', 'Podaj dokładny adres, pełną nazwę miejscowości, ulicę, numer domu, gminę, powiat, województwo, ponieważ nazwy miejscowości się powtarzają. Podaj charakterystyczne miejsca (szłokał, kościół, kapliczka, itp). Nigdy nie wiadomo czy połącznie nie zostanie zerwane, bateria może paść albo zasię komurkowy się zgubić. Przekazanie informacji o swoim położeniu jest najważniejszą informacją jaką należy przekazać dyspozytorowi pogotowia ratunkowego.']
              );
              tx.executeSql(
                  'INSERT INTO Steps (category_id, name, description) VALUES (?, ?, ?)',
                  [1, 'Wyjaśnij, co się stało', 'Opisz dokładnie, co się wydarzyło. Podaj informacje o ewentualnych wypadkach, incydentach, czy zagrożeniach. Im bardziej szczegółowe informacje, tym lepiej będą mogli ocenić sytuację i udzielić odpowiedniej pomocy.']
              );
              tx.executeSql(
                  'INSERT INTO Steps (category_id, name, description) VALUES (?, ?, ?)',
                  [1, 'Opisz stan poszkodowanego', 'Przedstaw stan poszkodowanego w miarę dokładnie. Ocen jego oddychanie, świadomość, krążenie krwi. Jeśli poszkodowany jest przytomny, zapytaj o ewentualne urazy, dolegliwości i alergie. Im więcej informacji, tym lepiej będą mogli pomóc.']
              );
              tx.executeSql(
                  'INSERT INTO Steps (category_id, name, description) VALUES (?, ?, ?)',
                  [1, 'Podaj swoje dane', 'Przekaz swoje imię, nazwisko oraz numer kontaktowy. Jeśli jesteś świadkiem zdarzenia, zapisz swoje dane personalne, aby w razie potrzeby mogli się z Tobą skontaktować. To pozwoli na uzyskanie dodatkowych informacji w razie konieczności.']
              );
              tx.executeSql(
                'INSERT INTO Steps (category_id, name, description) VALUES (?, ?, ?)',
                [1, 'Zaczekaj na przyjazd pogotowia', 'Opis przykładowego kroku 2']
              );
              tx.executeSql(
                'INSERT INTO Steps (category_id, name, description) VALUES (?, ?, ?)',
                [2, 'Przykładowy krok 3', 'Opis przykładowego kroku 3']
              );
            }
          },
          (error) => {
            console.error('Błąd podczas sprawdzania istnienia tabeli Steps', error);
          }
        );
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
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [steps, setSteps] = useState([]);

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

  useEffect(() => {
    createTables();
    loadCategories();
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
            setCategoryName(category.name);
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

  const renderContent = () => {
    if (selectedCategory !== null) {
      return (
        <View style={styles.StepsContainer}>
          <TouchableOpacity onPress={goBackToCategories}>
            <Image source={require('./assets/backIcon.png')} />
          </TouchableOpacity>
          <Text style={styles.categoryDescriptionTitle}>{categoryName}</Text>
          <Text style={styles.categoryDescription}>Opis kategorii:</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.categoryDescriptionText}>{categoryDescription}</Text>
          </View>
          <Text style={styles.categoryDescription}>Kroki do podjęcia:</Text>
          <FlatList
            data={steps}
            keyExtractor={(item) => item.step_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.stepContainer}>
                <Text style={styles.stepName}>{item.name}</Text>
                <Text style={styles.stepDescription}>{item.description}</Text>
              </View>
            )}
          />
        </View>
      );
    } else {
      return (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.category_id.toString()}
          style={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCategoryPress(item.category_id)}>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#00ab99',
  },
  contentContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 10,
  },
  categoryDescriptionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    width: '100%',
  },
  categoryDescription: {
    fontSize: 27,
    fontWeight: 'bold',
    width: '100%',
  },
  StepsContainer: {
    width: '95%',
    flex: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 2,
  },
  stepName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepDescription: {
    fontSize: 14,
    textAlign: 'justify', 
  },
  categoryList: {
    marginTop: 30,
    width: '95%',
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: 'gray',
    marginVertical: 10,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default FirstAid;