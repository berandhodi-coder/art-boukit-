import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type BouquetParts = {
  blooms: THREE.BufferGeometry;
  greens: THREE.BufferGeometry;
  berries: THREE.BufferGeometry;
  core: THREE.BufferGeometry;
  paperOuter: THREE.BufferGeometry;
  paperInner: THREE.BufferGeometry;
  ribbon: THREE.BufferGeometry;
  stems: THREE.BufferGeometry;
};

type Rng = () => number;

type RosePalette = { base: string; deep: string };

type RoseTemplate = { geometry: THREE.BufferGeometry; depth: Float32Array };

const UP = new THREE.Vector3(0, 1, 0);
const TAU = Math.PI * 2;

const PALETTES = {
  burgundy: { base: "#8f2443", deep: "#2a0612" },
  rose: { base: "#ecb9c3", deep: "#b0647a" },
  mauve: { base: "#d79aaa", deep: "#8a4960" },
  ivory: { base: "#fbf2e3", deep: "#d9bd97" },
} satisfies Record<string, RosePalette>;

const LEAF_COLORS = ["#4f6649", "#5c7354", "#6a8061", "#465c43"];
const EUCALYPTUS_COLORS = ["#9db1a3", "#a9b5a0", "#8ea595", "#b4c1b1"];
const BERRY_COLORS = ["#c6a56b", "#b3915a", "#d4b780"];

function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smooth(value: number): number {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function gridIndices(rows: number, cols: number): number[] {
  const indices: number[] = [];
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const a = row * cols + col;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  return indices;
}

function gridGeometry(
  positions: Float32Array,
  rows: number,
  cols: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(gridIndices(rows, cols));
  geometry.computeVertexNormals();
  return geometry;
}

function withoutUv(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  geometry.deleteAttribute("uv");
  return geometry;
}

function paint(
  geometry: THREE.BufferGeometry,
  color: THREE.Color,
): THREE.BufferGeometry {
  const count = geometry.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function merge(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = mergeGeometries(geometries, false);
  geometries.forEach((geometry) => geometry.dispose());
  if (!merged) {
    throw new Error("Bouquet geometry could not be merged");
  }
  return merged;
}

function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

function direction(polar: number, azimuth: number): THREE.Vector3 {
  return new THREE.Vector3(
    Math.sin(polar) * Math.sin(azimuth),
    Math.cos(polar),
    Math.sin(polar) * Math.cos(azimuth),
  );
}

/**
 * A whole rose head as one spiral surface: `theta` winds through the petals from
 * the outer whorl to the heart, and `x` runs from the base of a petal to its lip.
 */
function createRoseTemplate(
  thetaSegments: number,
  radialSegments: number,
  turns: number,
  openness: number,
): RoseTemplate {
  const rows = thetaSegments + 1;
  const cols = radialSegments + 1;
  const positions = new Float32Array(rows * cols * 3);
  const depth = new Float32Array(rows * cols);
  const thetaMax = turns * Math.PI;

  let vertex = 0;
  for (let row = 0; row < rows; row++) {
    const progress = row / thetaSegments;
    const theta = progress * thetaMax;
    const phi = (Math.PI / 2) * openness * Math.exp(-theta / (8 * Math.PI));
    const wrapped = (3.6 * theta) % TAU;
    const lip =
      1 - 0.5 * Math.pow(1.25 * Math.pow(1 - wrapped / Math.PI, 2) - 0.25, 2);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    for (let col = 0; col < cols; col++) {
      const x = col / radialSegments;
      const curl = 1.95653 * x * x * Math.pow(1.27689 * x - 1, 2) * sinPhi;
      const radius = lip * (x * sinPhi + curl * cosPhi);
      const height = lip * (x * cosPhi - curl * sinPhi);

      positions[vertex * 3] = radius * Math.sin(theta);
      positions[vertex * 3 + 1] = height;
      positions[vertex * 3 + 2] = radius * Math.cos(theta);
      depth[vertex] = smooth(x) * (1 - 0.3 * progress);
      vertex++;
    }
  }

  return { geometry: gridGeometry(positions, rows, cols), depth };
}

function instanceRose(
  template: RoseTemplate,
  palette: RosePalette,
  matrix: THREE.Matrix4,
): THREE.BufferGeometry {
  const geometry = template.geometry.clone().applyMatrix4(matrix);
  const base = new THREE.Color(palette.base);
  const deep = new THREE.Color(palette.deep);
  const mixed = new THREE.Color();
  const colors = new Float32Array(template.depth.length * 3);

  for (let i = 0; i < template.depth.length; i++) {
    mixed.copy(deep).lerp(base, template.depth[i]);
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function roseMatrix(
  dir: THREE.Vector3,
  distance: number,
  scale: number,
  twist: number,
): THREE.Matrix4 {
  const orientation = new THREE.Quaternion()
    .setFromUnitVectors(UP, dir)
    .multiply(new THREE.Quaternion().setFromAxisAngle(UP, twist));
  return new THREE.Matrix4().compose(
    dir.clone().multiplyScalar(distance),
    orientation,
    new THREE.Vector3(scale, scale, scale),
  );
}

/** A folded leaf lying along +Y with its face towards +Z. */
function createLeafTemplate(): THREE.BufferGeometry {
  const lengthSegments = 10;
  const widthSegments = 4;
  const rows = lengthSegments + 1;
  const cols = widthSegments + 1;
  const positions = new Float32Array(rows * cols * 3);

  let vertex = 0;
  for (let row = 0; row < rows; row++) {
    const v = row / lengthSegments;
    const half = 0.27 * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.72)), 0.9);
    for (let col = 0; col < cols; col++) {
      const s = (col / widthSegments) * 2 - 1;
      positions[vertex * 3] = s * half;
      positions[vertex * 3 + 1] = v;
      positions[vertex * 3 + 2] = Math.abs(s) * half * 0.5 - 0.22 * v * v;
      vertex++;
    }
  }

  return gridGeometry(positions, rows, cols);
}

function leafMatrix(
  origin: THREE.Vector3,
  lengthDir: THREE.Vector3,
  faceHint: THREE.Vector3,
  length: number,
  width: number,
): THREE.Matrix4 {
  const y = lengthDir.clone().normalize();
  const z = faceHint.clone().addScaledVector(y, -faceHint.dot(y));
  if (z.lengthSq() < 1e-6) {
    z.set(1, 0, 0).addScaledVector(y, -y.x);
  }
  z.normalize();
  const x = new THREE.Vector3().crossVectors(y, z);

  return new THREE.Matrix4()
    .makeBasis(
      x.multiplyScalar(width),
      y.multiplyScalar(length),
      z.multiplyScalar(length),
    )
    .setPosition(origin);
}

function createWrapGeometry(options: {
  rimLift: number;
  rimRadius: number;
  phase: number;
}): THREE.BufferGeometry {
  const { rimLift, rimRadius, phase } = options;
  const angleSegments = 72;
  const heightSegments = 20;
  const rows = angleSegments + 1;
  const cols = heightSegments + 1;
  const positions = new Float32Array(rows * cols * 3);
  const bottom = -3.15;
  const neck = -2.3;
  const neckRadius = 0.33;

  let vertex = 0;
  for (let row = 0; row < rows; row++) {
    const angle = (row / angleSegments) * TAU;
    const back = (1 - Math.cos(angle)) / 2;
    const top =
      -0.5 +
      rimLift +
      0.5 * back +
      0.1 * Math.sin(5 * angle + phase) +
      0.05 * Math.sin(11 * angle + phase * 2);

    for (let col = 0; col < cols; col++) {
      const y = bottom + (top - bottom) * (col / heightSegments);
      let radius: number;
      if (y < neck) {
        radius = neckRadius + 0.09 * ((neck - y) / (neck - bottom));
      } else {
        const k = (y - neck) / (top - neck);
        radius =
          neckRadius +
          (rimRadius - neckRadius) * Math.pow(k, 1.2) +
          k * k *
            (0.09 * Math.sin(6 * angle + phase) +
              0.04 * Math.sin(13 * angle + phase * 1.7)) +
          0.14 * Math.pow(k, 6);
      }

      positions[vertex * 3] = radius * Math.sin(angle);
      positions[vertex * 3 + 1] = y;
      positions[vertex * 3 + 2] = radius * Math.cos(angle);
      vertex++;
    }
  }

  return gridGeometry(positions, rows, cols);
}

function createStrip(
  points: THREE.Vector3[],
  widthDir: THREE.Vector3,
  width: number,
): THREE.BufferGeometry {
  const positions = new Float32Array(points.length * 2 * 3);
  const offset = widthDir.clone().normalize().multiplyScalar(width / 2);

  points.forEach((point, index) => {
    positions[index * 6] = point.x - offset.x;
    positions[index * 6 + 1] = point.y - offset.y;
    positions[index * 6 + 2] = point.z - offset.z;
    positions[index * 6 + 3] = point.x + offset.x;
    positions[index * 6 + 4] = point.y + offset.y;
    positions[index * 6 + 5] = point.z + offset.z;
  });

  return gridGeometry(positions, points.length, 2);
}

function createRibbon(): THREE.BufferGeometry {
  const knotY = -2.3;
  const knotZ = 0.43;
  const parts: THREE.BufferGeometry[] = [];

  parts.push(
    withoutUv(
      new THREE.CylinderGeometry(0.362, 0.35, 0.24, 64, 1, true).translate(
        0,
        knotY,
        0,
      ),
    ),
  );

  parts.push(
    withoutUv(
      new THREE.SphereGeometry(0.09, 16, 12)
        .scale(1.15, 1.3, 0.8)
        .translate(0, knotY, knotZ),
    ),
  );

  for (const side of [-1, 1]) {
    const loop: THREE.Vector3[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      loop.push(
        new THREE.Vector3(
          side * 0.66 * Math.sin(Math.PI * t),
          knotY + 0.2 * Math.sin(Math.PI * t) + 0.05 * Math.sin(TAU * t),
          knotZ + 0.08 + 0.13 * Math.sin(TAU * t),
        ),
      );
    }
    parts.push(createStrip(loop, new THREE.Vector3(0, 0.94, 0.34), 0.21));

    const tail: THREE.Vector3[] = [];
    for (let i = 0; i <= 18; i++) {
      const t = i / 18;
      tail.push(
        new THREE.Vector3(
          side * (0.04 + 0.26 * t + 0.03 * Math.sin(5 * t)),
          knotY - 0.02 - 1.2 * t,
          knotZ + 0.02 + 0.1 * Math.sin(Math.PI * t * 1.3) - 0.06 * t,
        ),
      );
    }
    parts.push(createStrip(tail, new THREE.Vector3(1, 0.1, side * 0.3), 0.2));
  }

  return merge(parts);
}

function createStems(rng: Rng): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const top = -2.1;
  const bottom = -3.9;

  for (let i = 0; i < 18; i++) {
    const angle = rng() * TAU;
    const spread = Math.sqrt(rng()) * 0.22;
    const start = new THREE.Vector3(
      Math.sin(angle) * spread,
      top,
      Math.cos(angle) * spread,
    );
    const end = new THREE.Vector3(
      Math.sin(angle + 0.5) * spread * 1.55,
      bottom + rng() * 0.16,
      Math.cos(angle + 0.5) * spread * 1.55,
    );
    const axis = end.clone().sub(start);
    const length = axis.length();
    const matrix = new THREE.Matrix4().compose(
      start.clone().add(end).multiplyScalar(0.5),
      new THREE.Quaternion().setFromUnitVectors(UP, axis.normalize()),
      new THREE.Vector3(1, length, 1),
    );
    parts.push(
      withoutUv(new THREE.CylinderGeometry(0.03, 0.03, 1, 7)).applyMatrix4(
        matrix,
      ),
    );
  }

  return merge(parts);
}

function createBlooms(rng: Rng): THREE.BufferGeometry {
  const gardenRose = createRoseTemplate(180, 9, 14, 0.8);
  const sprayRose = createRoseTemplate(96, 6, 10, 0.72);
  const blooms: THREE.BufferGeometry[] = [];

  const rings: { polar: number; start: number; palettes: RosePalette[]; scale: number }[] = [
    { polar: 0, start: 0, palettes: [PALETTES.burgundy], scale: 0.76 },
    {
      polar: 0.62,
      start: 0.35,
      palettes: [
        PALETTES.rose,
        PALETTES.ivory,
        PALETTES.mauve,
        PALETTES.burgundy,
        PALETTES.rose,
      ],
      scale: 0.68,
    },
    {
      polar: 1.14,
      start: 0.14,
      palettes: [
        PALETTES.burgundy,
        PALETTES.rose,
        PALETTES.burgundy,
        PALETTES.ivory,
        PALETTES.burgundy,
        PALETTES.mauve,
        PALETTES.burgundy,
        PALETTES.rose,
      ],
      scale: 0.64,
    },
  ];

  for (const ring of rings) {
    ring.palettes.forEach((palette, index) => {
      const azimuth =
        ring.start + (index / ring.palettes.length) * TAU + (rng() - 0.5) * 0.12;
      const polar = ring.polar === 0 ? 0 : ring.polar + (rng() - 0.5) * 0.08;
      blooms.push(
        instanceRose(
          gardenRose,
          palette,
          roseMatrix(
            direction(polar, azimuth),
            1.22 + rng() * 0.08,
            ring.scale + (rng() - 0.5) * 0.08,
            rng() * TAU,
          ),
        ),
      );
    });
  }

  for (let i = 0; i < 8; i++) {
    const azimuth = 0.14 + ((i + 0.5) / 8) * TAU + (rng() - 0.5) * 0.14;
    blooms.push(
      instanceRose(
        sprayRose,
        PALETTES.ivory,
        roseMatrix(
          direction(1.42 + (rng() - 0.5) * 0.14, azimuth),
          1.62 + rng() * 0.1,
          0.34 + rng() * 0.05,
          rng() * TAU,
        ),
      ),
    );
  }

  for (let i = 0; i < 5; i++) {
    const azimuth = 0.35 + ((i + 0.5) / 5) * TAU + (rng() - 0.5) * 0.2;
    blooms.push(
      instanceRose(
        sprayRose,
        i % 2 === 0 ? PALETTES.ivory : PALETTES.rose,
        roseMatrix(
          direction(0.9 + (rng() - 0.5) * 0.1, azimuth),
          1.74 + rng() * 0.06,
          0.3 + rng() * 0.04,
          rng() * TAU,
        ),
      ),
    );
  }

  gardenRose.geometry.dispose();
  sprayRose.geometry.dispose();
  return merge(blooms);
}

function createGreens(rng: Rng): THREE.BufferGeometry {
  const leaf = createLeafTemplate();
  const disc = withoutUv(new THREE.CircleGeometry(0.5, 14).translate(0, 0.5, 0));
  const greens: THREE.BufferGeometry[] = [];

  const addLeaf = (matrix: THREE.Matrix4) => {
    greens.push(
      paint(
        leaf.clone().applyMatrix4(matrix),
        new THREE.Color(pick(LEAF_COLORS, rng)),
      ),
    );
  };

  const collarCount = 22;
  for (let i = 0; i < collarCount; i++) {
    const azimuth = (i / collarCount) * TAU + (rng() - 0.5) * 0.2;
    const length = 1.05 + rng() * 0.45;
    addLeaf(
      leafMatrix(
        direction(1.42 + rng() * 0.12, azimuth).multiplyScalar(1.35),
        direction(1.3 + rng() * 0.45, azimuth + (rng() - 0.5) * 0.5),
        UP,
        length,
        length * (1 + rng() * 0.35),
      ),
    );
  }

  for (let i = 0; i < 14; i++) {
    const azimuth = rng() * TAU;
    const polar = 0.3 + rng() * 0.85;
    const outward = direction(polar, azimuth);
    const length = 0.62 + rng() * 0.3;
    addLeaf(
      leafMatrix(
        outward.clone().multiplyScalar(1.5),
        outward
          .clone()
          .add(direction(Math.PI / 2, azimuth + 1.3).multiplyScalar(0.55)),
        direction(Math.PI / 2, azimuth + (rng() - 0.5)),
        length,
        length,
      ),
    );
  }

  const sprigCount = 9;
  for (let i = 0; i < sprigCount; i++) {
    const azimuth = (i / sprigCount) * TAU + (rng() - 0.5) * 0.35;
    const outward = direction(1.02 + rng() * 0.28, azimuth);
    const origin = outward.clone().multiplyScalar(1.45);
    const heading = direction(
      0.72 + rng() * 0.42,
      azimuth + (rng() - 0.5) * 0.5,
    );
    const length = 1.3 + rng() * 0.55;
    const sway = direction(Math.PI / 2, azimuth + Math.PI / 2).multiplyScalar(
      (rng() - 0.5) * 0.5,
    );
    const droop = new THREE.Vector3(0, -0.28 - rng() * 0.18, 0).add(sway);

    const pointAt = (t: number) =>
      origin
        .clone()
        .addScaledVector(heading, length * t)
        .addScaledVector(droop, t * t);

    const spine: THREE.Vector3[] = [];
    for (let step = 0; step <= 8; step++) {
      spine.push(pointAt(step / 8));
    }
    greens.push(
      paint(
        withoutUv(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(spine),
            10,
            0.014,
            5,
            false,
          ),
        ),
        new THREE.Color("#7f9482"),
      ),
    );

    const leafCount = 11;
    for (let k = 0; k < leafCount; k++) {
      const t = 0.16 + (k / (leafCount - 1)) * 0.84;
      const position = pointAt(t);
      const tangent = pointAt(Math.min(1, t + 0.05))
        .sub(pointAt(Math.max(0, t - 0.05)))
        .normalize();
      const face = position.clone().normalize().lerp(UP, 0.35).normalize();
      const sideways = new THREE.Vector3()
        .crossVectors(tangent, face)
        .normalize()
        .multiplyScalar(k % 2 === 0 ? 1 : -1);
      const size = (0.34 - 0.16 * t) * (0.85 + rng() * 0.3);

      greens.push(
        paint(
          disc
            .clone()
            .applyMatrix4(
              leafMatrix(
                position,
                sideways.addScaledVector(tangent, 0.55),
                face,
                size,
                size * 0.92,
              ),
            ),
          new THREE.Color(pick(EUCALYPTUS_COLORS, rng)),
        ),
      );
    }
  }

  leaf.dispose();
  disc.dispose();
  return merge(greens);
}

function createBerries(rng: Rng): THREE.BufferGeometry {
  const berries: THREE.BufferGeometry[] = [];

  for (let cluster = 0; cluster < 8; cluster++) {
    const azimuth = (cluster / 8) * TAU + 0.4 + (rng() - 0.5) * 0.4;
    const centre = direction(0.42 + rng() * 0.75, azimuth).multiplyScalar(
      1.98 + rng() * 0.1,
    );
    for (let i = 0; i < 11; i++) {
      const radius = 0.045 + rng() * 0.022;
      berries.push(
        paint(
          withoutUv(new THREE.SphereGeometry(radius, 8, 6)).translate(
            centre.x + (rng() - 0.5) * 0.3,
            centre.y + (rng() - 0.5) * 0.3,
            centre.z + (rng() - 0.5) * 0.3,
          ),
          new THREE.Color(pick(BERRY_COLORS, rng)),
        ),
      );
    }
  }

  return merge(berries);
}

export function buildBouquet(): BouquetParts {
  const rng = createRng(20261113);

  return {
    blooms: createBlooms(rng),
    greens: createGreens(rng),
    berries: createBerries(rng),
    core: new THREE.SphereGeometry(1.24, 28, 18).scale(1, 0.94, 1),
    paperOuter: createWrapGeometry({ rimLift: 0, rimRadius: 1.98, phase: 0.4 }),
    paperInner: createWrapGeometry({
      rimLift: 0.16,
      rimRadius: 1.9,
      phase: 2.3,
    }),
    ribbon: createRibbon(),
    stems: createStems(rng),
  };
}

export function disposeBouquet(parts: BouquetParts): void {
  Object.values(parts).forEach((geometry) => geometry.dispose());
}
