export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN DISCUSSION' | 'PROPOSAL SENT' | 'CONVERTED' | 'ARCHIVED';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AIAnalysis {
  category: string;
  subcategory: string;
  intent: string;
  priority: PriorityLevel;
  suggestedTeam: string;
  confidenceScore: number;
  summary: string;
  recommendedAction: string;
  keyRequirements: string[];
  estimatedBudgetRange?: string;
  timelineEstimate?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  author: string;
  action: string;
  details: string;
  type: 'system' | 'user' | 'ai';
}

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
  status: EnquiryStatus;
  priority: PriorityLevel;
  aiCategory: string;
  assignedTeam: string;
  assignedEmployee?: string;
  aiAnalysis: AIAnalysis;
  notes: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
  activities: ActivityLog[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  capabilities: string[];
  technologies: string[];
  metrics: { label: string; value: string }[];
}

export interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string }[];
  techUsed: string[];
}

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'ai-automation',
    title: 'AI & Intelligent Automation',
    shortDesc: 'Automate complex business processes with custom machine learning models, LLM routing, and autonomous agent workflows.',
    fullDesc: 'We build end-to-end intelligent automation systems that process un-structured customer enquiries, extract actionable intelligence, streamline backend routing, and deliver natural conversational interfaces for enterprise scale.',
    iconName: 'Cpu',
    capabilities: [
      'Automated Customer Enquiry Categorization',
      'LLM & Retrieval Augmented Generation (RAG)',
      'Robotic Process Automation (RPA)',
      'Document Intelligence & Sentiment Analysis',
      'Autonomous Workflow Orchestration'
    ],
    technologies: ['PyTorch', 'LangChain', 'FastAPI', 'Vector Databases', 'OpenAI Enterprise'],
    metrics: [
      { label: 'Enquiry Processing Speed', value: '10x Faster' },
      { label: 'Manual Routing Reduction', value: '88%' }
    ]
  },
  {
    id: 'cloud-engineering',
    title: 'Cloud & Digital Engineering',
    shortDesc: 'Modernize monolithic applications with cloud-native microservices, automated CI/CD pipelines, and resilient multi-cloud architecture.',
    fullDesc: 'Transform legacy applications into cloud-native powerhouses. We architect high-concurrency microservices, configure multi-region deployment, and implement zero-downtime DevOps practices.',
    iconName: 'Cloud',
    capabilities: [
      'Multi-Cloud & Hybrid Migration (AWS, Azure, GCP)',
      'Kubernetes Orchestration & Service Mesh',
      'Serverless & Microservice Architecture',
      'Infrastructure as Code (Terraform)',
      'Site Reliability & 99.99% Availability'
    ],
    technologies: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Go / Node.js'],
    metrics: [
      { label: 'Uptime SLA Guarantee', value: '99.99%' },
      { label: 'Infrastructure Cost Reduction', value: '35%' }
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data & Analytics',
    shortDesc: 'Turn raw operational data into actionable real-time insights with enterprise data lakes, BI reporting, and predictive modeling.',
    fullDesc: 'Architect robust data pipelines that ingest terabytes of customer interactions, financial telemetry, and logistics logs to empower executive decision making.',
    iconName: 'BarChart3',
    capabilities: [
      'Real-time Data Streaming & ETL Pipelines',
      'Enterprise Data Warehousing & Data Lakes',
      'Executive Dashboards & Interactive BI',
      'Predictive Churn & Demand Analytics',
      'Data Governance & Compliance Frameworks'
    ],
    technologies: ['Snowflake', 'Apache Kafka', 'dbt', 'Recharts / PowerBI', 'PostgreSQL'],
    metrics: [
      { label: 'Data Latency', value: '< 200ms' },
      { label: 'Decision Velocity', value: '4x' }
    ]
  },
  {
    id: 'enterprise-software',
    title: 'Enterprise Application Development',
    shortDesc: 'Custom enterprise SaaS, web portals, and backend core applications designed for security, performance, and scale.',
    fullDesc: 'We architect and develop high-throughput B2B SaaS web applications, internal enterprise tools, and customer portals utilizing modern frontend frameworks and scalable backend services.',
    iconName: 'Layers',
    capabilities: [
      'Custom B2B Enterprise SaaS Web Apps',
      'Internal Tooling & Workflow Portals',
      'High-Performance REST & GraphQL APIs',
      'Legacy Codebase Modernization',
      'Role-Based Access Control (RBAC)'
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    metrics: [
      { label: 'Developer Efficiency', value: '+45%' },
      { label: 'Security Standard', value: 'SOC 2 Ready' }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Compliance',
    shortDesc: 'Safeguard enterprise infrastructure with end-to-end encryption, automated vulnerability management, and SOC 2 / GDPR compliance.',
    fullDesc: 'Protect your enterprise data asset with continuous security monitoring, strict identity management, Zero Trust architecture, and automated compliance tracking.',
    iconName: 'ShieldCheck',
    capabilities: [
      'Zero Trust Network Architecture',
      'Automated Vulnerability Scanning',
      'GDPR, HIPAA & SOC 2 Auditing',
      'Identity & Access Management (IAM)',
      'Incident Response & Threat Mitigation'
    ],
    technologies: ['Vault', 'Auth0', 'Cloudflare', 'Splunk', 'OWASP'],
    metrics: [
      { label: 'Threat Mitigation Rate', value: '99.9%' },
      { label: 'Audit Readiness', value: '100%' }
    ]
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    shortDesc: 'Strategic advisory and technical execution to transition legacy enterprise workflows into automated digital systems.',
    fullDesc: 'Bridge business vision and technical execution. We partner with enterprise leadership to map technology roadmaps, replace manual legacy workflows, and execute seamless digital upgrades.',
    iconName: 'Zap',
    capabilities: [
      'Technology Roadmap & Architecture Strategy',
      'Process Digitization & Automation Mapping',
      'Change Management & Developer Upskilling',
      'Integration of Legacy Systems with Modern APIs',
      'ROI & Impact Measurement'
    ],
    technologies: ['Agile', 'DevOps', 'Microservices', 'Enterprise AI'],
    metrics: [
      { label: 'Time-to-Market', value: '60% Faster' },
      { label: 'Client Satisfaction', value: '98%' }
    ]
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'ENQ-2026-00427',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@technova.io',
    company: 'TechNova Solutions',
    phone: '+91 98765 43210',
    service: 'AI & Intelligent Automation',
    message: 'We are interested in implementing an AI-based automated enquiry management system for our customer support and sales workflow. We currently receive around 2,000 requests monthly that need intent recognition and smart routing to 4 different departments.',
    createdAt: '2026-09-28T09:30:00Z',
    status: 'NEW',
    priority: 'HIGH',
    aiCategory: 'AI & Automation',
    assignedTeam: 'AI Solutions Team',
    assignedEmployee: 'Vikram Sengupta (Lead AI Engineer)',
    aiAnalysis: {
      category: 'AI & Intelligent Automation',
      subcategory: 'Customer Support & Enquiry Automation',
      intent: 'Enterprise Service Inquiry',
      priority: 'HIGH',
      suggestedTeam: 'AI Solutions Team',
      confidenceScore: 0.96,
      summary: 'Customer seeking AI-based automated enquiry management with intent recognition and smart routing for ~2,000 monthly incoming requests across 4 departments.',
      recommendedAction: 'Schedule a 30-minute technical discovery call within 24 hours to review intent classification requirements and API integrations.',
      keyRequirements: [
        '2,000+ monthly enquiry throughput',
        'NLP / Intent recognition engine',
        'Multi-department routing (4 teams)',
        'CRM & Helpdesk integration'
      ],
      estimatedBudgetRange: '$40,000 - $65,000',
      timelineEstimate: '6 - 8 Weeks'
    },
    notes: [
      {
        id: 'n1',
        author: 'System AI',
        text: 'Initial enquiry analyzed automatically. Priority elevated to HIGH due to high volume (2,000 monthly enquiries) and enterprise intent.',
        createdAt: '2026-09-28T09:30:05Z'
      }
    ],
    activities: [
      {
        id: 'a1',
        timestamp: '2026-09-28T09:30:00Z',
        author: 'Rahul Sharma',
        action: 'Enquiry Received',
        details: 'Submitted via Nexora Corporate Website form.',
        type: 'user'
      },
      {
        id: 'a2',
        timestamp: '2026-09-28T09:30:04Z',
        author: 'Nexora AI Engine v3',
        action: 'AI Analysis Completed',
        details: 'Categorized as AI & Automation (Score: 96%). Assigned HIGH priority and routed to AI Solutions Team.',
        type: 'ai'
      }
    ]
  },
  {
    id: 'ENQ-2026-00426',
    fullName: 'Ananya Patel',
    email: 'ananya@finedge.com',
    company: 'FinEdge Global',
    phone: '+91 98123 45678',
    service: 'Cloud Engineering',
    message: 'Looking to migrate our legacy financial database service from on-premise infrastructure to AWS with zero downtime and SOC-2 audit compliance guarantee.',
    createdAt: '2026-09-28T08:15:00Z',
    status: 'IN DISCUSSION',
    priority: 'MEDIUM',
    aiCategory: 'Cloud',
    assignedTeam: 'Cloud Engineering Team',
    assignedEmployee: 'Siddharth Rao',
    aiAnalysis: {
      category: 'Cloud Engineering',
      subcategory: 'Legacy Migration & Compliance',
      intent: 'Infrastructure Modernization',
      priority: 'MEDIUM',
      suggestedTeam: 'Cloud Engineering Team',
      confidenceScore: 0.92,
      summary: 'Financial client requesting on-premise to AWS cloud migration for core database systems requiring SOC-2 compliance and zero-downtime cutover.',
      recommendedAction: 'Send technical cloud migration readiness assessment checklist and proposal draft.',
      keyRequirements: [
        'AWS Cloud Infrastructure',
        'Zero-downtime migration strategy',
        'SOC-2 / Financial Compliance',
        'Database replication'
      ],
      estimatedBudgetRange: '$50,000 - $80,000',
      timelineEstimate: '8 - 12 Weeks'
    },
    notes: [
      {
        id: 'n2',
        author: 'Siddharth Rao',
        text: 'Spoke with Ananya on initial call. Sent cloud readiness architecture diagram. Waiting for database schema doc.',
        createdAt: '2026-09-28T11:00:00Z'
      }
    ],
    activities: [
      {
        id: 'a3',
        timestamp: '2026-09-28T08:15:00Z',
        author: 'Ananya Patel',
        action: 'Enquiry Received',
        details: 'Submitted via Nexora Contact Portal.',
        type: 'user'
      },
      {
        id: 'a4',
        timestamp: '2026-09-28T09:00:00Z',
        author: 'Siddharth Rao',
        action: 'Status Changed to IN DISCUSSION',
        details: 'First technical consultation held.',
        type: 'user'
      }
    ]
  },
  {
    id: 'ENQ-2026-00425',
    fullName: 'Rohan Mehta',
    email: 'rohan.mehta@retailx.in',
    company: 'RetailX Enterprises',
    phone: '+91 97788 99000',
    service: 'Data Analytics',
    message: 'We require a unified data warehouse and real-time executive dashboard to aggregate inventory, sales, and supply chain metrics across 120 retail outlets.',
    createdAt: '2026-09-27T16:45:00Z',
    status: 'CONTACTED',
    priority: 'HIGH',
    aiCategory: 'Analytics',
    assignedTeam: 'Data & Analytics Team',
    assignedEmployee: 'Neha Kulkarni',
    aiAnalysis: {
      category: 'Data & Analytics',
      subcategory: 'Enterprise Data Warehouse & BI',
      intent: 'Multi-location BI Implementation',
      priority: 'HIGH',
      suggestedTeam: 'Data & Analytics Team',
      confidenceScore: 0.94,
      summary: 'Retail chain with 120 locations requires real-time data warehouse ETL pipeline and executive dashboards for inventory and sales telemetry.',
      recommendedAction: 'Follow up on preliminary data model requirement document.',
      keyRequirements: [
        '120 retail location data ingestion',
        'Real-time streaming ETL pipeline',
        'Executive BI dashboard (Sub-second refresh)',
        'Inventory forecasting model'
      ],
      estimatedBudgetRange: '$60,000 - $95,000',
      timelineEstimate: '10 - 14 Weeks'
    },
    notes: [
      {
        id: 'n3',
        author: 'Neha Kulkarni',
        text: 'Initiated email contact. Rohan confirmed meeting scheduled for Wednesday.',
        createdAt: '2026-09-27T17:30:00Z'
      }
    ],
    activities: [
      {
        id: 'a5',
        timestamp: '2026-09-27T16:45:00Z',
        author: 'Rohan Mehta',
        action: 'Enquiry Received',
        details: 'Submitted online enquiry.',
        type: 'user'
      },
      {
        id: 'a6',
        timestamp: '2026-09-27T17:20:00Z',
        author: 'Neha Kulkarni',
        action: 'Status Changed to CONTACTED',
        details: 'Outreach email dispatched.',
        type: 'user'
      }
    ]
  },
  {
    id: 'ENQ-2026-00424',
    fullName: 'David Miller',
    email: 'dmiller@logistix.com',
    company: 'Logistix Global',
    phone: '+1 (555) 234-5678',
    service: 'Enterprise Software',
    message: 'Need custom fleet dispatch software integration with existing ERP. Real-time GPS tracking, driver job assignment, and automated invoice billing features needed.',
    createdAt: '2026-09-27T14:10:00Z',
    status: 'PROPOSAL SENT',
    priority: 'CRITICAL',
    aiCategory: 'Enterprise Software',
    assignedTeam: 'Enterprise Software Team',
    assignedEmployee: 'Arjun Verma',
    aiAnalysis: {
      category: 'Enterprise Software',
      subcategory: 'Custom Logistics SaaS',
      intent: 'ERP Custom Integration',
      priority: 'CRITICAL',
      suggestedTeam: 'Enterprise Software Team',
      confidenceScore: 0.98,
      summary: 'Global logistics enterprise seeking fleet dispatch web portal, driver mobile API, real-time GPS tracking, and ERP integration.',
      recommendedAction: 'Proposal sent. Follow up with Procurement VP by Thursday.',
      keyRequirements: [
        'Real-time GPS fleet tracking',
        'ERP Integration (SAP/Oracle)',
        'Automated billing generation',
        'Driver assignment portal'
      ],
      estimatedBudgetRange: '$110,000 - $150,000',
      timelineEstimate: '14 - 16 Weeks'
    },
    notes: [
      {
        id: 'n4',
        author: 'Arjun Verma',
        text: 'Formal proposal document v1.2 transmitted to VP of Operations. Review call planned for tomorrow.',
        createdAt: '2026-09-28T10:00:00Z'
      }
    ],
    activities: [
      {
        id: 'a7',
        timestamp: '2026-09-27T14:10:00Z',
        author: 'David Miller',
        action: 'Enquiry Received',
        details: 'Global logistics request received.',
        type: 'user'
      },
      {
        id: 'a8',
        timestamp: '2026-09-28T10:00:00Z',
        author: 'Arjun Verma',
        action: 'Proposal Sent',
        details: 'Commercial & Technical Proposal delivered.',
        type: 'user'
      }
    ]
  },
  {
    id: 'ENQ-2026-00423',
    fullName: 'Priya Sundaram',
    email: 'priya@healthplus.org',
    company: 'HealthPlus Healthcare',
    phone: '+91 99001 12233',
    service: 'Cybersecurity',
    message: 'Seeking HIPAA compliance assessment, vulnerability audit, and Zero-Trust identity setup across our healthcare portal and patient data database.',
    createdAt: '2026-09-26T11:20:00Z',
    status: 'CONVERTED',
    priority: 'HIGH',
    aiCategory: 'Cybersecurity',
    assignedTeam: 'Security & Compliance Team',
    assignedEmployee: 'Amitabh Sen',
    aiAnalysis: {
      category: 'Cybersecurity',
      subcategory: 'HIPAA Compliance & Zero Trust',
      intent: 'Security & Compliance Audit',
      priority: 'HIGH',
      suggestedTeam: 'Security & Compliance Team',
      confidenceScore: 0.95,
      summary: 'Healthcare network requesting HIPAA audit, penetration testing, and Zero Trust access management.',
      recommendedAction: 'Contract signed. Kickoff meeting executed on Sept 27.',
      keyRequirements: [
        'HIPAA Data Privacy Compliance',
        'Vulnerability & Pen Testing',
        'Zero Trust Identity IAM',
        'Staff Security Protocol Training'
      ],
      estimatedBudgetRange: '$45,000 - $70,000',
      timelineEstimate: '6 Weeks'
    },
    notes: [
      {
        id: 'n5',
        author: 'Amitabh Sen',
        text: 'MSA signed! Project kickoff completed. Commencing initial vulnerability scan on Monday.',
        createdAt: '2026-09-27T15:00:00Z'
      }
    ],
    activities: [
      {
        id: 'a9',
        timestamp: '2026-09-26T11:20:00Z',
        author: 'Priya Sundaram',
        action: 'Enquiry Received',
        details: 'Healthcare portal security request.',
        type: 'user'
      },
      {
        id: 'a10',
        timestamp: '2026-09-27T15:00:00Z',
        author: 'Amitabh Sen',
        action: 'Converted to Deal',
        details: 'Master Services Agreement executed.',
        type: 'user'
      }
    ]
  },
  {
    id: 'ENQ-2026-00422',
    fullName: 'Marcus Vance',
    email: 'm.vance@apexfinance.co',
    company: 'Apex Finance Capital',
    phone: '+1 (555) 987-6543',
    service: 'AI & Intelligent Automation',
    message: 'We require an automated document processing AI to parse quarterly earnings reports, PDF financial statements, and extract key metrics directly into our investment database.',
    createdAt: '2026-09-25T15:30:00Z',
    status: 'IN DISCUSSION',
    priority: 'MEDIUM',
    aiCategory: 'AI & Automation',
    assignedTeam: 'AI Solutions Team',
    assignedEmployee: 'Vikram Sengupta',
    aiAnalysis: {
      category: 'AI & Intelligent Automation',
      subcategory: 'Document Intelligence & Extraction',
      intent: 'Financial Document Parsing',
      priority: 'MEDIUM',
      suggestedTeam: 'AI Solutions Team',
      confidenceScore: 0.93,
      summary: 'Investment firm requiring OCR & LLM-driven document extraction for financial PDFs and balance sheets into PostgreSQL.',
      recommendedAction: 'Demonstrate Document AI benchmark prototype during next call.',
      keyRequirements: ['PDF Financial OCR', 'Table & Key-Value extraction', 'Financial taxonomy accuracy >99%', 'PostgreSQL ingestion'],
      estimatedBudgetRange: '$35,000 - $55,000',
      timelineEstimate: '6 Weeks'
    },
    notes: [],
    activities: []
  },
  {
    id: 'ENQ-2026-00421',
    fullName: 'Kavita Deshmukh',
    email: 'kavita@edulearn.org',
    company: 'EduLearn Digital',
    phone: '+91 96543 21098',
    service: 'Digital Transformation',
    message: 'Modernize our online learning platform architecture to handle 50,000 concurrent streaming students during peak examination hours.',
    createdAt: '2026-09-24T10:00:00Z',
    status: 'CONTACTED',
    priority: 'LOW',
    aiCategory: 'Digital Transformation',
    assignedTeam: 'Enterprise Software Team',
    assignedEmployee: 'Arjun Verma',
    aiAnalysis: {
      category: 'Digital Transformation',
      subcategory: 'E-Learning Scalability',
      intent: 'Infrastructure Scaling',
      priority: 'LOW',
      suggestedTeam: 'Enterprise Software Team',
      confidenceScore: 0.89,
      summary: 'EdTech organization seeking microservice architecture transformation for high concurrency streaming during peak exams.',
      recommendedAction: 'Send load test audit proposal.',
      keyRequirements: ['50k concurrent users', 'Video stream optimization', 'CDN routing'],
      estimatedBudgetRange: '$30,000 - $45,000',
      timelineEstimate: '8 Weeks'
    },
    notes: [],
    activities: []
  }
];

export const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'technova-automation',
    client: 'TechNova Global',
    industry: 'Enterprise Software',
    title: 'Automating Customer Support Enquiry Triage with 96% Intent Recognition',
    summary: 'How Nexora transformed a high-volume B2B inquiry system using AI classification, reducing resolution time from 18 hours to 15 minutes.',
    challenge: 'TechNova received over 2,000 unstructured enterprise enquiries monthly through emails and contact forms. Manual triage led to delayed response times and misplaced routing.',
    solution: 'Nexora deployed a multi-stage NLP & LLM classification engine that assigns category, priority level, and suggested technical teams instantly upon form submission.',
    results: [
      { metric: '96%', label: 'Classification Accuracy' },
      { metric: '15 Mins', label: 'Average Response Time (from 18h)' },
      { metric: '88%', label: 'Reduction in Manual Triage Workload' }
    ],
    techUsed: ['Next.js', 'Python FastAPI', 'Vector DB', 'OpenAI LLM', 'PostgreSQL']
  },
  {
    id: 'finedge-cloud',
    client: 'FinEdge Global',
    industry: 'Fintech & Banking',
    title: 'Zero-Downtime Multi-Region Cloud Migration on AWS',
    summary: 'Modernizing core transaction processing systems to cloud microservices while satisfying strict SOC-2 & PCI-DSS compliance standards.',
    challenge: 'FinEdge relied on aging legacy hardware with frequent maintenance windows and limited scalability during market hours.',
    solution: 'Nexora re-architected the monolithic stack into Docker microservices deployed on AWS EKS with automated Terraform infrastructure.',
    results: [
      { metric: '99.99%', label: 'Guaranteed SLA Uptime' },
      { metric: '$120K', label: 'Annual Cost Savings' },
      { metric: '0 Mins', label: 'Downtime During Cutover' }
    ],
    techUsed: ['AWS EKS', 'Docker', 'Terraform', 'Kubernetes', 'Go']
  },
  {
    id: 'retailx-analytics',
    client: 'RetailX Enterprises',
    industry: 'Retail & E-commerce',
    title: 'Real-Time Telemetry & Supply Chain BI for 120 Stores',
    summary: 'Building a unified real-time analytics warehouse to stream sales, stock levels, and store performance into executive dashboards.',
    challenge: 'Disparate POS systems created 24-hour data delays, causing stockouts and inefficient warehouse dispatch.',
    solution: 'Nexora created an Apache Kafka streaming pipeline into Snowflake with live dashboard analytics.',
    results: [
      { metric: '< 200ms', label: 'Data Ingestion Latency' },
      { metric: '4x', label: 'Faster Supply Chain Decisions' },
      { metric: '24%', label: 'Reduction in Inventory Stockouts' }
    ],
    techUsed: ['Snowflake', 'Apache Kafka', 'Next.js', 'Recharts', 'dbt']
  }
];

export const ANALYTICS_DATA = {
  kpis: {
    totalEnquiries: 128,
    totalEnquiriesTrend: '+18.4% vs last month',
    newEnquiries: 24,
    newEnquiriesTrend: '+6 this week',
    highPriority: 9,
    highPriorityTrend: 'Requires immediate action',
    converted: 31,
    convertedTrend: '24.2% Conversion rate'
  },
  enquiriesOverTime: [
    { date: 'Sep 21', enquiries: 12, converted: 3, highPriority: 2 },
    { date: 'Sep 22', enquiries: 15, converted: 4, highPriority: 1 },
    { date: 'Sep 23', enquiries: 18, converted: 5, highPriority: 3 },
    { date: 'Sep 24', enquiries: 22, converted: 6, highPriority: 2 },
    { date: 'Sep 25', enquiries: 19, converted: 4, highPriority: 2 },
    { date: 'Sep 26', enquiries: 24, converted: 7, highPriority: 4 },
    { date: 'Sep 27', enquiries: 28, converted: 8, highPriority: 5 },
    { date: 'Sep 28', enquiries: 31, converted: 9, highPriority: 6 },
  ],
  byService: [
    { name: 'AI & Automation', count: 42, color: '#3b82f6' },
    { name: 'Cloud Engineering', count: 31, color: '#06b6d4' },
    { name: 'Data & Analytics', count: 25, color: '#8b5cf6' },
    { name: 'Enterprise Software', count: 18, color: '#10b981' },
    { name: 'Cybersecurity', count: 8, color: '#f59e0b' },
    { name: 'Digital Transform', count: 4, color: '#ec4899' },
  ],
  byPriority: [
    { name: 'High / Critical', value: 34, color: '#ef4444' },
    { name: 'Medium', value: 58, color: '#f59e0b' },
    { name: 'Low', value: 36, color: '#10b981' }
  ],
  byStatus: [
    { status: 'NEW', count: 24, fill: '#3b82f6' },
    { status: 'CONTACTED', count: 32, fill: '#06b6d4' },
    { status: 'IN DISCUSSION', count: 26, fill: '#8b5cf6' },
    { status: 'PROPOSAL SENT', count: 15, fill: '#f59e0b' },
    { status: 'CONVERTED', count: 31, fill: '#10b981' }
  ],
  teamWorkload: [
    { team: 'AI Solutions', active: 14, capacity: 20 },
    { team: 'Cloud Engineering', active: 11, capacity: 15 },
    { team: 'Data Analytics', active: 9, capacity: 15 },
    { team: 'Enterprise Software', active: 8, capacity: 12 },
    { team: 'Security & Compliance', active: 5, capacity: 10 }
  ],
  aiInsights: [
    {
      id: 'i1',
      title: 'AI & Intelligent Automation is current top requested domain',
      type: 'trend',
      description: 'Demand for AI & Automation accounts for 32.8% of total inbound enquiries this month, showing a 42% month-over-month surge.',
      action: 'Consider allocating 2 additional senior AI engineers to the AI Solutions Team.'
    },
    {
      id: 'i2',
      title: 'High priority enquiries response time bottleneck',
      type: 'warning',
      description: '9 High/Critical enquiries received in the last 48h. Average first contact latency currently stands at 3.2 hours.',
      action: 'Enable automated SMS/Slack alerts for CRITICAL severity enquiries.'
    },
    {
      id: 'i3',
      title: 'High conversion rate in Cloud & Digital Engineering',
      type: 'success',
      description: 'Cloud Engineering inquiries exhibit a 38.5% lead-to-conversion rate, outperforming all other service lines.',
      action: 'Promote FinEdge cloud migration case study on the primary home page hero.'
    }
  ]
};
