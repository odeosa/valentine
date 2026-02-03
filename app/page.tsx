"use client";

import { useEffect, useRef, useState } from "react";

export default function ValentinePage() {
  // Position of the NO button (percentages keep it responsive)
  const [noPosition, setNoPosition] = useState({ top: 50, left: 60 });

  // Scale factor for YES button
  const [yesScale, setYesScale] = useState(1);

  // Hide NO after enough failed attempts
  const [hideNo, setHideNo] = useState(false);

  // Final success state
  const [saidYes, setSaidYes] = useState(false);

  const attemptsRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Moves NO more aggressively and grows YES.
   */
  const moveNoButton = () => {
    attemptsRef.current += 1;

    // Cap YES growth so it never overflows the card
    setYesScale((prev) => Math.min(prev + 0.18, 2.6));

    // Remove NO completely after enough tries
    if (attemptsRef.current >= 7) {
      setHideNo(true);
      return;
    }

    // Wider movement range so NO really escapes
    setNoPosition({
      top: Math.random() * 60 + 20, // 20% – 80%
      left: Math.random() * 60 + 20,
    });
  };

  const handleYesClick = () => {
    setSaidYes(true);
    launchConfetti();
  };

  /**
   * Lightweight canvas confetti
   */
  const launchConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 90%, 70%)`,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > canvas.height) p.y = -10;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
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
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.card}>
        {!saidYes ? (
          <>
            {/* 20%: Question */}
            <div style={styles.header}>
              <h1 style={styles.question}>
                Nma, will you be my Valentine? 💖
              </h1>
            </div>

            {/* 80%: Button area */}
            <div style={styles.body}>
              <button
                onClick={handleYesClick}
                style={{
                  ...styles.yesButton,
                  transform: `scale(${yesScale})`,
                }}
              >
                Yes 💕
              </button>

              {!hideNo && (
                <button
                  onMouseEnter={moveNoButton}
                  onClick={moveNoButton}
                  style={{
                    ...styles.noButton,
                    top: `${noPosition.top}%`,
                    left: `${noPosition.left}%`,
                  }}
                >
                  No 😏
                </button>
              )}
            </div>
          </>
        ) : (
          <h2 style={styles.success}>
            Yay!!! 💘 I’m so happy you said yes, Nma 🥹
          </h2>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    fontFamily: "'Poppins', system-ui, sans-serif",
  },
  canvas: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "420px",
    height: "480px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
  },
  header: {
    height: "20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  question: {
    fontSize: "1.4rem",
    textAlign: "center",
    color: "#ff2d55",
    fontWeight: 600,
  },
  body: {
    height: "80%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  yesButton: {
    padding: "0.9rem 2.2rem",
    borderRadius: "999px",
    border: "none",
    background: "#ff2d55",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "transform 0.25s ease",
    zIndex: 2,
  },
  noButton: {
    position: "absolute",
    padding: "0.9rem 2.2rem",
    borderRadius: "999px",
    border: "none",
    background: "#f2f2f2",
    color: "#ff2d55",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "top 0.25s ease, left 0.25s ease",
  },
  success: {
    margin: "auto",
    textAlign: "center",
    fontSize: "1.6rem",
    color: "#ff2d55",
    padding: "1.5rem",
  },
};
