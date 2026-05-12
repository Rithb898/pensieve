import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  Pressable, 
  Switch, 
  useWindowDimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useNotes, Note } from '../context/NotesContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();
  const { theme, isDark, toggleTheme, colors } = useTheme();
  const { notes } = useNotes();
  const { width } = useWindowDimensions();
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isTablet = width > 768;

  const renderNoteCard = ({ item }: { item: Note }) => {
    const cardBaseStyle = styles.card;
    const cardThemeStyle = { backgroundColor: colors.surface };
    const cardWrapper = [cardBaseStyle, cardThemeStyle];

    return (
      <Pressable 
        style={({ pressed }) => StyleSheet.compose(
          StyleSheet.flatten(cardWrapper), 
          pressed && { opacity: 0.8 }
        )}
        onPress={() => router.push(`/note/${item.id}`)}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.title || 'Untitled Note'}
        </Text>
        <Text style={[styles.cardContent, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.content || 'No content...'}
        </Text>
        <Text style={[styles.cardTimestamp, { color: colors.textSecondary }]}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notes</Text>
        <View style={styles.themeToggleContainer}>
          <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>Dark Mode</Text>
          <Switch 
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#E5E5EA', true: colors.primary }}
          />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={[
            styles.searchInput, 
            { backgroundColor: colors.surface, color: colors.textPrimary }
          ]}
          placeholder="Search notes..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList 
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={renderNoteCard}
        contentContainerStyle={[
          styles.listContent,
          isTablet && styles.listContentTablet
        ]}
        showsVerticalScrollIndicator={false}
      />

      <Pressable 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/note/new')}
      >
        <Text style={[styles.fabText, { color: '#000' }]}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999, // Pill shape
    fontSize: 17,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // accommodate FAB
    gap: 16,
  },
  listContentTablet: {
    paddingHorizontal: 64, // wider padding for tablets
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardTimestamp: {
    fontSize: 13,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: {
    fontSize: 32,
    fontWeight: '400',
    marginTop: -2,
  }
});
