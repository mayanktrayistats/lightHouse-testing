import { IMG } from "../utils/image";

export const GAMES = [
  { id:1, title:"Shadow Protocol",  genre:"Tactical FPS",   desc:"Next-gen tactical warfare with hyper-realistic physics and adaptive AI.",   img:IMG("cardImage11"), rating:4.9, badge:"hot",  price:"$59.99" },
  { id:2, title:"Neon Abyss II",    genre:"Action RPG",     desc:"Descend into a cyberpunk underworld filled with rogue-like dungeons.",       img:IMG("cardImage22"), rating:4.7, badge:"new",  price:"$49.99" },
  { id:3, title:"Apex Dominion",    genre:"Battle Royale",  desc:"100 players, one map, zero mercy. The ultimate survival showdown.",          img:IMG("cardImage3"), rating:4.8, badge:"hot",  price:"Free"   },
  { id:4, title:"Stellar Drift",    genre:"Space Sim",      desc:"Chart unknown galaxies, build fleets, conquer civilizations.",               img:IMG("cardImage4"), rating:4.6, badge:"sale", price:"$29.99" },
  { id:5, title:"Iron Citadel",     genre:"Strategy RTS",   desc:"Build, defend and destroy in the most brutal RTS ever made.",                img:IMG("cardImage4"), rating:4.5, badge:"new",  price:"$39.99" },
  { id:6, title:"Void Runner",      genre:"Endless Runner", desc:"Speed through procedural dimensions at 240fps with full haptics.",           img:IMG("cardImage6"), rating:4.3, badge:"sale", price:"$14.99" },
  { id:7, title:"Phantom Breach",   genre:"Stealth Action", desc:"Infiltrate mega-corps, hack systems, vanish before they see you.",           img:IMG("cardImage7"), rating:4.4, badge:"new",  price:"$44.99" },
  { id:8, title:"Quantum Legion",   genre:"MOBA",           desc:"5v5 tactical team battles with 120+ unique quantum-powered heroes.",          img:IMG("cardImage8"), rating:4.6, badge:"hot",  price:"Free"   },
];

export const STORE_ITEMS = [
  { id:1, title:"Shadow Protocol — Deluxe",   price:"$79.99", old:"$99.99", img:IMG("cardImage11") },
  { id:2, title:"Neon Abyss II Season Pass",  price:"$24.99", old:"$39.99", img:IMG("cardImage22") },
  { id:3, title:"Apex Dominion Battle Pass",  price:"$9.99",  old:null,     img:IMG("cardImage3") },
  { id:4, title:"Stellar Drift: Nova Pack",   price:"$14.99", old:"$19.99", img:IMG("cardImage4") },
  { id:5, title:"Neon Skin Bundle Vol.3",     price:"$19.99", old:"$34.99", img:IMG("cardImage4") },
  { id:6, title:"NEXUS Points — 5000",        price:"$49.99", old:null,     img:IMG("cardImage6") },
  { id:7, title:"Iron Citadel Expansion",     price:"$29.99", old:"$44.99", img:IMG("cardImage7") },
  { id:8, title:"Void Runner Soundtrack",     price:"$4.99",  old:null,     img:IMG("cardImage8") },
];

export const TOURNAMENTS = [
  { id:1, name:"World Cyber Games 2024",     game:"Shadow Protocol", prize:"$500,000",   teams:128, date:"Dec 14–22", status:"live",     img:IMG("cardImage7") },
  { id:2, name:"Neon Invitational Season 7", game:"Neon Abyss II",   prize:"$250,000",   teams:64,  date:"Dec 28",    status:"upcoming", img:IMG("cardImage22") },
  { id:3, name:"Apex Global Championship",   game:"Apex Dominion",   prize:"$1,000,000", teams:200, date:"Jan 10–15", status:"upcoming", img:IMG("cardImage11") },
  { id:4, name:"Iron League Cup Q4",         game:"Iron Citadel",    prize:"$75,000",    teams:32,  date:"Nov 30",    status:"ended",    img:IMG("cardImage4") },
  { id:5, name:"Stellar Open Universe",      game:"Stellar Drift",   prize:"$150,000",   teams:48,  date:"Jan 5–8",   status:"upcoming", img:IMG("cardImage4") },
];

export const NEWS_ARTICLES = [
  { id:1, title:"Season 7 Patch Notes: Everything Changed",           cat:"patch",   date:"Dec 12, 2024", excerpt:"Biggest balance overhaul in NEXUS.GG history drops today.", img:IMG("cardImage7") },
  { id:2, title:"World Cyber Games Bracket Revealed",                 cat:"esports", date:"Dec 11, 2024", excerpt:"All 128 teams set. Here's who faces who in Round 1.",       img:IMG("cardImage11") },
  { id:3, title:"New Map: The Shattered Citadel Drops Next Week",     cat:"update",  date:"Dec 10, 2024", excerpt:"Six new zones, dynamic weather, destructible terrain.",     img:IMG("cardImage4") },
  { id:4, title:"Phantom Breach 2.4 — Stealth Rework Explained",     cat:"patch",   date:"Dec 9, 2024",  excerpt:"The dev team breaks down the new detection system.",         img:IMG("cardImage22") },
  { id:5, title:"NeonViper_X: 'I Practice 14 Hours a Day'",           cat:"esports", date:"Dec 8, 2024",  excerpt:"Exclusive interview with the current #1 ranked player.",    img:IMG("cardImage3") },
  { id:6, title:"Cross-Platform Play Now Live for All Titles",         cat:"update",  date:"Dec 7, 2024",  excerpt:"Console and PC players can now compete in the same lobbies.", img:IMG("cardImage6") },
];

export const LEADERBOARD = [
  { rank:1, name:"NeonViper_X",   score:"2,847,500", level:"Grand Master", avatar:IMG("player1") },
  { rank:2, name:"ShadowPulse99", score:"2,651,200", level:"Diamond",      avatar:IMG("player2") },
  { rank:3, name:"CyberWraith",   score:"2,490,800", level:"Diamond",      avatar:IMG("player3") },
  { rank:4, name:"QuantumRift",   score:"2,301,100", level:"Platinum",     avatar:IMG("player4") },
  { rank:5, name:"GlitchKing_77", score:"2,198,400", level:"Platinum",     avatar:IMG("player5") },
  { rank:6, name:"NullPointer",   score:"2,044,300", level:"Gold",         avatar:IMG("player6") },
  { rank:7, name:"ByteSlayer",    score:"1,987,600", level:"Gold",         avatar:IMG("player7") },
  { rank:8, name:"PixelGhost",    score:"1,830,200", level:"Silver",       avatar:IMG("player8") },
];

export const ACHIEVEMENTS = [
  { icon:"🏆", name:"Grand Champion",   desc:"Win 500 ranked matches",       pct:78,  rarity:"legendary" },
  { icon:"⚡", name:"Lightning Reflex", desc:"Achieve 0.1s reaction time",   pct:45,  rarity:"legendary" },
  { icon:"💀", name:"Unstoppable",      desc:"30 kills without dying",        pct:62,  rarity:"rare"      },
  { icon:"🌍", name:"World Traveler",   desc:"Play on all 50 server regions", pct:100, rarity:"rare"      },
  { icon:"🎯", name:"Headhunter",       desc:"Land 10,000 headshots",         pct:89,  rarity:"rare"      },
  { icon:"🤝", name:"Team Player",      desc:"Win 1,000 clan war battles",    pct:34,  rarity:"common"    },
  { icon:"💰", name:"High Roller",      desc:"Spend $1,000 in the store",     pct:20,  rarity:"common"    },
  { icon:"🔥", name:"On Fire",          desc:"Win 10 matches in a row",       pct:55,  rarity:"rare"      },
  { icon:"🛡️", name:"Iron Wall",        desc:"Block 50,000 damage",           pct:91,  rarity:"common"    },
  { icon:"🌟", name:"Legend Status",    desc:"Reach Grand Master rank",       pct:12,  rarity:"legendary" },
  { icon:"🎮", name:"Marathon Gamer",   desc:"Play 5,000 hours total",        pct:67,  rarity:"rare"      },
  { icon:"🚀", name:"Speed Demon",      desc:"Win a match in under 3 minutes",pct:43,  rarity:"legendary" },
];

export const FEATURES = [
  { icon:"⚡", title:"Ultra-Low Latency", desc:"Sub-5ms server response across 200+ edge nodes worldwide." },
  { icon:"🏆", title:"Ranked Seasons",    desc:"Seasonal ladders with exclusive rewards, titles and cosmetics." },
  { icon:"🎮", title:"Cross-Platform",    desc:"Seamless play across PC, console, and mobile with full sync." },
  { icon:"🤖", title:"AI Anti-Cheat",     desc:"Neural-network detection eliminates cheaters in real-time." },
  { icon:"🌐", title:"Global Servers",    desc:"200+ regions guarantee under 20ms ping in 150+ countries." },
  { icon:"🎙️", title:"Spatial Audio",     desc:"Directional 3D sound engine with noise-cancellation." },
];

export const DB_ACTIVITIES = [
  { name:"NeonViper_X",   action:"Won a Ranked Match",       time:"2m ago",  avatar:IMG("player1") },
  { name:"ShadowPulse99", action:"Unlocked Achievement ⚡",  time:"5m ago",  avatar:IMG("player2") },
  { name:"CyberWraith",   action:"Joined Tournament",        time:"12m ago", avatar:IMG("player3") },
  { name:"QuantumRift",   action:"Purchased Neon Bundle",    time:"18m ago", avatar:IMG("player4") },
  { name:"GlitchKing_77", action:"Reached Platinum Rank 🥈", time:"24m ago", avatar:IMG("player5") },
];
