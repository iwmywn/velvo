import { Product } from "./definition";

function shuffleArray(array: Product[]) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function generateSlugWithRandom(
  category: string,
  name: string,
  description: string,
): string {
  const randomString = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((byte) => byte.toString(36).padStart(2, "0"))
    .join("")
    .substring(0, 16);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return `${normalize(category)}-${normalize(name)}-${normalize(description)}-${randomString}`;
}

export { shuffleArray, generateSlugWithRandom };
