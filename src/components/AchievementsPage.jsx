import { useEffect } from "react";
import { heavyBlockingWork } from "../utils/heavyBlockingWork";
import { ACHIEVEMENTS } from "./data";
import { getSettings } from "../utils/config";

const AchievementsPage = () => {
  const settings = getSettings();

  // 🔴 TBT: Heavy work on render and mount (bypassed if optimized inside heavyBlockingWork)
  if (!settings.tbt) {
    heavyBlockingWork();
  }

  useEffect(() => { 
    if (!settings.tbt) {
      heavyBlockingWork(); 
    }
  }, [settings.tbt]);

  return (
    <section style={{paddingTop:"100px",background:"var(--dark-bg)",minHeight:"100vh"}}>
      <div className="section-title">Achievements</div>
      <div className="section-sub">// Your Hall of Glory</div>
      <div className="ach-grid">
        {ACHIEVEMENTS.map(a=>(
          <div className="ach-card" key={a.name}>
            <span className="ach-icon" aria-label="icon">{a.icon}</span>
            <div className="ach-name">{a.name}</div>
            <div className="ach-desc">{a.desc}</div>
            <div className="ach-progress-bar">
              <div className="ach-progress-fill" style={{width:`${a.pct}%`}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.5rem"}}>
              <div className={`ach-rarity ach-${a.rarity}`}>{a.rarity.toUpperCase()}</div>
              <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.3)"}}>{a.pct}%</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AchievementsPage;