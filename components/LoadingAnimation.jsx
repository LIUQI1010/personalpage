'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LoadingAnimation = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const ringRef = useRef(null);
  const radiusRef = useRef({ value: 0 });
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    const ssrOverlay = document.getElementById('ssr-loading-overlay');
    if (!sessionStorage.getItem('loading-played')) {
      setShouldPlay(true);
      sessionStorage.setItem('loading-played', '1');
    } else {
      // 不播放动画时，立即移除 SSR 遮罩
      ssrOverlay?.remove();
      onComplete?.();
    }
  }, []);

  useEffect(() => {
    if (!shouldPlay) return;

    // 动画组件已挂载，移除 SSR 遮罩（自身 overlay 接管）
    document.getElementById('ssr-loading-overlay')?.remove();

    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    if (!overlay || !canvas || !ring) return;

    const ctx = canvas.getContext('2d');
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    canvas.width = vw;
    canvas.height = vh;

    const centerX = vw / 2;
    const centerY = vh / 2;
    const maxRadius = Math.sqrt(vw * vw + vh * vh) / 2;

    const scale = vw < vh ? 0.7 : 1;

    // --- Lizard Config ---
    const LERP = 0.15;
    const SPINE_COUNT = 6;
    const SPINE_GAP = 14 * scale;
    const TAIL_GAPS = [12, 10, 8].map(g => g * scale);
    const UPPER_LEG = 18 * scale;
    const LOWER_LEG = 15 * scale;
    const SHOULDER_W = 6 * scale;
    const FOOT_SPREAD = 22 * scale;
    const STEP_THRESH = 25 * scale;
    const STEP_MS = 120;
    const MAX_BEND = 0.5;

    // --- Lizard State ---
    let mx = centerX;
    let my = centerY;

    const spine = Array.from({ length: SPINE_COUNT }, (_, i) => ({
      x: centerX,
      y: centerY + i * SPINE_GAP,
    }));
    const tail = Array.from({ length: TAIL_GAPS.length + 1 }, () => ({
      x: centerX,
      y: centerY + SPINE_COUNT * SPINE_GAP,
    }));

    const makeLeg = (si, side) => ({
      si,
      side,
      foot: { x: centerX, y: centerY },
      rest: { x: 0, y: 0 },
      stepping: false,
      stepT: 0,
      from: { x: 0, y: 0 },
    });
    const legs = [makeLeg(1, 1), makeLeg(1, -1), makeLeg(3, 1), makeLeg(3, -1)];
    const pairs = [
      [0, 3],
      [1, 2],
    ];

    // --- Helpers ---
    const lerpVal = (a, b, t) => a + (b - a) * t;
    const hypot = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    const spineDir = i => {
      const p = i > 0 ? spine[i - 1] : spine[0];
      const n = i < spine.length - 1 ? spine[i + 1] : spine[i];
      const dx = p.x - n.x,
        dy = p.y - n.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: dx / len, y: dy / len };
    };

    const footRest = leg => {
      const s = spine[leg.si];
      const d = spineDir(leg.si);
      const px = -d.y * leg.side,
        py = d.x * leg.side;
      const fwd = leg.si <= 2 ? 5 : -5;
      return {
        x: s.x + px * FOOT_SPREAD + d.x * fwd,
        y: s.y + py * FOOT_SPREAD + d.y * fwd,
      };
    };

    const ik2 = (sx, sy, tx, ty, a, b, side) => {
      const dx = tx - sx,
        dy = ty - sy;
      let d = Math.sqrt(dx * dx + dy * dy);
      d = Math.min(d, (a + b) * 0.98);
      if (d < 0.01) return { ex: sx, ey: sy + a * side };
      const cos = (a * a + d * d - b * b) / (2 * a * d);
      const ang = Math.acos(Math.max(-1, Math.min(1, cos)));
      const base = Math.atan2(dy, dx);
      return {
        ex: sx + a * Math.cos(base + ang * side),
        ey: sy + a * Math.sin(base + ang * side),
      };
    };

    const clampAngle = (parentAng, childAng, maxBend) => {
      let diff = childAng - parentAng;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      if (Math.abs(diff) > maxBend) {
        return parentAng + Math.sign(diff) * maxBend;
      }
      return childAng;
    };

    const updateSpine = () => {
      spine[0].x = lerpVal(spine[0].x, mx, LERP);
      spine[0].y = lerpVal(spine[0].y, my, LERP);
      for (let i = 1; i < spine.length; i++) {
        const dx = spine[i].x - spine[i - 1].x;
        const dy = spine[i].y - spine[i - 1].y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        spine[i].x = spine[i - 1].x + (dx / d) * SPINE_GAP;
        spine[i].y = spine[i - 1].y + (dy / d) * SPINE_GAP;
        if (i >= 2) {
          const pAng = Math.atan2(spine[i - 1].y - spine[i - 2].y, spine[i - 1].x - spine[i - 2].x);
          const cAng = Math.atan2(spine[i].y - spine[i - 1].y, spine[i].x - spine[i - 1].x);
          const clamped = clampAngle(pAng, cAng, MAX_BEND);
          if (clamped !== cAng) {
            spine[i].x = spine[i - 1].x + Math.cos(clamped) * SPINE_GAP;
            spine[i].y = spine[i - 1].y + Math.sin(clamped) * SPINE_GAP;
          }
        }
      }
    };

    const updateTail = () => {
      const anchor = spine[spine.length - 1];
      for (let i = 0; i < tail.length; i++) {
        const prev = i === 0 ? anchor : tail[i - 1];
        const gap = TAIL_GAPS[Math.min(i, TAIL_GAPS.length - 1)];
        const dx = tail[i].x - prev.x;
        const dy = tail[i].y - prev.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        tail[i].x = prev.x + (dx / d) * gap;
        tail[i].y = prev.y + (dy / d) * gap;
        const pPrev = i === 0 ? spine[spine.length - 2] : i === 1 ? anchor : tail[i - 2];
        const pAng = Math.atan2(prev.y - pPrev.y, prev.x - pPrev.x);
        const cAng = Math.atan2(tail[i].y - prev.y, tail[i].x - prev.x);
        const clamped = clampAngle(pAng, cAng, MAX_BEND);
        if (clamped !== cAng) {
          tail[i].x = prev.x + Math.cos(clamped) * gap;
          tail[i].y = prev.y + Math.sin(clamped) * gap;
        }
      }
    };

    const MAX_REACH = (UPPER_LEG + LOWER_LEG) * 0.95;

    const updateLegs = now => {
      for (const l of legs) l.rest = footRest(l);
      for (const pair of pairs) {
        const otherPair = pair === pairs[0] ? pairs[1] : pairs[0];
        const otherStepping = otherPair.some(i => legs[i].stepping);
        const urgent = pair.some(i => hypot(legs[i].foot, legs[i].rest) > STEP_THRESH * 1.5);
        if (otherStepping && !urgent) continue;
        const needs = pair.some(
          i => hypot(legs[i].foot, legs[i].rest) > STEP_THRESH && !legs[i].stepping,
        );
        if (needs) {
          for (const i of pair) {
            if (!legs[i].stepping && hypot(legs[i].foot, legs[i].rest) > STEP_THRESH * 0.5) {
              legs[i].stepping = true;
              legs[i].stepT = now;
              legs[i].from = { ...legs[i].foot };
            }
          }
        }
      }
      for (const l of legs) {
        if (l.stepping) {
          const t = Math.min((now - l.stepT) / STEP_MS, 1);
          const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          l.foot.x = lerpVal(l.from.x, l.rest.x, e);
          l.foot.y = lerpVal(l.from.y, l.rest.y, e);
          if (t >= 1) l.stepping = false;
        }
        const s = spine[l.si];
        const d = spineDir(l.si);
        const sx = s.x - d.y * l.side * SHOULDER_W;
        const sy = s.y + d.x * l.side * SHOULDER_W;
        const footDist = Math.sqrt((l.foot.x - sx) ** 2 + (l.foot.y - sy) ** 2);
        if (footDist > MAX_REACH) {
          const scale = MAX_REACH / footDist;
          l.foot.x = sx + (l.foot.x - sx) * scale;
          l.foot.y = sy + (l.foot.y - sy) * scale;
        }
      }
    };

    // --- Draw ---
    const BODY_WIDTHS = [5, 3.5, 5.5, 6, 4.5, 3, 2, 1.2, 0.6, 0.2].map(w => w * scale);

    const jointPerp = (joints, i) => {
      let dx, dy;
      if (i === 0) {
        dx = joints[0].x - joints[1].x;
        dy = joints[0].y - joints[1].y;
      } else if (i >= joints.length - 1) {
        dx = joints[i - 1].x - joints[i].x;
        dy = joints[i - 1].y - joints[i].y;
      } else {
        dx = joints[i - 1].x - joints[i + 1].x;
        dy = joints[i - 1].y - joints[i + 1].y;
      }
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: -dy / len, y: dx / len };
    };

    const glowStroke = (buildPath, w, op) => {
      ctx.save();
      ctx.strokeStyle = `rgba(0,255,255,${op * 0.3})`;
      ctx.lineWidth = w;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.shadowColor = `rgba(0,255,255,${op * 0.4})`;
      ctx.shadowBlur = 8;
      buildPath();
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = `rgba(255,255,255,${op * 0.3})`;
      ctx.lineWidth = Math.max(0.5, w * 0.4);
      ctx.lineCap = ctx.lineJoin = 'round';
      buildPath();
      ctx.stroke();
      ctx.restore();
    };

    const glowShape = (buildPath, strokeW, op) => {
      ctx.save();
      ctx.fillStyle = `rgba(0,255,255,${op * 0.06})`;
      buildPath();
      ctx.fill();
      ctx.restore();
      glowStroke(buildPath, strokeW, op);
    };

    const smoothClosedPath = points => {
      const n = points.length;
      if (n < 3) return;
      ctx.beginPath();
      const sx = (points[n - 1].x + points[0].x) / 2;
      const sy = (points[n - 1].y + points[0].y) / 2;
      ctx.moveTo(sx, sy);
      for (let i = 0; i < n; i++) {
        const c = points[i];
        const next = points[(i + 1) % n];
        ctx.quadraticCurveTo(c.x, c.y, (c.x + next.x) / 2, (c.y + next.y) / 2);
      }
      ctx.closePath();
    };

    let lizardOpacity = 1;

    const drawLizard = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = lizardOpacity;

      const time = performance.now() / 1000;
      const rawJoints = [...spine, ...tail];

      // 身体末端+尾巴摆动
      const totalLen = spine.length + tail.length;
      const swayStart = Math.floor(spine.length * 0.5);
      const joints = rawJoints.map((j, i) => {
        if (i < swayStart) return j;
        const perp = jointPerp(rawJoints, i);
        const t = (i - swayStart) / (totalLen - swayStart);
        const wave = Math.sin(time * 4 - (i - swayStart) * 0.9) * 3.5 * t;
        return { x: j.x + perp.x * wave, y: j.y + perp.y * wave };
      });

      const hd = spineDir(0);

      const leftPts = [];
      const rightPts = [];
      for (let i = 0; i < joints.length; i++) {
        const p = jointPerp(joints, i);
        const w = BODY_WIDTHS[i] || 0.2;
        leftPts.push({ x: joints[i].x + p.x * w, y: joints[i].y + p.y * w });
        rightPts.push({ x: joints[i].x - p.x * w, y: joints[i].y - p.y * w });
      }

      const headTip = { x: spine[0].x + hd.x * 8, y: spine[0].y + hd.y * 8 };
      const tipL = {
        x: headTip.x + (leftPts[0].x - headTip.x) * 0.2,
        y: headTip.y + (leftPts[0].y - headTip.y) * 0.2,
      };
      const tipR = {
        x: headTip.x + (rightPts[0].x - headTip.x) * 0.2,
        y: headTip.y + (rightPts[0].y - headTip.y) * 0.2,
      };
      const contour = [tipR, headTip, tipL, ...leftPts, ...rightPts.slice().reverse()];

      // Legs
      for (const l of legs) {
        const sp = spine[l.si];
        const d = spineDir(l.si);
        const sx = sp.x - d.y * l.side * SHOULDER_W;
        const sy = sp.y + d.x * l.side * SHOULDER_W;
        const { ex, ey } = ik2(sx, sy, l.foot.x, l.foot.y, UPPER_LEG, LOWER_LEG, l.side);

        glowStroke(() => {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.lineTo(l.foot.x, l.foot.y);
        }, 1.8, 0.6);

      }

      // Body
      glowShape(() => smoothClosedPath(contour), 2, 1);

      // Spine line
      ctx.save();
      ctx.strokeStyle = 'rgba(0,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(spine[0].x, spine[0].y);
      for (let i = 1; i < spine.length; i++) ctx.lineTo(spine[i].x, spine[i].y);
      ctx.stroke();
      ctx.restore();

      // Eyes
      const eyeFwd = 4;
      const eyeSpread = 4;
      for (const s of [-1, 1]) {
        const ex = spine[0].x + hd.x * eyeFwd - hd.y * s * eyeSpread;
        const ey = spine[0].y + hd.y * eyeFwd + hd.x * s * eyeSpread;
        ctx.save();
        ctx.fillStyle = 'rgba(0,255,255,0.15)';
        ctx.shadowColor = 'rgba(0,255,255,0.4)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(ex + hd.x * 0.5, ey + hd.y * 0.5, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    // --- Mask ---
    const updateMask = r => {
      if (r <= 0) {
        overlay.style.WebkitMaskImage = 'none';
        overlay.style.maskImage = 'none';
        return;
      }
      const mask = `radial-gradient(circle ${r}px at ${centerX}px ${centerY}px, transparent ${r}px, black ${r}px)`;
      overlay.style.WebkitMaskImage = mask;
      overlay.style.maskImage = mask;
    };
    updateMask(0);

    const spiral = { angle: 0, radius: (vw < vh) ? 25 : 35 };
    let arrived = false;
    let animId;

    // 初始化脚的位置
    for (const l of legs) {
      const r = footRest(l);
      l.foot.x = r.x;
      l.foot.y = r.y;
    }

    const loop = () => {
      mx = centerX + Math.cos(spiral.angle) * spiral.radius;
      my = centerY + Math.sin(spiral.angle) * spiral.radius;
      updateSpine();
      updateTail();
      updateLegs(performance.now());
      drawLizard();
      if (!arrived) {
        animId = requestAnimationFrame(loop);
      }
    };
    animId = requestAnimationFrame(loop);

    // GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        cancelAnimationFrame(animId);
        if (overlay.parentNode) {
          overlay.style.display = 'none';
        }
        onComplete?.();
      },
    });

    // 蜥蜴在中心盘旋并逐渐消失
    tl.to(spiral, {
      angle: Math.PI * 2,
      radius: 0,
      duration: 1.2,
      ease: 'power1.in',
      onUpdate: function () { lizardOpacity = 1 - this.progress(); },
      onComplete: () => {
        arrived = true;
        cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
    });

    // 圆环扩散 + 遮罩揭开同时开始
    const revealLabel = 'reveal';

    tl.fromTo(
      ring,
      { scale: 0, opacity: 1 },
      { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out' },
      revealLabel,
    );

    tl.to(
      radiusRef.current,
      {
        value: maxRadius,
        duration: 1.15,
        ease: 'power2.out',
        onUpdate: () => { updateMask(radiusRef.current.value); },
      },
      revealLabel,
    );

    return () => {
      tl.kill();
      cancelAnimationFrame(animId);
    };
  }, [shouldPlay]);

  if (!shouldPlay) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const ringSize = Math.max(vw, vh) * 0.6;

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'oklch(0.13 0.03 261.7)',
          pointerEvents: 'none',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* 扩散圆环 — 独立于 overlay，不受 mask 影响 */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          zIndex: 10001,
          left: '50%',
          top: '50%',
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderRadius: '50%',
          border: '2px solid rgba(0, 255, 255, 0.8)',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.1)',
          transform: 'scale(0)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default LoadingAnimation;
