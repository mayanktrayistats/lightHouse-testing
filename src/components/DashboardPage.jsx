import { useEffect } from "react";
import { heavyBlockingWork } from "../utils/heavyBlockingWork";
import { DB_ACTIVITIES } from "./data";
import { getSettings } from "../utils/config";

const DashboardPage = () => {
  const settings = getSettings();

  // 🔴 TBT: Heavy work on mount AND in useEffect (bypassed if optimized inside heavyBlockingWork)
  if (!settings.tbt) {
    heavyBlockingWork();
  }
  
  useEffect(() => { 
    if (!settings.tbt) {
      heavyBlockingWork(); 
    }
  }, [settings.tbt]);

  const stats = [
    { label:"Matches Played",  value:"3,842",     delta:"+24 today"         },
    { label:"Total Kills",     value:"128,449",   delta:"+340 today"        },
    { label:"Win Rate",        value:"67.4%",     delta:"+1.2% this week"   },
    { label:"NEXUS Points",    value:"24,500",    delta:"+500 earned"       },
    { label:"Clan Members",    value:"48 / 50",   delta:"2 slots open"      },
    { label:"Rank Points",     value:"2,847,500", delta:"+12,000 today"     },
    { label:"Tournaments Won", value:"14",        delta:"+1 this season"    },
    { label:"Hours Played",    value:"4,230 hrs", delta:"+6 today"          },
  ];
  
  const chartData = [["Mon",65],["Tue",80],["Wed",45],["Thu",92],["Fri",78],["Sat",100],["Sun",88]];
  
  return (
    <section style={{paddingTop:"100px",background:"var(--dark-bg)",minHeight:"100vh"}}>
      <div className="section-title">Dashboard</div>
      <div className="section-sub">// Your Season 7 Stats</div>
      <div className="db-grid">
        {stats.map(s=>(
          <div className="db-card" key={s.label}>
            <div className="db-card-label">{s.label}</div>
            <div className="db-card-value">{s.value}</div>
            <div className="db-card-delta">{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="db-activity">
        <div className="db-panel">
          <h3>Recent Activity</h3>
          {DB_ACTIVITIES.map((a,i)=>(
            <div className="db-activity-row" key={i}>
              {/* 
                🔴 SPEED INDEX: 3000px heavy JPEGs downloaded as avatars
                🔴 CLS: No avatar width/height (causes layout shifting as rows load)
              */}
              <img 
                className="db-avatar" 
                src={a.avatar} 
                alt={a.name}
                loading={settings.si ? "lazy" : "eager"}
                width={settings.cls ? 36 : undefined}
                height={settings.cls ? 36 : undefined}
              />
              <div style={{flex:1}}>
                <div className="db-act-name">{a.name}</div>
                <div className="db-act-action">{a.action}</div>
              </div>
              <div className="db-act-time">{a.time}</div>
            </div>
          ))}
        </div>
        <div className="db-panel">
          <h3>Weekly Wins</h3>
          {chartData.map(([day,pct])=>(
            <div key={day}>
              <div className="db-chart-label"><span>{day}</span><span>{pct}%</span></div>
              <div className="db-chart-bar" style={{width:`${pct}%`}}/>
            </div>
          ))}
          <div style={{marginTop:"1.5rem"}}>
            <div className="db-card-label">Current Streak</div>
            <div className="db-card-value" style={{fontSize:"2.5rem"}}>🔥 7</div>
            <div className="db-card-delta">Personal best: 14 days</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;