import type { Metadata } from 'next';
import ArchetypeQuizClient from '@/components/quiz/ArchetypeQuizClient';

export const metadata: Metadata = {
  title: 'Quick Light Check | 143 Leadership',
  description:
    'A quick 9-question Light Check that reveals your top leadership capacities. Takes 2 minutes. No account required.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Quick Light Check | 143 Leadership',
    description: '9 questions. 2 minutes. See where your leadership light is brightest.',
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
