import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';

const ShoppingList = () => {
  const [item, setItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    if (item) {
      setItems([...items, item]);
      setItem('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter item"
          value={item}
          onChangeText={setItem}
        />
        <Button title="Add" onPress={addItem} />
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  item: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default ShoppingList;
