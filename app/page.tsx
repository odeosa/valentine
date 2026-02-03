"use client";

import { useEffect, useRef, useState } from "react";

export default function ValentinePage() {
  const [noAbsolute, setNoAbsolute] = useState(false);
  const [noPos, setNoPos] = useState({ top: 50, left: 60 });
  const [yesScale, setYesScale] = useState(1);
  const [saidYes, setSaidYes] = useState(false);

  const attempts = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Moves NO button and grows YES.
   * NO becomes absolute only after first interaction.
   */
  const dodgeNo = () => {
    attempts.current += 1;

    if (!noAbsolute) setNoAbsolute(true);

    setYesScale((s) => Math.min(s + 0.2, 2.8));

    setNoPos({
      top: Math.random() * 60 + 20,
      left: Math.random() * 60 + 20,
    });
  };

  const sayYes = () => {
    setSaidYes(true);
    launchHeartConfetti();
  };

  /**
   * Heart-shaped confetti using canvas
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

  return (
    <main style={styles.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap"
        rel="stylesheet"
      />

      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Floating background hearts */}
      <div style={styles.bgHearts} />

      <div style={styles.card}>
        {!saidYes ? (
          <>
            {/* Text moves up as YES grows */}
            <div
              style={{
                ...styles.textWrap,
                transform: `translateY(-${(yesScale - 1) * 20}px)`,
              }}
            >
              <h1 style={styles.question}>
                Nma, will you be my Valentine? 🥺
              </h1>
            </div>

            <div style={styles.buttonsWrap}>
              <button
                onClick={sayYes}
                style={{
                  ...styles.yesBtn,
                  transform: `scale(${yesScale})`,
                  width: yesScale > 1.6 ? "80%" : "160px",
                }}
              >
                Yes 😍
              </button>

              <button
                onMouseEnter={dodgeNo}
                onClick={dodgeNo}
                style={{
                  ...styles.noBtn,
                  position: noAbsolute ? "absolute" : "relative",
                  top: noAbsolute ? `${noPos.top}%` : "auto",
                  left: noAbsolute ? `${noPos.left}%` : "auto",
                }}
              >
                No 😔
              </button>
            </div>
          </>
        ) : (
          <h2 style={styles.success}>Yayyy 💖 I love you, Nma 🥹</h2>
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
    fontFamily: "'Poppins', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
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
      "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.06) 2px, transparent 3px)",
    backgroundSize: "120px 120px",
    animation: "float 20s linear infinite",
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
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  yesBtn: {
    background: "#cc2b35",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "transform 0.3s ease, width 0.3s ease",
    zIndex: 2,
  },
  noBtn: {
    background: "#eee",
    color: "#000",
    border: "none",
    borderRadius: "999px",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "top 0.3s ease, left 0.3s ease",
  },
  success: {
    fontSize: "1.8rem",
    color: "#cc2b35",
    textAlign: "center",
  },
};
