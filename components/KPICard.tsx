'use client';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  status?: 'green' | 'yellow' | 'red' | 'neutral';
  trend?: number;
  loading?: boolean;
  index?: number;
}

const statusColors = {
  green: { dot: '#4ade9a', bg: 'rgba(74,222,154,0.06)', border: 'rgba(74,222,154,0.15)' },
  yellow: { dot: '#f5c542', bg: 'rgba(245,197,66,0.06)', border: 'rgba(245,197,66,0.15)' },
  red: { dot: '#f55a5a', bg: 'rgba(245,90,90,0.06)', border: 'rgba(245,90,90,0.15)' },
  neutral: { dot: '#8888aa', bg: 'rgba(136,136,170,0.04)', border: 'rgba(136,136,170,0.1)' },
};

export default function KPICard({
  title, value, subtitle, status = 'neutral', trend, loading, index = 0
}: KPICardProps) {
  const colors = statusColors[status];

  if (loading) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 32, width: '80%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 10, width: '40%' }} />
      </div>
    );
  }

  return (
    <div
      className={`fade-up stagger-${index + 1}`}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Status dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{
          width: 7, height: 7,
          borderRadius: '50%',
          background: colors.dot,
          boxShadow: `0 0 6px ${colors.dot}`,
          animation: status !== 'neutral' ? 'pulse-dot 2s ease-in-out infinite' : 'none',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>{title}</span>
      </div>

      {/* Value */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 32,
        fontWeight: 600,
        color: colors.dot,
        lineHeight: 1,
        marginBottom: 8,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>

      {/* Subtitle / trend */}
      {(subtitle || trend !== undefined) && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          {trend !== undefined && (
            <span style={{ color: trend >= 0 ? '#f55a5a' : '#4ade9a' }}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}