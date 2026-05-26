import { useEffect, useState } from "react";
import { heavyBlockingWork } from "../utils/heavyBlockingWork";
import { STORE_ITEMS } from "./data";
import { getSettings } from "../utils/config";

const StorePage = () => {
  const settings = getSettings();

  // 🔴 TBT: Heavy work on mount AND render (bypassed if optimized inside heavyBlockingWork)
  if (!settings.tbt) {
    heavyBlockingWork();
  }

  useEffect(() => { 
    if (!settings.tbt) {
      heavyBlockingWork(); 
    }
  }, [settings.tbt]);

  const filters = ["All","Action","RPG","Strategy","Battle Royale","Bundles","Points"];
  const [active, setActive] = useState("All");

  return (
    <section style={{paddingTop:"100px",background:"#060610",minHeight:"100vh"}}>
      <div className="section-title">Game Store</div>
      <div className="section-sub">// Season 7 Deals — Up to 60% Off</div>
      <div className="store-filters">
        {filters.map(f=>(
          <button key={f} className={`filter-btn${active===f?" active":""}`} onClick={()=>setActive(f)}>{f}</button>
        ))}
      </div>
      <div className="store-grid">
        {STORE_ITEMS.map(item=>(
          <div className="store-card" key={item.id}>
            {/* 
              🔴 SPEED INDEX: No lazy loading, pulls heavy raw JPEGs
              🔴 CLS: Missing aspect container or dimensions on images
            */}
            <img 
              className="store-card-img" 
              src={item.img} 
              alt={item.title}
              loading={settings.si ? "lazy" : "eager"}
              width={settings.cls ? 280 : undefined}
              height={settings.cls ? 180 : undefined}
            />
            <div className="store-card-body">
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.85rem",fontWeight:700,color:"#fff",marginBottom:"0.6rem",lineHeight:1.4}}>{item.title}</div>
              <div>
                <span className="store-price">{item.price}</span>
                {item.old && <span className="store-price-old">{item.old}</span>}
              </div>
              <button className="btn-primary store-add-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StorePage;