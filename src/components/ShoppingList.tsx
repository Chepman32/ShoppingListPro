import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { useTranslation } from 'react-i18next';

const ShoppingList = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [item, setItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const addItem = () => {
    if (item) {
      setItems([...items, item]);
      setItem('');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: theme.text,
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
      borderColor: theme.primary,
      borderWidth: 1,
      marginRight: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: theme.background,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    item: {
      fontSize: 18,
      paddingVertical: 10,
      borderBottomColor: theme.primary,
      borderBottomWidth: 1,
      color: theme.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('shopping_list')}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('enter_item')}
          placeholderTextColor={theme.text}
          value={item}
          onChangeText={setItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>{t('add')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ShoppingList;
