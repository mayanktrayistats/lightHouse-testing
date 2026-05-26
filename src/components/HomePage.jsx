import { heavyBlockingWork } from "../utils/heavyBlockingWork";
import { FEATURES, GAMES, LEADERBOARD } from "./data";
import { IMG } from "../utils/image";
import { getSettings } from "../utils/config";

const StarRating = ({ rating }) => {
  return (
    <div className="game-rating">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))}
      <span style={{color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",marginLeft:4}}>{rating}</span>
    </div>
  );
}

const HomePage = ({ setPage }) => {
  const settings = getSettings();

  // 🔴 TBT: runs on every HomePage render (bypassed if optimized inside heavyBlockingWork)
  if (!settings.tbt) {
    heavyBlockingWork();
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        {/* Left Column: Content */}
        <div className="hero-content">
          <div className="hero-tag">// SEASON 7 IS LIVE — JOIN 50M+ PLAYERS</div>
          <h1>The Future<br/>of Gaming<br/>Is Here</h1>
          <p>Enter NEXUS.GG — the ultimate gaming platform where legends are forged, tournaments are won, and next-gen experience begins.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={()=>setPage("store")}>Start Playing</button>
            <button className="btn-secondary" onClick={()=>setPage("tournaments")}>Watch Trailer</button>
          </div>
          <div className="stats-row">
            {[["50M+","Players"],["200+","Games"],["$10M","Prize Pool"],["150+","Countries"]].map(([n,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right Column: Image */}
        <div className="hero-image-container">
          {/*
            🔴 LCP: Unoptimized uses div styled with CSS background image (hidden from preload scanner)
            🟢 OPTIMIZED: Uses dynamic <img> tag with fetchpriority="high", preloaded in head, AVIF format
          */}
          {settings.lcp ? (
            <img 
              className="hero-bg" 
              src={IMG("bg-image1")} 
              alt="The Future of Gaming"
              fetchpriority="high"
              width={settings.cls ? 540 : undefined}
              height={settings.cls ? 338 : undefined}
            />
          ) : (
            <div 
              className="hero-bg-div" 
              style={{ backgroundImage: `url('${IMG("bg-image")}')` }} 
            />
          )}
        </div>
      </section>

      {/* GAMES */}
      <section style={{background:"#060610"}}>
        <div className="section-title">Featured Games</div>
        <div className="section-sub">// Top Titles This Season</div>
        <div className="games-grid">
          {GAMES.map(g=>(
            <div className="game-card" key={g.id}>
              {/* 
                🔴 SPEED INDEX: No lazy loading, loads massive 3.1MB images
                🔴 CLS: No width/height tags (causes layout shifts on slow connections)
              */}
              <img 
                className="game-card-img" 
                src={g.img} 
                alt={g.title} 
                loading={settings.si ? "lazy" : "eager"}
                width={settings.cls ? 360 : undefined}
                height={settings.cls ? 195 : undefined}
              />
              <div className="game-card-body">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.45rem"}}>
                  <div className="game-card-title">{g.title}</div>
                  <span className={`game-badge badge-${g.badge}`}>{g.badge.toUpperCase()}</span>
                </div>
                <div className="game-card-genre">{g.genre}</div>
                <div className="game-card-desc">{g.desc}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <StarRating rating={g.rating}/>
                  <span style={{fontFamily:"'Orbitron',monospace",fontSize:"0.82rem",color:"#fff",fontWeight:700}}>{g.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{background:"linear-gradient(180deg,#050510,#080818)"}}>
        <div className="section-title">Why NEXUS.GG</div>
        <div className="section-sub">// Built for Champions</div>
        <div className="features-grid">
          {FEATURES.map(f=>(
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section style={{background:"#060610"}}>
        <div className="section-title">Epic Battles Await</div>
        <div className="section-sub">// Real Gameplay. Real Stakes.</div>
        
        <div className="showcase-grid">
          <img 
            className="showcase-img" 
            src={IMG("tournament1")} 
            alt="Compete"
            loading={settings.si ? "lazy" : "eager"}
            width={settings.cls ? 580 : undefined}
            height={settings.cls ? 326 : undefined}
          />
          <div className="showcase-text" style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <h3>Compete on the World Stage</h3>
            <p>Join weekly tournaments, seasonal ranked ladders, and live-streamed championships broadcast to millions. Every match is a chance to prove you're the best.</p>
            <p>Earn exclusive cosmetics, rank titles, and real cash prizes.</p>
            <button className="btn-primary" style={{width:"fit-content"}} onClick={()=>setPage("tournaments")}>Join Tournament</button>
          </div>
        </div>
        
        <div className="showcase-grid" style={{marginTop:"2rem"}}>
          <div className="showcase-text" style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <h3>Forge Your Clan</h3>
            <p>Build a squad, recruit the best players, and wage war in Clan Wars mode. Territory control, resource raiding, and clan leaderboards — dominate or be dominated.</p>
            <button className="btn-secondary" style={{width:"fit-content"}}>Create Clan</button>
          </div>
          <img 
            className="showcase-img" 
            src={IMG("tournament2")} 
            alt="Clan wars"
            loading={settings.si ? "lazy" : "eager"}
            width={settings.cls ? 580 : undefined}
            height={settings.cls ? 326 : undefined}
          />
        </div>
      </section>

      {/* LEADERBOARD */}
      <section style={{background:"var(--dark-bg)"}}>
        <div className="section-title">Global Leaderboard</div>
        <div className="section-sub">// Season 7 Rankings</div>
        <div className="leaderboard">
          {LEADERBOARD.map(p=>(
            <div className="lb-row" key={p.rank}>
              <div className={`lb-rank ${p.rank===1?"gold":p.rank===2?"silver":p.rank===3?"bronze":""}`}>
                {p.rank<=3?["🥇","🥈","🥉"][p.rank-1]:"#"+p.rank}
              </div>
              {/* 
                🔴 SPEED INDEX: Avatar loads a massive 8.4MB image file for a small 42px element
                🔴 CLS: No avatar width/height tags (causes page shifts on avatar load)
              */}
              <img 
                className="lb-avatar" 
                src={p.avatar} 
                alt={p.name}
                loading={settings.si ? "lazy" : "eager"}
                width={settings.cls ? 42 : undefined}
                height={settings.cls ? 42 : undefined}
              />
              <div style={{flex:1}}>
                <div className="lb-name">{p.name}</div>
                <div className="lb-level">{p.level}</div>
              </div>
              <div className="lb-score">{p.score} pts</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"2rem"}}>
          <button className="btn-secondary" onClick={()=>setPage("dashboard")}>View Full Dashboard</button>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="section-title" style={{marginBottom:"0.5rem"}}>Stay in the Game</div>
        <div className="section-sub">// Drops, Patches & Alerts</div>
        <p style={{color:"rgba(255,255,255,0.4)",maxWidth:"460px",margin:"0 auto",textAlign:"center",lineHeight:1.7,fontSize:"0.92rem"}}>
          Get early access to new drops, patch notes, tournament brackets, and exclusive subscriber rewards.
        </p>
        <div className="newsletter-form">
          <input className="newsletter-input" type="email" placeholder="your@email.com"/>
          <button className="btn-primary">Subscribe</button>
        </div>
      </section>
    </>
  );
}

export default HomePage;