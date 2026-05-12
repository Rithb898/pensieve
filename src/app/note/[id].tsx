import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  Text, 
  KeyboardAvoidingView, 
  Platform,
  ImageBackground,
  useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useNotes } from '../../context/NotesContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { getNote, saveNote } = useNotes();
  const { width } = useWindowDimensions();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      const existingNote = getNote(id);
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
      }
    }
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    await saveNote(id || 'new', title, content);
    router.back();
  };

  const isTablet = width > 768;

  const headerWrapper = StyleSheet.flatten([
    styles.headerWrapper,
    isTablet && { height: 250 }
  ]);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={headerWrapper}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <SafeAreaView edges={['top']} style={styles.navBar}>
            <Pressable onPress={() => router.back()} style={styles.navButton}>
              <Text style={styles.navText}>Back</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={[styles.navButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.navText, { color: '#000', fontWeight: '600' }]}>Save</Text>
            </Pressable>
          </SafeAreaView>
        </ImageBackground>
      </View>

      <View style={[styles.contentContainer, isTablet && { paddingHorizontal: 64 }]}>
        <TextInput
          style={[styles.titleInput, { color: colors.textPrimary }]}
          placeholder="Note Title"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.bodyInput, { color: colors.textPrimary }]}
          placeholder="Start typing your note here..."
          placeholderTextColor={colors.textSecondary}
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    height: 150,
    width: '100%',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  navText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleInput: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 16,
  },
  bodyInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
  }
});