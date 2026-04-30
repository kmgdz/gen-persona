export async function generatePersona(answers: string[]) {
  // Simulate some thinking time to keep the UX feeling like it's analyzing
  await new Promise(resolve => setTimeout(resolve, 1500));

  const personas = [
    {
      title: "Diamond-Handed Degen",
      description: "You have Visionary tendencies and a 73% chance of becoming a whale. You never sell at a loss and believe in the underlying tech (but mostly the memes).",
      traits: ["Diamond Hands", "Visionary", "Hopium Addict"],
      emoji: "💎🙌"
    },
    {
      title: "Shadowy Super Coder",
      description: "You thrive in the dark mode. You are a true builder at heart with a 99% chance of launching a successful DAO that you'll probably forget about in a week.",
      traits: ["Builder", "Anon", "Big Brain"],
      emoji: "💻🥷"
    },
    {
      title: "Gas Fee Martyr",
      description: "You've spent more on gas fees than your actual portfolio balance. You have a 100% chance of complaining about ETH gwei on Twitter.",
      traits: ["Patience", "Gwei Watcher", "Layer 2 Maxi"],
      emoji: "⛽💀"
    },
    {
      title: "Yield Farming Chad",
      description: "You move liquidity faster than most people change their socks. You have an 88% chance of getting rugged but you'll make it back in the next farm.",
      traits: ["APY Chaser", "Risk Taker", "DeFi Native"],
      emoji: "🚜🌾"
    },
    {
      title: "Ape With A Plan",
      description: "You buy first and read the whitepaper never. You have a 50/50 chance of generational wealth or moving back in with your parents.",
      traits: ["Impulsive", "Vibes Only", "Moon Math"],
      emoji: "🦍🚀"
    },
    {
      title: "The Over-Analyzer",
      description: "You have 15 charts open right now and draw triangles that mean nothing. 100% chance of missing the pump while waiting for confirmation.",
      traits: ["TA Expert", "Skeptical", "Chart Gobler"],
      emoji: "📈🤓"
    },
    {
      title: "Airdrop Hunter",
      description: "You have 45 different wallets and bridge 0.01 ETH daily. 99% chance you are considered a sybil attacker by your own family.",
      traits: ["Grinder", "Persistent", "Free Money Maxi"],
      emoji: "🪂🕵️"
    },
    {
      title: "Permabull Maxi",
      description: "You buy the dip. The dip keeps dipping. You buy more. You have a 100% chance of telling your friends 'we are so back' at least twice a week.",
      traits: ["Optimist", "Accumulator", "Up Only"],
      emoji: "🐂📈"
    }
  ];

  // Simple hash function to deterministically pick a persona based on the answers
  const combinedAnswers = answers.join("").toLowerCase();
  let hash = 0;
  for (let i = 0; i < combinedAnswers.length; i++) {
    hash = combinedAnswers.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Ensure positive index
  const index = Math.abs(hash) % personas.length;
  
  return personas[index];
}
