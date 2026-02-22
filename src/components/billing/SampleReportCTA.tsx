'use client';

import { useState } from 'react';
import InlineCheckoutModal from '@/components/billing/InlineCheckoutModal';

interface SampleReportCTAProps {
  primaryLabel: string;
  secondaryLabel: string;
}

export default function SampleReportCTA({ primaryLabel, secondaryLabel }: SampleReportCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary"
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-watch"
        >
          {secondaryLabel}
        </button>
      </div>

      <InlineCheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cancelUrl="/sample-report"
      />
    </>
  );
}
