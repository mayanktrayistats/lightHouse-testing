import { useEffect } from "react";
import { heavyBlockingWork } from "../utils/heavyBlockingWork";
import { TOURNAMENTS } from "./data";
import { getSettings } from "../utils/config";

const TournamentsPage = () => {
  const settings = getSettings();

  // 🔴 TBT: runs on mount and render (bypassed if optimized inside heavyBlockingWork)
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
      <div className="section-title">Tournaments</div>
      <div className="section-sub">// Compete. Win. Become Legend.</div>
      <div className="tournament-list">
        {TOURNAMENTS.map(t=>(
          <div className="tournament-card" key={t.id}>
            {/* 
              🔴 SPEED INDEX: Downloads heavy raw JPEGs for tiny 70px elements
              🔴 CLS: Missing layout slot dimensions on logo images
            */}
            <img 
              className="t-logo" 
              src={t.img} 
              alt={t.name}
              loading={settings.si ? "lazy" : "eager"}
              width={settings.cls ? 70 : undefined}
              height={settings.cls ? 70 : undefined}
            />
            <div>
              <div className="t-name">{t.name}</div>
              <div className="t-meta">
                <span>Game: <b>{t.game}</b></span>
                <span>Teams: <b>{t.teams}</b></span>
                <span>Date: <b>{t.date}</b></span>
              </div>
              <span className={`t-status t-${t.status}`}>
                {t.status==="live"?"🟢 Live Now":t.status==="upcoming"?"🔵 Upcoming":"⚫ Ended"}
              </span>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="t-prize">{t.prize}</div>
              <div className="t-prize-label">Prize Pool</div>
              <button className="btn-primary" style={{marginTop:"0.8rem",padding:"0.6rem 1.2rem",fontSize:"0.7rem"}}>
                {t.status==="ended"?"View Results":"Register Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TournamentsPage;
