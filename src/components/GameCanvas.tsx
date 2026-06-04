import React, { useRef, useEffect } from 'react';
import { GameGate, Particle, Player } from '../types';
import { Language, translateQuestion } from '../translations';

interface GameCanvasProps {
  player: Player;
  gates: GameGate[];
  particles: Particle[];
  onPlayerMove: (newX: number) => void;
  onUpdateGameStatus: (dt: number) => void;
  isPaused: boolean;
  activeGlowColor: string;
  isAwaitingChoice: boolean;
  onSelectAnswer: (side: 'left' | 'right') => void;
  lang: Language;
}

export default function GameCanvas({
  player,
  gates,
  particles,
  onPlayerMove,
  onUpdateGameStatus,
  isPaused,
  activeGlowColor,
  isAwaitingChoice,
  onSelectAnswer,
  lang,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 600, height: 400 });

  // Drag and swipe control state
  const isDraggingRef = useRef(false);
  const dragStartMouseXRef = useRef(0);
  const dragStartPlayerXRef = useRef(0);

  // Keyboard control tracking
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});

  // Stream-trail coordinates of player to draw trail
  const playerTrailRef = useRef<{ x: number; z: number }[]>([]);

  // Update canvas sizing based on offset size
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const canvas = canvasRef.current;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      dimensionsRef.current = { width: rect.width, height: rect.height };
    };

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    handleResize();

    return () => {
      observer.disconnect();
    };
  }, []);

  // Keyboard listeners for desktop inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      keysPressedRef.current[e.key] = true;

      // When stopped awaiting response, immediate keys choice triggers
      if (isAwaitingChoice) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          onSelectAnswer('left');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          onSelectAnswer('right');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, isAwaitingChoice, onSelectAnswer]);

  // Handle direct touch/clicks for choosing left/right lanes easily
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPaused) return;

    if (isAwaitingChoice) {
      // Tap left half of screen selects left path, right half selects right path!
      const clickX = e.clientX - containerRef.current!.getBoundingClientRect().left;
      const pct = clickX / dimensionsRef.current.width;
      if (pct < 0.5) {
        onSelectAnswer('left');
      } else {
        onSelectAnswer('right');
      }
      return;
    }

    isDraggingRef.current = true;
    dragStartMouseXRef.current = e.clientX;
    dragStartPlayerXRef.current = player.x;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || isPaused || isAwaitingChoice) return;
    const deltaX = e.clientX - dragStartMouseXRef.current;
    
    // Map pixels to track units: track width is about 4.0 units across
    const speedRatio = 4.0 / dimensionsRef.current.width;
    let targetX = dragStartPlayerXRef.current + deltaX * speedRatio;
    
    targetX = Math.max(-1.8, Math.min(1.8, targetX));
    onPlayerMove(targetX);
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Touch triggers (for mobile responsive swiping)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPaused) return;

    if (isAwaitingChoice && e.touches.length > 0) {
      const touchX = e.touches[0].clientX - containerRef.current!.getBoundingClientRect().left;
      const pct = touchX / dimensionsRef.current.width;
      if (pct < 0.5) {
        onSelectAnswer('left');
      } else {
        onSelectAnswer('right');
      }
      return;
    }

    if (e.touches.length === 0) return;
    isDraggingRef.current = true;
    dragStartMouseXRef.current = e.touches[0].clientX;
    dragStartPlayerXRef.current = player.x;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || isPaused || isAwaitingChoice || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - dragStartMouseXRef.current;
    const speedRatio = 4.0 / dimensionsRef.current.width;
    let targetX = dragStartPlayerXRef.current + deltaX * speedRatio;
    
    targetX = Math.max(-1.8, Math.min(1.8, targetX));
    onPlayerMove(targetX);
  };

  // Modern flat top-down camera projection
  const project = (x: number, z: number) => {
    const { width, height } = dimensionsRef.current;
    
    // player.z is mapped to height * 0.82
    const distanceZ = z - player.z;
    
    // Constant height top down projection
    const scaleZ = height / 195;
    const screenY = (height * 0.82) - (distanceZ * scaleZ);
    
    // X boundary map
    const scaleX = Math.min(width * 0.23, 140);
    const screenX = (width / 2) + x * scaleX;
    
    const scale = Math.max(0.45, 1.0 - (distanceZ * 0.0016));
    
    return { x: screenX, y: screenY, scale };
  };

  // Primary animation loop
  useEffect(() => {
    let animationFrameId: number;

    const runLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      let dt = (timestamp - lastTimeRef.current) / 1000;
      
      if (dt > 0.1) dt = 0.1;
      lastTimeRef.current = timestamp;

      // Maintain keyboard steering inputs when not paused
      if (!isPaused && !isAwaitingChoice) {
        let steerDir = 0;
        if (keysPressedRef.current['ArrowLeft'] || keysPressedRef.current['a'] || keysPressedRef.current['A']) {
          steerDir = -1;
        }
        if (keysPressedRef.current['ArrowRight'] || keysPressedRef.current['d'] || keysPressedRef.current['D']) {
          steerDir = 1;
        }

        if (steerDir !== 0) {
          const steerSpeed = 5.8 * dt; 
          let targetX = player.x + steerDir * steerSpeed;
          targetX = Math.max(-1.8, Math.min(1.8, targetX));
          onPlayerMove(targetX);
        }

        onUpdateGameStatus(dt);
      }

      // Record trail coords
      if (!isPaused) {
        playerTrailRef.current.push({ x: player.x, z: player.z });
        if (playerTrailRef.current.length > 25) {
          playerTrailRef.current.shift();
        }
      }

      draw();

      animationFrameId = requestAnimationFrame(runLoop);
    };

    // Draw frame onto context
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = dimensionsRef.current;

      // 1. Cyberpunk Space sunset-to-turf emerald linear gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#120d2b'); // Outer cosmos dark
      gradient.addColorStop(0.3, '#311042'); // Deep sunset purple
      gradient.addColorStop(0.65, '#052e16'); // Dark lawn green
      gradient.addColorStop(1, '#021e10'); // Rich pitch turf grass base
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Star field constellations drawing
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 30; i++) {
        const sx = (Math.sin(i * 412.19) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 211.38) * 0.5 + 0.5) * (height * 0.4);
        const r = (Math.sin(i * 812.92) * 0.5 + 0.5) * 1.4;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Turf Grass Stripes inside top-down view for magnificent sports presentation
      const stripeZ = 30;
      const startStripeZ = Math.floor(player.z / stripeZ) * stripeZ - 60;
      for (let z = startStripeZ; z < player.z + 320; z += stripeZ) {
        const p1 = project(-2.2, z);
        const p2 = project(2.2, z + stripeZ);
        if (p1 && p2) {
          const idx = Math.floor(z / stripeZ);
          ctx.fillStyle = idx % 2 === 0 ? 'rgba(16, 185, 129, 0.04)' : 'rgba(16, 185, 129, 0.01)';
          ctx.fillRect(0, p2.y, width, p1.y - p2.y);
        }
      }

      // 3. Central Track boundaries and neon layout
      ctx.beginPath();
      let firstLeft = true;
      for (let zVal = player.z - 30; zVal < player.z + 280; zVal += 15) {
        const p = project(-1.95, zVal);
        if (p) {
          if (firstLeft) { ctx.moveTo(p.x, p.y); firstLeft = false; }
          else { ctx.lineTo(p.x, p.y); }
        }
      }
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.beginPath();
      let firstRight = true;
      for (let zVal = player.z - 30; zVal < player.z + 280; zVal += 15) {
        const p = project(1.95, zVal);
        if (p) {
          if (firstRight) { ctx.moveTo(p.x, p.y); firstRight = false; }
          else { ctx.lineTo(p.x, p.y); }
        }
      }
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Dashed lane centers down straight pitch
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      const pCenterStart = project(0, player.z - 30);
      const pCenterEnd = project(0, player.z + 280);
      if (pCenterStart && pCenterEnd) {
        ctx.moveTo(pCenterStart.x, pCenterStart.y);
        ctx.lineTo(pCenterEnd.x, pCenterEnd.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 4. Highlight Response Zone And Forks
      const upcomingGate = gates.find(g => !g.answered);
      if (upcomingGate) {
        // A. Paint Response Zone horizontal banner
        const rzZ = upcomingGate.z - 45;
        const rzLength = 7;
        const pRZ1 = project(-1.95, rzZ);
        const pRZ2 = project(1.95, rzZ + rzLength);

        if (pRZ1 && pRZ2) {
          ctx.save();
          const rzPulse = Math.sin(Date.now() * 0.005) * 0.12 + 0.35;
          ctx.fillStyle = `rgba(34, 211, 238, ${rzPulse * 0.35})`;
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.fillRect(pRZ1.x, pRZ2.y, pRZ2.x - pRZ1.x, pRZ1.y - pRZ2.y);
          ctx.strokeRect(pRZ1.x, pRZ2.y, pRZ2.x - pRZ1.x, pRZ1.y - pRZ2.y);

          // Glowing side poles for Response Line
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.arc(pRZ1.x, pRZ1.y, 5, 0, Math.PI*2);
          ctx.arc(pRZ2.x, pRZ1.y, 5, 0, Math.PI*2);
          ctx.fill();

          ctx.font = '900 9px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          const decisionText = lang === 'tr' ? 'KARAR SINIRI' : lang === 'ar' ? 'حد اتخاذ القرار' : 'DECISION BOUNDARY';
          ctx.fillText(decisionText, width / 2, pRZ1.y - 8);
          ctx.restore();
        }

        // B. Paint two divergent parallel runway paths (Path A left, Path B right)
        // From rzZ + rzLength forward up to gate.z coordinates
        const pathStart = rzZ + rzLength;
        const pathEnd = upcomingGate.z;

        const pA1 = project(-1.9, pathStart);
        const pA2 = project(-0.05, pathEnd);
        if (pA1 && pA2) {
          ctx.save();
          ctx.fillStyle = 'rgba(34, 211, 238, 0.08)';
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.fillRect(pA1.x, pA2.y, pA2.x - pA1.x, pA1.y - pA2.y);
          ctx.strokeRect(pA1.x, pA2.y, pA2.x - pA1.x, pA1.y - pA2.y);
          ctx.restore();
        }

        const pB1 = project(0.05, pathStart);
        const pB2 = project(1.9, pathEnd);
        if (pB1 && pB2) {
          ctx.save();
          ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.fillRect(pB1.x, pB2.y, pB2.x - pB1.x, pB1.y - pB2.y);
          ctx.strokeRect(pB1.x, pB2.y, pB2.x - pB1.x, pB1.y - pB2.y);
          ctx.restore();
        }

        const translated = translateQuestion(
          upcomingGate.question.id,
          lang,
          upcomingGate.question.question,
          upcomingGate.leftOption,
          upcomingGate.rightOption
        );
        const leftOptStr = translated.left.toUpperCase();
        const rightOptStr = translated.right.toUpperCase();

        // C. Draw huge 3D answer panels visible at start of each path
        // Labeled beautifully as PATH A & PATH B in volumetric cards
        // Positioned around Z = gate.z - 25
        const pLabelA = project(-0.95, upcomingGate.z - 25);
        if (pLabelA) {
          ctx.save();
          const size = Math.max(12, Math.min(20, pLabelA.scale * 16));
          ctx.font = `900 ${size}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.fillRect(pLabelA.x - 65, pLabelA.y - size - 12, 130, size + 22);

          // Solid Background Plate
          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.9)';
          ctx.lineWidth = 2.5;
          ctx.fillRect(pLabelA.x - 67, pLabelA.y - size - 14, 130, size + 22);
          ctx.strokeRect(pLabelA.x - 67, pLabelA.y - size - 14, 130, size + 22);

          // Volumetric edge layer
          ctx.fillStyle = 'rgba(34, 211, 238, 0.25)';
          ctx.fillRect(pLabelA.x - 67, pLabelA.y - 6, 130, 14);

          // Text labels
          ctx.fillStyle = '#22d3ee';
          ctx.font = '900 8px "Space Grotesk", sans-serif';
          const pathAText = lang === 'tr' ? 'A YOLU' : lang === 'ar' ? 'المسار أ' : 'PATH A';
          ctx.fillText(pathAText, pLabelA.x, pLabelA.y - size);

          ctx.fillStyle = '#ffffff';
          ctx.font = `900 ${size}px "JetBrains Mono", monospace`;
          ctx.fillText(leftOptStr, pLabelA.x, pLabelA.y + 6);
          ctx.restore();
        }

        const pLabelB = project(0.95, upcomingGate.z - 25);
        if (pLabelB) {
          ctx.save();
          const size = Math.max(12, Math.min(20, pLabelB.scale * 16));
          ctx.font = `900 ${size}px "Space Grotesk", sans-serif`;
          ctx.textAlign = 'center';

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.fillRect(pLabelB.x - 65, pLabelB.y - size - 12, 130, size + 22);

          // Solid Plate
          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.9)';
          ctx.lineWidth = 2.5;
          ctx.fillRect(pLabelB.x - 67, pLabelB.y - size - 14, 130, size + 22);
          ctx.strokeRect(pLabelB.x - 67, pLabelB.y - size - 14, 130, size + 22);

          // Volumetric layer
          ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
          ctx.fillRect(pLabelB.x - 67, pLabelB.y - 6, 130, 14);

          // Labels
          ctx.fillStyle = '#f472b6';
          ctx.font = '900 8px "Space Grotesk", sans-serif';
          const pathBText = lang === 'tr' ? 'B YOLU' : lang === 'ar' ? 'المسار ب' : 'PATH B';
          ctx.fillText(pathBText, pLabelB.x, pLabelB.y - size);

          ctx.fillStyle = '#ffffff';
          ctx.font = `900 ${size}px "JetBrains Mono", monospace`;
          ctx.fillText(rightOptStr, pLabelB.x, pLabelB.y + 6);
          ctx.restore();
        }
      }

      // 5. Render historical gates (farthest rendered first, back-sorted)
      const sortedGates = [...gates]
        .filter(g => g.z > player.z - 30 && g.z < player.z + 280)
        .sort((a, b) => b.z - a.z);

      sortedGates.forEach(gate => {
        const { z, answered, chosenSide, isCorrect } = gate;
        
        // Render physical gate arches
        const pG1 = project(-1.95, z);
        const pG2 = project(1.95, z);

        if (pG1 && pG2) {
          ctx.save();
          // Transparent portal glass arch
          ctx.fillStyle = answered 
            ? (isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)')
            : 'rgba(34, 211, 238, 0.06)';
          
          ctx.fillRect(pG1.x, pG1.y - 25, pG2.x - pG1.x, 25);
          
          ctx.strokeStyle = answered
            ? (isCorrect ? '#10b981' : '#ef4444')
            : 'rgba(34, 211, 238, 0.55)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(pG1.x, pG1.y);
          ctx.lineTo(pG1.x, pG1.y - 25);
          ctx.lineTo(pG2.x, pG2.y - 25);
          ctx.lineTo(pG2.x, pG2.y);
          ctx.stroke();
          ctx.restore();
        }
      });

      // 6. Particle effects stars drawing
      particles.forEach((p) => {
        const proj = project(p.x, p.z);
        if (proj) {
          const size = p.size * proj.scale * 0.15;
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = size * 1.5;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(1, size), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 7. Render Player as a majestic high-tech blue energy soccer ball trailing streamers
      // Directly aligned in strict top-down perspective
      const pRender = project(player.x, player.z);
      if (pRender) {
        // Draw streaming coordinate lines
        if (playerTrailRef.current.length > 1) {
          ctx.save();
          ctx.beginPath();
          let lineStarted = false;

          playerTrailRef.current.forEach((coord) => {
            const projCoord = project(coord.x, coord.z);
            if (projCoord) {
              if (!lineStarted) {
                ctx.moveTo(projCoord.x, projCoord.y);
                lineStarted = true;
              } else {
                ctx.lineTo(projCoord.x, projCoord.y);
              }
            }
          });

          ctx.strokeStyle = activeGlowColor;
          ctx.lineWidth = Math.max(4, pRender.scale * 5);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowColor = activeGlowColor;
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.restore();
        }

        // Draw character sphere
        const radius = Math.max(9, pRender.scale * 12);
        ctx.save();
        
        const glowRad = radius * 1.8;
        const glowGrad = ctx.createRadialGradient(
          pRender.x, pRender.y, radius * 0.2,
          pRender.x, pRender.y, glowRad
        );
        glowGrad.addColorStop(0, '#ffffff');
        glowGrad.addColorStop(0.2, '#22d3ee'); // Blue glow
        glowGrad.addColorStop(0.6, 'rgba(34, 211, 238, 0.25)');
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(pRender.x, pRender.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pRender.x, pRender.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sports soccer grids overlay
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.65)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pRender.x - radius * 0.4, pRender.y, radius * 0.5, -Math.PI/3, Math.PI/3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pRender.x + radius * 0.4, pRender.y, radius * 0.5, Math.PI * 0.7, Math.PI * 1.3);
        ctx.stroke();
        ctx.restore();
      }
    };

    animationFrameId = requestAnimationFrame(runLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [player, gates, particles, isPaused, activeGlowColor, onPlayerMove, onUpdateGameStatus, isAwaitingChoice, onSelectAnswer]);

  return (
    <div
      id="game-canvas-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUpOrLeave}
      className="w-full h-full relative overflow-hidden cursor-pointer bg-slate-950 flex select-none"
    >
      <canvas
        id="runner-web-view"
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
