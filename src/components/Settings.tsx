import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

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
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>{t('theme')}</Text>
        <Picker
          style={styles.picker}
          selectedValue={theme.name}
          onValueChange={(itemValue) => toggleTheme(itemValue)}>
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
          <Picker.Item label="Solar" value="solar" />
          <Picker.Item label="Mono" value="mono" />
        </Picker>
      </View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>{t('sound')}</Text>
        <Switch
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={isSoundEnabled ? theme.primary : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsSoundEnabled}
          value={isSoundEnabled}
        />
      </View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>{t('haptics')}</Text>
        <Switch
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={isHapticsEnabled ? theme.primary : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsHapticsEnabled}
          value={isHapticsEnabled}
        />
      </View>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>Language</Text>
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
      </View>
    </View>
  );
};

export default Settings;
