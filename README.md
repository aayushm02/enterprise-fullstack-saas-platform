# NexusPulse — Enterprise Multi-Tenant Incident Operations & Autonomous Multi-Agent AI Platform

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-emerald?style=flat&logo=githubactions&logoColor=white)](https://github.com/aayushm02/enterprise-fullstack-saas-platform)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=nodedotjs&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-Socket.io-010101?style=flat&logo=socketdotio&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat&logo=redis&logoColor=white)
![Multi-Agent AI](https://img.shields.io/badge/Multi--Agent_AI-RAG_Enhanced-8A2BE2?style=flat&logo=openai&logoColor=white)

**NexusPulse** is a production-ready, full-stack enterprise SaaS platform for real-time incident management, automated event-driven workflows, and autonomous multi-agent root-cause investigation. Built with a decoupled microservice backend and responsive React frontend, it features multi-tenant isolation, 3-tier Role-Based Access Control (RBAC), live WebSocket telemetry, and an integrated **RAG-grounded Multi-Agent AI Copilot**.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client_Tier["Client Tier (React 18 & TypeScript)"]
        UI[Enterprise Dashboard SPA]
        WS_Client[Socket.io Real-Time Client]
        Auth_State[JWT Token & RBAC Session Store]
        UI <--> WS_Client
    end

    subgraph API_Gateway["Backend API Gateway (Express & Node.js)"]
        Sec[Helmet & Sliding-Window Rate Limiter]
        Auth_MW[JWT Auth Middleware & Tenant Context]
        RBAC_MW[RBAC Authorization: ADMIN / ENGINEER / VIEWER]
        Router[REST API v1 Router]

        Sec --> Auth_MW --> RBAC_MW --> Router
    end

    subgraph Core_Services["Domain Microservices & Event Engine"]
        IncService[Incident State Machine Service]
        WfService[Workflow Automation Engine]
        AudService[SOC-2 Compliance Audit Logger]
        WSServer[Socket.io Multi-Tenant Room Hub]
    end

    subgraph AI_Copilot["Autonomous Multi-Agent & RAG Tier"]
        Triage[1. Triage Agent: Blast Radius & Severity]
        Diag[2. Diagnosis Agent: RAG Vector Knowledge Retrieval]
        Mitig[3. Mitigation Agent: SRE Remediation & Script Gen]
        RAG_KB[(Enterprise Runbook & Post-Mortem Vector Store)]

        Triage --> Diag
        Diag <--> RAG_KB
        Diag --> Mitig
    end

    subgraph Storage_Tier["Data & Cache Tier"]
        PG[(PostgreSQL 15 Multi-Tenant Schema via Prisma)]
        RedisCache[(Redis 7 Pub/Sub & Session Cache)]
    end

    UI -->|HTTPS REST| API_Gateway
    WS_Client <-->|WSS Events| WSServer
    Router --> IncService & WfService & AudService
    IncService --> AI_Copilot
    IncService --> WSServer
    IncService & WfService & AudService --> PG
    IncService --> RedisCache
```

---

## 🤖 Multi-Agent AI & RAG Copilot Architecture

When an on-call engineer triggers an investigation on any critical incident, NexusPulse activates a sequential **3-Agent Collaborative Pipeline**:

```text
  +-----------------------------------------------------------------------------+
  |                   NEXUSAI MULTI-AGENT COLLABORATION PIPELINE                 |
  +-----------------------------------------------------------------------------+
         |
         v
  [1. Triage Agent]
         • Parses incident title, service name, and error stack trace.
         • Classifies severity blast radius (Global vs. Isolated).
         |
         v
  [2. Diagnosis Agent (RAG Grounding)]
         • Semantic similarity search across vectorized enterprise runbooks & post-mortems.
         • Extracts exact historical precedent (e.g. PgBouncer pool leak, Kafka lag).
         |
         v
  [3. Mitigation / SRE Agent]
         • Formulates actionable 3-step remediation playbook.
         • Generates verified shell commands (e.g. kubectl rollout restart deployment/...).
         • Calculates confidence consensus score (e.g. 94%).
```

---

## 🛡️ Multi-Tenancy & RBAC Security Matrix

Every request executes within a strict tenant-isolated boundary (`tenantId`). Permissions are strictly enforced via the `requireRole()` middleware:

| Feature / Endpoint | VIEWER | ENGINEER | ADMIN |
| :--- | :---: | :---: | :---: |
| View Incidents & Health Status (`GET /incidents`) | ✅ | ✅ | ✅ |
| Trigger Multi-Agent AI Investigation (`POST /ai/investigate`) | ✅ | ✅ | ✅ |
| Broadcast New Incident (`POST /incidents`) | ❌ | ✅ | ✅ |
| Transition Incident State (`PATCH /incidents/:id/status`) | ❌ | ✅ | ✅ |
| View Audit Logs (`GET /audit`) | ❌ | ✅ | ✅ |
| Create / Toggle Workflow Automations (`POST /workflows`) | ❌ | ❌ | ✅ |

---

## ⚡ WebSocket Real-Time Events

The platform uses authenticated Socket.io rooms partitioned by tenant (`tenant_${tenantId}`). All browser instances receive immediate updates with zero polling:
- `INCIDENT_CREATED`: Dispatched when any teammate or automated webhook triggers an incident.
- `INCIDENT_UPDATED`: Dispatched when status changes (e.g., `TRIGGERED` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `RESOLVED`).

---

## 📁 Repository Structure

```text
enterprise-fullstack-saas-platform/
├── client/                               # React 18 + TypeScript Frontend SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx                # Top navigation & live status
│   │   │   ├── IncidentList.tsx          # Real-time incident table & action modal
│   │   │   ├── AiInvestigationModal.tsx  # Multi-Agent trace & RAG citation modal
│   │   │   ├── WorkflowList.tsx          # Workflow rule cards & toggle actions
│   │   │   └── AuditLogView.tsx          # SOC-2 compliance audit log viewer
│   │   ├── App.tsx                       # Root application coordinator
│   │   ├── types.ts                      # Frontend domain types
│   │   └── main.tsx
│   ├── Dockerfile                        # Multi-stage Nginx production build
│   └── package.json
├── server/                               # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── ai/
│   │   │   ├── agentService.ts           # Multi-Agent Orchestrator (Triage, Diagnosis, Mitigation)
│   │   │   └── ragService.ts             # Semantic Runbook Knowledge Base Retrieval
│   │   ├── config/env.ts                 # Zod environment variable validator
│   │   ├── controllers/                  # Auth, Incidents, Workflows, Audit, AI controllers
│   │   ├── middlewares/                  # JWT auth, RBAC, Rate-Limiting, Error Handler
│   │   ├── routes/                       # Express API v1 routers
│   │   ├── services/                     # Business logic & tenant stores
│   │   ├── types/                        # Core TypeScript interfaces
│   │   ├── websocket/socketServer.ts     # Multi-tenant Socket.io hub
│   │   └── server.ts                     # Application entrypoint
│   ├── prisma/
│   │   └── schema.prisma                 # PostgreSQL multi-tenant relational schema
│   ├── tests/
│   │   └── incident.test.ts              # Vitest integration test suite
│   ├── Dockerfile                        # Multi-stage Node.js container
│   └── package.json
├── ci/
│   └── fullstack_ci.yml                  # GitHub Actions CI for Lint, TypeCheck, and Tests
├── docker-compose.yml                    # Full-stack composition: Client, Server, PG, Redis
├── package.json                          # Monorepo root workspace
└── README.md
```

---

## 🚀 Quickstart Guide

### Option 1: Run with Docker Compose (Recommended)
```bash
git clone https://github.com/aayushm02/enterprise-fullstack-saas-platform.git
cd enterprise-fullstack-saas-platform
docker compose up --build
```
- **Web App:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000/api/v1/health`

### Option 2: Run Locally (Zero Cloud Cost)

#### 1. Start Server:
```bash
cd server
npm install
npm run dev
```

#### 2. Start Client (in a separate terminal):
```bash
cd client
npm install
npm run dev
```

### 🔑 Demo Credentials

The platform includes instant 1-click login presets on the sign-in page:
- **Admin User:** `admin@enterprise.com` / `Admin@12345` (Full mutation and workflow controls)
- **Engineer User:** `engineer@enterprise.com` / `Engineer@12345` (Incident ops & AI investigation)
- **Viewer User:** `viewer@enterprise.com` / `Viewer@12345` (Read-only stakeholder mode)

---

## 🧪 Running Automated Tests

```bash
cd server
npm test
```
*Executes the Vitest test suite testing Health, Authentication, Tenant Isolation, RBAC gates, and Multi-Agent RAG execution.*

---

## 👤 Author
**Aayush Mishra**  
- **LinkedIn:** [linkedin.com/in/aayushm02](https://linkedin.com/in/aayushm02)  
- **GitHub:** [github.com/aayushm02](https://github.com/aayushm02)  
- **Portfolio:** [aayush-mishra-portfolio.netlify.app](https://aayush-mishra-portfolio.netlify.app)
