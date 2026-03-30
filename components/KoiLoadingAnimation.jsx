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
      ssrOverlay?.remove();
      onComplete?.();
    }
  }, []);

  useEffect(() => {
    if (!shouldPlay) return;

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

    // --- 锦鲤参数 ---
    const LERP = 0.15;
    const SPINE_COUNT = 8;
    const SPINE_GAP = 10;
    const TAIL_GAPS = [8, 6, 5];
    const MAX_BEND = 0.4;
    const SWIM_SPEED = 4;
    const SWIM_AMP = 5;

    const BODY_WIDTHS = [7, 10.5, 12, 12, 11, 9, 7, 5, 3, 1.8, 0.8, 0.3];

    // --- State ---
    const startX = vw * 0.05;
    const startY = vh * 0.92;
    let mx = startX;
    let my = startY;

    const spine = Array.from({ length: SPINE_COUNT }, (_, i) => ({
      x: startX,
      y: startY + i * SPINE_GAP,
    }));
    const tail = Array.from({ length: TAIL_GAPS.length + 1 }, () => ({
      x: startX,
      y: startY + SPINE_COUNT * SPINE_GAP,
    }));

    // --- Helpers ---
    const lerpVal = (a, b, t) => a + (b - a) * t;

    const clampAngle = (parentAng, childAng, maxBend) => {
      let diff = childAng - parentAng;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      if (Math.abs(diff) > maxBend) return parentAng + Math.sign(diff) * maxBend;
      return childAng;
    };

    const spineDir = i => {
      const p = i > 0 ? spine[i - 1] : spine[0];
      const n = i < spine.length - 1 ? spine[i + 1] : spine[i];
      const dx = p.x - n.x, dy = p.y - n.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: dx / len, y: dy / len };
    };

    const jointPerp = (joints, i) => {
      let dx, dy;
      if (i === 0) { dx = joints[0].x - joints[1].x; dy = joints[0].y - joints[1].y; }
      else if (i >= joints.length - 1) { dx = joints[i - 1].x - joints[i].x; dy = joints[i - 1].y - joints[i].y; }
      else { dx = joints[i - 1].x - joints[i + 1].x; dy = joints[i - 1].y - joints[i + 1].y; }
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      return { x: -dy / len, y: dx / len };
    };

    // --- Update ---
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

    // --- Glow helpers ---
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

    let fishOpacity = 1;

    const drawFish = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalAlpha = fishOpacity;

      const time = performance.now() / 1000;
      const joints = [...spine, ...tail];

      // 游动波浪（carangiform：头部稳定，身体中段开始摆动，尾部最大）
      const drawJoints = joints.map((j, i) => {
        const perp = jointPerp(joints, i);
        const t = i / (joints.length - 1);
        const envelope = t < 0.2 ? 0 : Math.pow((t - 0.2) / 0.8, 1.3);
        const wave = Math.sin(time * SWIM_SPEED - i * 0.7) * SWIM_AMP * envelope;
        return { x: j.x + perp.x * wave, y: j.y + perp.y * wave };
      });

      const hd = spineDir(0);

      // 身体轮廓
      const leftPts = [];
      const rightPts = [];
      for (let i = 0; i < drawJoints.length; i++) {
        const perp = jointPerp(drawJoints, i);
        const w = BODY_WIDTHS[i] || 0.2;
        leftPts.push({ x: drawJoints[i].x + perp.x * w, y: drawJoints[i].y + perp.y * w });
        rightPts.push({ x: drawJoints[i].x - perp.x * w, y: drawJoints[i].y - perp.y * w });
      }

      const headTip = { x: drawJoints[0].x + hd.x * 4, y: drawJoints[0].y + hd.y * 4 };
      const tipL = {
        x: headTip.x + (leftPts[0].x - headTip.x) * 0.55,
        y: headTip.y + (leftPts[0].y - headTip.y) * 0.55,
      };
      const tipR = {
        x: headTip.x + (rightPts[0].x - headTip.x) * 0.55,
        y: headTip.y + (rightPts[0].y - headTip.y) * 0.55,
      };
      const contour = [tipR, headTip, tipL, ...leftPts, ...rightPts.slice().reverse()];

      // --- 叉形尾鳍（两瓣） ---
      const tailEnd = drawJoints[drawJoints.length - 1];
      const tailPrev = drawJoints[drawJoints.length - 2];
      const tdx = tailEnd.x - tailPrev.x;
      const tdy = tailEnd.y - tailPrev.y;
      const tLen = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
      const tailDir = { x: tdx / tLen, y: tdy / tLen };
      const tailPerp = { x: -tailDir.y, y: tailDir.x };
      const finLen = 18;
      const finSpread = 13;
      const finWave = Math.sin(time * SWIM_SPEED - joints.length * 0.8) * 3;
      const notchDepth = finLen * 0.35;

      // 上瓣
      glowShape(() => {
        ctx.beginPath();
        ctx.moveTo(tailEnd.x + tailPerp.x * 0.5, tailEnd.y + tailPerp.y * 0.5);
        ctx.quadraticCurveTo(
          tailEnd.x + tailDir.x * finLen * 0.3 + tailPerp.x * (finSpread * 0.8 + finWave),
          tailEnd.y + tailDir.y * finLen * 0.3 + tailPerp.y * (finSpread * 0.8 + finWave),
          tailEnd.x + tailDir.x * finLen + tailPerp.x * (finSpread * 0.6 + finWave),
          tailEnd.y + tailDir.y * finLen + tailPerp.y * (finSpread * 0.6 + finWave),
        );
        ctx.quadraticCurveTo(
          tailEnd.x + tailDir.x * finLen * 0.7 + tailPerp.x * (finWave * 0.3),
          tailEnd.y + tailDir.y * finLen * 0.7 + tailPerp.y * (finWave * 0.3),
          tailEnd.x + tailDir.x * notchDepth,
          tailEnd.y + tailDir.y * notchDepth,
        );
        ctx.closePath();
      }, 1.2, 0.7);

      // 下瓣
      glowShape(() => {
        ctx.beginPath();
        ctx.moveTo(tailEnd.x - tailPerp.x * 0.5, tailEnd.y - tailPerp.y * 0.5);
        ctx.quadraticCurveTo(
          tailEnd.x + tailDir.x * finLen * 0.3 - tailPerp.x * (finSpread * 0.8 - finWave),
          tailEnd.y + tailDir.y * finLen * 0.3 - tailPerp.y * (finSpread * 0.8 - finWave),
          tailEnd.x + tailDir.x * finLen - tailPerp.x * (finSpread * 0.6 - finWave),
          tailEnd.y + tailDir.y * finLen - tailPerp.y * (finSpread * 0.6 - finWave),
        );
        ctx.quadraticCurveTo(
          tailEnd.x + tailDir.x * finLen * 0.7 - tailPerp.x * (finWave * 0.3),
          tailEnd.y + tailDir.y * finLen * 0.7 - tailPerp.y * (finWave * 0.3),
          tailEnd.x + tailDir.x * notchDepth,
          tailEnd.y + tailDir.y * notchDepth,
        );
        ctx.closePath();
      }, 1.2, 0.7);

      // --- 胸鳍（扇形，两侧） ---
      for (const side of [-1, 1]) {
        const idx = 2;
        const joint = drawJoints[idx];
        const perp = jointPerp(drawJoints, idx);
        const bDir = {
          x: drawJoints[idx - 1].x - drawJoints[idx + 1].x,
          y: drawJoints[idx - 1].y - drawJoints[idx + 1].y,
        };
        const bLen = Math.sqrt(bDir.x * bDir.x + bDir.y * bDir.y) || 1;
        bDir.x /= bLen; bDir.y /= bLen;
        const w = BODY_WIDTHS[idx];
        const baseX = joint.x + perp.x * side * w * 0.85;
        const baseY = joint.y + perp.y * side * w * 0.85;
        const finL = 16;
        const flapAng = Math.sin(time * 2.5 + side * 0.5) * 0.3;

        const outX = perp.x * side * Math.cos(flapAng) - bDir.x * Math.sin(flapAng);
        const outY = perp.y * side * Math.cos(flapAng) - bDir.y * Math.sin(flapAng);
        const tipX = baseX + outX * finL;
        const tipY = baseY + outY * finL;

        const fwd = { x: baseX + bDir.x * 5 + perp.x * side * w * 0.3, y: baseY + bDir.y * 5 + perp.y * side * w * 0.3 };
        const back = { x: baseX - bDir.x * 6 + perp.x * side * w * 0.2, y: baseY - bDir.y * 6 + perp.y * side * w * 0.2 };

        glowShape(() => {
          ctx.beginPath();
          ctx.moveTo(fwd.x, fwd.y);
          ctx.quadraticCurveTo(
            baseX + outX * finL * 0.7 + bDir.x * 3,
            baseY + outY * finL * 0.7 + bDir.y * 3,
            tipX, tipY,
          );
          ctx.quadraticCurveTo(
            baseX + outX * finL * 0.7 - bDir.x * 5,
            baseY + outY * finL * 0.7 - bDir.y * 5,
            back.x, back.y,
          );
          ctx.closePath();
        }, 1, 0.5);
      }

      // --- 背鳍 ---
      const dorsalStart = 2;
      const dorsalEnd = 5;
      glowStroke(() => {
        ctx.beginPath();
        const perp0 = jointPerp(drawJoints, dorsalStart);
        ctx.moveTo(
          drawJoints[dorsalStart].x + perp0.x * BODY_WIDTHS[dorsalStart] * 0.8,
          drawJoints[dorsalStart].y + perp0.y * BODY_WIDTHS[dorsalStart] * 0.8,
        );
        for (let i = dorsalStart + 1; i <= dorsalEnd; i++) {
          const p = jointPerp(drawJoints, i);
          const h = (i === dorsalStart + 1 || i === dorsalEnd) ? 1.0 : 1.4;
          ctx.lineTo(
            drawJoints[i].x + p.x * BODY_WIDTHS[i] * h,
            drawJoints[i].y + p.y * BODY_WIDTHS[i] * h,
          );
        }
      }, 1, 0.4);

      // --- 身体 ---
      glowShape(() => smoothClosedPath(contour), 2, 1);

      // --- 电路走线 + 脉冲 ---
      const pulsePos = (performance.now() % 1500) / 1500;

      ctx.save();
      ctx.strokeStyle = 'rgba(0,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(drawJoints[0].x, drawJoints[0].y);
      for (let i = 1; i < drawJoints.length; i++) ctx.lineTo(drawJoints[i].x, drawJoints[i].y);
      ctx.stroke();
      ctx.restore();

      const totalJ = drawJoints.length;
      for (let i = 0; i < totalJ; i++) {
        const perp = jointPerp(drawJoints, i);
        const w = BODY_WIDTHS[i] || 0.2;
        const normPos = i / totalJ;
        const pulseDist = Math.abs(normPos - pulsePos);
        const pulseGlow = Math.max(0, 1 - pulseDist * 5);

        if (w > 2 && i % 2 === 0) {
          const branchLen = w * 0.6;
          for (const side of [-1, 1]) {
            const bx = drawJoints[i].x + perp.x * side * branchLen;
            const by = drawJoints[i].y + perp.y * side * branchLen;
            ctx.save();
            ctx.strokeStyle = `rgba(0,255,255,${0.1 + pulseGlow * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(drawJoints[i].x, drawJoints[i].y);
            ctx.lineTo(bx, by);
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.fillStyle = `rgba(0,255,255,${0.25 + pulseGlow * 0.5})`;
            ctx.shadowColor = `rgba(0,255,255,${0.25 + pulseGlow * 0.5})`;
            ctx.shadowBlur = 2 + pulseGlow * 4;
            ctx.beginPath();
            ctx.arc(bx, by, 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        const nodeOp = 0.25 + pulseGlow * 0.7;
        const nodeR = i < spine.length ? 1.3 : 0.8;
        ctx.save();
        ctx.fillStyle = `rgba(0,255,255,${nodeOp})`;
        ctx.shadowColor = `rgba(0,255,255,${nodeOp})`;
        ctx.shadowBlur = 3 + pulseGlow * 6;
        ctx.beginPath();
        ctx.arc(drawJoints[i].x, drawJoints[i].y, nodeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- 鱼须 ---
      const barbLen = 8;
      for (const side of [-1, 1]) {
        const bx = headTip.x - hd.y * side * 2;
        const by = headTip.y + hd.x * side * 2;
        const tipBx = bx + (hd.x * 0.5 - hd.y * side * 0.5) * barbLen;
        const tipBy = by + (hd.y * 0.5 + hd.x * side * 0.5) * barbLen;
        const barbWave = Math.sin(time * 3 + side) * 1.5;

        glowStroke(() => {
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.quadraticCurveTo(
            bx + hd.x * barbLen * 0.5 + barbWave * hd.y * side,
            by + hd.y * barbLen * 0.5 - barbWave * hd.x * side,
            tipBx + barbWave, tipBy + barbWave,
          );
        }, 0.8, 0.4);
      }

      // --- 圆形眼睛（头部两侧偏后） ---
      const eyeFwd = -1;
      const eyeSpread = 5;
      for (const s of [-1, 1]) {
        const ex = drawJoints[0].x + hd.x * eyeFwd - hd.y * s * eyeSpread;
        const ey = drawJoints[0].y + hd.y * eyeFwd + hd.x * s * eyeSpread;

        ctx.save();
        ctx.fillStyle = 'rgba(0,255,255,0.15)';
        ctx.strokeStyle = 'rgba(0,255,255,0.4)';
        ctx.lineWidth = 0.6;
        ctx.shadowColor = 'rgba(0,255,255,0.5)';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(ex + hd.x * 0.8, ey + hd.y * 0.8, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(ex + hd.x * 1.2 - hd.y * s * 0.3, ey + hd.y * 1.2 + hd.x * s * 0.3, 0.6, 0, Math.PI * 2);
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

    // --- 贝塞尔曲线路径 ---
    const pathPoints = [
      { x: startX, y: startY },
      { x: vw * 0.2, y: vh * 0.65 },
      { x: vw * 0.4, y: vh * 0.35 },
      { x: centerX, y: centerY },
    ];

    const cubicBezier = (p0, p1, p2, p3, t) => {
      const u = 1 - t;
      return {
        x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
        y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
      };
    };

    const cubicBezierTangent = (p0, p1, p2, p3, t) => {
      const u = 1 - t;
      return {
        x: 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
        y: 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y),
      };
    };

    // 沿路径叠加正弦横向摆动，模拟鱼类游动
    const UNDULATION_FREQ = 3;
    const UNDULATION_AMP = 22;
    const pathWithUndulation = (p0, p1, p2, p3, t) => {
      const pos = cubicBezier(p0, p1, p2, p3, t);
      const tan = cubicBezierTangent(p0, p1, p2, p3, t);
      const tanLen = Math.sqrt(tan.x * tan.x + tan.y * tan.y) || 1;
      const nx = -tan.y / tanLen;
      const ny = tan.x / tanLen;
      const envelope = Math.sin(Math.PI * t) * (1 - t * t);
      const offset = UNDULATION_AMP * envelope * Math.sin(2 * Math.PI * UNDULATION_FREQ * t);
      return { x: pos.x + nx * offset, y: pos.y + ny * offset };
    };

    const progress = { value: 0 };
    const spiral = { angle: 0, radius: 35, phase: 'crawl' };
    let arrived = false;
    let animId;

    const loop = () => {
      if (spiral.phase === 'crawl') {
        const pos = pathWithUndulation(pathPoints[0], pathPoints[1], pathPoints[2], pathPoints[3], progress.value);
        mx = pos.x;
        my = pos.y;
      } else {
        mx = centerX + Math.cos(spiral.angle) * spiral.radius;
        my = centerY + Math.sin(spiral.angle) * spiral.radius;
      }
      updateSpine();
      updateTail();
      drawFish();
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

    // 阶段一：锦鲤游向中心
    tl.to(progress, {
      value: 1,
      duration: 2,
      ease: 'power2.inOut',
    });

    // 阶段二：在中心盘旋并消失
    tl.to(spiral, {
      angle: Math.PI * 2,
      radius: 0,
      duration: 1.2,
      ease: 'power1.in',
      onStart: () => { spiral.phase = 'spiral'; },
      onUpdate: function () { fishOpacity = 1 - this.progress(); },
      onComplete: () => {
        arrived = true;
        cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      },
    });

    // 圆环扩散 + 遮罩揭开
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
