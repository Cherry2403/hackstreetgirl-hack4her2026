// Endangered-animal collection.
// Two image versions per animal (drop real artwork in with these filenames):
//   - realistic photo for the My Sphere collection: /public/realistic/<id>.png
//   - cartoon "running" sprite for the header walker:  /public/cartoon/<id>.png
// The cartoon sprite should face RIGHT; the header flips it when walking left.

export interface Animal {
  id: string;
  name: string;
  /** "# remaining" in the wild — kept short for the card. */
  remaining: number;
  /** Realistic photo shown in the collection. */
  realistic: string;
  /** Cartoon running sprite shown walking in the header. */
  cartoon: string;
  /** Three interesting facts shown in the unlock modal. */
  facts: [string, string, string];
}

export const ANIMALS: Animal[] = [
  {
    id: "honey-badger",
    name: "Honey badger",
    remaining: 9000,
    realistic: "/realistic/honey-badger.png",
    cartoon: "/cartoon/honey-badger.png",
    facts: [
      "Honey badgers are nearly immune to snake venom and regularly eat venomous cobras.",
      "They have loose, thick skin that lets them twist around to bite attackers — even while being held.",
      "Honey badgers use tools: they've been filmed stacking objects to escape enclosures.",
    ],
  },
  {
    id: "red-panda",
    name: "Red panda",
    remaining: 10000,
    realistic: "/realistic/red-panda.png",
    cartoon: "/cartoon/red-panda.png",
    facts: [
      "Red pandas were the original 'panda' — discovered 48 years before the giant panda was named.",
      "They have a false thumb (an enlarged wrist bone) to grip bamboo, just like giant pandas.",
      "Red pandas are most active at dawn and dusk, and sleep curled up with their tail over their face.",
    ],
  },
  {
    id: "red-fox",
    name: "Red fox",
    remaining: 7000,
    realistic: "/realistic/red-fox.png",
    cartoon: "/cartoon/red-fox.png",
    facts: [
      "Red foxes use Earth's magnetic field to pinpoint prey hiding under snow before pouncing.",
      "A fox's bushy tail (called a brush) acts as a warm blanket and a balance aid at the same time.",
      "They communicate with over 40 different vocalisations, including a spine-chilling scream.",
    ],
  },
  {
    id: "meerkat",
    name: "Meerkat",
    remaining: 5000,
    realistic: "/realistic/meerkat.png",
    cartoon: "/cartoon/meerkat.png",
    facts: [
      "Meerkats are immune to many venoms, including scorpion stings that would kill a small cat.",
      "Pups are taught to handle live prey gradually — starting with dead scorpions, then live ones.",
      "The whole mob takes turns babysitting while others forage, with no expectation of food reward.",
    ],
  },
  {
    id: "skunk",
    name: "Skunk",
    remaining: 4000,
    realistic: "/realistic/skunk.png",
    cartoon: "/cartoon/skunk.png",
    facts: [
      "Skunks warn predators with a handstand display before spraying — a polite final warning.",
      "Their spray can reach up to 3 metres and the smell can linger for days if not neutralised.",
      "Skunks are highly resistant to snake venom and are one of the main predators of rattlesnakes.",
    ],
  },
];

export function getAnimal(id: string): Animal | undefined {
  return ANIMALS.find((a) => a.id === id);
}

/** Short remaining label, e.g. 9000 -> "9k". */
export function remainingLabel(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return String(n);
}
