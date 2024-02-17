import { create } from "zustand";

export interface QuickBookState {
    from: string;
    to: string;
    departureDate: string;
    passengers: number;
    searching: boolean;
}

interface QuickBookStore {
	from: string;
	to: string;
	departureDate: string;
	passengers: number;
	searching: boolean;
	setFrom: (from: string) => void;
	setTo: (to: string) => void;
	setDepartureDate: (departureDate: string) => void;
	setPassengers: (passengers: number) => void;
	clear: () => void;
	setSearch: (search: boolean) => void;
    setQuickBook: (quickBook: QuickBookState) => void;
}

const useQuickBookStore = create<QuickBookStore>((set) => ({
	from: "",
	to: "",
	departureDate: "",
	passengers: 1,
	searching: false,
	setFrom: (from: string) => set({ from }),
	setTo: (to: string) => set({ to }),
	setDepartureDate: (departureDate: string) => set({ departureDate }),
	setPassengers: (passengers: number) => set({ passengers }),
	clear: () => set({ from: "", to: "", departureDate: "", passengers: 1 }),
	setSearch: (search: boolean) => set({ searching: search }),
    setQuickBook: (quickBook: QuickBookState) => set(quickBook)
}));

export default useQuickBookStore;
