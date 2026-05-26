const Footer = ({ setPage }) => {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo-text">NEXUS<span style={{color:"var(--neon-magenta)"}}>GG</span></div>
          <p>The world's premier gaming platform. Built by gamers, for gamers. 50 million players across 200+ titles daily.</p>
        </div>
        {[
          { title:"Platform", links:[["Dashboard","dashboard"],["Tournaments","tournaments"],["Game Store","store"],["News","news"],["Achievements","achievements"]] },
          { title:"Games",    links:[["New Releases","store"],["Top Rated","store"],["Free to Play","store"],["Battle Royale","home"],["Strategy","home"]] },
          { title:"Support",  links:[["Help Center","home"],["Bug Reports","home"],["Contact Us","home"],["Terms","home"],["Privacy","home"]] },
        ].map(col=>(
          <div className="footer-col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map(([label,pg])=>(
                <li key={label}><a href="#" onClick={e=>{e.preventDefault();setPage(pg);}}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>© 2024 NEXUS.GG — All rights reserved. Powered by next-gen infrastructure.</p>
        <div className="social-links">
          {["𝕏","▶","📱","💬"].map((s,i)=>(<span key={i} className="social-link">{s}</span>))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;