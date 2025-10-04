import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { useTranslation } from 'react-i18next';
import { TextInput, Button, Text, Checkbox } from 'react-native-paper';

const ShoppingList = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [item, setItem] = useState('');
  const [items, setItems] = useState<Array<{ id: string; label: string; completed: boolean }>>([]);

  const addItem = () => {
    const trimmed = item.trim();
    if (trimmed) {
      setItems([
        ...items,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          label: trimmed,
          completed: false,
        },
      ]);
      setItem('');
    }
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((listItem) =>
        listItem.id === id
          ? { ...listItem, completed: !listItem.completed }
          : listItem
      )
    );
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
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomColor: theme.primary,
      borderBottomWidth: 1,
    },
    itemLabel: {
      fontSize: 18,
      color: theme.text,
      flex: 1,
    },
    itemLabelCompleted: {
      textDecorationLine: 'line-through',
      color: theme.text + '99',
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
        renderItem={({ item: listItem }) => (
          <View style={styles.itemRow}>
            <Checkbox
              status={listItem.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleItem(listItem.id)}
            />
            <Text
              style={[styles.itemLabel, listItem.completed && styles.itemLabelCompleted]}
            >
              {listItem.label}
            </Text>
          </View>
        )}
        keyExtractor={(listItem) => listItem.id}
        ItemSeparatorComponent={() => <View />}
      />
    </View>
  );
};

export default ShoppingList;
