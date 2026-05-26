import { useEffect } from "react";
import { heavyBlockingWork } from "../utils/heavyBlockingWork";
import { NEWS_ARTICLES } from "./data";
import { getSettings } from "../utils/config";

const NewsPage = () => {
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

  const catClass = {update:"cat-update",esports:"cat-esports",patch:"cat-patch"};
  const catLabel = {update:"Update",esports:"Esports",patch:"Patch Notes"};
  const [featured, ...rest] = NEWS_ARTICLES;

  return (
    <section style={{paddingTop:"100px",background:"#060610",minHeight:"100vh"}}>
      <div className="section-title">News & Updates</div>
      <div className="section-sub">// What's Happening in NEXUS.GG</div>
      <div className="news-grid">
        <div className="news-featured">
          {/* 
            Featured image is above the fold. 
            🔴 CLS: Missing layout shift dimensions
          */}
          <img 
            className="news-featured-img" 
            src={featured.img} 
            alt={featured.title}
            width={settings.cls ? 780 : undefined}
            height={settings.cls ? 320 : undefined}
          />
          <div className="news-featured-body">
            <span className={`news-category ${catClass[featured.cat]}`}>{catLabel[featured.cat]}</span>
            <div className="news-featured-title">{featured.title}</div>
            <div className="news-featured-excerpt">{featured.excerpt} Read the full breakdown of every change, buff, nerf, and new mechanic introduced in this game-changing update.</div>
            <button className="btn-primary" style={{marginTop:"1.2rem"}}>Read Full Article</button>
          </div>
        </div>
        <div className="news-sidebar">
          {rest.slice(0,4).map(a=>(
            <div className="news-small-card" key={a.id}>
              {/* 
                🔴 SPEED INDEX: No lazy loading, requests heavy JPEGs for tiny slots
                🔴 CLS: Missing layout shift dimensions
              */}
              <img 
                className="news-small-img" 
                src={a.img} 
                alt={a.title}
                loading={settings.si ? "lazy" : "eager"}
                width={settings.cls ? 100 : undefined}
                height={settings.cls ? 80 : undefined}
              />
              <div className="news-small-body">
                <span className={`news-category ${catClass[a.cat]}`} style={{fontSize:"0.6rem",padding:"0.15rem 0.45rem"}}>{catLabel[a.cat]}</span>
                <div className="news-small-title">{a.title}</div>
                <div className="news-small-date">{a.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="news-list">
        {NEWS_ARTICLES.map(a=>(
          <div className="news-list-card" key={a.id}>
            {/* 
              🔴 SPEED INDEX: No lazy loading, pulls heavy uncompressed JPEGs below fold
              🔴 CLS: Missing layout shift dimensions
            */}
            <img 
              className="news-list-img" 
              src={a.img} 
              alt={a.title}
              loading={settings.si ? "lazy" : "eager"}
              width={settings.cls ? 380 : undefined}
              height={settings.cls ? 155 : undefined}
            />
            <div className="news-list-body">
              <span className={`news-category ${catClass[a.cat]}`}>{catLabel[a.cat]}</span>
              <div className="news-list-title">{a.title}</div>
              <div className="news-list-excerpt">{a.excerpt}</div>
              <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.25)",marginTop:"0.6rem",letterSpacing:"1px"}}>{a.date}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewsPage;