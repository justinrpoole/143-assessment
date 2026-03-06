'use client';

import dynamic from 'next/dynamic';
import {
  VETERAN_RAYS,
  VETERAN_ECLIPSE,
  VETERAN_INDICES,
} from '@/components/cosmic/energy-star-chart-data';

const EnergyStarChart = dynamic(
  () => import('@/components/cosmic/EnergyStarChart'),
  { ssr: false }
);

export default function EnergyStarChartClient() {
  return (
    <EnergyStarChart
      mode="full"
      rays={VETERAN_RAYS}
      eclipse={VETERAN_ECLIPSE}
      indices={VETERAN_INDICES}
      overallScore={VETERAN_RAYS.R9?.score ?? 88}
    />
  );
}
