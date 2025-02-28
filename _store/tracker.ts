import { create } from "zustand";

export type Tracker = {
  isCallClicked: boolean;
  isWhatsappClicked: boolean;
};

interface TrackerState {
  isCallClicked: boolean;
  isWhatsappClicked: boolean;
  callClicked: () => void
  whatsAppClicked: () => void
  clear: () => void
}

export const useTracker = create<TrackerState>()((set) => ({
  isCallClicked: false,
  isWhatsappClicked: false,
  callClicked: () => set({ isCallClicked: true }),
  whatsAppClicked: () => set({ isWhatsappClicked: true }),
  clear: () => set({ isCallClicked: false, isWhatsappClicked: false })
}));