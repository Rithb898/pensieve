import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note, useNotes } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';

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
    // Polish: remove heavy shadows, use subtle borders, flatter layout
    const cardThemeStyle = { 
      backgroundColor: colors.surface,
      borderColor: isDark ? '#38383A' : '#EAEAEF', 
    };
    const cardWrapper = [cardBaseStyle, cardThemeStyle];

    return (
      <Pressable
        style={({ pressed }) => StyleSheet.compose(
          StyleSheet.flatten(cardWrapper),
          pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
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
          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notes</Text>
        <Pressable 
          onPress={toggleTheme} 
          style={({ pressed }) => [
            styles.themeToggleContainer,
            { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }
          ]}
        >
          <Ionicons 
            name={isDark ? "sunny" : "moon"} 
            size={20} 
            color={colors.textPrimary} 
          />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7', color: colors.textPrimary }
          ]}
          placeholder="Search..."
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notes found.</Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab, 
          { backgroundColor: colors.primary },
          pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
        ]}
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  themeToggleContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  searchInput: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 17,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // accommodate FAB
    gap: 16,
  },
  listContentTablet: {
    paddingHorizontal: 64, // wider padding for tablets
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    // Removed old shadows. We are flattening this out.
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardTimestamp: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    fontWeight: '300',
    marginTop: -4,
  }
});
