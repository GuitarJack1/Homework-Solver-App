import { useVars } from "@/components/Context";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactElement, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Flashcard {
  id: number;
  title: string;
  content: string;
}

export default function FlashcardScreen(){
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [currentContent, setCurrentContent] = useState<React.JSX.Element>(
    <FlashcardEditScreen />
  );
  const [currentPageName, setPageName] = useState<string>("Edit");
  
  const helpScreens = [
    {
      name: "Edit",
      icon: "pencil-sharp",
      content: <FlashcardEditScreen />,
    },
    {
      name: "List",
      icon: "albums-outline",
      content: <FlashcardListScreen />,
    },
  ];

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuOpen(!menuOpen)}
        >
          <Ionicons name="ellipsis-horizontal-sharp" size={30} color={"white"} />
        </TouchableOpacity>

        {menuOpen && (
          <View style={styles.sideMenu}>
            {helpScreens.map((option) => (
              <TouchableOpacity
                key={option.name}
                style={styles.menuItem}
                onPress={() => {
                  setCurrentContent(option.content);
                  setPageName(option.name);
                  setMenuOpen(false);
                }}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={option.name == currentPageName ? "#0D92F4" : "white"}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      color:
                        option.name == currentPageName ? "#0D92F4" : "white",
                    },
                  ]}
                >
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.content}>{currentContent}</View>
      </View>
    </View>
  );
}

function FlashcardListScreen() {
  const { flashcards, setFlashcards } = useVars();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedFlashcard = flashcards.find((n) => n.id === selectedId);

  const [curIndex, setCurIndex] = useState<number>(0);


  const [showFront, setShowFront] = useState(true); // true = title, false = content

  const toggleFlashcard = () => {
    setShowFront(prev => !prev);
  };
  
  let curFlashcard = flashcards[curIndex];

  const prevFlashcard = () => {
    if(curIndex > 0){
      setCurIndex(curIndex - 1);
      curFlashcard = flashcards[curIndex];
      setShowFront(true);
    }
  };
  const nextFlashcard = () => {
    if(curIndex < flashcards.length - 1){
      setCurIndex(curIndex + 1);
      curFlashcard = flashcards[curIndex];
      setShowFront(true);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={FlashcardStyles.FlashcardScrollView}
    >
      <View style={FlashcardStyles.FlashcardContainer}>
        <Text style={FlashcardStyles.FlashcardHeader}>Flashcards</Text>

        <View style={FlashcardStyles.FlashcardTabContainer}>
          <TouchableOpacity
            style={[
              FlashcardStyles.FlashcardTabSwitch, FlashcardStyles.FlashcardTab, FlashcardStyles.FlashcardSelectedTab,
            ]}
            onPress={prevFlashcard}
          >
            <Text numberOfLines={1} style={FlashcardStyles.FlashcardTabText}>
              Prev
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              FlashcardStyles.FlashcardTabSwitch, FlashcardStyles.FlashcardTab, FlashcardStyles.FlashcardSelectedTab,
            ]}
            onPress={nextFlashcard}
          >
            <Text numberOfLines={1} style={FlashcardStyles.FlashcardTabText}>
              Next
            </Text>
          </TouchableOpacity>
        </View>

        {curFlashcard && (
          <TouchableOpacity onPress={toggleFlashcard}>
            <View style={FlashcardStyles.Flashcard}>
              <Text style={showFront ? FlashcardStyles.FlashcardTitle : FlashcardStyles.FlashcardBody}>
                {showFront ? curFlashcard.title : curFlashcard.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

function FlashcardEditScreen() {
  const { flashcards, setFlashcards } = useVars();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const createNewFlashcard = () => {
    const newFlashcard: Flashcard = {
      id: Date.now(),
      title: "",
      content: "",
    };
    setFlashcards([...flashcards, newFlashcard]);
    setSelectedId(newFlashcard.id);
  };

  const deleteFlashcard = () => {
    const updatedFlashcards = flashcards.filter((n) => n.id !== selectedId);
    setFlashcards(updatedFlashcards);
    setSelectedId(null);
  };

  const updateTitle = (text: string) => {
    setFlashcards(
      flashcards.map((n) => (n.id === selectedId ? { ...n, title: text } : n))
    );
  };

  const updateContent = (text: string) => {
    setFlashcards(
      flashcards.map((n) => (n.id === selectedId ? { ...n, content: text } : n))
    );
  };

  const selectedFlashcard = flashcards.find((n) => n.id === selectedId);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={FlashcardStyles.FlashcardScrollView}
    >
      <View style={FlashcardStyles.FlashcardContainer}>
        <Text style={FlashcardStyles.FlashcardHeader}>Flashcards</Text>

        <TouchableOpacity
          style={FlashcardStyles.FlashcardButton}
          onPress={createNewFlashcard}
        >
          <Text style={FlashcardStyles.FlashcardButtonText}>+ New Flashcard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={FlashcardStyles.deleteButton}
          onPress={deleteFlashcard}
        >
          <Text style={FlashcardStyles.FlashcardButtonText}>- Delete Flashcard</Text>
        </TouchableOpacity>

        <View style={FlashcardStyles.FlashcardTabContainer}>
          <FlatList
            data={flashcards}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={FlashcardStyles.FlashcardList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  FlashcardStyles.FlashcardTab,
                  selectedId === item.id && FlashcardStyles.FlashcardSelectedTab,
                ]}
                onPress={() => setSelectedId(item.id)}
              >
                <Text numberOfLines={1} style={FlashcardStyles.FlashcardTabText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {selectedFlashcard && (
          <View style={FlashcardStyles.FlashcardEditor}>
            <TextInput
              style={FlashcardStyles.FlashcardTitleInput}
              value={selectedFlashcard.title}
              onChangeText={updateTitle}
              placeholder="Vocab Word"
              placeholderTextColor="#B0C9E0"
            />
            <TextInput
              style={FlashcardStyles.FlashcardInput}
              multiline
              placeholder="Definition"
              placeholderTextColor="#B0C9E0"
              value={selectedFlashcard.content}
              onChangeText={updateContent}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const FlashcardStyles = StyleSheet.create({
  FlashcardContainer: {
    flex: 1,
    paddingTop: 150,
    paddingHorizontal: 20,
    backgroundColor: "#0B1523",
    paddingBottom: 100,
  },
  FlashcardHeader: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4FC3F7",
  },
  FlashcardButton: {
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
  FlashcardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  FlashcardTabContainer: {
    marginBottom: 12,
    flexDirection: "row",
  },
  FlashcardList: {
    paddingTop: 15,
  },
  FlashcardTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#16212F",
    borderRadius: 8,
    marginRight: 10,
    maxWidth: 140,
    borderColor: "#2A3B50",
    borderWidth: 1,
  },
  FlashcardTabSwitch: {
    width: "40%",
  },
  FlashcardSelectedTab: {
    backgroundColor: "#29ABE2", // Electric blue
  },
  FlashcardTabText: {
    fontSize: 14,
    color: "#E0F7FA",
  },
  FlashcardScrollView: {
    flex: 1,
    width: "100%",
  },
  FlashcardTitleInput: {
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
  FlashcardInput: {
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
  FlashcardEditor: {
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
  Flashcard: {
    minWidth: 200,
    maxWidth: 200,
    minHeight: 100,
    marginTop: 10,
    backgroundColor: "#0E1D2C",
    padding: 14,
    borderRadius: 16,
    shadowColor: "#3BAFDA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
    gap: 10,
  },
  FlashcardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
  },
  FlashcardBody: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    textAlignVertical: "bottom",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1523",
  },
  menuButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 2,
    padding: 10,
    backgroundColor: "#1E2A38",
    borderRadius: 5,
  },
  menuText: {
    fontSize: 24,
    color: "white",
  },
  sideMenu: {
    position: "absolute",
    top: 130,
    left: 20,
    backgroundColor: "#1E2A38",
    padding: 10,
    borderRadius: 10,
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  menuItemText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    color: "white",
    fontSize: 24,
  },
});