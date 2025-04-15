import React, { createContext, useContext, useState } from "react";

type Events = Record<string, string[]>;

interface Notepad {
  id: number;
  title: string;
  content: string;
}
type Notepads = Notepad[];

type ContextType = {
  events: Events;
  setEvents: React.Dispatch<React.SetStateAction<Events>>;
  notepads: Notepads;
  setNotepads: React.Dispatch<React.SetStateAction<Notepads>>;
};
const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Events>({});
  const [notepads, setNotepads] = useState<Notepad[]>([]);

  return (
    <Context.Provider value={{ events, setEvents, notepads, setNotepads }}>
      {children}
    </Context.Provider>
  );
};

export const useVars = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};
