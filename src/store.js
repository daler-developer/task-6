import create from "zustand";

const useStore = create((set) => ({
  region: "england",
  page: 1,
  inaccurateNumErrors: 1,
  seed: "test",

  setRegion(to) {
    set(() => ({ region: to }));
  },
  setPage(to) {
    set(() => ({ page: to }));
  },
  setInaccurateNumErrors(to) {
    set(() => ({ inaccurateNumErrors: to }));
  },
  setSeed(to) {
    set(() => ({ seed: to }));
  },
}));

export default useStore;
