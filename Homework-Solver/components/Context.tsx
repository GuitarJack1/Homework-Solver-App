import React, { createContext, useContext, useState } from "react";

type Events = Record<string, string[]>;

interface Notepad {
  id: number;
  title: string;
  content: string;
}
type Notepads = Notepad[];

interface Flashcard {
  id: number;
  title: string;
  content: string;
}
type Flashcards = Flashcard[];

type ContextType = {
  events: Events;
  setEvents: React.Dispatch<React.SetStateAction<Events>>;
  notepads: Notepads;
  setNotepads: React.Dispatch<React.SetStateAction<Notepads>>;
  flashcards: Flashcards;
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcards>>;
};
const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Events>({});
  const [notepads, setNotepads] = useState<Notepad[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  return (
    <Context.Provider value={{ events, setEvents, notepads, setNotepads, flashcards, setFlashcards }}>
      {children}
    </Context.Provider>
  );
};



export const useVars = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};
