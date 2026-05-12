import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NotesProvider } from '../context/NotesContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function RootStack() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="note/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <RootStack />
      </NotesProvider>
    </ThemeProvider>
  );
}
