import { create } from "zustand";

interface KeyboardStore {
  isInputFocused: boolean;
  setIsInputFocused: (focused: boolean) => void;
}

const useKeyboardStore = create<KeyboardStore>((set) => ({
  isInputFocused: false,
  setIsInputFocused: (focused) => set({ isInputFocused: focused }),
}));

export default useKeyboardStore;
