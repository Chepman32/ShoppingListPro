import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { Text, Switch, List } from 'react-native-paper';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(false);

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
    optionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    optionText: {
      fontSize: 18,
      color: theme.text,
    },
    picker: {
      flex: 1,
      height: 40,
      color: theme.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>
      <List.Section>
        <List.Item
          title={t('theme')}
          right={() => (
            <Picker
              style={styles.picker}
              selectedValue={theme.name}
              onValueChange={(itemValue) => toggleTheme(itemValue)}>
              <Picker.Item label="Light" value="light" />
              <Picker.Item label="Dark" value="dark" />
              <Picker.Item label="Solar" value="solar" />
              <Picker.Item label="Mono" value="mono" />
            </Picker>
          )}
        />
        <List.Item
          title={t('sound')}
          right={() => (
            <Switch
              value={isSoundEnabled}
              onValueChange={setIsSoundEnabled}
            />
          )}
        />
        <List.Item
          title={t('haptics')}
          right={() => (
            <Switch
              value={isHapticsEnabled}
              onValueChange={setIsHapticsEnabled}
            />
          )}
        />
        <List.Item
          title="Language"
          right={() => (
            <Picker
              style={styles.picker}
              selectedValue={i18n.language}
              onValueChange={(itemValue) => i18n.changeLanguage(itemValue)}>
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Русский" value="ru" />
              <Picker.Item label="Español" value="sp" />
              <Picker.Item label="Deutsch" value="de" />
              <Picker.Item label="Français" value="fr" />
              <Picker.Item label="Português" value="por" />
              <Picker.Item label="日本語" value="jp" />
              <Picker.Item label="中文" value="ch" />
              <Picker.Item label="한국어" value="ko" />
              <Picker.Item label="Українська" value="ua" />
            </Picker>
          )}
        />
      </List.Section>
    </View>
  );
};

export default Settings;
