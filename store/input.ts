import { create } from "zustand"

type form = {
  company: string
  industry: string
}

type formInputStore = {
  input: form
  submit: (i: form) => void
}

export const useInput = create<formInputStore>((set) => ({
  input: { company: "", industry: "" },
  submit: (i) => set(() => ({ input: i })),
}))
