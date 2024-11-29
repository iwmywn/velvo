interface Props {
  id: number;
  name: string;
  priceCents: number;
  images: string[];
  saleOff: number;
}

export default function shuffleArray(array: Props[]) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
