#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const SVG_PATH = path.resolve(ROOT, 'public', 'nz.svg');
const OUTPUT_PATH = path.resolve(ROOT, 'public', 'nz_stars.json');

const SVG_VIEWBOX = { width: 1000, height: 1330 };
const TOTAL_STARS = 1000;

const SOUTH_ISLAND_REGIONS = new Set([
  'Southland',
  'Marlborough District',
  'Nelson City',
  'Tasman District',
  'West Coast',
  'Otago',
  'Canterbury',
]);

const NORTH_ISLAND_REGIONS = new Set([
  'Auckland',
  'Waikato',
  'Wellington',
  'Manawatu-Wanganui',
  'Taranaki',
  'Northland',
  'Bay of Plenty',
  'Gisborne District',
  "Hawke's Bay",
]);

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function extractPathTags(svgText) {
  const tags = svgText.match(/<path\b[^>]*>/g) || [];
  const items = [];
  for (const tag of tags) {
    const dMatch = tag.match(/\bd="([^"]+)"/);
    const nameMatch = tag.match(/\bname="([^"]+)"/);
    if (!dMatch) continue;
    const d = dMatch[1];
    const name = nameMatch ? nameMatch[1] : '';
    items.push({ d, name });
  }
  return items;
}

function extractLabelPoints(svgText) {
  const circles = svgText.match(/<circle\b[^>]*>/g) || [];
  const result = new Map();
  for (const tag of circles) {
    const cls = (tag.match(/\bclass="([^"]+)"/) || [])[1];
    const cx = (tag.match(/\bcx="([\-\d\.]+)"/) || [])[1];
    const cy = (tag.match(/\bcy="([\-\d\.]+)"/) || [])[1];
    if (!cls || cx === undefined || cy === undefined) continue;
    const x = Number(cx);
    const y = Number(cy);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      result.set(cls, { x, y });
    }
  }
  return result;
}

function pickRegionArrays(paths) {
  const south = [];
  const north = [];
  for (const { d, name } of paths) {
    if (SOUTH_ISLAND_REGIONS.has(name)) south.push({ d, name });
    else if (NORTH_ISLAND_REGIONS.has(name)) north.push({ d, name });
  }
  return { south, north };
}

// --- Minimal path parser for M/L/H/V/Z (and lowercase variants). ---
function tokenizePathData(d) {
  const tokens = [];
  let i = 0;
  const isCmd = c => /[MLHVZmlhvz]/.test(c);
  const numRe = /[-+]?\d*\.?\d+(?:e[-+]?\d+)?/iy;
  while (i < d.length) {
    const c = d[i];
    if (isCmd(c)) {
      tokens.push({ type: 'cmd', value: c });
      i++;
      continue;
    }
    if (c === ' ' || c === ',' || c === '\n' || c === '\t') {
      i++;
      continue;
    }
    numRe.lastIndex = i;
    const m = numRe.exec(d);
    if (m) {
      tokens.push({ type: 'num', value: parseFloat(m[0]) });
      i = numRe.lastIndex;
    } else {
      // skip unknown char
      i++;
    }
  }
  return tokens;
}

function parseToPolylines(d) {
  const tokens = tokenizePathData(d);
  const polylines = [];
  let curr = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  let currentPoly = null;
  let i = 0;

  function ensurePoly() {
    if (!currentPoly) currentPoly = [];
  }

  while (i < tokens.length) {
    const tok = tokens[i++];
    if (!tok || tok.type !== 'cmd') continue;
    const cmd = tok.value;
    const isRel = cmd === cmd.toLowerCase();
    switch (cmd.toLowerCase()) {
      case 'm': {
        // first pair -> move, subsequent pairs -> implicit lineto
        if (i + 1 >= tokens.length) break;
        const x = tokens[i++]?.value;
        const y = tokens[i++]?.value;
        if (typeof x !== 'number' || typeof y !== 'number') break;
        if (isRel) {
          curr = { x: curr.x + x, y: curr.y + y };
        } else {
          curr = { x, y };
        }
        // end previous polyline
        if (currentPoly && currentPoly.length > 1) polylines.push(currentPoly);
        currentPoly = [];
        start = { ...curr };
        ensurePoly();
        currentPoly.push({ ...curr });
        // subsequent pairs
        while (i + 1 < tokens.length && tokens[i].type === 'num' && tokens[i + 1].type === 'num') {
          const nx = tokens[i++]?.value;
          const ny = tokens[i++]?.value;
          const pt = isRel ? { x: curr.x + nx, y: curr.y + ny } : { x: nx, y: ny };
          curr = pt;
          currentPoly.push({ ...curr });
        }
        break;
      }
      case 'l': {
        while (i + 1 < tokens.length && tokens[i].type === 'num' && tokens[i + 1].type === 'num') {
          ensurePoly();
          const dx = tokens[i++]?.value;
          const dy = tokens[i++]?.value;
          const pt = isRel ? { x: curr.x + dx, y: curr.y + dy } : { x: dx, y: dy };
          curr = pt;
          currentPoly.push({ ...curr });
        }
        break;
      }
      case 'h': {
        while (i < tokens.length && tokens[i].type === 'num') {
          ensurePoly();
          const dx = tokens[i++]?.value;
          const pt = isRel ? { x: curr.x + dx, y: curr.y } : { x: dx, y: curr.y };
          curr = pt;
          currentPoly.push({ ...curr });
        }
        break;
      }
      case 'v': {
        while (i < tokens.length && tokens[i].type === 'num') {
          ensurePoly();
          const dy = tokens[i++]?.value;
          const pt = isRel ? { x: curr.x, y: curr.y + dy } : { x: curr.x, y: dy };
          curr = pt;
          currentPoly.push({ ...curr });
        }
        break;
      }
      case 'z': {
        if (currentPoly && currentPoly.length > 0) {
          currentPoly.push({ ...start });
          polylines.push(currentPoly);
        }
        currentPoly = null;
        curr = { ...start };
        break;
      }
      default: {
        // unsupported commands -> bail by ending current polyline
        if (currentPoly && currentPoly.length > 1) polylines.push(currentPoly);
        currentPoly = null;
        // skip any following numbers
        while (i < tokens.length && tokens[i].type === 'num') i++;
        break;
      }
    }
  }

  if (currentPoly && currentPoly.length > 1) polylines.push(currentPoly);
  return polylines;
}

function lengthOfPolylines(polys) {
  let total = 0;
  for (const poly of polys) {
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1];
      const b = poly[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      total += Math.hypot(dx, dy);
    }
  }
  return total;
}

function pointAtLength(polys, dist) {
  let acc = 0;
  for (const poly of polys) {
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1];
      const b = poly[i];
      const seg = Math.hypot(b.x - a.x, b.y - a.y);
      if (acc + seg >= dist) {
        const t = (dist - acc) / seg;
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      }
      acc += seg;
    }
  }
  // if overflow, return last point
  const lastPoly = polys[polys.length - 1];
  return lastPoly[lastPoly.length - 1];
}

function buildRegionEntries(regions) {
  const entries = [];
  for (const r of regions) {
    const polys = parseToPolylines(r.d);
    const length = lengthOfPolylines(polys);
    if (length > 1) {
      entries.push({ name: r.name, polys, length });
    }
  }
  return entries;
}

function gaussianWeight(dx, dy, sigma) {
  const s2 = sigma * sigma;
  return Math.exp(-(dx * dx + dy * dy) / (2 * s2));
}

function generateStars(entries, cityPoints) {
  const totalLen = entries.reduce((s, e) => s + e.length, 0);
  if (totalLen <= 0) return [];

  const target = TOTAL_STARS;
  const stars = [];
  const sigma = 60; // 城市聚集半径（SVG像素）
  const amps = [
    { key: 'Auckland', amp: 0.8 },
    { key: 'Wellington', amp: 0.8 },
    { key: 'Canterbury', amp: 0.6 }, // 用区域中心近似基督城
  ];

  // 预先构建累积长度用于按长度选择路径
  const cumulative = [];
  let acc = 0;
  for (const e of entries) {
    acc += e.length;
    cumulative.push(acc);
  }

  function pickEntryByLength() {
    const r = Math.random() * totalLen;
    let i = 0;
    while (i < cumulative.length && r > cumulative[i]) i++;
    return entries[Math.min(i, entries.length - 1)];
  }

  // 接受-拒绝采样，叠加城市高斯权重
  const maxIters = target * 200; // 上限避免死循环
  let iters = 0;
  while (stars.length < target && iters < maxIters) {
    iters++;
    const entry = pickEntryByLength();
    const t = Math.random() * entry.length;
    const pt = pointAtLength(entry.polys, t);
    const x = pt.x;
    const y = pt.y;

    let s = 0;
    for (const { key, amp } of amps) {
      const c = cityPoints.get(key);
      if (!c) continue;
      s += amp * gaussianWeight(x - c.x, y - c.y, sigma);
    }
    // 将 s 压到 [0,1]，并给一个基础接受率
    const p = Math.min(1, 0.25 + 0.75 * Math.min(1, s));
    if (Math.random() <= p) {
      stars.push({ x, y });
    }
  }

  if (stars.length < target) {
    console.warn(`Accepted ${stars.length}/${target}. Filling remainder uniformly.`);
    // 兜底均匀填充
    while (stars.length < target) {
      const entry = pickEntryByLength();
      const t = Math.random() * entry.length;
      const pt = pointAtLength(entry.polys, t);
      stars.push({ x: pt.x, y: pt.y });
    }
  }

  return stars;
}

function main() {
  const svg = readText(SVG_PATH);
  const pathItems = extractPathTags(svg);
  const { south, north } = pickRegionArrays(pathItems);
  console.log(
    `Found path tags: ${pathItems.length}, south: ${south.length}, north: ${north.length}`
  );
  if (south.length === 0 && north.length === 0) {
    console.error('No island paths found.');
    process.exit(1);
  }
  const southEntries = buildRegionEntries(south);
  const northEntries = buildRegionEntries(north);
  const allEntries = [...southEntries, ...northEntries];
  const totalLen = allEntries.reduce((s, e) => s + e.length, 0);
  console.log(
    `Entries south=${southEntries.length}, north=${northEntries.length}, totalLen=${Math.round(totalLen)}`
  );

  const labelPoints = extractLabelPoints(svg);
  // 生成星星（SVG坐标系）
  const stars = generateStars(allEntries, labelPoints);

  const out = {
    version: 1,
    coordSpace: 'svg',
    svgSize: { width: SVG_VIEWBOX.width, height: SVG_VIEWBOX.height },
    total: stars.length,
    stars,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out), 'utf8');
  console.log(`Wrote ${stars.length} stars to ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main();
