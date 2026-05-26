import { useState } from "react";
import { heavyBlockingWork } from "../utils/heavyBlockingWork";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label:"Home", page:"home" },
  { label:"Games", page:"home" },
  { label:"Leaderboard", page:"home" },
  { label:"Community", page:"home" },
];
const DROPDOWN_PAGES = [
  { label:"Dashboard",    page:"dashboard",    emoji:"📊" },
  { label:"Game Store",   page:"store",        emoji:"🛒" },
  { label:"Tournaments",  page:"tournaments",  emoji:"⚔️"  },
  { label:"News & Blog",  page:"news",         emoji:"📰" },
  { label:"Achievements", page:"achievements", emoji:"🏅" },
  { label:"Clan Wars",    page:"home",         emoji:"🔥" },
  { label:"Live Streams", page:"home",         emoji:"📡" },
  { label:"Settings",     page:"home",         emoji:"⚙️"  },
];

const Navbar = ({ setPage }) => {
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔴 TBT: Heavy work called on every nav interaction (bypassed if optimized inside heavyBlockingWork)
  const go = (p) => { 
    heavyBlockingWork(); 
    setPage(p); 
    setDropOpen(false); 
    setMenuOpen(false);
  };

  return (
    <nav>
      <div className="nav-logo" onClick={()=>go("home")}>NEXUS<span>.GG</span></div>
      
      {/* Mobile hamburger menu toggle */}
      <button className="nav-toggle-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={menuOpen ? "nav-active" : ""}>
        {NAV_LINKS.map(l=>(
          <li key={l.label}><a href="#" onClick={e=>{e.preventDefault();go(l.page);}}>{l.label}</a></li>
        ))}
        <li className="nav-dropdown" onMouseEnter={()=>setDropOpen(true)} onMouseLeave={()=>setDropOpen(false)}>
          <button onClick={() => setDropOpen(!dropOpen)}>More Pages ▾</button>
          {dropOpen && (
            <div className="nav-dropdown-menu">
              {DROPDOWN_PAGES.map(p=>(
                <button key={p.label} onClick={()=>go(p.page)}>{p.emoji} {p.label}</button>
              ))}
            </div>
          )}
        </li>
        <li><button className="cta-btn" onClick={()=>go("store")}>▶ Play Free</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;