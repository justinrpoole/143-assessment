import type { Metadata } from 'next';
import ArchetypeQuizClient from '@/components/quiz/ArchetypeQuizClient';

export const metadata: Metadata = {
  title: 'Which Light Signature Are You? | 143 Leadership',
  description:
    'Discover your Light Signature in 2 minutes. 9 quick questions reveal your top leadership capacities and your unique archetype name.',
  openGraph: {
    title: 'Which Light Signature Are You?',
    description: '9 questions. 2 minutes. Discover your leadership archetype.',
  },
};

export default function QuizPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--bg-deep)' }}
    >
      <ArchetypeQuizClient />
    </main>
  );
}
