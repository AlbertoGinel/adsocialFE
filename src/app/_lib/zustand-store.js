import { create } from "zustand";

const useAppState = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Export the store as a named export
export { useAppState };

// Optionally, you can also export a provider component
const AppStateProvider = ({ children }) => {
  return <useAppState.Provider>{children}</useAppState.Provider>;
};

// Export the provider component
export { AppStateProvider };
