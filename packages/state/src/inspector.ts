import { create } from 'zustand';

export type InspectorKind =
  | { type: 'none' }
  | { type: 'connect' }
  | { type: 'compose'; replyToId?: string }
  | { type: 'thread'; statusId: string }
  | { type: 'profile'; acctOrId: string }
  | { type: 'settings' }
  | { type: 'stages' };

type InspectorState = {
  inspector: InspectorKind;
  setInspector: (i: InspectorKind) => void;
  pin: boolean;
  setPin: (pin: boolean) => void;
};

export const useInspectorStore = create<InspectorState>((set) => ({
  inspector: { type: 'stages' },
  setInspector: (inspector) => set({ inspector }),
  pin: true,
  setPin: (pin) => set({ pin })
}));
