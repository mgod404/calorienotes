import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DefaultTheme,Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './screens/homescreen'
import LoginScreen from './screens/loginscreen'
import TestScreen from './screens/testscreen';



declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      background: string;
    }
  }
}

const theme = {
  ...DefaultTheme,
  dark: true,
  colors:{
    ...DefaultTheme.colors,
    background: '#000000',
    primary: '#f8f8ff'
  }
}



const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Test" component={TestScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )};

export default App;