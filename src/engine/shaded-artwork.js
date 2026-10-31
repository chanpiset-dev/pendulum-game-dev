// Shaded Canvas artwork. Pure rendering: never modifies gameplay or storage.
const TAU = Math.PI * 2;
function path(c, pts, color, width = 3) {
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.stroke();
}
function disk(c, x, y, r, fill, stroke) {
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1.5;
    c.stroke();
  }
}
function ellipse(c, x, y, rx, ry, color) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, TAU);
  c.fillStyle = color;
  c.fill();
}
function rect(c, x, y, w, h, r, fill, stroke) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1.5;
    c.stroke();
  }
}
function grad(c, x1, y1, x2, y2, stops) {
  let g = c.createLinearGradient(x1, y1, x2, y2);
  stops.forEach(([n, v]) => g.addColorStop(n, v));
  return g;
}
const metalStops = [
  [0, "#f0f8ff"],
  [0.18, "#b9ccd9"],
  [0.45, "#546a7f"],
  [0.62, "#9caebc"],
  [1, "#26384b"],
];
function metal(c, x, y, w, h, r = 5) {
  rect(c, x + 2, y + 4, w, h, r, "#030b14");
  rect(c, x, y, w, h, r, grad(c, x, y, x, y + h, metalStops), "#6d849b");
}
function sphere(c, x, y, r, color, t) {
  const dx = -0.32;
  let g = c.createRadialGradient(x + r * dx, y - r * 0.4, r * 0.02, x, y, r);
  g.addColorStop(0, "#f2ffe9");
  g.addColorStop(0.14, color[0]);
  g.addColorStop(0.48, color[1]);
  g.addColorStop(0.84, color[2]);
  g.addColorStop(1, "#091c29");
  disk(c, x + 2, y + 4, r, "#0006");
  disk(c, x, y, r, g, "#a9e9e62b");
  ellipse(c, x - r * 0.28, y - r * 0.42, r * 0.17, r * 0.09, "#fff7");
}
const green = ["#bbff8e", "#55cf40", "#206d39"],
  blue = ["#a0e9ff", "#258add", "#163a82"],
  purple = ["#e6baff", "#9d5bdd", "#3d267e"];
function joint(c, x, y, r = 7) {
  disk(c, x, y, r, grad(c, x - r, y - r, x + r, y + r, metalStops), "#15273b");
  disk(c, x, y, r * 0.38, "#32495f", "#9db1c6");
}
function rod(c, x1, y1, x2, y2) {
  let len = Math.hypot(x2 - x1, y2 - y1);
  c.save();
  c.translate(x1, y1);
  c.rotate(Math.atan2(y2 - y1, x2 - x1));
  rect(
    c,
    0,
    -5,
    len,
    10,
    4,
    grad(c, 0, -5, 0, 5, [
      [0, "#5a7285"],
      [0.3, "#ecf6ff"],
      [0.58, "#a4bbca"],
      [1, "#2e4459"],
    ]),
    "#192f44",
  );
  c.restore();
}
function chain(c, points, color, t) {
  for (let i = 1; i < points.length; i++)
    rod(c, ...points[i - 1], ...points[i]);
  points.slice(0, -1).forEach((p) => joint(c, ...p));
  sphere(c, ...points.at(-1), 14, color, t);
}
function arrow(c, x, y, dx, dy, color) {
  path(
    c,
    [
      [x, y],
      [x + dx, y + dy],
    ],
    "#041223",
    7,
  );
  path(
    c,
    [
      [x, y],
      [x + dx, y + dy],
    ],
    color,
    4,
  );
  let a = Math.atan2(dy, dx);
  path(
    c,
    [
      [x + dx - 9 * Math.cos(a - 0.6), y + dy - 9 * Math.sin(a - 0.6)],
      [x + dx, y + dy],
      [x + dx - 9 * Math.cos(a + 0.6), y + dy - 9 * Math.sin(a + 0.6)],
    ],
    color,
    4,
  );
}
function ring(c, x, y, r, color, start = 0, end = TAU) {
  c.save();
  c.translate(x, y);
  c.beginPath();
  c.arc(2, 4, r, start, end);
  c.strokeStyle = "#020b17";
  c.lineWidth = 13;
  c.stroke();
  c.beginPath();
  c.arc(0, 0, r, start, end);
  c.strokeStyle = grad(c, -r, -r, r, r, [
    [0, color[0]],
    [0.5, color[1]],
    [1, color[2]],
  ]);
  c.lineWidth = 10;
  c.lineCap = "round";
  c.stroke();
  c.beginPath();
  c.arc(0, 0, r - 3, start, end);
  c.strokeStyle = color[0] + "99";
  c.lineWidth = 1.3;
  c.stroke();
  c.restore();
}
function pad(c, x, y, r, color, t) {
  disk(c, x + 2, y + 5, r + 6, "#020b15");
  disk(
    c,
    x,
    y,
    r + 6,
    grad(c, x - r, y - r, x + r, y + r, metalStops),
    "#9eb6c5",
  );
  disk(c, x, y, r, "#10283d");
  sphere(c, x, y, r - 3, color, t);
}
function shadow(c, x, y, w = 47) {
  const g = c.createRadialGradient(x, y, 1, x, y, w);
  g.addColorStop(0, "#0007");
  g.addColorStop(1, "#0000");
  c.save();
  c.translate(x, y);
  c.scale(1, 0.22);
  disk(c, 0, 0, w, g);
  c.restore();
}

function portal(c, p, t) {
  let col = p.targetId
    ? ["#b9ffff", "#2cd9f1", "#185b99"]
    : ["#eed4ff", "#ad71f5", "#54349a"];
  const r = p.r * 1.08;
  c.save();
  c.translate(p.x, p.y);
  c.scale(0.76, 1);
  let g = c.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, "#08192a");
  g.addColorStop(0.55, col[2] + "aa");
  g.addColorStop(1, col[1] + "aa");
  disk(c, 0, 0, r, g);
  c.save();
  c.beginPath();
  c.arc(0, 0, r - 4, 0, TAU);
  c.clip();
  for (let k = 0; k < 5; k++) {
    c.beginPath();
    for (let j = 0; j < 70; j++) {
      let u = j / 69,
        angle = u * TAU * 0.8 + (k * TAU) / 5 + t * 0.38,
        rr = (0.1 + u * 0.82) * r;
      let x = Math.cos(angle) * rr,
        y = Math.sin(angle) * rr;
      j ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.strokeStyle = col[0] + "20";
    c.lineWidth = 1;
    c.stroke();
  }
  for (let i = 0; i < 25; i++) {
    let phase = (i / 25 + t * 0.055) % 1,
      angle = i * 2.399 + t * 0.4,
      rr = r * (0.15 + 0.78 * phase),
      alpha = 0.15 + phase * 0.6;
    c.globalAlpha = alpha;
    disk(
      c,
      Math.cos(angle) * rr,
      Math.sin(angle) * rr,
      0.55 + phase * 0.65,
      col[0],
    );
  }
  c.globalAlpha = 1;
  c.restore();
  c.save();
  if (true) {
    c.shadowColor = col[1];
    c.shadowBlur = 12;
  }
  ring(c, 0, 0, r, col);
  c.shadowBlur = 0;
  c.beginPath();
  c.arc(0, 0, r * 0.86, -Math.PI * 0.85, Math.PI * 0.2);
  c.lineWidth = 1.2;
  c.strokeStyle = col[0] + "aa";
  c.stroke();
  c.restore();
  c.restore();
  c.fillStyle = "#d7e9fb";
  c.font = "bold 10px system-ui";
  c.textAlign = "center";
  void 0;
}
function blackHole(c, x, y, r, variant, t, glow = true) {
  c.save();
  c.translate(x, y);
  const hues = [
    ["#fff1b6", "#ffae51", "#b9482a"],
    ["#f3d7ff", "#b27af5", "#6336a8"],
    ["#fff6e5", "#edcf9b", "#916e45"],
    ["#deffff", "#68d5ff", "#437cd1"],
  ][variant];
  const aura = c.createRadialGradient(0, 0, r * 0.65, 0, 0, r * 2.2);
  aura.addColorStop(0, hues[1] + "45");
  aura.addColorStop(0.5, hues[2] + "15");
  aura.addColorStop(1, "#0000");
  if (glow) disk(c, 0, 0, r * 2.2, aura);
  function orbitalBand(front) {
    c.save();
    c.rotate(variant === 3 ? -0.28 : -0.17);
    c.scale(1, variant === 3 ? 0.42 : 0.3);
    for (let k = 0; k < 7; k++) {
      let rr = r * (1.2 + k * 0.09);
      c.beginPath();
      c.arc(0, 0, rr, front ? 0 : Math.PI, front ? Math.PI : TAU);
      c.lineWidth = r * (0.035 + (6 - k) * 0.008);
      c.strokeStyle = k < 2 ? hues[0] + "c0" : hues[1] + (k < 5 ? "99" : "44");
      if (glow) {
        c.shadowColor = hues[1];
        c.shadowBlur = 5;
      }
      c.stroke();
    }
    c.restore();
  }
  if (variant === 0 || variant === 3) {
    orbitalBand(false);
    c.save();
    c.scale(1, 0.95);
    c.beginPath();
    c.arc(0, 0, r * 1.17, Math.PI, TAU);
    c.lineWidth = r * 0.12;
    c.strokeStyle = hues[1] + "88";
    if (glow) {
      c.shadowBlur = r * 0.2;
      c.shadowColor = hues[1];
    }
    c.stroke();
    c.restore();
  }
  if (variant === 1) {
    for (let k = 0; k < 4; k++) {
      let pts = [];
      for (let j = 0; j < 75; j++) {
        let u = j / 74,
          rr = r * (1.05 + u * 0.85),
          a = (k * TAU) / 4 + u * 4.5 + t * 0.25;
        pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.88]);
      }
      path(c, pts, hues[1] + "77", r * 0.045);
    }
    for (let k = 0; k < 30; k++) {
      let u = (k / 30 - t * 0.045 + 10) % 1,
        rr = r * (1.06 + u * 0.8),
        a = k * 2.399 + u * 4 + t * 0.2;
      disk(c, Math.cos(a) * rr, Math.sin(a) * rr * 0.88, r * 0.014, hues[0]);
    }
  }
  if (variant === 2) {
    for (let k = 0; k < 44; k++) {
      let a = (k * TAU) / 44,
        inner = r * 1.05,
        outer = r * (1.15 + 0.14 * Math.sin(k * 2.7 + t * 0.45));
      path(
        c,
        [
          [Math.cos(a) * inner, Math.sin(a) * inner],
          [Math.cos(a) * outer, Math.sin(a) * outer],
        ],
        hues[1] + "44",
        r * 0.035,
      );
    }
  }
  // A black disk covers every rear layer so the center stays truly dark.
  disk(c, 0, 0, r, "#010207");
  c.beginPath();
  c.arc(0, 0, r * 1.025, 0, TAU);
  c.lineWidth = r * (variant === 2 ? 0.055 : 0.035);
  c.strokeStyle = hues[0];
  if (glow) {
    c.shadowBlur = r * 0.17;
    c.shadowColor = hues[1];
  }
  c.stroke();
  c.shadowBlur = 0;
  if (variant === 0 || variant === 3) {
    orbitalBand(true);
    disk(c, 0, 0, r * 0.84, "#010207");
    for (let k = 0; k < 13; k++) {
      let a = (k * TAU) / 13 + t * 0.5;
      c.save();
      c.rotate(-0.17);
      let px = Math.cos(a) * r * 1.59,
        py = Math.sin(a) * r * 0.45;
      if (py > 0 && Math.hypot(px, py) > r * 1.03)
        disk(c, px, py, r * 0.018, hues[0]);
      c.restore();
    }
  }
  if (variant === 2) {
    c.beginPath();
    c.arc(0, 0, r * 1.06, -2.7, -1.6);
    c.lineWidth = r * 0.07;
    c.strokeStyle = "#fff9e9";
    c.stroke();
  }
  c.restore();
}

const enamelMetal = [
  [0, "#e7f4fc"],
  [0.25, "#91a9bc"],
  [0.55, "#3e566e"],
  [0.75, "#7891a5"],
  [1, "#1a2c40"],
];
function targetRing(c, r, a, b, color, width) {
  c.beginPath();
  c.arc(0, 0, r, a, b);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.stroke();
}
function enamelTarget(c, x, y, r, design, hp = 1, impact = 0) {
  c.save();
  c.translate(x, y);
  c.scale(1 + impact * 0.07, 1 - impact * 0.12);
  let outer = r + (design === 2 ? 8 : 5);
  disk(c, 2, 7 + impact * 4, outer, "#020b16");
  disk(c, 0, 3, outer, grad(c, -r, -r, r, r, enamelMetal), "#183044");
  disk(
    c,
    0,
    0,
    r,
    grad(
      c,
      -r,
      -r,
      r,
      r,
      design === 1
        ? [
            [0, "#ec6671"],
            [0.5, "#c73445"],
            [1, "#7b2337"],
          ]
        : [
            [0, "#ffb3a8"],
            [0.3, "#eb4e5c"],
            [1, "#901b36"],
          ],
    ),
    "#f0909544",
  );
  if (design === 0 || design === 2) {
    for (let i = 4; i >= 1; i--) {
      let rr = (r * i) / 5,
        col =
          i % 2 === 0
            ? [
                [0, "#fffdf4"],
                [1, "#bdcbd5"],
              ]
            : [
                [0, "#ff777e"],
                [1, "#b6213f"],
              ];
      disk(c, 0, 0, rr, grad(c, -rr, -rr, rr, rr, col), "#ffffff22");
    }
    if (design === 0) {
      c.save();
      c.beginPath();
      c.arc(0, 0, r - 2, 0, TAU);
      c.clip();
      ellipse(c, -r * 0.18, -r * 0.65, r * 0.8, r * 0.17, "#ffffff20");
      c.restore();
    }
  }
  if (design === 1) {
    targetRing(c, r * 0.78, 0, TAU, "#efe8df", r * 0.12);
    disk(
      c,
      0,
      0,
      r * 0.43,
      grad(c, -r * 0.4, -r * 0.4, r * 0.4, r * 0.4, [
        [0, "#fff9e8"],
        [1, "#bec6cd"],
      ]),
    );
    disk(c, 0, 0, r * 0.18, "#c53747");
    for (let i = 0; i < 18; i++) {
      let a = (i * TAU) / 18;
      disk(
        c,
        Math.cos(a) * r * 0.94,
        Math.sin(a) * r * 0.94,
        r * 0.018,
        "#63203988",
      );
    }
  }
  if (design === 2) {
    for (let i = 0; i < 4; i++) {
      let a = Math.PI / 4 + (i * Math.PI) / 2,
        px = Math.cos(a) * (r + 3),
        py = Math.sin(a) * (r + 3);
      disk(c, px, py, 3.2, "#c4d5df", "#314b60");
      path(
        c,
        [
          [px - 1.5, py],
          [px + 1.5, py],
        ],
        "#3f586a",
        1,
      );
    }
    targetRing(c, r * 0.94, 0, TAU, "#76243a", 2);
  }
  if (design === 3) {
    c.save();
    c.shadowColor = "#8ce8ff";
    c.shadowBlur = 5;
    targetRing(c, r + 1, 0, TAU, "#81ccdf", 1.8);
    targetRing(c, r * 0.66, 0, TAU, "#fff3ec", r * 0.1);
    disk(c, 0, 0, r * 0.26, "#ffebe1");
    c.restore();
    c.save();
    c.beginPath();
    c.arc(0, 0, r, 0, TAU);
    c.clip();
    ellipse(c, -r * 0.17, -r * 0.49, r * 0.64, r * 0.29, "#ffffff24");
    c.restore();
  }
  const segments = Math.max(0, hp - 1);
  const armorStep = TAU / Math.max(2, segments);
  for (let i = 0; i < segments; i++) {
    let a = -Math.PI / 2 + i * armorStep;
    targetRing(c, r + 12, a + 0.11, a + armorStep - 0.11, "#04101d", 10);
    targetRing(
      c,
      r + 12,
      a + 0.11,
      a + armorStep - 0.11,
      grad(c, -r, -r, r, r, [
        [0, "#b3f2ff"],
        [0.4, "#369fd9"],
        [1, "#165087"],
      ]),
      7,
    );
    targetRing(c, r + 10, a + 0.15, a + armorStep - 0.15, "#c0f6ff77", 1);
  }
  c.restore();
}

export function paintShaded(c, kind, palette, t = 0, hits = 3, exit = false) {
  c.save();
  c.scale(0.48, 0.48);
  const id = kind;
  // Align decorative shells with the contact centers used by the live renderer.
  if (kind === "bomb") c.translate(0, -3.4166666667);
  if (kind === "spring") c.translate(0, 7.3333333333);
  if (kind === "slime" || kind === "resin") c.scale(70 / 84.48, 56 / 73.92);
  if (kind === "target" || kind === "armored") {
    enamelTarget(
      c,
      0,
      0,
      kind === "armored" ? 56 : 60,
      0,
      kind === "armored" ? Math.max(2, hits) : 1,
    );
    c.restore();
    return;
  }
  if (kind === "portal-in" || kind === "portal-out") {
    portal(
      c,
      {
        x: 0,
        y: 0,
        r: 54,
        targetId: kind === "portal-in" ? 1 : null,
        label: "",
      },
      t,
    );
    c.restore();
    return;
  }
  if (kind === "blackhole") {
    blackHole(c, 0, 0, 53.125, 1, t, true);
    c.restore();
    return;
  }

  let sway = Math.sin(t * 0.9) * 9;
  if (["pendulum", "multi", "clones"].includes(id)) {
    metal(c, -53, -103, 106, 9, 3);
    if (id === "pendulum")
      chain(
        c,
        [
          [0, -90],
          [-19 + sway, -7],
          [24 + sway, 65],
        ],
        green,
        t,
      );
    if (id === "multi")
      chain(
        c,
        [
          [0, -90],
          [-29, -42],
          [-16 + sway, 0],
          [18 + sway, 24],
          [48 + sway, 68],
        ],
        green,
        t,
      );
    if (id === "clones") {
      chain(
        c,
        [
          [0, -90],
          [-29 - sway, -13],
          [-53 - sway, 65],
        ],
        green,
        t,
      );
      chain(
        c,
        [
          [0, -90],
          [29 + sway, -13],
          [53 + sway, 65],
        ],
        purple,
        t,
      );
    }
  } else if (id === "target" || id === "armored") {
    let r = 61;
    disk(c, 3, 7, r + 5, "#030a15");
    disk(c, 0, 0, r + 3, grad(c, -60, -60, 60, 60, metalStops));
    for (let i = 5; i >= 1; i--) {
      let radius = i * 11;
      disk(
        c,
        0,
        0,
        radius,
        grad(
          c,
          -radius,
          -radius,
          radius,
          radius,
          i % 2
            ? [
                [0, "#ff9b97"],
                [0.3, "#f04754"],
                [1, "#8a172f"],
              ]
            : [
                [0, "#fffef6"],
                [1, "#bbc8d1"],
              ],
        ),
        "#ffffff35",
      );
    }
    if (id === "armored")
      for (let i = 0; i < 4; i++)
        ring(c, 0, 0, 76, blue, (i * TAU) / 4 + 0.1, ((i + 1) * TAU) / 4 - 0.1);
  } else if (id === "bomb") {
    sphere(c, 0, 18, 53, ["#9aafbe", "#354758", "#0c1422"], t);
    metal(c, -13, -42, 26, 17, 4);
    path(
      c,
      [
        [0, -42],
        [5, -66],
        [24, -76],
      ],
      "#563d24",
      8,
    );
    path(
      c,
      [
        [0, -42],
        [5, -66],
        [24, -76],
      ],
      "#dab271",
      4,
    );
    c.save();
    c.shadowColor = "#ffad45";
    c.shadowBlur = 18;
    disk(c, 24, -76, 5, "#fff3b1");
    for (let i = 0; i < 7; i++) {
      let a = (i * TAU) / 7 + t;
      path(
        c,
        [
          [24 + Math.cos(a) * 9, -76 + Math.sin(a) * 9],
          [24 + Math.cos(a) * 15, -76 + Math.sin(a) * 15],
        ],
        "#ffc561",
        2,
      );
    }
    c.restore();
    path(
      c,
      [
        [-8, 18],
        [8, 18],
      ],
      "#82939a",
      2,
    );
  } else if (id === "portal") {
    for (const [x, y, col, label] of [
      [-58, -7, ["#afffff", "#30d7f4", "#195da4"], "IN"],
      [58, 7, ["#eac0ff", "#a16afb", "#542795"], "OUT"],
    ]) {
      c.save();
      c.translate(x, y);
      c.scale(0.76, 1);
      let g = c.createRadialGradient(0, 0, 0, 0, 0, 61);
      g.addColorStop(0, "#030b1f");
      g.addColorStop(1, col[2] + "99");
      disk(c, 0, 0, 57, g);
      c.shadowColor = col[1];
      c.shadowBlur = 17;
      ring(c, 0, 0, 58, col);
      c.shadowBlur = 0;
      for (let i = 0; i < 12; i++) {
        let a = (i * TAU) / 12 + t * 0.25;
        disk(c, Math.cos(a) * 46, Math.sin(a) * 46, 1.1, col[0]);
      }
      c.restore();
      c.fillStyle = "#a9c9e2";
      c.font = "11px system-ui";
      c.textAlign = "center";
      c.fillText(label, x, y + 83);
    }
  } else if (id === "boost") {
    ring(c, 0, 0, 68, ["#a8ffe1", "#25c984", "#146a53"]);
    for (let x of [-20, 10]) {
      path(
        c,
        [
          [x - 8, -25],
          [x + 17, 0],
          [x - 8, 25],
        ],
        "#0b472c",
        13,
      );
      path(
        c,
        [
          [x - 8, -27],
          [x + 17, -2],
          [x - 8, 23],
        ],
        "#7af9ae",
        8,
      );
    }
  } else if (id === "laser") {
    metal(c, -105, -43, 29, 86);
    metal(c, 76, -43, 29, 86);
    for (let x of [-92, 89]) {
      disk(c, x, 0, 11, "#29384b", "#91a0b2");
      disk(c, x, 0, 6, "#ff6876");
    }
    c.save();
    c.shadowColor = "#ff375c";
    c.shadowBlur = 16;
    path(
      c,
      [
        [-76, 0],
        [76, 0],
      ],
      "#e53961",
      11,
    );
    path(
      c,
      [
        [-76, 0],
        [76, 0],
      ],
      "#ff96ab",
      5,
    );
    path(
      c,
      [
        [-76, 0],
        [76, 0],
      ],
      "#fff0ef",
      2,
    );
    c.restore();
  } else if (["bumper", "spring", "absorber", "moving"].includes(id)) {
    let x = id === "moving" ? Math.sin(t) * 37 : 0,
      y = id === "spring" ? -24 : 0;
    if (id === "moving") {
      c.setLineDash([4, 6]);
      path(
        c,
        [
          [-104, 0],
          [104, 0],
        ],
        "#5c7b96",
        2,
      );
      c.setLineDash([]);
      arrow(c, -96, 0, -16, 0, "#4ad7ed");
      arrow(c, 96, 0, 16, 0, "#4ad7ed");
    }
    if (id === "spring") {
      metal(c, -45, 74, 90, 12, 4);
      const pts = [];
      for (let i = 0; i <= 110; i++) {
        let a = (i / 110) * TAU * 4;
        pts.push([Math.cos(a) * 24, 22 + (i / 110) * 49 + Math.sin(a) * 4]);
      }
      path(c, pts, "#08111d", 10);
      path(c, pts, "#9eacb8", 6);
      path(
        c,
        pts.map(([x, y]) => [x - 1, y - 1]),
        "#e3f1fc",
        1.5,
      );
    }
    pad(
      c,
      x,
      y,
      51,
      id === "spring"
        ? ["#fff4a1", "#efb632", "#8b541d"]
        : id === "absorber"
          ? ["#c5d0d5", "#6d7c8c", "#303d50"]
          : blue,
      t,
    );
    if (id === "absorber")
      path(
        c,
        [
          [x - 17, y],
          [x + 17, y],
        ],
        "#f2f6ff",
        6,
      );
    else
      path(
        c,
        [
          [x - 17, y + 8],
          [x, y - 10],
          [x + 17, y + 8],
        ],
        "#e8f8ff",
        5,
      );
  } else if (id === "switch") {
    metal(c, -66, 35, 132, 27, 6);
    rect(
      c,
      -47,
      9,
      94,
      32,
      7,
      grad(c, 0, 9, 0, 41, [
        [0, "#ffe493"],
        [0.4, "#d79c2b"],
        [1, "#6b4521"],
      ]),
      "#f4ca73",
    );
    rect(
      c,
      -22,
      -49,
      44,
      65,
      7,
      grad(c, -22, -49, 22, 16, [
        [0, "#fff0a1"],
        [0.3, "#e7ac3a"],
        [1, "#91602c"],
      ]),
      "#e7bc69",
    );
    sphere(c, 45, 48, 5, green, t);
  } else if (id === "gate") {
    metal(c, 22, -91, 29, 183);
    c.save();
    c.beginPath();
    c.rect(25, -88, 23, 177);
    c.clip();
    for (let y = -110; y < 110; y += 29)
      path(
        c,
        [
          [17, y + 29],
          [55, y],
        ],
        "#eeb643",
        13,
      );
    c.restore();
    sphere(c, 36, -105, 7, green, t);
    metal(c, -84, 39, 54, 21);
    rect(c, -78, 31, 41, 12, 3, "#e9b34e", "#ffe49c");
    c.setLineDash([4, 5]);
    path(
      c,
      [
        [-30, 49],
        [4, 49],
        [4, 4],
        [18, 4],
      ],
      "#c5a05c",
      2,
    );
    c.setLineDash([]);
  } else if (["rail", "lift", "orbit"].includes(id)) {
    let px = 0,
      py = -34;
    if (id === "rail") {
      metal(c, -111, -42, 222, 19);
      px = Math.sin(t * 0.7) * 46;
      arrow(c, -64, -68, 126, 0, "#56dcec");
    }
    if (id === "lift") {
      metal(c, -9, -109, 18, 204);
      py = Math.sin(t * 0.7) * 33 - 20;
      arrow(c, -56, 50, 0, -105, "#56dcec");
    }
    if (id === "orbit") {
      px = Math.sin(t * 0.7) * 52;
      py = -37 + Math.cos(t * 0.7) * 23;
      c.save();
      c.setLineDash([4, 6]);
      c.beginPath();
      c.ellipse(0, -37, 62, 29, 0, 0, TAU);
      c.strokeStyle = "#7296af";
      c.lineWidth = 2;
      c.stroke();
      c.restore();
      metal(c, -100, py - 8, 200, 16);
      metal(c, px - 8, -100, 16, 129);
    }
    metal(c, px - 18, py - 16, 36, 32);
    chain(
      c,
      [
        [px, py],
        [px + 19 + sway * 0.5, py + 48],
        [px + 41 + sway, py + 93],
      ],
      green,
      t,
    );
  } else if (id === "wind") {
    for (let j = 0; j < 3; j++) {
      let yy = -48 + j * 48,
        pts = [];
      for (let i = 0; i <= 36; i++) {
        let x = -90 + i * 4.6;
        pts.push([x, yy + Math.sin(i * 0.22 - t * 0.8 + j) * 5]);
      }
      path(c, pts, "#051222", 11);
      path(
        c,
        pts,
        grad(c, -90, yy, 80, yy, [
          [0, "#30667f"],
          [0.4, "#88f4ff"],
          [1, "#27b9dc"],
        ]),
        6,
      );
      arrow(c, 76, pts.at(-1)[1], 25, 0, "#64e3f1");
    }
  } else if (id === "blackhole" || id === "repulsor") {
    let push = id === "repulsor",
      col = push
        ? ["#b7ffff", "#25cbe9", "#146b9b"]
        : ["#ecd0ff", "#ab69f0", "#3a246b"];
    c.save();
    c.shadowColor = col[1];
    c.shadowBlur = 22;
    ring(c, 0, 0, 55, col);
    c.shadowBlur = 0;
    if (push) sphere(c, 0, 0, 42, ["#d8ffff", "#32b4d2", "#113653"], t);
    else {
      disk(c, 0, 0, 48, "#02020c");
      for (let k = 0; k < 3; k++) {
        let pts = [];
        for (let i = 0; i < 50; i++) {
          let a = (k * TAU) / 3 + i * 0.12 + t * 0.15,
            r = 8 + i * 0.8;
          pts.push([Math.cos(a) * r, Math.sin(a) * r]);
        }
        path(c, pts, col[1], 2);
      }
    }
    c.restore();
    for (let i = 0; i < 4; i++) {
      let a = (i * TAU) / 4;
      arrow(
        c,
        Math.cos(a) * (push ? 72 : 97),
        Math.sin(a) * (push ? 72 : 97),
        Math.cos(a) * (push ? 24 : -24),
        Math.sin(a) * (push ? 24 : -24),
        col[1],
      );
    }
  } else if (id === "gravity") {
    for (let i = 0; i < 3; i++) {
      let x = -70 + i * 70;
      let up = i === 2;
      sphere(c, x, 33, 15, up ? green : ["#f2ffff", "#acbfce", "#415d75"], t);
      arrow(c, x, up ? 3 : -59, 0, up ? -63 : 63, up ? "#62edaa" : "#6fdef4");
      c.fillStyle = "#91adc5";
      c.font = "10px system-ui";
      c.textAlign = "center";
      c.fillText(["LOW", "HIGH", "INVERTED"][i], x, 78);
    }
  } else if (id === "slime" || id === "resin") {
    let sticky = id === "resin",
      col = sticky
        ? ["#fff1b1", "#edb33b", "#77501d"]
        : ["#a5f6ff", "#28c1d6", "#124e73"];
    rect(
      c,
      -88,
      -76,
      176,
      154,
      10,
      grad(c, -88, -76, 88, 78, [
        [0, col[0] + "38"],
        [0.45, col[1] + "22"],
        [1, col[2] + "bb"],
      ]),
      col[1] + "99",
    );
    let wave = [];
    for (let i = 0; i <= 44; i++) {
      let x = -88 + i * 4;
      wave.push([x, -65 + Math.sin(i * 0.35 + t * 0.8) * 4]);
    }
    path(c, wave, col[1], 7);
    path(
      c,
      wave.map(([x, y]) => [x, y - 2]),
      col[0],
      1.5,
    );
    for (let i = 0; i < 6; i++) {
      let x = -63 + i * 25,
        y = sticky
          ? -9 + Math.sin(i * 3) * 27
          : 15 + Math.sin(i * 2 + t * 0.35) * 34;
      if (sticky) {
        path(
          c,
          [
            [x, -64],
            [x, y],
          ],
          col[1] + "aa",
          5,
        );
        sphere(c, x, y, 6, [col[0], col[1], col[2]], t);
      } else {
        disk(c, x, y, 4 + (i % 3), col[1] + "88", col[0] + "aa");
        disk(c, x - 1, y - 2, 1, "#e0ffff");
      }
    }
    path(
      c,
      [
        [-85, 66],
        [85, 66],
      ],
      col[1],
      4,
    );
    path(
      c,
      [
        [-81, -47],
        [-81, 48],
      ],
      col[0] + "55",
      2,
    );
  }

  c.restore();
}
