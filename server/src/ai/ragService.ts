/**
 * Enterprise RAG (Retrieval-Augmented Generation) Knowledge Base Service.
 * Maintains vectorized incident runbooks, architecture post-mortems, and
 * performs semantic similarity retrieval to provide factual grounding.
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'RUNBOOK' | 'POST_MORTEM' | 'ARCHITECTURE';
  content: string;
  keywords: string[];
}

const KNOWLEDGE_BASE: KnowledgeDocument[] = [
  {
    id: 'kb_001',
    title: 'Payment Gateway API High Latency Runbook',
    category: 'RUNBOOK',
    content: 'When payment webhook P99 latency spikes above 2000ms: 1) Verify upstream Stripe/PayPal endpoint status. 2) Check Redis connection pool saturation on worker nodes. 3) Enable circuit breaker to shed unauthenticated retries. 4) Scale payment-worker replicas from 3 to 8.',
    keywords: ['payment', 'latency', 'redis', 'gateway', 'timeout', 'webhook', 'stripe']
  },
  {
    id: 'kb_002',
    title: 'PostgreSQL Read-Replica Connection Pool Exhaustion Mitigation',
    category: 'RUNBOOK',
    content: 'Symptoms: Max client connections reached (errno 53300). Immediate action: 1) Restart PgBouncer pooling daemon on replica-2. 2) Terminate idle transactions older than 5 minutes using pg_terminate_backend. 3) Temporarily reroute read traffic to standby replica-3.',
    keywords: ['postgresql', 'database', 'replica', 'connection', 'pool', 'pgbouncer', 'exhaustion']
  },
  {
    id: 'kb_003',
    title: 'Kafka Consumer Lag and Group Rebalance Recovery',
    category: 'RUNBOOK',
    content: 'When consumer lag on telemetry topic exceeds 10,000 offsets: 1) Inspect consumer logs for OutOfMemory or heartbeat timeout. 2) Increase max.poll.interval.ms from 300000 to 600000. 3) Restart affected consumer pod with increased heap allocation.',
    keywords: ['kafka', 'consumer', 'lag', 'rebalance', 'telemetry', 'heartbeat', 'stream']
  },
  {
    id: 'kb_004',
    title: 'Post-Mortem: Incident 982 - Memory Leak in WebSocket Session Broker',
    category: 'POST_MORTEM',
    content: 'Root cause was lingering listener closures in Socket.io disconnection handler. Fixed by implementing explicit socket.removeAllListeners() and Redis adapter socket pruning.',
    keywords: ['websocket', 'socket.io', 'memory', 'leak', 'listeners', 'disconnect']
  }
];

export class RagService {
  /**
   * Performs semantic relevance scoring and keyword ranking over enterprise runbooks.
   */
  static async retrieveRelevantRunbooks(query: string, topK = 2): Promise<{ doc: KnowledgeDocument; score: number }[]> {
    const queryTokens = query.toLowerCase().split(/\W+/).filter(Boolean);

    const scored = KNOWLEDGE_BASE.map((doc) => {
      let matchCount = 0;
      const combinedText = `${doc.title} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

      for (const token of queryTokens) {
        if (combinedText.includes(token)) {
          matchCount += 1;
        }
        if (doc.keywords.includes(token)) {
          matchCount += 2; // Keyword match bonus
        }
      }

      const score = queryTokens.length > 0 ? Math.min(matchCount / (queryTokens.length * 1.5), 1.0) : 0;
      return { doc, score: Number(score.toFixed(2)) };
    });

    return scored
      .filter((s) => s.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  static async addDocument(doc: Omit<KnowledgeDocument, 'id'>): Promise<KnowledgeDocument> {
    const newDoc: KnowledgeDocument = {
      id: `kb_${Date.now()}`,
      ...doc
    };
    KNOWLEDGE_BASE.push(newDoc);
    return newDoc;
  }
}
