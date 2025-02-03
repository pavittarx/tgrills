import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  name: string;
  phone: string;
  email?: string;
  address: string;
};

interface AddressState {
  address: Address;
  addAddress: (address: Address) => void;
}

const addAddress = (address: Address) => {
  return () => {
    return { address };
  };
};

export const useAddress = create<AddressState>()(
  persist(
    (set) => ({
      address: {} as Address,
      addAddress: (address: Address) => set(addAddress(address)),
    }),
    { name: "addresses" }
  )
);
