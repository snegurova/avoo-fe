import { MD3LightTheme, type MD3Theme } from 'react-native-paper';

const paperTheme: MD3Theme = {
  ...MD3LightTheme, 
  colors: {
    ...MD3LightTheme.colors, 
    primary: '#000000', 
    secondary: '#8B5CF6', 
    tertiary: 'red', 
  },
};

export default paperTheme;