import { create } from 'zustand'

type ChooseCharacterState = {
  errMsg: string;
  setErrMsg: (newErrMsg: string) => void;
  selectedGroup: string[];
  setSelectedGroup: (newSelectedGroup: string[]) => void;
  setShownAlternatives: (newShowAlternatives: string[]) => void;
  showAlternatives: string[];
  showSimilars: string[];
  setShownSimilars: (newShowSimilars: string[]) => void;
  startIsVisible: boolean;
}

export const useCharacters = create<ChooseCharacterState>((set) => ({
  errMsg: '',
  setErrMsg: (newErrMsg: string) => set({ errMsg: newErrMsg }),
  selectedGroup: [],
  setSelectedGroup: (newSelectedGroup: string[]) => set({ selectedGroup: newSelectedGroup }),
  showAlternatives: [],
  showSimilars: [],
  startIsVisible: true,
  setShownAlternatives: (newShowAlternatives: string[]) => set({ showAlternatives: newShowAlternatives }),
  setShownSimilars: (newShowSimilars: string[]) => set({ showSimilars: newShowSimilars }),
}))
