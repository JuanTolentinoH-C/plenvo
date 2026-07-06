type CoverageBarProps = {
  pct: number; // 0..100
};

/**
 * Barra horizontal que muestra el % de cobertura de inversión.
 * - 100%: llena con gradiente Plenvo
 * - <100%: mitad con gradiente, mitad gris
 */
export function CoverageBar({ pct }: CoverageBarProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-2 rounded-full bg-plenvo-gray-300 overflow-hidden"
    >
      <div
        className="absolute inset-y-0 left-0 plenvo-gradient-bg rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
