'use client';

interface ReflectionInputProps {
  itemId: string;
  value: string;
  onChange: (itemId: string, value: string) => void;
  placeholder?: string;
}

export default function ReflectionInput({ itemId, value, onChange, placeholder }: ReflectionInputProps) {
  const charCount = value.length;

  return (
    <div className="space-y-3">
      <p className="text-sm italic" style={{ color: 'var(--text-on-dark-muted)' }}>
        Use one real moment. What happened, what did you do, and what changed?
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(itemId, e.target.value)}
        placeholder={placeholder || 'A few direct sentences. Specific beats polished.'}
        aria-label="Use one real moment. What happened, what did you do, and what changed?"
        rows={4}
        className="w-full resize-y rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-brand-gold/40"
        style={{
          background: 'var(--surface-glass)',
          borderColor: 'var(--surface-border)',
          color: 'var(--text-on-dark)',
        }}
      />

      <div className="flex justify-end">
        <span className="text-xs" style={{ color: charCount > 50 ? 'var(--text-on-dark-secondary)' : 'var(--text-on-dark-muted)' }}>
          {charCount > 0 ? `${charCount} characters` : ''}
        </span>
      </div>
    </div>
  );
}
