import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

const chatSequence = [
  {
    id: 1,
    type: "user",
    text: "Water is coming through my ceiling. Do you handle emergency water damage??",
    delay: 1000,
  },
  {
    id: 2,
    type: "ai",
    text: "Yes — we run 24/7 emergency crews. Is the water still actively leaking right now?",
    delay: 1800,
  },
  {
    id: 3,
    type: "user",
    text: "Yes, it's getting worse. 412 Maple Ct.",
    delay: 1500,
  },
  {
    id: 4,
    type: "ai",
    text: "Got it — marking this urgent. What's the best phone number for our on-call tech to reach you at?",
    delay: 2000,
  },
  { id: 5, type: "action", text: "Urgent Lead Captured", delay: 800 },
];

export default function Hero({ onOpenPopup }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const chatContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    let timeoutId;
    if (step === 0) setShowTicketPopup(false);

    if (step < chatSequence.length) {
      const nextMessage = chatSequence[step];
      if (nextMessage.type === "ai") {
        setIsTyping(true);
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setTimeout(() => {
            setMessages((prev) => [...prev, nextMessage]);
            setStep((prev) => prev + 1);
          }, 150);
        }, nextMessage.delay);
      } else {
        timeoutId = setTimeout(() => {
          setMessages((prev) => [...prev, nextMessage]);
          setStep((prev) => prev + 1);
        }, nextMessage.delay);
      }
    } else {
      setShowTicketPopup(true);
      timeoutId = setTimeout(() => {
        setMessages([]);
        setStep(0);
      }, 5500);
    }
    return () => clearTimeout(timeoutId);
  }, [step]);

  const industries = [
    "HVAC",
    "Plumbing",
    "Restoration",
    "Roofing",
    "Pest Control",
    "Electrical",
  ];

  return (
    // Note: bg-transparent allows the global index.jsx background to shine through
    <section
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 sm:pb-20 bg-transparent text-[var(--foreground)] transition-colors duration-300"
      id="top"
    >
      <div className="relative w-full max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-8 items-center mt-4">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[var(--foreground-muted)]/10 border border-[var(--grid-line)] mb-4 sm:mb-6 hover:bg-[var(--foreground-muted)]/20 transition-colors duration-300">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--accent-blue)] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
              Founding 25 Launch Program - Now Open
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black tracking-normal mb-4 sm:mb-6 leading-[1.05] text-[var(--foreground)] text-balance">
            Turn field-service <br className="hidden lg:block" /> website
            visitors into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary)] to-[var(--accent-blue)]">
              booked jobs, 24/7.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl font-medium mb-8 sm:mb-10 leading-relaxed text-balance px-2 sm:px-0">
            CloseDesk by Aicyro is a done-for-you AI booking desk that responds
            to your website visitors instantly, qualifies urgent service
            requests, captures contact details, and books quote calls,
            inspections, and service visits{" "}
            <span className="text-[var(--foreground)] font-bold border-b border-[var(--primary)]/50">
              before they call a competitor.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={onOpenPopup} // <-- Attach it here
              className="relative flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-blue)] text-white hover:scale-105 font-black rounded-xl transition-all duration-300 ease-out text-base sm:text-lg shadow-xl hover:shadow-2xl"
            >
              Claim a Founding 25 Spot
            </button>
            <button
              onClick={() => router.push("/free-website-audit")}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-[var(--card-bg)] text-[var(--foreground)] font-bold rounded-xl border border-[var(--border-color)] hover:border-[var(--primary)]/50 transition-colors duration-300 text-base sm:text-lg"
            >
              Get a Free Website Lead Audit
            </button>
          </div>
        </div>

        {/* Right Column: Visual Stage */}
        <div className="lg:col-span-6 relative w-full h-[450px] sm:h-[500px] lg:h-[650px] flex items-center justify-center perspective-[1000px] lg:perspective-[1200px] mt-4 lg:mt-0">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[450px] h-[400px] sm:h-[450px] lg:h-[550px] transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] lg:[transform-style:preserve-3d] hover:scale-[1.02] lg:hover:[transform:rotateY(-12deg)_rotateX(4deg)_scale(1.02)] lg:[transform:rotateY(-20deg)_rotateX(8deg)_scale(0.96)]">
            {/* The Main Chat Interface */}
            <div className="absolute inset-0 bg-[var(--card-bg)]/90 backdrop-blur-3xl border border-[var(--border-color)] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.05)] lg:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col overflow-hidden transition-colors duration-300">
              <div className="bg-gradient-to-r from-[var(--primary)]/10 to-transparent border-b border-[var(--grid-line)] p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[var(--primary)] to-[var(--accent-blue)] p-[1px] shadow-lg shrink-0">
                    <div className="w-full h-full bg-[var(--card-bg)] rounded-[15px] flex items-center justify-center font-bold text-[var(--foreground)] text-xs sm:text-sm transition-colors duration-300">
                      CD
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] tracking-wide">
                      CloseDesk
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--primary)] rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]"></span>
                      <span className="text-[10px] sm:text-xs text-[var(--foreground-muted)] font-medium">
                        Online — responds in &lt; 1s
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono font-medium pr-2">
                  11:42 PM
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 p-4 sm:p-5 overflow-y-auto flex flex-col gap-3 sm:gap-4 hide-scrollbar"
              >
                {messages.map((msg) => {
                  if (msg.type === "action") {
                    return (
                      <div
                        key={msg.id}
                        className="self-center my-1 sm:my-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 animate-pop-in"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span className="text-[10px] sm:text-xs font-bold text-[var(--primary)] uppercase tracking-widest">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] text-xs sm:text-sm py-2.5 px-3 sm:py-3 sm:px-4 shadow-sm animate-pop-in origin-bottom transition-colors duration-300 ${msg.type === "user" ? "self-end bg-[var(--background)] text-[var(--foreground)] border border-[var(--border-color)] rounded-2xl rounded-tr-sm origin-bottom-right" : "self-start bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--foreground)] rounded-2xl rounded-tl-sm origin-bottom-left"}`}
                    >
                      {msg.text}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="self-start bg-[var(--background)]/80 border border-[var(--grid-line)] py-2.5 px-3 sm:py-3 sm:px-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 w-12 sm:w-16 animate-pop-in origin-bottom-left transition-colors duration-300">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--foreground-muted)] rounded-full animate-[pulse_1s_ease-in-out_infinite]"></span>
                    <span
                      className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--foreground-muted)] rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[var(--foreground-muted)] rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Element: Lead Ticket Component */}
            <div
              className={`absolute -right-4 sm:-right-12 lg:-right-24 bottom-12 sm:bottom-16 lg:bottom-20 bg-[var(--card-bg)]/95 backdrop-blur-xl border border-[var(--primary)]/30 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl lg:[transform:translateZ(90px)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-30 scale-90 sm:scale-100 origin-bottom-right w-64 sm:w-72 ${showTicketPopup ? "opacity-100 translate-y-0 scale-[0.9] sm:scale-100 animate-[float_7s_ease-in-out_infinite_0.5s]" : "opacity-0 translate-y-12 scale-[0.8] sm:scale-90 pointer-events-none"}`}
            >
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--grid-line)]">
                <span className="text-[var(--foreground)] font-bold text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--accent-blue)] rounded-full animate-pulse shadow-[0_0_8px_var(--accent-blue)]"></span>
                  Lead Captured
                </span>
                <span className="bg-[var(--primary)]/20 text-[var(--primary)] text-[9px] sm:text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                  URGENT
                </span>
              </div>

              <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
                    SERVICE
                  </span>
                  <span className="text-[var(--foreground)] font-medium text-right max-w-[130px] truncate">
                    Water damage
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
                    NAME
                  </span>
                  <span className="text-[var(--foreground)] font-medium text-right">
                    Dana R.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
                    PHONE
                  </span>
                  <span className="text-[var(--foreground)] font-medium text-right">
                    (555) 014-2276
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
                    LOCATION
                  </span>
                  <span className="text-[var(--foreground)] font-medium text-right">
                    412 Maple Ct.
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-mono">
                    CAPTURED
                  </span>
                  <span className="text-[var(--foreground)] font-medium text-right">
                    11:44 PM
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--grid-line)] flex items-center gap-2">
                <span className="w-1 h-1 bg-[var(--foreground-muted)] rounded-full"></span>
                <span className="text-[var(--foreground-muted)] text-[10px] sm:text-xs font-medium">
                  Team notified · Logged in Pulse
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mt-12 sm:mt-16 lg:mt-8 flex flex-col items-center">
        <p className="text-[10px] sm:text-xs text-[var(--foreground-muted)] font-mono mb-4 sm:mb-6 uppercase tracking-[0.2em] text-center opacity-70 px-4">
          Built for field-service businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full max-w-3xl lg:max-w-full">
          {industries.map((industry) => (
            <div
              key={industry}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--foreground-muted)]/5 border border-[var(--border-color)] text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--foreground-muted)]/10 transition-colors cursor-default"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0%, 100% { transform: translateZ(60px) translateY(0px); } 50% { transform: translateZ(60px) translateY(-12px); } }
        @keyframes pop-in { 0% { opacity: 0; transform: scale(0.8) translateY(15px); } 60% { transform: scale(1.02) translateY(-2px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `,
        }}
      />
    </section>
  );
}
