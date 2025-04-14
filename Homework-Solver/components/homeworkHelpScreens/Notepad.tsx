import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Notepad {
  id: number;
  title: string;
  content: string;
}

export default function NotepadScreen() {
  const [notepads, setNotepads] = useState<Notepad[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const createNewNotepad = () => {
    const newNotepad: Notepad = {
      id: Date.now(),
      title: "Untitled Notepad",
      content: "",
    };
    setNotepads([newNotepad, ...notepads]);
    setSelectedId(newNotepad.id);
  };

  const deleteNotepad = () => {
    for (let index = 0; index < notepads.length; index++) {
      const element = notepads[index];
      if (element.id == selectedId) {
        notepads.splice(index, 1);
        break;
      }
    }
    setSelectedId(null);
  };

  const updateTitle = (text: string) => {
    setNotepads(
      notepads.map((n) => (n.id === selectedId ? { ...n, title: text } : n))
    );
  };

  const updateContent = (text: string) => {
    setNotepads(
      notepads.map((n) => (n.id === selectedId ? { ...n, content: text } : n))
    );
  };

  const selectedNotepad = notepads.find((n) => n.id === selectedId);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={notepadStyles.notepadScrollView}
    >
      <View style={notepadStyles.notepadContainer}>
        <Text style={notepadStyles.notepadHeader}>Notepads</Text>
        <TouchableOpacity
          style={notepadStyles.notepadButton}
          onPress={createNewNotepad}
        >
          <Text style={notepadStyles.notepadButtonText}>+ New Notepad</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={notepadStyles.deleteButton}
          onPress={deleteNotepad}
        >
          <Text style={notepadStyles.notepadButtonText}>- Delete Notepad</Text>
        </TouchableOpacity>

        <FlatList
          data={notepads}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={notepadStyles.notepadList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                notepadStyles.notepadTab,
                selectedId === item.id && notepadStyles.notepadSelectedTab,
              ]}
              onPress={() => setSelectedId(item.id)}
            >
              <Text numberOfLines={1} style={notepadStyles.notepadTabText}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />

        {selectedNotepad && (
          <View>
            <TextInput
              style={notepadStyles.notepadTitleInput}
              value={selectedNotepad.title}
              onChangeText={updateTitle}
              placeholder="Title"
            />
            <TextInput
              style={notepadStyles.notepadInput}
              multiline
              placeholder="Start typing..."
              value={selectedNotepad.content}
              onChangeText={updateContent}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const notepadStyles = StyleSheet.create({
  notepadContainer: {
    flex: 1,
    paddingTop: 150,
    paddingHorizontal: 20,
    backgroundColor: "#0B1523",
    paddingBottom: 250,
  },
  notepadHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  notepadButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  notepadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  notepadList: {
    marginBottom: 10,
  },
  notepadTab: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginRight: 10,
    maxWidth: 120,
  },
  notepadSelectedTab: {
    backgroundColor: "#cce5ff",
  },
  notepadTabText: {
    fontSize: 14,
  },
  notepadScrollView: {
    flex: 1,
    width: "100%",
    marginBottom: 100,
  },
  notepadTitleInput: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  notepadInput: {
    fontSize: 18,
    textAlignVertical: "top",
    minHeight: 200,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
});
