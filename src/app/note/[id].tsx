import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../../context/NotesContext';
import { useTheme } from '../../context/ThemeContext';

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
                    source={{ uri: 'https://images.unsplash.com/photo-1542435503-9a4ae4f37580?q=80&w=2000&auto=format&fit=crop' }}
                    style={styles.imageBackground}
                    resizeMode="cover"
                >
                    <View style={styles.imageOverlay} />
                    <SafeAreaView edges={['top']} style={styles.navBar}>
                        <Pressable onPress={() => router.back()} style={styles.navButton}>
                            <Text style={styles.navText}>Back</Text>
                        </Pressable>
                        <Pressable onPress={handleSave} style={[styles.navButton, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.navText, { color: '#000', fontWeight: '700' }]}>Save</Text>
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
        height: 180,
        width: '100%',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 16,
        zIndex: 2,
    },
    navButton: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
    },
    navText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 32,
    },
    titleInput: {
        fontSize: 34,
        fontWeight: '800',
        marginBottom: 24,
        letterSpacing: -0.5,
    },
    bodyInput: {
        flex: 1,
        fontSize: 18,
        lineHeight: 28,
    }
});