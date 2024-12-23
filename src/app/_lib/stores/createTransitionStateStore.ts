import { create } from 'zustand'; // Use named import

type TransitionPayload = {
  first_name: string;
  last_name: string;
};

type CreateTransitionState = {
  transitionPayload: TransitionPayload;
  setTransitionPayload: (newPayload: TransitionPayload) => void;
  resetTransitionPayload: () => void;
};

export const useCreateTransition = create<CreateTransitionState>((set) => ({
  transitionPayload: { first_name: '', last_name: '' },
  setTransitionPayload: (newPayload: TransitionPayload) =>
    set({ transitionPayload: newPayload }),
  resetTransitionPayload: () =>
    set({ transitionPayload: { first_name: '', last_name: '' } }),
}));

export default useCreateTransition;