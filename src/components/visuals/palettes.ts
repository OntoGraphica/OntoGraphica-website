import type { SpiralPalette } from "./DotSpiral";

/** Ontographica red, carrying OntoCampus blue and OntoCandidate yellow through it. */
export const brandPalette: SpiralPalette = { stroke: "#f5253b", pulses: ["#4a7bf7", "#f2b630"], cursor: "#ff5a68" };

/** OntoCampus: cool white with a blue pulse. */
export const campusPalette: SpiralPalette = { stroke: "#eef1f6", pulses: ["#5b8bff"], cursor: "#5b8bff" };

/** OntoCandidate: amber with a warm white pulse. */
export const candidatePalette: SpiralPalette = { stroke: "#e8b342", pulses: ["#fff1cc"], cursor: "#f2cd78" };

/** Ontographica red only, for company pages. */
export const redPalette: SpiralPalette = { stroke: "#f5253b", pulses: ["#ff8a94"], cursor: "#ff5a68" };
