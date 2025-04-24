export const generateUsername = () => {
    const adjectives = ["Gridiron", "Clutch", "Pigskin", "Elite", "Blitz"];
    const nouns = ["Beast", "Fanatic", "Guru", "Wizard", "Tank"];
    return (
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      nouns[Math.floor(Math.random() * nouns.length)] +
      Math.floor(Math.random() * 100)
    );
  };
  