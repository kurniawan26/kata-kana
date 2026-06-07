export type LevelConfig = {
  id: number
  name: string
  kanaPreview: string
  groups: string[]
}

export const LEVELS: LevelConfig[] = [
  { id: 1,  name: 'Vowels',      kanaPreview: 'あいうえお',   groups: ['h_group1'] },
  { id: 2,  name: 'K-Row',       kanaPreview: 'かきくけこ',   groups: ['h_group2'] },
  { id: 3,  name: 'S-Row',       kanaPreview: 'さしすせそ',   groups: ['h_group3'] },
  { id: 4,  name: 'T-Row',       kanaPreview: 'たちつてと',   groups: ['h_group4'] },
  { id: 5,  name: 'N-Row',       kanaPreview: 'なにぬねの',   groups: ['h_group5'] },
  { id: 6,  name: 'H & M Rows',  kanaPreview: 'はひふまみむ', groups: ['h_group6', 'h_group7'] },
  { id: 7,  name: 'Y · R · W',   kanaPreview: 'やゆよらわん', groups: ['h_group8', 'h_group9', 'h_group10'] },
  { id: 8,  name: 'Katakana I',  kanaPreview: 'アカサタナ',   groups: ['k_group1', 'k_group2', 'k_group3', 'k_group4', 'k_group5'] },
  { id: 9,  name: 'Katakana II', kanaPreview: 'ハマヤラワ',   groups: ['k_group6', 'k_group7', 'k_group8', 'k_group9', 'k_group10'] },
  { id: 10, name: 'Dakuten',     kanaPreview: 'がざだばぱ',   groups: ['h_group11_a', 'h_group12_a', 'h_group13_a', 'h_group14_a', 'h_group15_a'] },
]

export const PASSING_SCORE = 0.7

export function getStars(score: number): number {
  if (score >= 0.9) return 3
  if (score >= PASSING_SCORE) return 2
  if (score > 0) return 1
  return 0
}
