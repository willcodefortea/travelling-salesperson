/**
 * Fisher-Yates Shuffle.
 */
export const shuffle = (arr: Array<any>) => {
  const shuffledArray = [...arr];
  let currentIndex = arr.length;
  let randomIndex = 0;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }

  return shuffledArray;
};
