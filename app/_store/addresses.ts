import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
};

interface AddressState {
  details: Address[];
  addAddress: (address: Address) => void;
}

const addAddress = (address: Address) => {
  return (state: AddressState) => {
    return { details: [...state.details, address] };
  };
};

export const useAddresses = create<AddressState>()(
  persist(
    (set) => ({
      details: [] as Address[],
      addAddress: (addr: Address) => set(addAddress(addr)),
    }),
    { name: "addresses" }
  )
);
