# Pensieve Notes App

Pensieve is a clean React Native notes app built with Expo for a mobile development assignment. The UI includes a scrollable notes list and a focused note editor so it feels like a real productivity app on phones and tablets.

## Screenshots

|                                                                                             |                                                                                             |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![Notes app screenshot 1](assets/images/screen-shoots/Screenshot%202026-05-12%20222957.png) | ![Notes app screenshot 2](assets/images/screen-shoots/Screenshot%202026-05-12%20223012.png) |
| ![Notes app screenshot 3](assets/images/screen-shoots/Screenshot%202026-05-12%20223116.png) |                                                                                             |

## Features

- Notes listing screen with `FlatList`, searchable filtering, note cards, and a Pressable theme toggle
- Note editor screen with title and body inputs, `KeyboardAvoidingView`, and `ImageBackground`
- Responsive layouts using `useWindowDimensions()` for different screen sizes
- Theme handling using `useColorScheme()` through the app theme context
- Clean interactions using `Pressable` and `TextInput`
- Styling built with `StyleSheet.create()` and `StyleSheet.compose()` / `StyleSheet.flatten()`

## Components And Hooks Used

- Components: `SafeAreaView`, `View`, `Text`, `TextInput`, `FlatList`, `Pressable`, `KeyboardAvoidingView`, `ImageBackground`
- Hooks: `useState`, `useEffect`, `useRouter`, `useLocalSearchParams`, `useWindowDimensions`, `useColorScheme()`

## Additional UI Improvements

- Structured note cards with clear hierarchy and readable typography
- Tablet-aware spacing and wider content padding
- Press feedback on interactive elements
- Automatic persistence for notes with AsyncStorage

## Run The App

```bash
npm install
npx expo start
```
