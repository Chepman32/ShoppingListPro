import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { useTranslation } from 'react-i18next';
import { TextInput, Button, Text } from 'react-native-paper';

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
      marginRight: 10,
      backgroundColor: theme.background,
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
          label={t('enter_item')}
          value={item}
          onChangeText={setItem}
          mode="outlined"
          style={styles.input}
        />
        <Button mode="contained" onPress={addItem}>
          {t('add')}
        </Button>
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
