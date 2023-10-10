import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { WebView } from 'react-native-webview';

const PDFViewer = () => {
  const [files, setFiles] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");

  const db = SQLite.openDatabase({
    name: 'custom_db.db',
    location: 'Documents'
  });

  useEffect(() => {
    db.transaction((tx) => {
      // Utwórz tabelę 'files', jeśli nie istnieje
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data BLOB)',
        [],
        (tx, results) => {
          // Tabela została utworzona lub już istniała
        },
        (error) => {
          console.error('Błąd podczas tworzenia tabeli:', error);
        }
      );

      // Pobierz wszystkie pliki z bazy danych
      tx.executeSql(
        'SELECT * FROM files',
        [],
        (tx, { rows }) => {
          setFiles(rows._array);
        },
        (error) => {
          console.error('Błąd podczas pobierania plików:', error);
        }
      );
    });
  }, []);

  const onFileSelect = async () => {
    // Implementuj logikę wybierania pliku i zapisywania go do bazy danych
  };

  const onFileOpen = async (fileId) => {
    // Implementuj logikę otwierania wybranego pliku
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zapis pliku PDF do bazy danych</Text>
      <TextInput
        placeholder="Nazwa pliku"
        value={fileName}
        onChangeText={setFileName}
      />
      <Button title="Wybierz plik" onPress={onFileSelect} />
      {files && files.length > 0 && (
        <View style={styles.fileList}>
          {files.map((file) => (
            <View key={file.id}>
              <Text>{file.name}</Text>
              <Button title="Otwórz" onPress={() => onFileOpen(file.id)} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  fileList: {
    flex: 1,
    margin: 10,
  },
});

export default PDFViewer;
