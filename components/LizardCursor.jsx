'use client';

import { useEffect, useRef } from 'react';

const LizardCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // --- Config ---
    const LERP = 0.12;
    const SPINE_COUNT = 6;
    const SPINE_GAP = 14;
    const TAIL_GAPS = [12, 10, 8];
    const UPPER_LEG = 18;
    const LOWER_LEG = 15;
    const SHOULDER_W = 6;
    const FOOT_SPREAD = 22;
    const STEP_THRESH = 25;
    const STEP_MS = 120;
    const MAX_BEND = 0.5; // max radians per joint (~28°)

    // --- State ---
    let mx = -200,
      my = -200,
      active = false;
    const spine = Array.from({ length: SPINE_COUNT }, () => ({
      x: -200,
      y: -200,
    }));
    const tail = Array.from({ length: TAIL_GAPS.length + 1 }, () => ({
      x: -200,
      y: -200,
    }));

    const makeLeg = (si, side) => ({
      si,
      side,
      foot: { x: -200, y: -200 },
      rest: { x: 0, y: 0 },
      stepping: false,
      stepT: 0,
      from: { x: 0, y: 0 },
    });
    const legs = [
      makeLeg(1, 1),
      makeLeg(1, -1),
      makeLeg(3, 1),
      makeLeg(3, -1),
    ];
    const pairs = [
      [0, 3],
      [1, 2],
    ]; // diagonal gait

    // --- Helpers ---
    const lerpVal = (a, b, t) => a + (b - a) * t;
    const hypot = (a, b) =>
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    const spineDir = (i) => {
      const p = i > 0 ? spine[i - 1] : spine[0];
      const n = i < spine.length - 1 ? spine[i + 1] : spine[i];
      const dx = p.x - n.x,
        dy = p.y - n.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: dx / len, y: dy / len };
    };

    const footRest = (leg) => {
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

    // --- Update ---
    // Clamp angle difference to [-MAX_BEND, MAX_BEND]
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
        // Distance constraint
        const dx = spine[i].x - spine[i - 1].x;
        const dy = spine[i].y - spine[i - 1].y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        spine[i].x = spine[i - 1].x + (dx / d) * SPINE_GAP;
        spine[i].y = spine[i - 1].y + (dy / d) * SPINE_GAP;

        // Angle constraint relative to previous segment
        if (i >= 2) {
          const pAng = Math.atan2(
            spine[i - 1].y - spine[i - 2].y,
            spine[i - 1].x - spine[i - 2].x,
          );
          const cAng = Math.atan2(
            spine[i].y - spine[i - 1].y,
            spine[i].x - spine[i - 1].x,
          );
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

        // Distance constraint
        const dx = tail[i].x - prev.x;
        const dy = tail[i].y - prev.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        tail[i].x = prev.x + (dx / d) * gap;
        tail[i].y = prev.y + (dy / d) * gap;

        // Angle constraint
        const pPrev =
          i === 0
            ? spine[spine.length - 2]
            : i === 1
              ? anchor
              : tail[i - 2];
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

    const updateLegs = (now) => {
      for (const l of legs) l.rest = footRest(l);

      // Allow both pairs to step simultaneously when needed
      for (const pair of pairs) {
        const otherPair = pair === pairs[0] ? pairs[1] : pairs[0];
        const otherStepping = otherPair.some((i) => legs[i].stepping);
        // Only block if other pair is stepping AND no leg in this pair is urgently stretched
        const urgent = pair.some(
          (i) => hypot(legs[i].foot, legs[i].rest) > STEP_THRESH * 1.5,
        );
        if (otherStepping && !urgent) continue;

        const needs = pair.some(
          (i) =>
            hypot(legs[i].foot, legs[i].rest) > STEP_THRESH &&
            !legs[i].stepping,
        );
        if (needs) {
          for (const i of pair) {
            if (
              !legs[i].stepping &&
              hypot(legs[i].foot, legs[i].rest) > STEP_THRESH * 0.5
            ) {
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
          const e =
            t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          l.foot.x = lerpVal(l.from.x, l.rest.x, e);
          l.foot.y = lerpVal(l.from.y, l.rest.y, e);
          if (t >= 1) l.stepping = false;
        }

        // Drag foot if it's beyond IK reach from shoulder
        const s = spine[l.si];
        const d = spineDir(l.si);
        const sx = s.x - d.y * l.side * SHOULDER_W;
        const sy = s.y + d.x * l.side * SHOULDER_W;
        const footDist = Math.sqrt(
          (l.foot.x - sx) ** 2 + (l.foot.y - sy) ** 2,
        );
        if (footDist > MAX_REACH) {
          const scale = MAX_REACH / footDist;
          l.foot.x = sx + (l.foot.x - sx) * scale;
          l.foot.y = sy + (l.foot.y - sy) * scale;
        }
      }
    };

    // --- Draw ---
    // Width profile: spine[0..5] + tail[0..3]
    const BODY_WIDTHS = [5, 3.5, 5.5, 6, 4.5, 3, 2, 1.2, 0.6, 0.2];

    // Get perpendicular direction for any joint in the combined array
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

    // Apply 2-layer glow to a path-building function (no filter blur)
    const glowStroke = (buildPath, w, op) => {
      // Main line with shadow glow
      ctx.save();
      ctx.strokeStyle = `rgba(0,255,255,${op * 0.3})`;
      ctx.lineWidth = w;
      ctx.lineCap = ctx.lineJoin = 'round';
      ctx.shadowColor = `rgba(0,255,255,${op * 0.4})`;
      ctx.shadowBlur = 8;
      buildPath();
      ctx.stroke();
      ctx.restore();

      // Inner bright
      ctx.save();
      ctx.strokeStyle = `rgba(255,255,255,${op * 0.3})`;
      ctx.lineWidth = Math.max(0.5, w * 0.4);
      ctx.lineCap = ctx.lineJoin = 'round';
      buildPath();
      ctx.stroke();
      ctx.restore();
    };

    // Apply 2-layer glow fill + stroke for closed shapes
    const glowShape = (buildPath, strokeW, op) => {
      // Subtle fill
      ctx.save();
      ctx.fillStyle = `rgba(0,255,255,${op * 0.06})`;
      buildPath();
      ctx.fill();
      ctx.restore();

      // Stroke with glow
      glowStroke(buildPath, strokeW, op);
    };

    // Draw smooth closed path through points
    const smoothClosedPath = (points) => {
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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!active) return;

      const joints = [...spine, ...tail];
      const hd = spineDir(0);

      // --- Build body contour ---
      const leftPts = [];
      const rightPts = [];
      for (let i = 0; i < joints.length; i++) {
        const p = jointPerp(joints, i);
        const w = BODY_WIDTHS[i] || 0.2;
        leftPts.push({ x: joints[i].x + p.x * w, y: joints[i].y + p.y * w });
        rightPts.push({ x: joints[i].x - p.x * w, y: joints[i].y - p.y * w });
      }

      // Head tip (pointed snout)
      const headTip = {
        x: spine[0].x + hd.x * 8,
        y: spine[0].y + hd.y * 8,
      };
      // Points near tip to keep it sharp
      const tipL = {
        x: headTip.x + (leftPts[0].x - headTip.x) * 0.2,
        y: headTip.y + (leftPts[0].y - headTip.y) * 0.2,
      };
      const tipR = {
        x: headTip.x + (rightPts[0].x - headTip.x) * 0.2,
        y: headTip.y + (rightPts[0].y - headTip.y) * 0.2,
      };

      // Full contour: head tip → left side → tail → right side (reversed)
      const contour = [
        tipR,
        headTip,
        tipL,
        ...leftPts,
        ...rightPts.slice().reverse(),
      ];

      // --- Draw legs (behind body) ---
      for (const l of legs) {
        const sp = spine[l.si];
        const d = spineDir(l.si);
        const sx = sp.x - d.y * l.side * SHOULDER_W;
        const sy = sp.y + d.x * l.side * SHOULDER_W;
        const { ex, ey } = ik2(
          sx, sy, l.foot.x, l.foot.y, UPPER_LEG, LOWER_LEG, l.side,
        );

        // Leg bones
        glowStroke(() => {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.lineTo(l.foot.x, l.foot.y);
        }, 1.8, 0.6);

        // Toes (4 per foot)
        const fdx = l.foot.x - ex;
        const fdy = l.foot.y - ey;
        const flen = Math.sqrt(fdx * fdx + fdy * fdy) || 1;
        const fDirX = fdx / flen;
        const fDirY = fdy / flen;
        const toeLen = 5;
        const toeAngles = [-0.5, -0.17, 0.17, 0.5];

        glowStroke(() => {
          ctx.beginPath();
          for (const ang of toeAngles) {
            const cos = Math.cos(ang), sin = Math.sin(ang);
            const tx = fDirX * cos - fDirY * sin;
            const ty = fDirX * sin + fDirY * cos;
            ctx.moveTo(l.foot.x, l.foot.y);
            ctx.lineTo(l.foot.x + tx * toeLen, l.foot.y + ty * toeLen);
          }
        }, 1, 0.5);
      }

      // --- Draw body ---
      glowShape(() => smoothClosedPath(contour), 2, 1);

      // --- Spine line (subtle center detail) ---
      ctx.save();
      ctx.strokeStyle = 'rgba(0,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(spine[0].x, spine[0].y);
      for (let i = 1; i < spine.length; i++) ctx.lineTo(spine[i].x, spine[i].y);
      ctx.stroke();
      ctx.restore();

      // --- Eyes ---
      const eyeFwd = 4;
      const eyeSpread = 4;
      for (const s of [-1, 1]) {
        const ex = spine[0].x + hd.x * eyeFwd - hd.y * s * eyeSpread;
        const ey = spine[0].y + hd.y * eyeFwd + hd.x * s * eyeSpread;

        // Eye glow
        ctx.save();
        ctx.fillStyle = 'rgba(0,255,255,0.15)';
        ctx.shadowColor = 'rgba(0,255,255,0.4)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Eye pupil
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(ex + hd.x * 0.5, ey + hd.y * 0.5, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // --- Events ---
    const initAt = (x, y) => {
      if (active) return;
      active = true;
      mx = x;
      my = y;
      for (let i = 0; i < spine.length; i++) {
        spine[i].x = x;
        spine[i].y = y + i * SPINE_GAP;
      }
      for (let i = 0; i < tail.length; i++) {
        const prev = i === 0 ? spine[spine.length - 1] : tail[i - 1];
        tail[i].x = prev.x;
        tail[i].y =
          prev.y + TAIL_GAPS[Math.min(i, TAIL_GAPS.length - 1)];
      }
      for (const l of legs) {
        const r = footRest(l);
        l.foot.x = r.x;
        l.foot.y = r.y;
      }
    };

    const onMouse = (e) => {
      if (!active) initAt(e.clientX, e.clientY);
      mx = e.clientX;
      my = e.clientY;
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) {
        if (!active) initAt(t.clientX, t.clientY);
        mx = t.clientX;
        my = t.clientY;
      }
    };
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let animId;
    const loop = () => {
      updateSpine();
      updateTail();
      updateLegs(performance.now());
      draw();
      animId = requestAnimationFrame(loop);
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMouse);
    document.addEventListener('touchstart', onTouch, { passive: true });
    document.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouse);
      document.removeEventListener('touchstart', onTouch);
      document.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default LizardCursor;
