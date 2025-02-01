import { create } from "zustand";

export type Banner = {
  top: string[];
  middle: string[];
  bottom: string[];
};

interface BannersState {
  top: string[];
  middle: string[];
  bottom: string[];
  setTop: (banners: string[]) => void;
  setMiddle: (banners: string[]) => void;
  setBottom: (banners: string[]) => void;
  setBanners: (banners: Banner) => void;
}

export const useBanners = create<BannersState>()((set) => ({
  top: [],
  middle: [],
  bottom: [],
  setBanners: (banners: Banner) => set(banners),
  setTop: (banners: string[]) => set({ ...banners, top: banners }),
  setMiddle: (banners: string[]) => set({ ...banners, middle: banners }),
  setBottom: (banners: string[]) => set({...banners, bottom: banners }),
}));
