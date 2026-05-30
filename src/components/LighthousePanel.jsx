import React, { useState, useEffect } from "react";
import { getSettings, saveSettings } from "../utils/config";
import { Sliders, RefreshCw, X, Check, EyeOff } from "lucide-react";

export default function LighthousePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Keep local component state in sync with URL/localStorage if they change
    const interval = setInterval(() => {
      setSettings(getSettings());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = (key) => {
    setIsSimulating(true);
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveSettings(updated);
    
    setTimeout(() => {
      setIsSimulating(false);
    }, 200);
  };

  const handleMasterToggle = (isOptimized) => {
    setIsSimulating(true);
    const updated = {
      cssFonts: isOptimized,
      lcp: isOptimized,
      tbt: isOptimized,
      si: isOptimized,
      cls: isOptimized,
    };
    setSettings(updated);
    saveSettings(updated);
    
    setTimeout(() => {
      setIsSimulating(false);
    }, 300);
  };

  const configItems = [
    {
      id: "cssFonts",
      label: "Optimize CSS & Fonts (FCP)",
      description: "Optimized: Static CSS compilation, async fonts with swap. Unoptimized: 400 bloat unused classes, render-blocking Google Font import chains."
    },
    {
      id: "lcp",
      label: "Optimize LCP Asset Delivery (LCP)",
      description: "Optimized: Hidden preload image tag in head with fetchpriority='high', AVIF layout banner. Unoptimized: CSS background-image JPEG banner."
    },
    {
      id: "tbt",
      label: "Disable Thread-Blocking JS (TBT)",
      description: "Optimized: Skips artificial CPU loop. Unoptimized: Executes synchronous 60,000,000 computation loops on mount and renders."
    },
    {
      id: "si",
      label: "Lazy Load & Compress Images (SI)",
      description: "Optimized: Serves compressed AVIF images, adds lazy loading to off-screen assets. Unoptimized: Sequentially fetches raw 4MB-8MB JPEGs eagerly."
    },
    {
      id: "cls",
      label: "Add Image Dimensions (CLS)",
      description: "Optimized: Adds width/height attributes and aspect-ratios to reserve layout spacing. Unoptimized: Dynamic height sizes causing reflows."
    }
  ];

  return (
    <>
      {/* Floating Settings Button */}
      <button 
        className="lh-fab" 
        onClick={() => setIsOpen(true)}
        aria-label="Open Performance Config"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00f5ff, #ff00ff)",
          border: "none",
          cursor: "pointer",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(0, 245, 255, 0.3)",
          transition: "transform 0.2s ease-in-out",
          transform: isOpen ? "scale(0)" : "scale(1)"
        }}
      >
        <Sliders size={24} color="#000" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 99999
          }}
        />
      )}

      {/* Configuration Drawer */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "440px",
          background: "linear-gradient(180deg, #080816 0%, #04040a 100%)",
          borderLeft: "1px solid rgba(0, 245, 255, 0.15)",
          boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.5)",
          zIndex: 100000,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          color: "#e0e0e0",
          fontFamily: "'Rajdhani', sans-serif"
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: "1.2rem 1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 900,
              color: "var(--neon-cyan)",
              letterSpacing: "1px"
            }}>
              PERFORMANCE TUNER
            </h2>
            <p style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Toggle Diagnostics for DevTools Audit
            </p>
          </div>
          <button 
            aria-label="Close diagnostics panel"
            onClick={() => setIsOpen(false)}
            style={{ background: "transparent", border: "none", color: "rgba(255, 255, 255, 0.4)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
          
          {isSimulating && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(4, 4, 10, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              zIndex: 10
            }}>
              <RefreshCw className="spin" size={16} color="var(--neon-cyan)" />
              <span style={{ fontSize: "0.8rem", color: "var(--neon-cyan)", fontFamily: "'Orbitron', sans-serif" }}>APPLYING CONFIG...</span>
            </div>
          )}

          {/* Quick Presets */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            padding: "0.8rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem"
          }}>
            <div style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", fontWeight: "bold" }}>
              Quick Preset Modes
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <button 
                onClick={() => handleMasterToggle(false)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  fontFamily: "'Orbitron', sans-serif",
                  cursor: "pointer",
                  background: "rgba(255, 78, 66, 0.1)",
                  border: "1px solid rgba(255, 78, 66, 0.25)",
                  color: "#ff4e42"
                }}
              >
                UNOPTIMIZED (Red Score)
              </button>
              <button 
                onClick={() => handleMasterToggle(true)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  fontFamily: "'Orbitron', sans-serif",
                  cursor: "pointer",
                  background: "rgba(0, 245, 255, 0.08)",
                  border: "1px solid rgba(0, 245, 255, 0.25)",
                  color: "var(--neon-cyan)"
                }}
              >
                OPTIMIZED (Green Score)
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {configItems.map((item) => {
              const isActive = settings[item.id];
              return (
                <div 
                  key={item.id}
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.01)",
                    padding: "0.8rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: "700", fontSize: "0.85rem", color: isActive ? "var(--neon-cyan)" : "#a0a0b0" }}>
                      {item.label}
                    </div>

                    {/* Simple Switch */}
                    <label style={{ position: "relative", display: "inline-block", width: "38px", height: "20px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={isActive}
                        onChange={() => handleToggle(item.id)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                        aria-label="Enable diagnostic mode"
                      />
                      <span 
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: isActive ? "var(--neon-cyan)" : "rgba(255,255,255,0.1)",
                          transition: ".2s",
                          borderRadius: "20px"
                        }}
                      >
                        <span 
                          style={{
                            position: "absolute",
                            height: "14px",
                            width: "14px",
                            left: isActive ? "21px" : "3px",
                            bottom: "3px",
                            backgroundColor: "#000",
                            transition: ".2s",
                            borderRadius: "50%"
                          }}
                        />
                      </span>
                    </label>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Drawer Footer */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          background: "#040408",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              width: "100%",
              padding: "0.7rem",
              borderRadius: "4px",
              background: "linear-gradient(135deg, #00f5ff, #ff00ff)",
              color: "#000",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "0.8rem",
              fontWeight: "900",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <RefreshCw size={14} />
            APPLY & RELOAD PAGE
          </button>
          <div style={{ fontSize: "0.65rem", color: "rgba(255, 255, 255, 20)", textAlign: "center" }}>
            Reload forces standard DevTools Lighthouse scanning environment to register active options.
          </div>
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
