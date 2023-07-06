import { create } from "zustand"

type ConsultancyFilter = {
  filter: Consultancy[]
  add: (s: Consultancy) => void
  remove: (a: Consultancy) => void
  clear: () => void
}

type Consultancy = {
  name: string
}

export const useFilter = create<ConsultancyFilter>()((set) => ({
  filter: [{ name: "Orbis AG" }],
  add: (s) =>
    set((state) => {
      let found = false
      for (var i = 0; i < state.filter.length; i++) {
        if (state.filter[i].name == s.name) {
          found = true
          break
        }
      }
      if (found) {
        return { filter: state.filter.filter((pre) => pre.name != s.name) }
      } else {
        return { filter: state.filter.concat(s) }
      }
    }),
  remove: (s) =>
    set((state) => ({
      filter: state.filter.filter((pre) => pre.name != s.name),
    })),
  clear: () => set((state) => ({ filter: [] })),
}))
