export default function AuthDivider({ label = 'ou' }: { label?: string }) {
  return (
    <div className="relative flex items-center gap-4 py-1">
      <div className="flex-grow h-px bg-white/10" />
      <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest shrink-0">
        {label}
      </span>
      <div className="flex-grow h-px bg-white/10" />
    </div>
  );
}
