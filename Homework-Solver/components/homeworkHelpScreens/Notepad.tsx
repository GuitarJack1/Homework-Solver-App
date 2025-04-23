import { useVars } from "@/components/Context";
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
  const { notepads, setNotepads } = useVars();
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
    const updatedNotepads = notepads.filter((n) => n.id !== selectedId);
    setNotepads(updatedNotepads);
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

        <View style={notepadStyles.notepadTabContainer}>
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
        </View>

        {selectedNotepad && (
          <View style={notepadStyles.notepadEditor}>
            <TextInput
              style={notepadStyles.notepadTitleInput}
              value={selectedNotepad.title}
              onChangeText={updateTitle}
              placeholder="Title"
              placeholderTextColor="#B0C9E0"
            />
            <TextInput
              style={notepadStyles.notepadInput}
              multiline
              placeholder="Start typing..."
              placeholderTextColor="#B0C9E0"
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
    paddingBottom: 100,
  },
  notepadHeader: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4FC3F7",
  },
  notepadButton: {
    backgroundColor: "#0039A6",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "#A62C3B",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  notepadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  notepadTabContainer: {
    marginBottom: 12,
  },
  notepadList: {
    paddingTop: 15,
  },
  notepadTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#16212F",
    borderRadius: 8,
    marginRight: 10,
    maxWidth: 140,
    borderColor: "#2A3B50",
    borderWidth: 1,
  },
  notepadSelectedTab: {
    backgroundColor: "#29ABE2", // Electric blue
  },
  notepadTabText: {
    fontSize: 14,
    color: "#E0F7FA",
  },
  notepadScrollView: {
    flex: 1,
    width: "100%",
  },
  notepadTitleInput: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#122236", // Dark navy
    borderRadius: 10,
    color: "#F0F8FF", // Pale blue
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#3BAFDA",
  },
  notepadInput: {
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 200,
    padding: 12,
    backgroundColor: "#122236",
    borderRadius: 10,
    color: "#F0F8FF",
    borderWidth: 1,
    borderColor: "#3BAFDA",
  },
  notepadEditor: {
    marginTop: 10,
    backgroundColor: "#0E1D2C", // Subtle dark contrast
    padding: 14,
    borderRadius: 16,
    shadowColor: "#3BAFDA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    gap: 10,
  },
});
