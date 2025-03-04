const ukToEn: Record<string, string> = {
  й: 'q',
  ц: 'w',
  у: 'e',
  к: 'r',
  е: 't',
  н: 'y',
  г: 'u',
  ш: 'i',
  щ: 'o',
  з: 'p',
  х: '[',
  ї: ']',
  ф: 'a',
  і: 's',
  в: 'd',
  а: 'f',
  п: 'g',
  р: 'h',
  о: 'j',
  л: 'k',
  д: 'l',
  ж: ';',
  є: "'",
  я: 'z',
  ч: 'x',
  с: 'c',
  м: 'v',
  и: 'b',
  т: 'n',
  ь: 'm',
  б: ',',
  ю: '.',
  "'": '`',
};

const enToUk: Record<string, string> = Object.fromEntries(
  Object.entries(ukToEn).map(([uk, en]) => [en, uk])
);

export const convertToUkrainianLayout = (input: string): string => {
  return input
    .split('')
    .map(char => enToUk[char] || char)
    .join('');
};
