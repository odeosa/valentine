"use client";

import { useEffect, useRef, useState } from "react";

export default function ValentinePage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const yesRef = useRef<HTMLButtonElement | null>(null);

  const [noAbsolute, setNoAbsolute] = useState(false);
  const [noPos, setNoPos] = useState({ top: 0, left: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [saidYes, setSaidYes] = useState(false);
  const [noScale, setNoScale] = useState(1);

  const attempts = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Moves NO button freely within the card.
   * YES grows in width & height.
   * After 15 attempts, NO hides behind YES.
   */
 const dodgeNo = () => {
  if (attempts.current >= 15) return;

  attempts.current += 1;

  if (!noAbsolute) setNoAbsolute(true);

  // Grow YES (both width & height)
  setYesScale((s) => Math.min(s + 0.15, 2.6));

  // Shrink NO slightly
  setNoScale((s) => Math.max(0.4, s - 0.05));

  if (!cardRef.current || !yesRef.current) return;

  const card = cardRef.current.getBoundingClientRect();
  const yesRect = yesRef.current.getBoundingClientRect();

  const noWidth = 130;
  const noHeight = 54;
  // Extra safety padding around YES
  const safetyPadding = 24;


  const maxX = card.width - noWidth;
  const maxY = card.height - noHeight;

  let left = 0;
  let top = 0;
  let tries = 0;

  // Keep generating positions until NO does not overlap YES
  do {
    left = Math.random() * maxX;
    top = Math.random() * maxY;
    tries++;
  } while (
    isOverlapping(
  { left, top, width: noWidth, height: noHeight },
  {
    left: yesRect.left - card.left - safetyPadding,
    top: yesRect.top - card.top - safetyPadding,
    width: yesRect.width + safetyPadding * 2,
    height: yesRect.height + safetyPadding * 2,
  }
)
 &&
    tries < 10
  );

  setNoPos({ left, top });
};


  const sayYes = () => {
    setSaidYes(true);
    launchHeartConfetti();
  };

  /**
   * Heart-shaped confetti
   */
  const launchHeartConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hearts = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 8,
      speed: Math.random() * 2 + 2,
      color: "#ff4d6d",
    }));

    const drawHeart = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size / 2, x, y + size * 1.5);
      ctx.bezierCurveTo(x + size * 2, y + size / 2, x + size, y - size, x, y);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach((h) => {
        h.y += h.speed;
        if (h.y > canvas.height) h.y = -20;
        ctx.fillStyle = h.color;
        drawHeart(h.x, h.y, h.size);
      });
      requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const hideNo = attempts.current >= 15;

  return (
    <main style={styles.page}>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.bgHearts} />

      <div ref={cardRef} style={styles.card}>
        {!saidYes ? (
          <>
            {/* Text pushed up by YES growth */}
            <div
              style={{
                ...styles.textWrap,
                transform: `translateY(-${(yesScale - 1) * 30}px)`,
              }}
            >
              <h1 style={styles.question}>
                Nma, will you be my Valentine? 🥺
              </h1>
            </div>

            <div style={styles.buttonsWrap}>
              <button
                ref={yesRef}
                onClick={sayYes}
                style={{
                  ...styles.yesBtn,
                  transform: `scale(${yesScale})`,
                  width: yesScale > 1.5 ? "80%" : "160px",
                  height: yesScale > 1.5 ? "64px" : "48px",
                }}
              >
                Yes 😍
              </button>

              {!hideNo && (
                <button
                  onMouseEnter={dodgeNo}
                  onClick={dodgeNo}
                  style={{
                    ...styles.noBtn,
                    position: noAbsolute ? "absolute" : "relative",
                    left: noAbsolute ? noPos.left : "auto",
                    top: noAbsolute ? noPos.top : "auto",
                    transform: `scale(${noScale})`,
                    zIndex: attempts.current < 15 ? 3 : 1,
                  }}
                >
                  No 😔
                </button>
              )}
            </div>
          </>
        ) : (
          <h2 style={{...styles.success,  position: "absolute",
  inset: "0",
  background: "white",
  zIndex: "50",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",}}>Yayyy 💖 Thank you for accepting! You have made me the happiest person in the world! 💕🕺🏽</h2>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#cc2b35",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Poppins', system-ui, sans-serif"
  },
  canvas: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
  },
  bgHearts: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 2px, transparent 3px)",
    backgroundSize: "120px 120px",
  },
  card: {
    width: "90%",
    maxWidth: "560px",
    height: "360px",
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    position: "relative",
    zIndex: 2,
  },
  textWrap: {
    marginBottom: "2rem",
    transition: "transform 0.3s ease",
  },
  question: {
    color: "#ff0000",
    fontSize: "1.8rem",
    fontWeight: 600,
    textAlign: "center",
  },
  buttonsWrap: {
    position: "relative",
    width: "100%",
    height: "120px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  yesBtn: {
    background: "#cc2b35",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    zIndex: 2,
  },
  noBtn: {
    background: "#eee",
    color: "#000",
    border: "none",
    borderRadius: "999px",
    padding: "0.8rem 2rem",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  success: {
    fontSize: "1.8rem",
    color: "#cc2b35",
    textAlign: "center",
    width: "90%",
    maxWidth: "420px",
    padding: "32px 24px",
    borderRadius: "24px",
  },
};
function isOverlapping(a: any, b: any) {
  return !(
    a.left + a.width < b.left ||
    a.left > b.left + b.width ||
    a.top + a.height < b.top ||
    a.top > b.top + b.height
  );
}
