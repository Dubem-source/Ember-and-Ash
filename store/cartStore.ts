import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  subtotal: () => number;
  itemCount: () => number;
  setHasHydrated: (value: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      updateNotes: (id, notes) => {
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, notes } : i)),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => {
        const subtotal = get().subtotal();
        return subtotal;
      },

      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "ember-cart",
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (!error) state?.setHasHydrated(true);
      },
    },
  ),
);
