'use client';

import dynamic from 'next/dynamic';
import {
  SAMPLE_RAYS,
  SAMPLE_ECLIPSE,
  SAMPLE_INDICES,
} from '@/components/cosmic/energy-star-chart-data';

const EnergyStarChart = dynamic(
  () => import('@/components/cosmic/EnergyStarChart'),
  { ssr: false }
);

export default function EnergyStarChartClient() {
  return (
    <EnergyStarChart
      mode="preview"
      rays={SAMPLE_RAYS}
      eclipse={SAMPLE_ECLIPSE}
      indices={SAMPLE_INDICES}
      overallScore={SAMPLE_RAYS.R9?.score ?? 82}
    />
  );
}
