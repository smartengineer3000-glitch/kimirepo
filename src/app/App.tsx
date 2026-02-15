import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/context/AppContext';
import { theme } from './src/themes';

// Screens
import CalculatorScreen from './src/screens/CalculatorScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import CompareScreen from './src/screens/CompareScreen';
import TestsScreen from './src/screens/TestsScreen';
import RulesScreen from './src/screens/RulesScreen';
import AuditScreen from './src/screens/AuditScreen';

// Custom light theme
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: theme.colors.primary.main,
    onPrimary: theme.colors.primary.contrast,
    primaryContainer: theme.colors.primary.light,
    onPrimaryContainer: theme.colors.primary.dark,
    secondary: theme.colors.secondary.main,
    onSecondary: theme.colors.secondary.contrast,
    secondaryContainer: theme.colors.secondary.light,
    onSecondaryContainer: theme.colors.secondary.dark,
    background: theme.colors.background.main,
    onBackground: theme.colors.text.primary,
    surface: theme.colors.background.card,
    onSurface: theme.colors.text.primary,
    surfaceVariant: theme.colors.background.elevated,
    onSurfaceVariant: theme.colors.text.secondary,
    outline: theme.colors.border.medium,
    error: theme.colors.status.error,
    onError: '#FFFFFF',
    errorContainer: '#FFCDD2',
    onErrorContainer: '#B71C1C',
    success: theme.colors.status.success,
    warning: theme.colors.status.warning,
    info: theme.colors.status.info,
  },
  roundness: theme.borderRadius.lg,
};

// Custom dark theme
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: theme.colors.primary.light,
    onPrimary: theme.colors.primary.dark,
    primaryContainer: theme.colors.primary.dark,
    onPrimaryContainer: theme.colors.primary.light,
    secondary: theme.colors.secondary.light,
    onSecondary: theme.colors.secondary.dark,
    secondaryContainer: theme.colors.secondary.dark,
    onSecondaryContainer: theme.colors.secondary.light,
    background: theme.colors.background.dark,
    onBackground: theme.colors.text.inverse,
    surface: '#2D2D44',
    onSurface: theme.colors.text.inverse,
    surfaceVariant: '#3D3D54',
    onSurfaceVariant: '#B0B0C0',
    outline: '#505070',
    error: '#FF8A80',
    onError: '#1A1A1A',
    errorContainer: '#5C1C1C',
    onErrorContainer: '#FFCDD2',
    success: '#81C784',
    warning: '#FFD54F',
    info: '#64B5F6',
  },
  roundness: theme.borderRadius.lg,
};

// Tab Navigator
const Tab = createBottomTabNavigator();

const AppContent: React.FC = () => {
  const { isDarkMode } = useApp();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={currentTheme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: currentTheme.colors.primary,
            tabBarInactiveTintColor: isDarkMode ? '#808090' : '#757575',
            tabBarStyle: {
              backgroundColor: currentTheme.colors.surface,
              borderTopWidth: 1,
              borderTopColor: currentTheme.colors.outline,
              paddingBottom: 8,
              paddingTop: 8,
              height: 70,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 2,
            },
            tabBarIconStyle: {
              marginBottom: -2,
            },
          }}
        >
          <Tab.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={{
              tabBarLabel: 'الحاسبة',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? 'calculator-variant' : 'calculator'} 
                  color={color} 
                  size={size + 2} 
                />
              )
            }}
          />
          <Tab.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              tabBarLabel: 'النتائج',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? 'file-document-edit' : 'file-document'} 
                  color={color} 
                  size={size + 2} 
                />
              )
            }}
          />
          <Tab.Screen
            name="Compare"
            component={CompareScreen}
            options={{
              tabBarLabel: 'مقارنة',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? 'compare-horizontal' : 'compare'} 
                  color={color} 
                  size={size + 2} 
                />
              )
            }}
          />
          <Tab.Screen
            name="Tests"
            component={TestsScreen}
            options={{
              tabBarLabel: 'اختبارات',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? 'check-circle' : 'check-circle-outline'} 
                  color={color} 
                  size={size + 2} 
                />
              )
            }}
          />
          <Tab.Screen
            name="Rules"
            component={RulesScreen}
            options={{
              tabBarLabel: 'قواعد',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? 'book-open-variant' : 'book-open'} 
                  color={color} 
                  size={size + 2} 
                />
              )
            }}
          />
          <Tab.Screen
            name="Audit"
            component={AuditScreen}
            options={{
              tabBarLabel: 'السجل',
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons 
                  name={focused ? 'clipboard-text-clock' : 'clipboard-text'} 
                  color={color} 
                  size={size + 2} 
                />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </PaperProvider>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
