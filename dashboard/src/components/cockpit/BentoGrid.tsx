import React from 'react';

interface BentoPodProps {
  idPrefix: string;
  title: string;
  statusBadge?: string;
  children: React.ReactNode;
  className?: string;
  actionSlot?: React.ReactNode;
}

export const BentoPod: React.FC<BentoPodProps> = ({
  idPrefix,
  title,
  statusBadge,
  children,
  className = '',
  actionSlot,
}) => {
  return (
    <div className={`hud-card p-4 flex flex-col relative overflow-hidden ${className}`}>
      {/* Pod Top Header Bar */}
      <div className="flex items-center justify-between border-b border-hud-border/40 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-hud-accent font-semibold">
            [{idPrefix}]
          </span>
          <h3 className="font-serif text-sm font-semibold tracking-wide text-hud-text-primary">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[2px] bg-hud-status-badge text-hud-accent border border-hud-border/70">
              {statusBadge}
            </span>
          )}
          {actionSlot}
        </div>
      </div>

      {/* Pod Content */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Corner Hairline Accent Marks */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-hud-accent" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-hud-accent" />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-hud-accent" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-hud-accent" />
    </div>
  );
};
