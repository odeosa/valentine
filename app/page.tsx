"use client";

import { useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function Page() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [noCount, setNoCount] = useState(0);
  const [noStyle, setNoStyle] = useState<any>({});
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [shake, setShake] = useState(false);

  // Yes button growth (both width & height)
  const yesScale = Math.min(1 + noCount * 0.12, 2.2);

  // Move No button randomly within card
  const moveNo = () => {
    if (!cardRef.current) return;

    const card = cardRef.current.getBoundingClientRect();

    const padding = 20;
    const maxX = card.width - 120;
    const maxY = card.height - 60;

    const x = Math.random() * maxX + padding;
    const y = Math.random() * maxY + padding;

    setIsAbsolute(true);
    setNoStyle({
      left: x,
      top: y,
      transform: `scale(${Math.max(0.4, 1 - noCount * 0.05)})`,
    });

    // Trigger card shake
    setShake(true);
    setTimeout(() => setShake(false), 300);

    setNoCount((prev) => prev + 1);
  };

  const onYes = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const hideNo = noCount >= 15;

  return (
    <div className="wrapper">
      <div
        ref={cardRef}
        className={`card ${shake ? "shake" : ""}`}
      >
        {/* Text moves up naturally as Yes grows */}
        <h1
          style={{
            marginBottom: "2rem",
            transform: `translateY(-${Math.min(noCount * 6, 40)}px)`,
          }}
        >
          Nma, will you be my Valentine? 🥹
        </h1>

        <div className="buttons">
          <button
            className="yes"
            style={{
              transform: `scale(${yesScale})`,
              width: `${Math.min(80, 40 + noCount * 3)}%`,
            }}
            onClick={onYes}
          >
            Yes 😍
          </button>

          {!hideNo && (
            <button
              className="no"
              style={{
                position: isAbsolute ? "absolute" : "relative",
                ...noStyle,
              }}
              onMouseEnter={moveNo}
              onTouchStart={moveNo}
            >
              No 😒
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #cc2b36;
          padding: 1rem;
        }

        .card {
          background: white;
          border-radius: 24px;
          padding: 3rem 2rem 4rem;
          width: 100%;
          max-width: 420px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        h1 {
          font-size: 1.6rem;
          color: red;
          font-family: "Comic Sans MS", cursive;
          transition: transform 0.3s ease;
        }

        .buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          position: relative;
          height: 120px;
        }

        button {
          border: none;
          padding: 0.8rem 1.6rem;
          border-radius: 999px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .yes {
          background: #cc2b36;
          color: white;
          z-index: 2;
        }

        .no {
          background: #eee;
          color: black;
          z-index: 1;
        }

        /* Shake animation */
        .shake {
          animation: shake 0.3s;
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}
