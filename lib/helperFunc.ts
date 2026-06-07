export function arrayContains<T>(needle: T, haystack: T[]): boolean {
  return haystack.includes(needle);
}

export function removeFromArray<T>(needle: T, haystack: T[]): T[] {
  const index = haystack.indexOf(needle);
  if (index !== -1) {
    haystack.splice(index, 1);
  }
  return haystack;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findRomajisAtKanaKey(needle: string, kanaDictionary: any): string[] {
  for (const whichKana in kanaDictionary) {
    for (const groupName in kanaDictionary[whichKana]) {
      const characters = kanaDictionary[whichKana][groupName]['characters'];
      if (needle in characters) {
        return characters[needle];
      }
    }
  }
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function whichKanaTypeIsThis(character: string, kanaDictionary: Record<string, any>): string | null {
  for (const whichKana in kanaDictionary) {
    for (const groupName in kanaDictionary[whichKana]) {
      if (character in kanaDictionary[whichKana][groupName]['characters']) {
        return whichKana;
      }
    }
  }
  return null;
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements using destructuring
  }
  return array;
}

export function removeHash(): void {
  if (window.history.replaceState) {
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
  } else {
    window.location.hash = '';
  }
}

export function getRandomFromArray<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;
}

export function cartesianProduct<T>(elements: T[][]): T[][] {
  if (!Array.isArray(elements)) {
    throw new TypeError('Input must be an array of arrays');
  }

  return elements.reduce<T[][]>((acc, curr) => {
    return acc.flatMap(a => curr.map(b => [...a, b]));
  }, [[]]);
}