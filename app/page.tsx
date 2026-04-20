'use client';

import { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import KPICard from '@/components/KPICard';
import ChatWidget from '@/components/ChatWidget';
import { sendMessage, getSessionId } from '@/lib/api';

// Static chart data using seeded dummy values
const lossRatioByVehicle = [
  { name: 'Pickup', value: 58, fill: '#f55a5a' },
  { name: 'SUV', value: 47, fill: '#f5c542' },
  { name: 'Sedan', value: 38, fill: '#4ade9a' },
  { name: 'Luxury', value: 42, fill: '#4ade9a' },
];

const monthlyTrend = [
  { month: 'Nov', claims: 18200, premium: 42000 },
  { month: 'Dec', claims: 22400, premium: 44500 },
  { month: 'Jan', claims: 19800, premium: 43200 },
  { month: 'Feb', claims: 25100, premium: 45800 },
  { month: 'Mar', claims: 21300, premium: 46200 },
  { month: 'Apr', claims: 23700, premium: 47100 },
];

const agentPerformance = [
  { name: 'Rima H.', lossRatio: 29.8, policies: 76 },
  { name: 'Ahmad K.', lossRatio: 38.5, policies: 142 },
  { name: 'Faisal O.', lossRatio: 44.1, policies: 187 },
  { name: 'Sara M.', lossRatio: 51.2, policies: 98 },
  { name: 'Khaled N.', lossRatio: 58.3, policies: 53 },
];

const COLORS = ['#f55a5a', '#f5c542', '#4ade9a', '#60a5fa'];

function getLossStatus(ratio: number): 'green' | 'yellow' | 'red' {
  if (ratio < 45) return 'green';
  if (ratio <= 50) return 'yellow';
  return 'red';
}

export default function Dashboard() {
  const [kpiLoading, setKpiLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'chat'>('overview');

  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-JO', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Amman'
      }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            MED<span style={{ color: 'var(--accent)' }}>GULF</span>
          </div>
          <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}>ANALYTICS PLATFORM</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              LIVE · {currentTime} AST
            </span>
          </div>
          <div style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-secondary)',
          }}>
            PILOT v0.1
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <div style={{
        padding: '0 32px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 0,
        background: 'var(--bg-secondary)',
      }}>
        {(['overview', 'agents', 'chat'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>

        {activeTab === 'overview' && (
          <>
            {/* KPI Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              marginBottom: 32,
            }}>
              <KPICard
                title="Overall Loss Ratio"
                value="44.8%"
                subtitle="vs 47.2% last quarter"
                status="yellow"
                trend={-2.4}
                index={0}
              />
              <KPICard
                title="Outstanding Claims"
                value="284.500 JOD"
                subtitle="38 open claims"
                status="red"
                index={1}
              />
              <KPICard
                title="Recovery Rate"
                value="67.3%"
                subtitle="Above industry avg"
                status="green"
                trend={3.1}
                index={2}
              />
              <KPICard
                title="Active Policies"
                value="556"
                subtitle="This month"
                status="green"
                index={3}
              />
            </div>

            {/* Charts row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}>
              {/* Loss ratio by vehicle */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 24,
              }} className="fade-up stagger-5">
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>Loss Ratio by Vehicle Type</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    Current period · % of premium
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={lossRatioByVehicle} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#8888aa', fontSize: 12, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip
                      formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                        const rawValue = Array.isArray(value) ? value[0] : value
                        const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0)
                        return [`${numericValue}%`, 'Loss Ratio'] as [string, string]
                      }}
                      contentStyle={{ background: '#16161f', border: '1px solid #2a2a38', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                      labelStyle={{ color: '#f0f0f8' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {lossRatioByVehicle.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly trend */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 24,
              }} className="fade-up stagger-6">
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>Claims vs Premium Trend</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    Last 6 months · JOD
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#8888aa', fontSize: 12, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8888aa', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#16161f', border: '1px solid #2a2a38', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                      labelStyle={{ color: '#f0f0f8' }}
                      formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                        const rawValue = Array.isArray(value) ? value[0] : value
                        const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0)
                        return `${numericValue.toLocaleString()} JOD`
                      }}
                    />
                    <Line type="monotone" dataKey="premium" stroke="#4ade9a" strokeWidth={2} dot={false} name="Premium" />
                    <Line type="monotone" dataKey="claims" stroke="#f55a5a" strokeWidth={2} dot={false} name="Claims" />
                    <Legend wrapperStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#8888aa' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status bar */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                LOSS RATIO LEGEND
              </span>
              {[
                { label: '< 45% — Good', color: '#4ade9a' },
                { label: '45–50% — Warning', color: '#f5c542' },
                { label: '> 50% — Critical', color: '#f55a5a' },
              ].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'agents' && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
          }} className="fade-up stagger-1">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>Agent Performance</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Ranked by loss ratio · Current period
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Rank', 'Agent', 'Region', 'Loss Ratio', 'Policies', 'Status'].map(h => (
                    <th key={h} style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent, i) => {
                  const status = getLossStatus(agent.lossRatio);
                  const statusColor = status === 'green' ? '#4ade9a' : status === 'yellow' ? '#f5c542' : '#f55a5a';
                  const statusLabel = status === 'green' ? 'Good' : status === 'yellow' ? 'Warning' : 'Critical';
                  return (
                    <tr key={agent.name} style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                        #{i + 1}
                      </td>
                      <td style={{ padding: '16px 24px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
                        {agent.name.replace(' H.', ' Haddad').replace(' K.', ' Khalil').replace(' O.', ' Al-Omar').replace(' M.', ' Mansour').replace(' N.', ' Nasser')}
                      </td>
                      <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                        {['Irbid', 'Amman North', 'Zarqa', 'Amman South', 'Aqaba'][i]}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 14,
                          fontWeight: 500,
                          color: statusColor,
                        }}>{agent.lossRatio}%</span>
                      </td>
                      <td style={{ padding: '16px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
                        {agent.policies}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 20,
                          background: `${statusColor}15`,
                          border: `1px solid ${statusColor}30`,
                          color: statusColor,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                        }}>{statusLabel}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'chat' && (
          <FullChat />
        )}
      </main>

      {/* Floating chat widget (only on non-chat tabs) */}
      {activeTab !== 'chat' && <ChatWidget />}
    </div>
  );
}

// Full chat page embedded in tab
function FullChat() {
  type Message = {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي لتحليل بيانات MedGulf.\n\nHello! Ask me anything about your insurance portfolio — loss ratios, claims, agent performance, vehicle types, forecasts, and strategic recommendations.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionId = getSessionId();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }]);
    setInput('');
    setLoading(true);
    try {
      const res = await sendMessage(text, sessionId, 'full-chat');
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.message, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Connection error. Please try again.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'What is the overall loss ratio?',
    'Which vehicle type has highest claims?',
    'Top 3 agents by performance?',
    'How can we reduce loss ratio by 10%?',
    'Outstanding claims this month?',
    'Compare Pickup vs Sedan performance',
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, height: 'calc(100vh - 200px)' }}>
      {/* Chat area */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? 'var(--bg-hover)' : 'rgba(74,222,154,0.06)',
                border: msg.role === 'user' ? '1px solid var(--border)' : '1px solid rgba(74,222,154,0.15)',
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '14px 18px', width: 'fit-content',
              background: 'rgba(74,222,154,0.06)', border: '1px solid rgba(74,222,154,0.15)', borderRadius: '16px 16px 16px 4px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                  animation: 'pulse-dot 1s ease-in-out infinite', animationDelay: `${i*0.2}s` }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about loss ratios, claims, agents, forecasts..."
            style={{
              flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)',
              fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px', borderRadius: 10, border: 'none',
              background: input.trim() ? 'var(--accent)' : 'var(--bg-hover)',
              color: input.trim() ? '#0a0a0f' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500,
              cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
            }}
          >
            Send ↑
          </button>
        </div>
      </div>

      {/* Suggestions panel */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }}>
          SUGGESTED QUERIES
        </div>
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setInput(s); }}
            style={{
              padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)',
              fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)',
              textAlign: 'left', transition: 'all 0.15s', lineHeight: 1.4,
            }}
            onMouseEnter={e => {
              (e.currentTarget.style.borderColor = 'var(--accent)');
              (e.currentTarget.style.color = 'var(--accent)');
              (e.currentTarget.style.background = 'rgba(74,222,154,0.04)');
            }}
            onMouseLeave={e => {
              (e.currentTarget.style.borderColor = 'var(--border)');
              (e.currentTarget.style.color = 'var(--text-secondary)');
              (e.currentTarget.style.background = 'transparent');
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}