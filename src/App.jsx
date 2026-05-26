/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║         NEXUS.GG — INTENTIONALLY UNOPTIMIZED WEBSITE            ║
 * ║         For Lighthouse Performance Testing Presentation          ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  ANTI-PATTERNS BAKED IN (labeled with comments):                ║
 * ║  🔴 LCP  — Largest Contentful Paint degraded                    ║
 * ║  🔴 FCP  — First Contentful Paint degraded                      ║
 * ║  🔴 TBT  — Total Blocking Time degraded                         ║
 * ║  🔴 CLS  — Cumulative Layout Shift caused                       ║
 * ║  🔴 NET  — Unnecessary/heavy network requests                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { useState, lazy, Suspense } from "react";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { heavyBlockingWork } from "./utils/heavyBlockingWork";
import { getSettings } from "./utils/config";
import LighthousePanel from "./components/LighthousePanel";

// Lazy load non-landing pages to reduce initial bundle size and boost FCP / TTI
const DashboardPage = lazy(() => import("./components/DashboardPage"));
const StorePage = lazy(() => import("./components/StorePage"));
const TournamentsPage = lazy(() => import("./components/TournamentsPage"));
const NewsPage = lazy(() => import("./components/NewsPage"));
const AchievementsPage = lazy(() => import("./components/AchievementsPage"));

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🔴 FCP + TBT:
   Massive CSS injected via JS as a string.
   - Browser cannot paint until React runs AND this entire string parses.
   - Contains 400+ generated unused class rules (.bloat-N).
   - 6 chained @import font calls inside the style tag (render-blocking chain).
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const HEAVY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --neon-cyan: #00f5ff; --neon-magenta: #ff00ff; --neon-green: #39ff14;
    --neon-orange: #ff6600; --dark-bg: #050510; --card-bg: #0a0a1a;
    --glass: rgba(0,245,255,0.05);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--dark-bg); color: #e0e0e0; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }

  /* 🔴 TBT + FCP: 400 generated unused CSS classes — browser parses all before first paint */
  ${Array.from({length:400},(_,i)=>`
  .bloat-${i}{color:hsl(${i*3},60%,55%);padding:${i%12}px;margin:${i%9}px;font-size:${11+i%8}px;line-height:${1+i%4*0.15};letter-spacing:${i%5}px;border-radius:${i%16}px;}
  .bloat-${i}:hover{opacity:${0.4+i%6*0.1};transform:translateX(${i%24-12}px) rotate(${i%10-5}deg);transition:all 0.${i%9+1}s cubic-bezier(0.${i%9},0.${i%8},0.${i%7},0.${i%6});}
  .bloat-${i}::before{content:"${i}";display:block;height:0;overflow:hidden;}
  .bloat-${i}::after{content:"${i}x";display:block;height:0;overflow:hidden;}
  .bloat-${i}>.bc${i}+.bs${i}~.bz${i}:nth-child(${i%5+1}n){display:none;}
  `).join('')}

  @keyframes neonPulse{0%,100%{text-shadow:0 0 5px var(--neon-cyan),0 0 10px var(--neon-cyan);}50%{text-shadow:0 0 20px var(--neon-cyan),0 0 40px var(--neon-cyan),0 0 80px var(--neon-cyan);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-20px);}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  @keyframes unused1{0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(360deg);}}
  @keyframes unused2{0%{border-radius:0;}50%{border-radius:50%;}100%{border-radius:0;}}
  @keyframes unused3{0%,100%{transform:scale(1) skew(0);}50%{transform:scale(1.5) skew(10deg);}}

  nav{position:fixed;top:0;width:100%;z-index:1000;background:rgba(5,5,16,0.96);backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,245,255,0.25);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:68px;}
  .nav-logo{font-family:'Orbitron',monospace;font-size:1.55rem;font-weight:900;color:var(--neon-cyan);animation:neonPulse 2.5s infinite;letter-spacing:4px;cursor:pointer;}
  .nav-logo span{color:var(--neon-magenta);}
  nav ul{list-style:none;display:flex;gap:0.15rem;align-items:center;flex-wrap:wrap;}
  nav ul li a,nav ul li button{color:#9bb8e8;font-family:'Rajdhani',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:0.45rem 0.8rem;border-radius:4px;border:none;background:transparent;cursor:pointer;transition:all 0.25s;white-space:nowrap;}
  nav ul li a:hover,nav ul li button:hover{color:var(--neon-cyan);background:rgba(0,245,255,0.08);text-shadow:0 0 8px var(--neon-cyan);}
  .cta-btn{background:linear-gradient(135deg,#00f5ff22,#ff00ff22)!important;border:1px solid var(--neon-cyan)!important;color:var(--neon-cyan)!important;}
  .nav-dropdown{position:relative;}
  .nav-dropdown-menu{position:absolute;top:110%;left:0;background:rgba(4,4,14,0.99);border:1px solid rgba(0,245,255,0.2);border-radius:8px;padding:0.5rem;min-width:200px;display:flex;flex-direction:column;gap:2px;z-index:9999;}
  .nav-dropdown-menu button{color:#9bb8e8;padding:0.55rem 1rem;border-radius:4px;font-size:0.82rem;font-weight:600;letter-spacing:1px;display:flex;align-items:center;gap:8px;transition:all 0.2s;border:none;background:transparent;cursor:pointer;width:100%;text-align:left;}
  .nav-dropdown-menu button:hover{color:var(--neon-cyan);background:rgba(0,245,255,0.08);}

  section{padding:5.5rem 2rem;}
  .section-title{font-family:'Orbitron',monospace;font-size:clamp(1.4rem,3.5vw,2.4rem);font-weight:900;text-align:center;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:4px;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-magenta));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .section-sub{text-align:center;color:rgba(255,255,255,0.38);font-size:0.78rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:3rem;font-family:'Share Tech Mono',monospace;}
  .btn-primary{font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:0.9rem 2.2rem;border-radius:4px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--neon-cyan),#0080ff);color:#000;transition:all 0.3s;}
  .btn-primary:hover{box-shadow:0 0 30px rgba(0,245,255,0.55);transform:translateY(-2px);}
  .btn-secondary{font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:0.9rem 2.2rem;border-radius:4px;cursor:pointer;background:transparent;color:var(--neon-cyan);border:1px solid var(--neon-cyan);transition:all 0.3s;}
  .btn-secondary:hover{background:rgba(0,245,255,0.1);box-shadow:0 0 18px rgba(0,245,255,0.3);}

  .hero{min-height:90vh;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.1fr 0.9fr;gap:3rem;align-items:center;padding:7.5rem 2rem 4rem;}
  .hero-bg{width:100%;height:auto;border-radius:12px;border:1px solid rgba(0,245,255,0.18);box-shadow:0 0 30px rgba(0,245,255,0.15);display:block;object-fit:cover;aspect-ratio:16/10;}
  .hero-bg-div{width:100%;border-radius:12px;border:1px solid rgba(0,245,255,0.18);box-shadow:0 0 30px rgba(0,245,255,0.15);background-size:cover;background-position:center;aspect-ratio:16/10;}
  .hero-overlay{display:none;}
  .scanline{display:none;}
  .hero-content{position:relative;z-index:3;text-align:left;width:100%;padding:0;}
  .hero-tag{display:inline-block;font-family:'Share Tech Mono',monospace;font-size:0.72rem;letter-spacing:4px;color:var(--neon-cyan);border:1px solid rgba(0,245,255,0.4);padding:0.3rem 1rem;border-radius:2px;margin-bottom:1.5rem;background:rgba(0,245,255,0.05);}
  .hero h1{font-family:'Orbitron',monospace;font-size:clamp(2.2rem,5vw,4.2rem);font-weight:900;line-height:1.1;margin-bottom:1.4rem;text-transform:uppercase;letter-spacing:3px;background:linear-gradient(135deg,#fff 0%,var(--neon-cyan) 50%,var(--neon-magenta) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .hero p{font-family:'Exo 2',sans-serif;font-size:1.1rem;color:rgba(255,255,255,0.65);max-width:560px;margin:0 0 2.5rem 0;line-height:1.75;}
  .hero-btns{display:flex;gap:1rem;justify-content:flex-start;flex-wrap:wrap;}
  .stats-row{display:flex;gap:2.5rem;justify-content:flex-start;margin-top:3.5rem;flex-wrap:wrap;}
  .stat-num{font-family:'Orbitron',monospace;font-size:1.9rem;font-weight:900;color:var(--neon-cyan);}
  .stat-label{font-size:0.7rem;letter-spacing:3px;color:rgba(255,255,255,0.35);text-transform:uppercase;}

  @media(max-width:768px){
    .hero{grid-template-columns:1fr;padding-top:6rem;gap:2rem;text-align:center;}
    .hero-content{text-align:center;}
    .hero p{margin:0 auto 2.5rem;}
    .hero-btns{justify-content:center;}
    .stats-row{justify-content:center;}
  }

  .games-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:1.4rem;max-width:1200px;margin:0 auto;}
  .game-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.13);border-radius:12px;overflow:hidden;transition:all 0.3s;cursor:pointer;}
  .game-card:hover{transform:translateY(-7px);border-color:rgba(0,245,255,0.5);box-shadow:0 18px 38px rgba(0,245,255,0.09);}
  .game-card-img{width:100%;height:195px;object-fit:cover;display:block;}
  .game-card-body{padding:1.2rem;}
  .game-card-title{font-family:'Orbitron',monospace;font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:0.4rem;}
  .game-card-genre{font-size:0.7rem;letter-spacing:2px;color:var(--neon-cyan);text-transform:uppercase;margin-bottom:0.65rem;}
  .game-card-desc{font-size:0.88rem;color:rgba(255,255,255,0.5);line-height:1.5;margin-bottom:0.9rem;}
  .game-rating{display:flex;align-items:center;gap:5px;font-size:0.82rem;color:#ffd700;}
  .game-badge{display:inline-block;font-size:0.68rem;letter-spacing:1px;text-transform:uppercase;padding:0.22rem 0.55rem;border-radius:3px;font-weight:700;}
  .badge-new{background:rgba(57,255,20,0.12);color:var(--neon-green);border:1px solid rgba(57,255,20,0.28);}
  .badge-hot{background:rgba(255,102,0,0.12);color:var(--neon-orange);border:1px solid rgba(255,102,0,0.28);}
  .badge-sale{background:rgba(255,0,255,0.12);color:var(--neon-magenta);border:1px solid rgba(255,0,255,0.28);}

  .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1.4rem;max-width:1100px;margin:0 auto;}
  .feature-card{background:var(--glass);border:1px solid rgba(0,245,255,0.1);border-radius:12px;padding:1.8rem 1.4rem;text-align:center;transition:all 0.3s;}
  .feature-card:hover{background:rgba(0,245,255,0.07);border-color:rgba(0,245,255,0.32);transform:translateY(-4px);}
  .feature-icon{font-size:2.4rem;margin-bottom:0.9rem;}
  .feature-title{font-family:'Orbitron',monospace;font-size:0.92rem;font-weight:700;color:var(--neon-cyan);margin-bottom:0.65rem;letter-spacing:2px;}
  .feature-desc{font-size:0.87rem;color:rgba(255,255,255,0.45);line-height:1.6;}

  .showcase-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;max-width:1200px;margin:0 auto;}
  .showcase-img{width:100%;border-radius:12px;border:1px solid rgba(255,0,255,0.18);display:block;}
  .showcase-text h3{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;color:#fff;margin-bottom:1rem;}
  .showcase-text p{color:rgba(255,255,255,0.5);line-height:1.8;margin-bottom:1.3rem;}
  @media(max-width:768px){.showcase-grid{grid-template-columns:1fr;}}

  .leaderboard{max-width:820px;margin:0 auto;}
  .lb-row{display:flex;align-items:center;gap:1rem;padding:0.95rem 1.4rem;margin-bottom:0.7rem;background:var(--card-bg);border:1px solid rgba(0,245,255,0.09);border-radius:8px;transition:all 0.2s;}
  .lb-row:hover{border-color:rgba(0,245,255,0.28);background:rgba(0,245,255,0.03);}
  .lb-rank{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:900;width:38px;text-align:center;}
  .lb-rank.gold{color:#ffd700;}.lb-rank.silver{color:#c0c0c0;}.lb-rank.bronze{color:#cd7f32;}
  .lb-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid rgba(0,245,255,0.28);}
  .lb-name{flex:1;font-weight:700;font-size:0.97rem;}
  .lb-score{font-family:'Share Tech Mono',monospace;color:var(--neon-cyan);font-size:0.97rem;}
  .lb-level{font-size:0.7rem;letter-spacing:2px;color:rgba(255,255,255,0.3);text-transform:uppercase;}

  .newsletter-section{background:linear-gradient(135deg,#050510,#0a0a25,#050510);border-top:1px solid rgba(0,245,255,0.12);border-bottom:1px solid rgba(0,245,255,0.12);text-align:center;}
  .newsletter-form{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:2rem;}
  .newsletter-input{background:rgba(255,255,255,0.04);border:1px solid rgba(0,245,255,0.28);color:#fff;padding:0.8rem 1.4rem;border-radius:4px;font-family:'Rajdhani',sans-serif;font-size:1rem;width:300px;outline:none;}
  .newsletter-input:focus{border-color:var(--neon-cyan);box-shadow:0 0 14px rgba(0,245,255,0.18);}

  footer{background:#020208;border-top:1px solid rgba(0,245,255,0.09);padding:3.5rem 2rem 2rem;}
  .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2.5rem;max-width:1200px;margin:0 auto;}
  @media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr;gap:2rem;}}
  .footer-brand .logo-text{font-family:'Orbitron',monospace;font-size:1.35rem;font-weight:900;color:var(--neon-cyan);letter-spacing:4px;}
  .footer-brand p{color:rgba(255,255,255,0.3);font-size:0.87rem;line-height:1.7;margin-top:0.9rem;}
  .footer-col h4{font-family:'Orbitron',monospace;font-size:0.72rem;letter-spacing:3px;color:var(--neon-cyan);margin-bottom:0.9rem;text-transform:uppercase;}
  .footer-col ul{list-style:none;display:flex;flex-direction:column;gap:0.55rem;}
  .footer-col ul li a{color:rgba(255,255,255,0.3);font-size:0.87rem;text-decoration:none;transition:color 0.2s;cursor:pointer;}
  .footer-col ul li a:hover{color:var(--neon-cyan);}
  .footer-bottom{max-width:1200px;margin:2.5rem auto 0;padding-top:1.4rem;border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
  .footer-bottom p{color:rgba(255,255,255,0.2);font-size:0.78rem;letter-spacing:1px;}
  .social-links{display:flex;gap:0.8rem;}
  .social-link{width:34px;height:34px;border:1px solid rgba(0,245,255,0.18);border-radius:6px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.35);font-size:0.85rem;cursor:pointer;transition:all 0.2s;}
  .social-link:hover{border-color:var(--neon-cyan);color:var(--neon-cyan);}

  .db-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;max-width:1200px;margin:0 auto 2.5rem;}
  @media(max-width:900px){.db-grid{grid-template-columns:repeat(2,1fr);}}
  .db-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:10px;padding:1.4rem;}
  .db-card-label{font-size:0.7rem;letter-spacing:3px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:0.5rem;}
  .db-card-value{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;color:var(--neon-cyan);}
  .db-card-delta{font-size:0.78rem;color:var(--neon-green);margin-top:0.3rem;}
  .db-activity{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;}
  @media(max-width:900px){.db-activity{grid-template-columns:1fr;}}
  .db-panel{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:10px;padding:1.4rem;}
  .db-panel h3{font-family:'Orbitron',monospace;font-size:0.85rem;letter-spacing:3px;color:var(--neon-cyan);margin-bottom:1rem;text-transform:uppercase;}
  .db-activity-row{display:flex;align-items:center;gap:0.9rem;padding:0.7rem 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .db-activity-row:last-child{border-bottom:none;}
  .db-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;}
  .db-act-name{font-weight:600;font-size:0.9rem;}
  .db-act-action{font-size:0.8rem;color:rgba(255,255,255,0.45);}
  .db-act-time{font-size:0.72rem;color:rgba(255,255,255,0.3);letter-spacing:1px;}
  .db-chart-bar{height:8px;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-magenta));border-radius:4px;margin:0.4rem 0;}
  .db-chart-label{display:flex;justify-content:space-between;font-size:0.75rem;color:rgba(255,255,255,0.35);}

  .store-filters{display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;margin-bottom:2.5rem;}
  .filter-btn{font-family:'Rajdhani',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:0.45rem 1rem;border-radius:20px;border:1px solid rgba(0,245,255,0.2);background:transparent;color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.2s;}
  .filter-btn.active,.filter-btn:hover{border-color:var(--neon-cyan);color:var(--neon-cyan);background:rgba(0,245,255,0.07);}
  .store-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.3rem;max-width:1200px;margin:0 auto;}
  .store-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:12px;overflow:hidden;transition:all 0.3s;}
  .store-card:hover{transform:translateY(-6px);border-color:rgba(0,245,255,0.4);}
  .store-card-img{width:100%;height:180px;object-fit:cover;display:block;}
  .store-card-body{padding:1.1rem;}
  .store-price{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:900;color:var(--neon-green);}
  .store-price-old{font-size:0.85rem;color:rgba(255,255,255,0.25);text-decoration:line-through;margin-left:8px;}
  .store-add-btn{width:100%;margin-top:0.8rem;}

  .tournament-list{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:1.2rem;}
  .tournament-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:12px;padding:1.6rem 2rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;transition:all 0.3s;}
  @media(max-width:768px){.tournament-card{grid-template-columns:1fr;gap:0.8rem;}}
  .tournament-card:hover{border-color:rgba(0,245,255,0.4);background:rgba(0,245,255,0.025);}
  .t-logo{width:70px;height:70px;border-radius:10px;object-fit:cover;border:1px solid rgba(0,245,255,0.2);}
  .t-name{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.35rem;}
  .t-meta{display:flex;gap:1.2rem;flex-wrap:wrap;}
  .t-meta span{font-size:0.75rem;letter-spacing:2px;color:rgba(255,255,255,0.35);text-transform:uppercase;}
  .t-meta span b{color:var(--neon-cyan);}
  .t-prize{font-family:'Orbitron',monospace;font-size:1.5rem;font-weight:900;color:var(--neon-green);text-align:right;}
  .t-prize-label{font-size:0.65rem;letter-spacing:3px;color:rgba(255,255,255,0.3);text-transform:uppercase;}
  .t-status{display:inline-block;font-size:0.68rem;letter-spacing:2px;text-transform:uppercase;padding:0.22rem 0.7rem;border-radius:20px;font-weight:700;margin-top:0.5rem;}
  .t-live{background:rgba(57,255,20,0.12);color:var(--neon-green);border:1px solid rgba(57,255,20,0.3);}
  .t-upcoming{background:rgba(0,245,255,0.1);color:var(--neon-cyan);border:1px solid rgba(0,245,255,0.25);}
  .t-ended{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.3);border:1px solid rgba(255,255,255,0.1);}

  .news-grid{display:grid;grid-template-columns:2fr 1fr;gap:2rem;max-width:1200px;margin:0 auto;}
  @media(max-width:900px){.news-grid{grid-template-columns:1fr;}}
  .news-featured{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:12px;overflow:hidden;}
  .news-featured-img{width:100%;height:320px;object-fit:cover;display:block;}
  .news-featured-body{padding:1.6rem;}
  .news-category{display:inline-block;font-size:0.68rem;letter-spacing:2px;text-transform:uppercase;font-weight:700;padding:0.2rem 0.6rem;border-radius:3px;margin-bottom:0.8rem;}
  .cat-update{background:rgba(0,245,255,0.1);color:var(--neon-cyan);border:1px solid rgba(0,245,255,0.25);}
  .cat-esports{background:rgba(255,102,0,0.1);color:var(--neon-orange);border:1px solid rgba(255,102,0,0.25);}
  .cat-patch{background:rgba(255,0,255,0.1);color:var(--neon-magenta);border:1px solid rgba(255,0,255,0.25);}
  .news-featured-title{font-family:'Orbitron',monospace;font-size:1.3rem;font-weight:700;color:#fff;margin-bottom:0.75rem;line-height:1.4;}
  .news-featured-excerpt{color:rgba(255,255,255,0.45);font-size:0.92rem;line-height:1.7;}
  .news-sidebar{display:flex;flex-direction:column;gap:1rem;}
  .news-small-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:10px;overflow:hidden;display:grid;grid-template-columns:100px 1fr;}
  .news-small-img{width:100px;height:80px;object-fit:cover;display:block;}
  .news-small-body{padding:0.8rem;}
  .news-small-title{font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;color:#fff;line-height:1.4;margin-bottom:0.35rem;}
  .news-small-date{font-size:0.68rem;color:rgba(255,255,255,0.3);letter-spacing:1px;}
  .news-list{max-width:1200px;margin:2rem auto 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.3rem;}
  .news-list-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:10px;overflow:hidden;transition:all 0.3s;}
  .news-list-card:hover{transform:translateY(-5px);border-color:rgba(0,245,255,0.35);}
  .news-list-img{width:100%;height:155px;object-fit:cover;display:block;}
  .news-list-body{padding:1.1rem;}
  .news-list-title{font-family:'Orbitron',monospace;font-size:0.82rem;font-weight:700;color:#fff;margin-bottom:0.5rem;line-height:1.4;}
  .news-list-excerpt{font-size:0.83rem;color:rgba(255,255,255,0.4);line-height:1.5;}

  .ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.2rem;max-width:1100px;margin:0 auto;}
  .ach-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:12px;padding:1.5rem;text-align:center;transition:all 0.3s;}
  .ach-card:hover{border-color:rgba(255,215,0,0.4);transform:translateY(-4px);}
  .ach-icon{font-size:3rem;margin-bottom:0.8rem;display:block;}
  .ach-name{font-family:'Orbitron',monospace;font-size:0.85rem;font-weight:700;color:#fff;margin-bottom:0.4rem;}
  .ach-desc{font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:0.8rem;}
  .ach-progress-bar{height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;}
  .ach-progress-fill{height:100%;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-magenta));border-radius:3px;}
  .ach-rarity{font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;margin-top:0.5rem;}
  .ach-legendary{color:#ffd700;}.ach-rare{color:var(--neon-cyan);}.ach-common{color:rgba(255,255,255,0.35);}
`;

const CLEAN_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --neon-cyan: #00f5ff; --neon-magenta: #ff00ff; --neon-green: #39ff14;
    --neon-orange: #ff6600; --dark-bg: #050510; --card-bg: #0a0a1a;
    --glass: rgba(0,245,255,0.05);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--dark-bg); color: #e0e0e0; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }

  @keyframes neonPulse{0%,100%{text-shadow:0 0 5px var(--neon-cyan),0 0 10px var(--neon-cyan);}50%{text-shadow:0 0 20px var(--neon-cyan),0 0 40px var(--neon-cyan),0 0 80px var(--neon-cyan);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-20px);}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}

  nav{position:fixed;top:0;width:100%;z-index:1000;background:rgba(5,5,16,0.96);backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,245,255,0.25);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:68px;transition: all 0.3s;}
  .nav-logo{font-family:'Orbitron',monospace;font-size:1.55rem;font-weight:900;color:var(--neon-cyan);animation:neonPulse 2.5s infinite;letter-spacing:4px;cursor:pointer;}
  .nav-logo span{color:var(--neon-magenta);}
  nav ul{list-style:none;display:flex;gap:0.15rem;align-items:center;flex-wrap:wrap;}
  nav ul li a,nav ul li button{color:#9bb8e8;font-family:'Rajdhani',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:0.45rem 0.8rem;border-radius:4px;border:none;background:transparent;cursor:pointer;transition:all 0.25s;white-space:nowrap;}
  nav ul li a:hover,nav ul li button:hover{color:var(--neon-cyan);background:rgba(0,245,255,0.08);text-shadow:0 0 8px var(--neon-cyan);}
  .cta-btn{background:linear-gradient(135deg,#00f5ff22,#ff00ff22)!important;border:1px solid var(--neon-cyan)!important;color:var(--neon-cyan)!important;}
  .nav-dropdown{position:relative;}
  .nav-dropdown-menu{position:absolute;top:110%;left:0;background:rgba(4,4,14,0.99);border:1px solid rgba(0,245,255,0.2);border-radius:8px;padding:0.5rem;min-width:200px;display:flex;flex-direction:column;gap:2px;z-index:9999;}
  .nav-dropdown-menu button{color:#9bb8e8;padding:0.55rem 1rem;border-radius:4px;font-size:0.82rem;font-weight:600;letter-spacing:1px;display:flex;align-items:center;gap:8px;transition:all 0.2s;border:none;background:transparent;cursor:pointer;width:100%;text-align:left;}
  .nav-dropdown-menu button:hover{color:var(--neon-cyan);background:rgba(0,245,255,0.08);}

  section{padding:5.5rem 2rem;}
  .section-title{font-family:'Orbitron',monospace;font-size:clamp(1.4rem,3.5vw,2.4rem);font-weight:900;text-align:center;margin-bottom:0.6rem;text-transform:uppercase;letter-spacing:4px;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-magenta));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .section-sub{text-align:center;color:rgba(255,255,255,0.38);font-size:0.78rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:3rem;font-family:'Share Tech Mono',monospace;}
  .btn-primary{font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:0.9rem 2.2rem;border-radius:4px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--neon-cyan),#0080ff);color:#000;transition:all 0.3s;}
  .btn-primary:hover{box-shadow:0 0 30px rgba(0,245,255,0.55);transform:translateY(-2px);}
  .btn-secondary{font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:0.9rem 2.2rem;border-radius:4px;cursor:pointer;background:transparent;color:var(--neon-cyan);border:1px solid var(--neon-cyan);transition:all 0.3s;}
  .btn-secondary:hover{background:rgba(0,245,255,0.1);box-shadow:0 0 18px rgba(0,245,255,0.3);}

  .hero{min-height:90vh;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.1fr 0.9fr;gap:3rem;align-items:center;padding:7.5rem 2rem 4rem;}
  .hero-bg{width:100%;height:auto;border-radius:12px;border:1px solid rgba(0,245,255,0.18);box-shadow:0 0 30px rgba(0,245,255,0.15);display:block;object-fit:cover;aspect-ratio:16/10;}
  .hero-bg-div{width:100%;border-radius:12px;border:1px solid rgba(0,245,255,0.18);box-shadow:0 0 30px rgba(0,245,255,0.15);background-size:cover;background-position:center;aspect-ratio:16/10;}
  .hero-overlay{display:none;}
  .scanline{display:none;}
  .hero-content{position:relative;z-index:3;text-align:left;width:100%;padding:0;}
  .hero-tag{display:inline-block;font-family:'Share Tech Mono',monospace;font-size:0.72rem;letter-spacing:4px;color:var(--neon-cyan);border:1px solid rgba(0,245,255,0.4);padding:0.3rem 1rem;border-radius:2px;margin-bottom:1.5rem;background:rgba(0,245,255,0.05);}
  .hero h1{font-family:'Orbitron',monospace;font-size:clamp(2.2rem,5vw,4.2rem);font-weight:900;line-height:1.1;margin-bottom:1.4rem;text-transform:uppercase;letter-spacing:3px;background:linear-gradient(135deg,#fff 0%,var(--neon-cyan) 50%,var(--neon-magenta) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .hero p{font-family:'Exo 2',sans-serif;font-size:1.1rem;color:rgba(255,255,255,0.65);max-width:560px;margin:0 0 2.5rem 0;line-height:1.75;}
  .hero-btns{display:flex;gap:1rem;justify-content:flex-start;flex-wrap:wrap;}
  .stats-row{display:flex;gap:2.5rem;justify-content:flex-start;margin-top:3.5rem;flex-wrap:wrap;}
  .stat-num{font-family:'Orbitron',monospace;font-size:1.9rem;font-weight:900;color:var(--neon-cyan);}
  .stat-label{font-size:0.7rem;letter-spacing:3px;color:rgba(255,255,255,0.35);text-transform:uppercase;}

  @media(max-width:768px){
    .hero{grid-template-columns:1fr;padding-top:6rem;gap:2rem;text-align:center;}
    .hero-content{text-align:center;}
    .hero p{margin:0 auto 2.5rem;}
    .hero-btns{justify-content:center;}
    .stats-row{justify-content:center;}
  }

  .games-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:1.4rem;max-width:1200px;margin:0 auto;}
  .game-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.13);border-radius:12px;overflow:hidden;transition:all 0.3s;cursor:pointer;}
  .game-card:hover{transform:translateY(-7px);border-color:rgba(0,245,255,0.5);box-shadow:0 18px 38px rgba(0,245,255,0.09);}
  .game-card-img{width:100%;height:195px;object-fit:cover;display:block;}
  .game-card-body{padding:1.2rem;}
  .game-card-title{font-family:'Orbitron',monospace;font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:0.4rem;}
  .game-card-genre{font-size:0.7rem;letter-spacing:2px;color:var(--neon-cyan);text-transform:uppercase;margin-bottom:0.65rem;}
  .game-card-desc{font-size:0.88rem;color:rgba(255,255,255,0.5);line-height:1.5;margin-bottom:0.9rem;}
  .game-rating{display:flex;align-items:center;gap:5px;font-size:0.82rem;color:#ffd700;}
  .game-badge{display:inline-block;font-size:0.68rem;letter-spacing:1px;text-transform:uppercase;padding:0.22rem 0.55rem;border-radius:3px;font-weight:700;}
  .badge-new{background:rgba(57,255,20,0.12);color:var(--neon-green);border:1px solid rgba(57,255,20,0.28);}
  .badge-hot{background:rgba(255,102,0,0.12);color:var(--neon-orange);border:1px solid rgba(255,102,0,0.28);}
  .badge-sale{background:rgba(255,0,255,0.12);color:var(--neon-magenta);border:1px solid rgba(255,0,255,0.28);}

  .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1.4rem;max-width:1100px;margin:0 auto;}
  .feature-card{background:var(--glass);border:1px solid rgba(0,245,255,0.1);border-radius:12px;padding:1.8rem 1.4rem;text-align:center;transition:all 0.3s;}
  .feature-card:hover{background:rgba(0,245,255,0.07);border-color:rgba(0,245,255,0.32);transform:translateY(-4px);}
  .feature-icon{font-size:2.4rem;margin-bottom:0.9rem;}
  .feature-title{font-family:'Orbitron',monospace;font-size:0.92rem;font-weight:700;color:var(--neon-cyan);margin-bottom:0.65rem;letter-spacing:2px;}
  .feature-desc{font-size:0.87rem;color:rgba(255,255,255,0.45);line-height:1.6;}

  .showcase-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;max-width:1200px;margin:0 auto;}
  .showcase-img{width:100%;border-radius:12px;border:1px solid rgba(255,0,255,0.18);display:block;}
  .showcase-text h3{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;color:#fff;margin-bottom:1rem;}
  .showcase-text p{color:rgba(255,255,255,0.5);line-height:1.8;margin-bottom:1.3rem;}
  @media(max-width:768px){.showcase-grid{grid-template-columns:1fr;}}

  .leaderboard{max-width:820px;margin:0 auto;}
  .lb-row{display:flex;align-items:center;gap:1rem;padding:0.95rem 1.4rem;margin-bottom:0.7rem;background:var(--card-bg);border:1px solid rgba(0,245,255,0.09);border-radius:8px;transition:all 0.2s;}
  .lb-row:hover{border-color:rgba(0,245,255,0.28);background:rgba(0,245,255,0.03);}
  .lb-rank{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:900;width:38px;text-align:center;}
  .lb-rank.gold{color:#ffd700;}.lb-rank.silver{color:#c0c0c0;}.lb-rank.bronze{color:#cd7f32;}
  .lb-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid rgba(0,245,255,0.28);}
  .lb-name{flex:1;font-weight:700;font-size:0.97rem;}
  .lb-score{font-family:'Share Tech Mono',monospace;color:var(--neon-cyan);font-size:0.97rem;}
  .lb-level{font-size:0.7rem;letter-spacing:2px;color:rgba(255,255,255,0.3);text-transform:uppercase;}

  .newsletter-section{background:linear-gradient(135deg,#050510,#0a0a25,#050510);border-top:1px solid rgba(0,245,255,0.12);border-bottom:1px solid rgba(0,245,255,0.12);text-align:center;}
  .newsletter-form{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:2rem;}
  .newsletter-input{background:rgba(255,255,255,0.04);border:1px solid rgba(0,245,255,0.28);color:#fff;padding:0.8rem 1.4rem;border-radius:4px;font-family:'Rajdhani',sans-serif;font-size:1rem;width:300px;outline:none;}
  .newsletter-input:focus{border-color:var(--neon-cyan);box-shadow:0 0 14px rgba(0,245,255,0.18);}

  footer{background:#020208;border-top:1px solid rgba(0,245,255,0.09);padding:3.5rem 2rem 2rem;}
  .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:2.5rem;max-width:1200px;margin:0 auto;}
  @media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr;gap:2rem;}}
  .footer-brand .logo-text{font-family:'Orbitron',monospace;font-size:1.35rem;font-weight:900;color:var(--neon-cyan);letter-spacing:4px;}
  .footer-brand p{color:rgba(255,255,255,0.3);font-size:0.87rem;line-height:1.7;margin-top:0.9rem;}
  .footer-col h4{font-family:'Orbitron',monospace;font-size:0.72rem;letter-spacing:3px;color:var(--neon-cyan);margin-bottom:0.9rem;text-transform:uppercase;}
  .footer-col ul{list-style:none;display:flex;flex-direction:column;gap:0.55rem;}
  .footer-col ul li a{color:rgba(255,255,255,0.3);font-size:0.87rem;text-decoration:none;transition:color 0.2s;cursor:pointer;}
  .footer-col ul li a:hover{color:var(--neon-cyan);}
  .footer-bottom{max-width:1200px;margin:2.5rem auto 0;padding-top:1.4rem;border-top:1px solid rgba(255,255,255,0.05);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;}
  .footer-bottom p{color:rgba(255,255,255,0.2);font-size:0.78rem;letter-spacing:1px;}
  .social-links{display:flex;gap:0.8rem;}
  .social-link{width:34px;height:34px;border:1px solid rgba(0,245,255,0.18);border-radius:6px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.35);font-size:0.85rem;cursor:pointer;transition:all 0.2s;}
  .social-link:hover{border-color:var(--neon-cyan);color:var(--neon-cyan);}

  .db-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;max-width:1200px;margin:0 auto 2.5rem;}
  @media(max-width:900px){.db-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:550px){.db-grid{grid-template-columns:1fr;}}
  .db-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:10px;padding:1.4rem;}
  .db-card-label{font-size:0.7rem;letter-spacing:3px;color:rgba(255,255,255,0.35);text-transform:uppercase;margin-bottom:0.5rem;}
  .db-card-value{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;color:var(--neon-cyan);}
  .db-card-delta{font-size:0.78rem;color:var(--neon-green);margin-top:0.3rem;}
  .db-activity{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;}
  @media(max-width:900px){.db-activity{grid-template-columns:1fr;}}
  .db-panel{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:10px;padding:1.4rem;}
  .db-panel h3{font-family:'Orbitron',monospace;font-size:0.85rem;letter-spacing:3px;color:var(--neon-cyan);margin-bottom:1rem;text-transform:uppercase;}
  .db-activity-row{display:flex;align-items:center;gap:0.9rem;padding:0.7rem 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .db-activity-row:last-child{border-bottom:none;}
  .db-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;}
  .db-act-name{font-weight:600;font-size:0.9rem;}
  .db-act-action{font-size:0.8rem;color:rgba(255,255,255,0.45);}
  .db-act-time{font-size:0.72rem;color:rgba(255,255,255,0.3);letter-spacing:1px;}
  .db-chart-bar{height:8px;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-magenta));border-radius:4px;margin:0.4rem 0;}
  .db-chart-label{display:flex;justify-content:space-between;font-size:0.75rem;color:rgba(255,255,255,0.35);}

  .store-filters{display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;margin-bottom:2.5rem;}
  .filter-btn{font-family:'Rajdhani',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:0.45rem 1rem;border-radius:20px;border:1px solid rgba(0,245,255,0.2);background:transparent;color:rgba(255,255,255,0.4);cursor:pointer;transition:all 0.2s;}
  .filter-btn.active,.filter-btn:hover{border-color:var(--neon-cyan);color:var(--neon-cyan);background:rgba(0,245,255,0.07);}
  .store-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.3rem;max-width:1200px;margin:0 auto;}
  .store-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:12px;overflow:hidden;transition:all 0.3s;}
  .store-card:hover{transform:translateY(-6px);border-color:rgba(0,245,255,0.4);}
  .store-card-img{width:100%;height:180px;object-fit:cover;display:block;}
  .store-card-body{padding:1.1rem;}
  .store-price{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:900;color:var(--neon-green);}
  .store-price-old{font-size:0.85rem;color:rgba(255,255,255,0.25);text-decoration:line-through;margin-left:8px;}
  .store-add-btn{width:100%;margin-top:0.8rem;}

  .tournament-list{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:1.2rem;}
  .tournament-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:12px;padding:1.6rem 2rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;transition:all 0.3s;}
  @media(max-width:768px){.tournament-card{grid-template-columns:1fr;gap:0.8rem;}}
  .tournament-card:hover{border-color:rgba(0,245,255,0.4);background:rgba(0,245,255,0.025);}
  .t-logo{width:70px;height:70px;border-radius:10px;object-fit:cover;border:1px solid rgba(0,245,255,0.2);}
  .t-name{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.35rem;}
  .t-meta{display:flex;gap:1.2rem;flex-wrap:wrap;}
  .t-meta span{font-size:0.75rem;letter-spacing:2px;color:rgba(255,255,255,0.35);text-transform:uppercase;}
  .t-meta span b{color:var(--neon-cyan);}
  .t-prize{font-family:'Orbitron',monospace;font-size:1.5rem;font-weight:900;color:var(--neon-green);text-align:right;}
  .t-prize-label{font-size:0.65rem;letter-spacing:3px;color:rgba(255,255,255,0.3);text-transform:uppercase;}
  .t-status{display:inline-block;font-size:0.68rem;letter-spacing:2px;text-transform:uppercase;padding:0.22rem 0.7rem;border-radius:20px;font-weight:700;margin-top:0.5rem;}
  .t-live{background:rgba(57,255,20,0.12);color:var(--neon-green);border:1px solid rgba(57,255,20,0.3);}
  .t-upcoming{background:rgba(0,245,255,0.1);color:var(--neon-cyan);border:1px solid rgba(0,245,255,0.25);}
  .t-ended{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.3);border:1px solid rgba(255,255,255,0.1);}

  .news-grid{display:grid;grid-template-columns:2fr 1fr;gap:2rem;max-width:1200px;margin:0 auto;}
  @media(max-width:900px){.news-grid{grid-template-columns:1fr;}}
  .news-featured{background:var(--card-bg);border:1px solid rgba(0,245,255,0.12);border-radius:12px;overflow:hidden;}
  .news-featured-img{width:100%;height:320px;object-fit:cover;display:block;}
  .news-featured-body{padding:1.6rem;}
  .news-category{display:inline-block;font-size:0.68rem;letter-spacing:2px;text-transform:uppercase;font-weight:700;padding:0.2rem 0.6rem;border-radius:3px;margin-bottom:0.8rem;}
  .cat-update{background:rgba(0,245,255,0.1);color:var(--neon-cyan);border:1px solid rgba(0,245,255,0.25);}
  .cat-esports{background:rgba(255,102,0,0.1);color:var(--neon-orange);border:1px solid rgba(255,102,0,0.25);}
  .cat-patch{background:rgba(255,0,255,0.1);color:var(--neon-magenta);border:1px solid rgba(255,0,255,0.25);}
  .news-featured-title{font-family:'Orbitron',monospace;font-size:1.3rem;font-weight:700;color:#fff;margin-bottom:0.75rem;line-height:1.4;}
  .news-featured-excerpt{color:rgba(255,255,255,0.45);font-size:0.92rem;line-height:1.7;}
  .news-sidebar{display:flex;flex-direction:column;gap:1rem;}
  .news-small-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:10px;overflow:hidden;display:grid;grid-template-columns:100px 1fr;}
  .news-small-img{width:100px;height:80px;object-fit:cover;display:block;}
  .news-small-body{padding:0.8rem;}
  .news-small-title{font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;color:#fff;line-height:1.4;margin-bottom:0.35rem;}
  .news-small-date{font-size:0.68rem;color:rgba(255,255,255,0.3);letter-spacing:1px;}
  .news-list{max-width:1200px;margin:2rem auto 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.3rem;}
  .news-list-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:10px;overflow:hidden;transition:all 0.3s;}
  .news-list-card:hover{transform:translateY(-5px);border-color:rgba(0,245,255,0.35);}
  .news-list-img{width:100%;height:155px;object-fit:cover;display:block;}
  .news-list-body{padding:1.1rem;}
  .news-list-title{font-family:'Orbitron',monospace;font-size:0.82rem;font-weight:700;color:#fff;margin-bottom:0.5rem;line-height:1.4;}
  .news-list-excerpt{font-size:0.83rem;color:rgba(255,255,255,0.4);line-height:1.5;}

  .ach-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.2rem;max-width:1100px;margin:0 auto;}
  .ach-card{background:var(--card-bg);border:1px solid rgba(0,245,255,0.1);border-radius:12px;padding:1.5rem;text-align:center;transition:all 0.3s;}
  .ach-card:hover{border-color:rgba(255,215,0,0.4);transform:translateY(-4px);}
  .ach-icon{font-size:3rem;margin-bottom:0.8rem;display:block;}
  .ach-name{font-family:'Orbitron',monospace;font-size:0.85rem;font-weight:700;color:#fff;margin-bottom:0.4rem;}
  .ach-desc{font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:0.8rem;}
  .ach-progress-bar{height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;}
  .ach-progress-fill{height:100%;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-magenta));border-radius:3px;}
  .ach-rarity{font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;margin-top:0.5rem;}
  .ach-legendary{color:#ffd700;}.ach-rare{color:var(--neon-cyan);}.ach-common{color:rgba(255,255,255,0.35);}

  /* Mobile Responsive Navbar Override */
  .nav-toggle-btn {
    display: none;
    background: transparent;
    border: none;
    color: var(--neon-cyan);
    cursor: pointer;
    padding: 0.5rem;
    align-items: center;
  }
  @media(max-width: 768px) {
    .nav-toggle-btn {
      display: flex;
    }
    nav {
      padding: 0 1rem;
    }
    nav ul {
      display: none;
      position: absolute;
      top: 68px;
      left: 0;
      right: 0;
      background: rgba(5,5,16,0.98);
      flex-direction: column;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(0,245,255,0.25);
      gap: 1rem;
      height: auto;
      max-height: calc(100vh - 68px);
      overflow-y: auto;
      box-shadow: 0 10px 20px rgba(0,0,0,0.5);
    }
    nav ul.nav-active {
      display: flex;
    }
    nav ul li {
      width: 100%;
      text-align: center;
    }
    nav ul li a, nav ul li button {
      display: block;
      padding: 0.8rem;
      width: 100%;
      font-size: 1rem;
    }
    .nav-dropdown-menu {
      position: static;
      background: rgba(10,10,26,0.9);
      border: 1px solid rgba(0,245,255,0.15);
      margin-top: 0.5rem;
      width: 100%;
      min-width: 100%;
    }
  }
`;

export default function App() {
  const [page, setPage] = useState("home");
  const settings = getSettings();
  
  // Call blocking work only if TBT optimization is NOT active
  if (!settings.tbt) {
    heavyBlockingWork();
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":    return <DashboardPage />;
      case "store":        return <StorePage />;
      case "tournaments":  return <TournamentsPage />;
      case "news":         return <NewsPage />;
      case "achievements": return <AchievementsPage />;
      case "home":
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      {/* Conditionally inject HEAVY_CSS vs CLEAN_CSS */}
      {settings.cssFonts ? (
        <>
          <style dangerouslySetInnerHTML={{__html: CLEAN_CSS}}/>
          {/* Optimized font imports: display=swap, preconnect, loads only what's needed */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Exo+2:wght@400;600&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        </>
      ) : (
        <>
          <style dangerouslySetInnerHTML={{__html: HEAVY_CSS}}/>
          {/* Unoptimized font sheets: display=block, render-blocking, redundant fonts */}
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Bebas+Neue&family=Press+Start+2P&family=VT323&family=Bungee+Shade&family=Bungee+Inline&family=Permanent+Marker&family=Righteous&display=block"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Audiowide&family=Teko:wght@300;400;500;600;700&family=Saira+Condensed:wght@100;200;300;400;500;600;700;800;900&display=block"/>
        </>
      )}

      {/* Optimized preloads for LCP: Preload Hero Background Image if LCP optimization is active */}
      {settings.lcp && (
        <link rel="preload" as="image" href="public/avif-images/bg-image.avif" fetchPriority="high" />
      )}

      <Navbar setPage={setPage}/>
      
      {/* Semantic <main> landmark container for accessibility best practices */}
      <main id="main-content">
        {/* Suspense boundary for lazy routes */}
        <Suspense fallback={
          <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--dark-bg)",
            color: "var(--neon-cyan)",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "1.2rem",
            letterSpacing: "2px"
          }}>
            LOADING GRID CHUNKS...
          </div>
        }>
          {renderPage()}
        </Suspense>
      </main>

      <Footer setPage={setPage}/>

      {/* Floating Lighthouse Presentation Panel */}
      <LighthousePanel />
    </>
  );
}