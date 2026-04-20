const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;

export interface ChatResponse {
  success: boolean;
  message: string;
  chartData: ChartData | null;
  timestamp: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: Array<{ name: string; value: number; [key: string]: string | number }>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  chartData?: ChartData | null;
  timestamp: Date;
}

export async function sendMessage(
  message: string,
  sessionId: string,
  source: string = 'dashboard'
): Promise<ChatResponse> {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, source }),
  });

  if (!res.ok) throw new Error(`Webhook error: ${res.status}`);
  return res.json();
}

// Generate unique session ID per browser session
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr-session';
  let id = sessionStorage.getItem('medgulf-session');
  if (!id) {
    id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem('medgulf-session', id);
  }
  return id;
}

// Quick stat queries for dashboard KPIs
export const QUICK_QUERIES = {
  overallLossRatio: 'Give me the overall company loss ratio as a single number',
  outstandingClaims: 'What is the total outstanding claims amount in JOD?',
  recoveryRate: 'What is the overall recovery rate as a percentage?',
  monthlyClaims: 'How many claims were filed this month?',
  topAgents: 'Who are the top 3 agents by lowest loss ratio?',
  vehicleBreakdown: 'Give me loss ratio by vehicle type as a chart',
};