const DAKUON = new Set([
  // Hiragana
  'が','ぎ','ぐ','げ','ご',
  'ざ','じ','ず','ぜ','ぞ',
  'だ','ぢ','づ','で','ど',
  'ば','び','ぶ','べ','ぼ',
  'ぱ','ぴ','ぷ','ぺ','ぽ',
  // Katakana
  'ガ','ギ','グ','ゲ','ゴ',
  'ザ','ジ','ズ','ゼ','ゾ',
  'ダ','ヂ','ヅ','デ','ド',
  'バ','ビ','ブ','ベ','ボ',
  'パ','ピ','プ','ペ','ポ',
])

function getKanaCategory(char: string): 'seion' | 'dakuon' | 'yoon' {
  if (char.length > 1) return 'yoon'
  if (DAKUON.has(char)) return 'dakuon'
  return 'seion'
}

export function playKanaAudio(char: string): void {
  const category = getKanaCategory(char)
  const url = `https://www.japanese50sounds.com/audio/kana/${category}/${encodeURIComponent(char)}.mp3`
  new Audio(url).play().catch(() => {})
}
