// src/lib/calc/volume.ts
// Pool volume calculation engine (PoolTechTools v5.0 Section 7).
// All inputs normalized to feet/gallons internally. Rounding only at display boundary.

export type PoolShape = 'rectangle' | 'square' | 'round' | 'oval' | 'kidney' | 'irregular';

export interface CrossSection {
  positionFt: number; // longitudinal position from 0..length
  widthFt: number;
}

export interface VolumeInput {
  shape: PoolShape;
  // dimensions already normalized to feet
  lengthFt?: number;
  widthFt?: number;
  sideFt?: number;
  diameterFt?: number;
  shallowDepthFt?: number;
  deepDepthFt?: number;
  averageDepthOverrideFt?: number;
  estimatedSurfaceAreaSqFt?: number;
  kidneyMethod?: 'trapezoidal' | 'twoSemicircle';
  kidneyCrossSections?: CrossSection[];
  // two-semicircle decomposition
  rectLengthFt?: number;
  rectWidthFt?: number;
  semiDiameterFt?: number;
}

export interface VolumeResult {
  gallons: number; // full precision
  cubicFeet: number;
  liters: number;
  formula: string;
  measurementSummary: string;
  warnings: string[];
}

const GAL_PER_CUFT = 7.48052;
const LITERS_PER_GAL = 3.78541;

function avgDepth(i: VolumeInput): number {
  if (i.averageDepthOverrideFt && i.averageDepthOverrideFt > 0) return i.averageDepthOverrideFt;
  if (i.shallowDepthFt && i.deepDepthFt) return (i.shallowDepthFt + i.deepDepthFt) / 2;
  if (i.shallowDepthFt) return i.shallowDepthFt;
  if (i.deepDepthFt) return i.deepDepthFt;
  throw new Error('Missing depth');
}

export function calculateVolume(input: VolumeInput): VolumeResult {
  const warnings: string[] = [];
  const d = avgDepth(input);
  let cubicFeet = 0;
  let formula = '';

  switch (input.shape) {
    case 'rectangle': {
      const L = input.lengthFt!, W = input.widthFt!;
      cubicFeet = L * W * d;
      formula = `V = L x W x D_avg = ${L} x ${W} x ${d}`;
      break;
    }
    case 'square': {
      const s = input.sideFt!;
      cubicFeet = s * s * d;
      formula = `V = side^2 x D_avg = ${s}^2 x ${d}`;
      break;
    }
    case 'round': {
      const r = input.diameterFt! / 2;
      cubicFeet = Math.PI * r * r * d;
      formula = `V = pi x r^2 x D_avg = pi x ${r}^2 x ${d}`;
      break;
    }
    case 'oval': {
      const L = input.lengthFt!, W = input.widthFt!;
      cubicFeet = (Math.PI / 4) * L * W * d;
      formula = `V = (pi/4) x L x W x D_avg`;
      break;
    }
    case 'kidney': {
      if (input.kidneyMethod === 'twoSemicircle') {
        const rL = input.rectLengthFt!, rW = input.rectWidthFt!, rD = (input.shallowDepthFt ?? d);
        const semiR = input.semiDiameterFt!;
        const rectVol = rL * rW * rD;
        const semiVol = 2 * (0.5 * Math.PI * semiR * semiR * rD); // two semicircles = one circle
        cubicFeet = rectVol + semiVol;
        formula = `V = (rect) + (2 semicircles)`;
      } else {
        const cs = input.kidneyCrossSections!;
        // validate
        if (cs.length < 3) throw new Error('Kidney requires at least 3 cross-sections');
        if (cs[0].positionFt !== 0) throw new Error('First cross-section position must be 0');
        const L = input.lengthFt!;
        if (Math.abs(cs[cs.length - 1].positionFt - L) > 0.01) throw new Error('Last cross-section position must equal length');
        for (let i = 1; i < cs.length; i++) {
          if (cs[i].positionFt <= cs[i - 1].positionFt) throw new Error('Cross-section positions must be strictly increasing');
          if (cs[i].widthFt <= 0) throw new Error('Widths must be positive');
        }
        // trapezoidal integration
        let area = 0;
        for (let i = 0; i < cs.length - 1; i++) {
          area += ((cs[i].widthFt + cs[i + 1].widthFt) / 2) * (cs[i + 1].positionFt - cs[i].positionFt);
        }
        cubicFeet = area * d;
        formula = `V = trapezoidal surface area x D_avg`;
        warnings.push('Kidney pool volume is an estimate based on measured cross-sections.');
      }
      break;
    }
    case 'irregular': {
      const sa = input.estimatedSurfaceAreaSqFt!;
      cubicFeet = sa * d;
      formula = `V = estimated surface area x D_avg`;
      warnings.push('Irregular pool volume is an estimate based on user-entered surface area.');
      break;
    }
  }

  const gallons = cubicFeet * GAL_PER_CUFT;
  const liters = gallons * LITERS_PER_GAL;
  return {
    gallons,
    cubicFeet,
    liters,
    formula,
    measurementSummary: `${input.shape}: ${cubicFeet.toFixed(2)} cu ft`,
    warnings,
  };
}

// Display helpers
export function displayGallons(g: number): string {
  if (g >= 100) return (Math.round(g / 10) * 10).toLocaleString("en-US") + " gal";
  return Math.round(g).toLocaleString("en-US") + " gal";
}
