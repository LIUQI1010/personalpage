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

    // --- 锦鲤参数（cursor 缩小版） ---
    const LERP = 0.12;
    const SPINE_COUNT = 8;
    const SPINE_GAP = 6;
    const TAIL_GAPS = [5, 4, 3];
    const MAX_BEND = 0.4;
    const SWIM_SPEED = 4;
    const SWIM_AMP = 3.5;

    // 锦鲤体型（缩小）
    const BODY_WIDTHS = [4, 6.5, 7.5, 7.5, 7, 5.5, 4, 3, 1.8, 1, 0.5, 0.2];

    // --- State ---
    let mx = -200, my = -200, prevMx = -200, prevMy = -200, active = false;
    let swimIntensity = 0; // 0=静止, 1=全速游动
    const spine = Array.from({ length: SPINE_COUNT }, () => ({ x: -200, y: -200 }));
    const tail = Array.from({ length: TAIL_GAPS.length + 1 }, () => ({ x: -200, y: -200 }));

    // --- Helpers ---
    const lerpVal = (a, b, t) => a + (b - a) * t;

    const clampAngle = (parentAng, childAng, maxBend) => {
      let diff = childAng - parentAng;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      if (Math.abs(diff) > maxBend) return parentAng + Math.sign(diff) * maxBend;
      return childAng;
    };

    const spineDir = (i) => {
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

    // --- Draw ---
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!active) return;

      // 根据移动速度调整游动强度
      const speed = Math.sqrt((mx - prevMx) ** 2 + (my - prevMy) ** 2);
      const targetIntensity = Math.min(speed / 15, 1); // 15px/帧时达到满强度
      swimIntensity = lerpVal(swimIntensity, targetIntensity, 0.05);
      prevMx = mx; prevMy = my;

      const time = performance.now() / 1000;
      const joints = [...spine, ...tail];

      // 游动波浪（carangiform：头部稳定，身体中段开始摆动，尾部最大）
      const idleAmp = 0.4;
      const amp = idleAmp + (SWIM_AMP - idleAmp) * swimIntensity;
      const spd = 2 + (SWIM_SPEED - 2) * swimIntensity;
      const drawJoints = joints.map((j, i) => {
        const perp = jointPerp(joints, i);
        const t = i / (joints.length - 1);
        // 前 20% 身体不动，之后平滑增大振幅
        const envelope = t < 0.2 ? 0 : Math.pow((t - 0.2) / 0.8, 1.3);
        const wave = Math.sin(time * spd - i * 0.7) * amp * envelope;
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

      // 钝圆鱼头
      const headTip = { x: drawJoints[0].x + hd.x * 2.5, y: drawJoints[0].y + hd.y * 2.5 };
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
      const finLen = 11;
      const finSpread = 8;
      const finWave = Math.sin(time * spd - joints.length * 0.8) * (1 + 2 * swimIntensity);
      // V 形缺口位置
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
        const finL = 10;
        const flapAng = Math.sin(time * 2.5 + side * 0.5) * 0.3;

        // 鳍的主方向（向外 + 略向后）
        const outX = perp.x * side * Math.cos(flapAng) - bDir.x * Math.sin(flapAng);
        const outY = perp.y * side * Math.cos(flapAng) - bDir.y * Math.sin(flapAng);
        const tipX = baseX + outX * finL;
        const tipY = baseY + outY * finL;

        // 扇形前缘和后缘
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

      // 主线
      ctx.save();
      ctx.strokeStyle = 'rgba(0,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(drawJoints[0].x, drawJoints[0].y);
      for (let i = 1; i < drawJoints.length; i++) ctx.lineTo(drawJoints[i].x, drawJoints[i].y);
      ctx.stroke();
      ctx.restore();

      // 分支 + 节点
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

      // --- 鱼须（锦鲤特征） ---
      const barbLen = 5;
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
      const eyeSpread = 4;
      for (const s of [-1, 1]) {
        const ex = drawJoints[0].x + hd.x * eyeFwd - hd.y * s * eyeSpread;
        const ey = drawJoints[0].y + hd.y * eyeFwd + hd.x * s * eyeSpread;

        // 眼白
        ctx.save();
        ctx.fillStyle = 'rgba(0,255,255,0.15)';
        ctx.strokeStyle = 'rgba(0,255,255,0.4)';
        ctx.lineWidth = 0.6;
        ctx.shadowColor = 'rgba(0,255,255,0.5)';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(ex, ey, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 瞳孔
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(ex + hd.x * 0.5, ey + hd.y * 0.5, 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 高光
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(ex + hd.x * 1.2 - hd.y * s * 0.3, ey + hd.y * 1.2 + hd.x * s * 0.3, 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // --- Events ---
    const initAt = (x, y) => {
      if (active) return;
      active = true;
      mx = x; my = y;
      for (let i = 0; i < spine.length; i++) {
        spine[i].x = x; spine[i].y = y + i * SPINE_GAP;
      }
      for (let i = 0; i < tail.length; i++) {
        const prev = i === 0 ? spine[spine.length - 1] : tail[i - 1];
        tail[i].x = prev.x;
        tail[i].y = prev.y + TAIL_GAPS[Math.min(i, TAIL_GAPS.length - 1)];
      }
    };

    const onMouse = (e) => {
      if (!active) initAt(e.clientX, e.clientY);
      mx = e.clientX; my = e.clientY;
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) {
        if (!active) initAt(t.clientX, t.clientY);
        mx = t.clientX; my = t.clientY;
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
