'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useId,
  createContext,
  useContext,
} from 'react';

/* ─── Types ────────────────────────────────────────────────────────────────── */

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
  /** Small colored dot beside the label */
  accent?: string;
  /** Any icon node (e.g. an SVG or <img>) */
  icon?: React.ReactNode;
}

export interface DropdownGroup<T extends string = string> {
  /** Optional group label — rendered as a divider if undefined */
  heading?: string;
  options: DropdownOption<T>[];
}

export type DropdownItem<T extends string = string> =
  | DropdownOption<T>
  | DropdownGroup<T>;

function isGroup<T extends string>(
  item: DropdownItem<T>
): item is DropdownGroup<T> {
  return 'options' in item;
}

/* ─── Context (for trigger ↔ menu wiring) ──────────────────────────────────── */

interface DropdownCtx {
  open: boolean;
  triggerId: string;
  menuId: string;
}

const DropdownContext = createContext<DropdownCtx | null>(null);

/* ─── Root ──────────────────────────────────────────────────────────────────── */

export interface DropdownProps<T extends string = string> {
  /** Flat list or grouped list */
  items: DropdownItem<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** Text shown in the trigger button */
  placeholder?: string;
  /** 'sm' | 'md' (default) | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Full width of the parent container */
  fullWidth?: boolean;
  /** Minimum width of the menu panel. Defaults to trigger width */
  menuMinWidth?: number;
  /** Align menu to right edge of trigger instead of left */
  alignRight?: boolean;
  disabled?: boolean;
  /** Additional class on the root wrapper */
  className?: string;
}

function DropdownInner<T extends string = string>({
  items,
  value,
  onChange,
  placeholder = 'Select…',
  size = 'md',
  fullWidth = false,
  menuMinWidth,
  alignRight = false,
  disabled = false,
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const menuId = useId();

  /* Flatten all options for lookup */
  const allOptions: DropdownOption<T>[] = items.flatMap((item) =>
    isGroup(item) ? item.options : [item]
  );

  const selected = allOptions.find((o) => o.value === value) ?? null;

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  function toggle() {
    if (!disabled) setOpen((prev) => !prev);
  }

  function select(val: T) {
    onChange(val);
    setOpen(false);
  }

  /* ── Size tokens ── */
  const sizeMap = {
    sm: { height: 32, fontSize: 13, padding: '0 10px', itemPadding: '7px 10px', iconSize: 14 },
    md: { height: 36, fontSize: 14, padding: '0 12px', itemPadding: '9px 12px', iconSize: 14 },
    lg: { height: 42, fontSize: 15, padding: '0 14px', itemPadding: '11px 14px', iconSize: 16 },
  };
  const sz = sizeMap[size];

  /* ── Styles ── */
  const rootStyle: React.CSSProperties = {
    position: 'relative',
    display: fullWidth ? 'block' : 'inline-block',
  };

  const triggerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: sz.height,
    padding: sz.padding,
    fontSize: sz.fontSize,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    width: fullWidth ? '100%' : undefined,
    minWidth: fullWidth ? undefined : 160,
    justifyContent: 'space-between',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-surface)',
    color: selected ? 'var(--text-primary)' : 'var(--text-tertiary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: `calc(100% + 4px)`,
    left: alignRight ? undefined : 0,
    right: alignRight ? 0 : undefined,
    zIndex: 200,
    minWidth: menuMinWidth ?? (fullWidth ? '100%' : 'max-content'),
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
    animation: 'dd-open 120ms ease',
  };

  /* ── Render flat items or groups ── */
  function renderOption(opt: DropdownOption<T>) {
    const isActive = opt.value === value;
    return (
      <button
        key={opt.value}
        type="button"
        role="option"
        aria-selected={isActive}
        onClick={() => select(opt.value)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: sz.itemPadding,
          fontSize: sz.fontSize,
          fontFamily: 'var(--font-sans)',
          fontWeight: isActive ? 500 : 400,
          textAlign: 'left',
          border: 'none',
          background: isActive ? 'var(--bg-selected)' : 'transparent',
          color: isActive ? 'var(--color-primary)' : 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'background-color var(--transition-fast)',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--bg-hover)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = isActive
            ? 'var(--bg-selected)'
            : 'transparent';
        }}
      >
        {opt.accent && (
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: opt.accent,
              flexShrink: 0,
            }}
          />
        )}
        {opt.icon && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              flexShrink: 0,
              fontSize: sz.iconSize,
              color: 'var(--text-secondary)',
            }}
          >
            {opt.icon}
          </span>
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {opt.label}
        </span>
      </button>
    );
  }

  function renderItems() {
    return items.map((item, idx) => {
      if (!isGroup(item)) {
        return renderOption(item);
      }

      return (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div
              aria-hidden="true"
              style={{
                height: 1,
                background: 'var(--border-subtle)',
                margin: '4px 0',
              }}
            />
          )}
          {item.heading && (
            <div
              style={{
                padding: '6px 12px 4px',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {item.heading}
            </div>
          )}
          {item.options.map(renderOption)}
        </React.Fragment>
      );
    });
  }

  return (
    <DropdownContext.Provider value={{ open, triggerId, menuId }}>
      <div ref={rootRef} style={rootStyle} className={className}>
        {/* Trigger */}
        <button
          id={triggerId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={menuId}
          aria-disabled={disabled}
          onClick={toggle}
          style={triggerStyle}
          onMouseEnter={(e) => {
            if (!disabled) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'var(--bg-hover)';
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--border-strong)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--bg-surface)';
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              'var(--border-default)';
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              overflow: 'hidden',
              flex: 1,
              minWidth: 0,
            }}
          >
            {selected?.accent && (
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: selected.accent,
                  flexShrink: 0,
                }}
              />
            )}
            {selected?.icon && (
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  flexShrink: 0,
                  fontSize: sz.iconSize,
                  color: 'var(--text-secondary)',
                }}
              >
                {selected.icon}
              </span>
            )}
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selected?.label ?? placeholder}
            </span>
          </span>

          {/* Chevron */}
          <svg
            aria-hidden="true"
            width={sz.iconSize}
            height={sz.iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              flexShrink: 0,
              color: 'var(--text-tertiary)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-base)',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Menu */}
        {open && (
          <div
            ref={menuRef}
            id={menuId}
            role="listbox"
            aria-labelledby={triggerId}
            style={menuStyle}
          >
            {renderItems()}
          </div>
        )}
      </div>

      {/* Keyframe — defined once, inert if already declared */}
      <style>{`
        @keyframes dd-open {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DropdownContext.Provider>
  );
}

/* ─── Exported wrapper so the generic type flows correctly ──────────────────── */

export function Dropdown<T extends string = string>(props: DropdownProps<T>) {
  return <DropdownInner {...props} />;
}

export default Dropdown;