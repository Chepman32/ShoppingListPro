module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'react-native-worklets-core/plugin',
    'react-native-reanimated/plugin',
  ],
};
