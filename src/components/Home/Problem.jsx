import React, { useRef, useEffect, useState } from "react";

// ---------------------------------------------------------
// Interactive Spotlight & 3D Tilt Card Wrapper
// ---------------------------------------------------------
const InteractiveCard = ({
  children,
  className = "",
  status = "normal",
  isVisible = false, // Now controlled explicitly by React state
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    cardRef.current.style.setProperty("--mouse-x", `-1000px`);
    cardRef.current.style.setProperty("--mouse-y", `-1000px`);
  };

  const glowColor =
    status === "lost"
      ? "color-mix(in srgb, var(--primary) 35%, transparent)"
      : status === "warning"
        ? "color-mix(in srgb, var(--accent-blue) 25%, transparent)"
        : "color-mix(in srgb, var(--foreground-muted) 15%, transparent)";

  const borderColor =
    status === "lost"
      ? "border-[var(--primary)]/50 hover:border-[var(--primary)]/90"
      : status === "warning"
        ? "border-[var(--accent-blue)]/40 hover:border-[var(--accent-blue)]/80"
        : "border-[var(--border-color)] hover:border-[var(--foreground-muted)]/50";

  const bgClass =
    status === "lost"
      ? "bg-[var(--primary)]/10"
      : status === "warning"
        ? "bg-[var(--accent-blue)]/5"
        : "bg-[var(--card-bg)]/80";

  const animationClass =
    status === "lost" && isVisible
      ? "animate-[subtle-pulse_4s_ease-in-out_infinite]"
      : "";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Removed inline transition delay. Uses isVisible prop directly for snappy pop-in.
      className={`relative overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform backdrop-blur-xl border ${borderColor} ${bgClass} rounded-2xl shadow-lg ${className} ${animationClass} ${
        isVisible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-75 translate-y-16"
      }`}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col">
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// Main Problem Section Component
// ---------------------------------------------------------
export default function Problem() {
  // Animation Orchestration States
  const [headerVisible, setHeaderVisible] = useState(false);
  const [lineDrawn, setLineDrawn] = useState(false);
  const [visibleStages, setVisibleStages] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [footerVisible, setFooterVisible] = useState(false);
  const [showLoopingStreams, setShowLoopingStreams] = useState(false);

  useEffect(() => {
    // 1. Fade in Header (150ms)
    const headerTimer = setTimeout(() => setHeaderVisible(true), 150);

    // 2. Start drawing the timeline (400ms)
    const lineTimer = setTimeout(() => setLineDrawn(true), 400);

    // 3. Pop up each card sequentially with a defined interval (stagger interval: 400ms)
    const baseDelay = 800;
    const interval = 400;

    const stageTimers = [0, 1, 2, 3].map((index) => {
      return setTimeout(
        () => {
          setVisibleStages((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        },
        baseDelay + index * interval,
      );
    });

    // 4. Reveal the Diagnostics Footer after cards are done
    const footerTimer = setTimeout(
      () => setFooterVisible(true),
      baseDelay + 4 * interval + 200,
    );

    // 5. Start the continuous scanning streams along the line
    const loopTimer = setTimeout(
      () => setShowLoopingStreams(true),
      baseDelay + 4 * interval + 800,
    );

    // Cleanup timers
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(lineTimer);
      clearTimeout(footerTimer);
      clearTimeout(loopTimer);
      stageTimers.forEach(clearTimeout);
    };
  }, []);

  const stages = [
    {
      num: "01",
      title: "Visitor lands",
      desc: "Intent is high — they're ready to hire.",
      status: "normal",
    },
    {
      num: "02",
      title: "Nobody responds",
      desc: "Your form sits there. Phone rings out.",
      status: "warning",
    },
    {
      num: "03",
      title: "Tab closed",
      desc: "They go back to the search results.",
      status: "warning",
    },
    {
      num: "04",
      title: "Competitor wins",
      desc: "Whoever answered first gets the job.",
      status: "lost",
    },
  ];

  const pains = [
    "Speed beats reputation when someone's basement is flooding.",
    "It collects requests nobody sees until hours later.",
    "Nights and weekends are when emergencies - and lost jobs - happen.",
    "Every unanswered visitor is money you paid to book a competitor's job.",
  ];

  return (
    <section
      id="problem"
      className="relative w-full py-16 sm:py-20 px-4 sm:px-6 bg-transparent text-[var(--foreground)] z-10 overflow-hidden border-t border-[var(--border-color)] xl:min-h-screen flex flex-col justify-center"
    >
      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[60%] bg-gradient-to-b from-transparent via-[var(--primary)]/5 to-transparent blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">
        {/* ================= COMPACT HEADER ================= */}
        <div
          className={`flex flex-col items-center text-center mb-10 lg:mb-16 transition-all duration-1000 ease-out ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 mb-4 shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_15%,transparent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
            <span className="text-[9px] sm:text-[10px] font-mono text-[var(--primary)] uppercase tracking-widest">
              The Leak in Your Website
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-balance leading-[1.05]">
            You're paying for traffic.
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-blue)] to-[var(--primary)]">
              Your competitors are booking it.
            </span>
          </h2>
          <p className="text-[var(--foreground-muted)] text-sm sm:text-base max-w-2xl font-medium leading-relaxed text-balance">
            A homeowner with a burst pipe doesn't fill out a contact form and
            wait. They open three tabs and hire whoever answers first.
          </p>
        </div>

        {/* ================= SEQUENTIAL HORIZONTAL PIPELINE ================= */}
        <div className="relative w-full mb-12 lg:mb-16">
          {/* Main "Drawing" Timeline Wire (Draws left to right) */}
          <div
            className="hidden lg:block absolute top-[28px] h-[2px] bg-[var(--border-color)]/50 z-0 rounded-full transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: "10%",
              width: lineDrawn ? "80%" : "0%", // Animates from 0 width to full
            }}
          >
            {/* Glowing Data Stream (Starts after sequence finishes) */}
            <div
              className={`absolute top-0 left-[-20%] w-[150px] h-full bg-gradient-to-r from-transparent via-[var(--primary)] to-[var(--accent-blue)] blur-[2px] ${showLoopingStreams ? "animate-[data-stream_3s_linear_infinite]" : "hidden"}`}
            ></div>
            <div
              className={`absolute top-0 left-[-20%] w-[80px] h-full bg-[var(--primary)] ${showLoopingStreams ? "animate-[data-stream_3s_linear_infinite]" : "hidden"}`}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {stages.map((stage, i) => {
              const isVisible = visibleStages[i];
              return (
                <InteractiveCard
                  key={i}
                  status={stage.status}
                  isVisible={isVisible}
                  className="w-full flex-1"
                >
                  {/* Node Dot for the timeline - Pops in with the card */}
                  <div
                    className={`hidden lg:flex w-3 h-3 rounded-full mb-5 border-2 border-[var(--background)] shadow-sm transition-transform duration-500 delay-150 ${isVisible ? "scale-100" : "scale-0"} ${
                      stage.status === "lost"
                        ? "bg-[var(--primary)] shadow-[0_0_10px_var(--primary)]"
                        : stage.status === "warning"
                          ? "bg-[var(--accent-blue)] shadow-[0_0_8px_var(--accent-blue)]"
                          : "bg-[var(--foreground-muted)]"
                    }`}
                  ></div>

                  <span
                    className={`block font-mono text-[10px] tracking-widest mb-2 ${
                      stage.status === "lost"
                        ? "text-[var(--primary)] font-black drop-shadow-[0_0_5px_var(--primary)]"
                        : stage.status === "warning"
                          ? "text-[var(--accent-blue)]"
                          : "text-[var(--foreground-muted)]"
                    }`}
                  >
                    STAGE {stage.num}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 leading-tight">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mt-auto">
                    {stage.desc}
                  </p>
                </InteractiveCard>
              );
            })}
          </div>
        </div>

        {/* ================= COMPACT FOOTER / DIAGNOSTICS ================= */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 bg-[var(--card-bg)]/40 backdrop-blur-md border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          {/* Subtle Patience Drain Background effect on the footer */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--background)] z-0">
            <div
              className={`h-full w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent-blue)] to-[var(--primary)] opacity-50 ${showLoopingStreams ? "animate-[patience-drain_8s_linear_infinite]" : "hidden"}`}
              style={{ backgroundSize: "200% 100%" }}
            ></div>
          </div>

          <div
            className={`lg:w-1/3 text-center lg:text-left transition-all duration-1000 ease-out z-10 ${footerVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            <h3 className="text-2xl sm:text-3xl font-black text-[var(--primary)] mb-2 drop-shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_20%,transparent)]">
              Your ad spend. <br /> Their job.
            </h3>
            {/* <p className="text-xs text-[var(--foreground-muted)] font-mono uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              System Failure Analysis
            </p> */}
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 z-10">
            {pains.map((pain, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 group transition-all duration-700 ease-out ${footerVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-5 h-5 rounded bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[var(--primary)] transition-colors duration-300">
                  <span className="font-mono text-[var(--primary)] group-hover:text-[var(--background)] font-bold text-[10px] transition-colors duration-300">
                    ✕
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300 leading-snug">
                  {pain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CUSTOM ANIMATIONS ================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes data-stream {
          0% { left: -20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes subtle-pulse {
          0%, 100% { box-shadow: 0 0 15px color-mix(in srgb, var(--primary) 10%, transparent); border-color: color-mix(in srgb, var(--primary) 40%, transparent); }
          50% { box-shadow: 0 0 35px color-mix(in srgb, var(--primary) 30%, transparent); border-color: color-mix(in srgb, var(--primary) 80%, transparent); transform: translateY(-3px); }
        }
        @keyframes patience-drain {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `,
        }}
      />
    </section>
  );
}
