"use client";

import { useEffect, useRef, useState } from "react";

export default function ValentinePage() {
  // Tracks NO button position (percentage-based = responsive)
  const [noPosition, setNoPosition] = useState({ top: 60, left: 50 });

  // Controls how big the YES button gets
  const [yesScale, setYesScale] = useState(1);

  // Hides NO button after enough failed attempts
  const [hideNo, setHideNo] = useState(false);

  // Tracks if she already said yes
  const [saidYes, setSaidYes] = useState(false);

  // Counts how many times NO tried to escape
  const attemptsRef = useRef(0);

  // Canvas reference for confetti
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Moves the NO button randomly and
   * increases YES size each time
   */
  const moveNoButton = () => {
    attemptsRef.current += 1;

    // Gradually grow YES button
    setYesScale((prev) => prev + 0.18);

    // Remove NO completely after enough tries
    if (attemptsRef.current >= 7) {
      setHideNo(true);
      return;
    }

    // Random position within visible viewport
    setNoPosition({
      top: Math.random() * 65 + 10,
      left: Math.random() * 65 + 10,
    });
  };

  /**
   * When YES is clicked:
   * - lock the state
   * - launch confetti
   */
  const handleYesClick = () => {
    setSaidYes(true);
    launchConfetti();
  };

  /**
   * Simple canvas confetti animation
   * Lightweight and dependency-free
   */
  const launchConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((p) => {
        p.y += p.speed;
        if (p.y > canvas.height) p.y = -10;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  /**
   * Keep canvas full-screen on resize (mobile safe)
   */
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main style={styles.container}>
      {/* Confetti Canvas */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Main Content */}
      {!saidYes ? (
        <>
          <h1 style={styles.question}>
            Nma, will you be my Valentine? 💖
          </h1>

          <div style={styles.buttonArea}>
            {/* YES Button */}
            <button
              onClick={handleYesClick}
              style={{
                ...styles.yesButton,
                transform: `scale(${yesScale})`,
              }}
            >
              Yes 💕
            </button>

            {/* NO Button (escapes) */}
            {!hideNo && (
              <button
                onMouseEnter={moveNoButton} // Desktop
                onClick={moveNoButton} // Mobile
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
        // Success state after YES
        <h2 style={styles.success}>
          Yay!!! 💘 I’m so happy you said yes, Nma 🥹
        </h2>
      )}
    </main>
  );
}

/**
 * Inline styles keep things simple and readable.
 * Percentages + flexbox = mobile responsive by default.
 */
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "1rem",
  },
  canvas: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
  },
  question: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    color: "#fff",
    marginBottom: "2rem",
    zIndex: 2,
  },
  buttonArea: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    height: "260px",
    zIndex: 2,
  },
  yesButton: {
    padding: "1rem 2.5rem",
    fontSize: "1.1rem",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#ff2d55",
    color: "#fff",
    transition: "transform 0.2s ease",
  },
  noButton: {
    position: "absolute",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#ff2d55",
    transition: "top 0.2s ease, left 0.2s ease",
  },
  success: {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    color: "#fff",
    zIndex: 2,
  },
};
