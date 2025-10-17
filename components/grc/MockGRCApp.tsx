"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck, FileText, Layers, FolderOpen, Building2, FileSignature, Settings, Plus,
  Search, Filter, ChevronDown, AlertTriangle, CheckCircle2, Bell, Network, Gauge,
  ClipboardCheck, Map, Globe, Share2, GitMerge, ListChecks, Clock
} from "lucide-react";
import {
  ResponsiveContainer, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  Scatter, Cell, PieChart, Pie, BarChart, Bar
} from "recharts";

// --- helpers
function severityColor(score: number) { if (score >= 70) return "#ef4444"; if (score >= 50) return "#f59e0b"; return "#22c55e"; }

// --- seeds
const riskPoints = [
  { id: "R-101", title: "S3 Public Bucket", impact: 9, likelihood: 7, residual: 68 },
  { id: "R-142", title: "Weak TLS Ciphers", impact: 6, likelihood: 6, residual: 44 },
  { id: "R-205", title: "Vendor Lacks SOC2", impact: 7, likelihood: 8, residual: 72 },
  { id: "R-233", title: "Prod Access w/o MFA", impact: 8, likelihood: 5, residual: 55 },
  { id: "R-310", title: "Shadow SaaS", impact: 5, likelihood: 7, residual: 48 }
];
const controlsCoverage = [{ name: "Covered", value: 72 }, { name: "Gaps", value: 28 }];

async function api(path: string) {
  try { const r = await fetch(path); if (!r.ok) throw 0; return await r.json(); } catch { return null; }
}
function useRisks() { const [d, s] = React.useState<any[]>([]); React.useEffect(() => { (async () => s((await api("/api/risks")) ?? []))(); }, []); return d; }
function useVendors() { const [d, s] = React.useState<any[]>([]); React.useEffect(() => { (async () => s((await api("/api/vendors")) ?? []))(); }, []); return d; }
function useAudits() { const [d, s] = React.useState<any[]>([]); React.useEffect(() => { (async () => s((await api("/api/audits")) ?? []))(); }, []); return d; }

export default function MockGRCApp() {
  const risks = useRisks();
  const vendors = useVendors();
  const audits = useAudits();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="grid grid-cols-[260px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="border-r border-neutral-200 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <span className="font-semibold">GRC Atlas</span>
          </div>
          <div className="relative px-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input placeholder="Search…" className="pl-9 pr-3 bg-neutral-100 border-none" />
          </div>
          <nav className="text-sm">
            <ul className="space-y-1">
              <NavItem icon={<Layers className="h-4 w-4" />} label="Dashboard" active />
              <NavItem icon={<AlertTriangle className="h-4 w-4" />} label="Risks" />
              <NavItem icon={<ShieldCheck className="h-4 w-4" />} label="Controls" />
              <NavItem icon={<FolderOpen className="h-4 w-4" />} label="Evidence" />
              <NavItem icon={<Building2 className="h-4 w-4" />} label="Vendors" />
              <NavItem icon={<FileText className="h-4 w-4" />} label="Policies" />
              <NavItem icon={<FileSignature className="h-4 w-4" />} label="Audits" />
              <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />
            </ul>
          </nav>
          <div className="mt-auto p-3 rounded-2xl bg-neutral-100">
            <div className="text-xs text-neutral-500 mb-2">Framework Coverage</div>
            <Progress value={72} className="h-2" />
            <div className="text-xs mt-1">72% mapped</div>
          </div>
        </aside>

        {/* Main */}
        <main className="p-6">
          <Topbar />

          <div className="grid gap-4 grid-cols-1 xl:grid-cols-3 mt-4">
            <KPI title="Open Risks" value="12" trend="+2 this week" icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} />
            <KPI title="Control Coverage" value="72%" trend="+4% MoM" icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />} />
            <KPI title="Upcoming Audits" value="2" trend="Nov & Feb" icon={<FileSignature className="h-5 w-5 text-sky-500" />} />
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 mt-4">
            {/* Heatmap */}
            <Card className="rounded-2xl col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Risk Heatmap</CardTitle>
                <CardDescription>Likelihood × Impact — sized by residual score</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="likelihood" domain={[1, 10]} tick={{ fontSize: 12 }} />
                    <YAxis type="number" dataKey="impact" domain={[1, 10]} tick={{ fontSize: 12 }} />
                    <ReTooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ fontSize: 12 }} />
                    <Scatter data={riskPoints}>
                      {riskPoints.map((p, idx) => (
                        <Cell key={idx} fill={severityColor(p.residual)} r={6 + Math.round(p.residual / 15)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Coverage Pie */}
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle>Control Coverage</CardTitle>
                <CardDescription>SOC2 + ISO mapped</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={controlsCoverage} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4}>
                      <Cell fill="#10b981" />
                      <Cell fill="#f43f5e" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Badge className="bg-emerald-100 text-emerald-700">Covered</Badge>
                  <Badge className="bg-rose-100 text-rose-700">Gaps</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 xl:grid-cols-3 mt-4">
            {/* Risks table */}
            <Card className="rounded-2xl xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Open Risks</CardTitle>
                  <CardDescription>Top risks by residual score</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1"><Filter className="h-4 w-4" />Filters</Button>
                  <Button size="sm" className="gap-1"><Plus className="h-4 w-4" />New Risk</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="text-right">Inherent</TableHead>
                      <TableHead className="text-right">Residual</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{r.title}</div>
                          <div className="flex gap-1 mt-1">
                            {r.tags?.map((t: string) => (<Badge key={t} className="text-xs">{t}</Badge>))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar><AvatarFallback>{r.owner?.slice(0,1)}</AvatarFallback></Avatar>
                            <span className="text-sm">{r.owner}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{r.inherent}</TableCell>
                        <TableCell className="text-right">
                          <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${severityColor(r.residual)}20`, color: severityColor(r.residual) }}>{r.residual}</span>
                        </TableCell>
                        <TableCell>
                          {r.status === "Open" ? <Badge className="bg-amber-100 text-amber-700">Open</Badge> : <Badge className="bg-sky-100 text-sky-700">Mitigating</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Vendors & Audits */}
            <Card className="rounded-2xl">
              <CardHeader className="flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>Vendors</CardTitle>
                  <CardDescription>Tiering & red flags</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-1"><Building2 className="h-4 w-4" />Import SIG</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Flags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((v: any) => (
                      <TableRow key={v.name}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell><Badge>T{v.tier}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={v.score} className="h-1.5 w-28" />
                            <span className="text-xs">{v.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {v.redFlags === 0
                            ? <div className="flex items-center gap-1 text-emerald-600 text-xs"><CheckCircle2 className="h-4 w-4" />Clear</div>
                            : <div className="flex items-center gap-1 text-rose-600 text-xs"><AlertTriangle className="h-4 w-4" />{v.redFlags} flags</div>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator className="my-4" />
                <div className="text-sm font-medium mb-2">Upcoming Audits</div>
                <div className="space-y-2">
                  {audits.map((a: any) => (
                    <div key={a.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
                      <div>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-neutral-500">Due {new Date(a.due).toLocaleDateString()}</div>
                      </div>
                      <Badge className="bg-sky-100 text-sky-700">{a.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evidence preview rail */}
          <div className="mt-4">
            <Tabs defaultValue="evidence">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="evidence">Evidence</TabsTrigger>
                  <TabsTrigger value="controls">Controls</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <Button variant="outline" className="gap-1"><FolderOpen className="h-4 w-4" />Upload Evidence</Button>
              </div>
              <TabsContent value="evidence" className="mt-3">
                <Card className="rounded-2xl">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                      <div className="p-4 lg:col-span-2">
                        <div className="rounded-xl border h-[280px] bg-neutral-50 flex items-center justify-center text-neutral-500 text-sm">
                          PDF Preview (mock)
                        </div>
                      </div>
                      <div className="p-4 border-l space-y-3">
                        <div className="text-sm font-medium">Mapped Controls</div>
                        <div className="space-y-2">
                          <Badge>SOC2 CC6.6</Badge><Badge>ISO A.9.4.2</Badge><Badge>NIST AC-7</Badge>
                        </div>
                        <Separator />
                        <div className="text-sm font-medium">PII Flags</div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">Possible email detected on p.2</div>
                          <div className="p-2 rounded-lg bg-rose-50 text-rose-700">API key-like string on p.4</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">Acknowledge</Button>
                          <Button size="sm" variant="outline" className="flex-1">Redact</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="controls" className="mt-3">
                <Card className="rounded-2xl">
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["SOC2", "ISO 27001", "NIST CSF", "GDPR", "PCI DSS", "HIPAA"].map(fr => (
                        <div key={fr} className="p-3 rounded-xl bg-neutral-50 border">
                          <div className="text-sm font-medium mb-1">{fr}</div>
                          <div className="text-xs text-neutral-500">Coverage</div>
                          <BarMini value={Math.floor(Math.random() * 30) + 60} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity" className="mt-3">
                <Card className="rounded-2xl">
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li>✔️ Evidence <span className="font-mono">evidence_2025-10-12.pdf</span> mapped to CC6.6 and AC-7</li>
                      <li>⚠️ PII flag created by Guard: email address on page 2</li>
                      <li>📝 Remediation task opened: "Enforce TLS 1.2+"</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Separator className="my-6" />

          {/* Panorays-inspired modules */}
          <section className="grid gap-4 grid-cols-1 2xl:grid-cols-3">
            <div className="2xl:col-span-2 space-y-4">
              <Vendor360Card />
              <QuestionnaireCenter />
            </div>
            <div className="space-y-4">
              <RiskModelWeights />
              <MonitoringAlerts />
              <ReportsCard />
              <IntegrationsGrid />
            </div>
          </section>

          <Separator className="my-6" />

          {/* Advanced modules */}
          <section className="grid gap-4 grid-cols-1 2xl:grid-cols-3">
            <div className="2xl:col-span-2 space-y-4">
              <SupplyChainMap />
              <RemediationBoard />
            </div>
            <div className="space-y-4">
              <AttackSurface />
              <TrustPortal />
              <PrivacyROPA />
              <AutoAnswer />
              <CollaborationCenter />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">Dashboard</span>
        <Badge className="rounded-full">Preview</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1"><Filter className="h-4 w-4" /> Saved Views</Button>
        <Button size="sm" className="gap-1">Export <ChevronDown className="h-4 w-4" /></Button>
        <Avatar><AvatarFallback>U</AvatarFallback></Avatar>
      </div>
    </div>
  );
}

function KPI({ title, value, trend, icon }: { title: string; value: string; trend: string; icon: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-500">{title}</div>
              <div className="text-2xl font-semibold mt-1">{value}</div>
              <div className="text-xs text-neutral-500 mt-1">{trend}</div>
            </div>
            <div className="p-2 rounded-xl bg-neutral-100">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
function NavItem({ icon, label, badge, active }: { icon: React.ReactNode; label: string; badge?: string; active?: boolean }) {
  return (
    <li>
      <button className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-neutral-100 ${active ? "bg-neutral-100 font-medium" : ""}`}>
        <span className="text-neutral-600">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge ? <Badge className="text-xs">{badge}</Badge> : null}
      </button>
    </li>
  );
}
function BarMini({ value }: { value: number }) {
  const data = [{ name: "Covered", value }, { name: "Gap", value: 100 - value }];
  return (
    <div className="h-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <Bar dataKey="value" radius={[6, 6, 6, 6]}>
            <Cell fill="#10b981" /><Cell fill="#f43f5e" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-xs text-right mt-1">{value}%</div>
    </div>
  );
}

/* ======= Feature cards ======= */
function Vendor360Card() {
  const external = 80, internal = 72, impact = 65;
  const overall = Math.round(external * 0.5 + internal * 0.35 + impact * 0.15);
  const data = [
    { name: "External", value: external, color: "#0ea5e9" },
    { name: "Internal", value: internal, color: "#10b981" },
    { name: "Impact", value: impact, color: "#f59e0b" }
  ];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-sky-500" />Vendor 360 — Risk Profile</CardTitle>
          <CardDescription>Combined external posture, internal assessment & business impact</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge>Onboarding</Badge><Badge className="bg-emerald-100 text-emerald-700">Monitoring</Badge><Badge>Offboarding</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {data.map((d, i) => (<Cell key={i} fill={d.color} />))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-sm text-neutral-500 text-center -mt-6">Composition of rating</div>
        </div>
        <div className="space-y-3">
          <div className="text-sm">Overall Rating</div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-semibold">{overall}</span>
            <Badge className={overall >= 80 ? "bg-emerald-100 text-emerald-700" : overall >= 60 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}>
              {overall >= 85 ? "A" : overall >= 70 ? "B+" : "B"}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="External" value={external} color="#0ea5e9" />
            <MiniStat label="Internal" value={internal} color="#10b981" />
            <MiniStat label="Impact" value={impact} color="#f59e0b" />
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="gap-1"><Building2 className="h-4 w-4" />Open Vendor</Button>
            <Button size="sm" variant="outline" className="gap-1"><ClipboardCheck className="h-4 w-4" />Start Questionnaire</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
function QuestionnaireCenter() {
  const rows = [
    { vendor: "Acme Analytics", template: "SIG Lite", status: "Awaiting", ai: "Warnings", sla: 5 },
    { vendor: "CloudHelper Inc.", template: "CAIQ", status: "Sent", ai: "Pending", sla: 9 },
    { vendor: "SecureMail", template: "Custom DPA", status: "Completed", ai: "Pass", sla: 0 }
  ];
  const aiColor = (s: string) => s === "Pass" ? "bg-emerald-100 text-emerald-700" : s === "Warnings" ? "bg-amber-100 text-amber-700" : "bg-neutral-200 text-neutral-700";
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-emerald-500" />Questionnaire Center</CardTitle>
          <CardDescription>Templates, AI validation & response tracking</CardDescription>
        </div>
        <Button size="sm" variant="outline" className="gap-1"><Plus className="h-4 w-4" />New Questionnaire</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead><TableHead>Template</TableHead><TableHead>Status</TableHead><TableHead>AI Validation</TableHead><TableHead className="text-right">SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.vendor}>
                <TableCell className="font-medium">{row.vendor}</TableCell>
                <TableCell>{row.template}</TableCell>
                <TableCell><Badge className={row.status === "Completed" ? "bg-emerald-100 text-emerald-700" : row.status === "Awaiting" ? "bg-amber-100 text-amber-700" : ""}>{row.status}</Badge></TableCell>
                <TableCell><Badge className={aiColor(row.ai)}>{row.ai}</Badge></TableCell>
                <TableCell className="text-right">{row.sla}d</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
function MonitoringAlerts() {
  const alerts = [
    { ts: "2025-10-15", type: "Breach Report", vendor: "CloudHelper Inc.", severity: "high" },
    { ts: "2025-10-14", type: "New CVE on exposed service", vendor: "Acme Analytics", severity: "medium" },
    { ts: "2025-10-13", type: "Domain expires in 30 days", vendor: "SecureMail", severity: "low" }
  ];
  const sev = (s: string) => s === "high" ? "bg-rose-100 text-rose-700" : s === "medium" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700";
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-amber-500" />Continuous Monitoring</CardTitle>
        <CardDescription>Live alerts for security posture changes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map(a => (
          <div key={a.ts + a.vendor} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50">
            <div>
              <div className="text-sm font-medium">{a.type}</div>
              <div className="text-xs text-neutral-500">{a.vendor} • {new Date(a.ts).toLocaleDateString()}</div>
            </div>
            <Badge className={sev(a.severity)}>{a.severity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
function RiskModelWeights() {
  const weights = [
    { label: "External Posture", value: 50, color: "#0ea5e9" },
    { label: "Internal Assessment", value: 35, color: "#10b981" },
    { label: "Business Impact", value: 15, color: "#f59e0b" }
  ];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2"><Gauge className="h-5 w-5 text-purple-500" />Risk Rating Model</CardTitle>
        <CardDescription>Adjust weighting across factors (mock)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {weights.map(w => (
          <div key={w.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm"><span>{w.label}</span><span>{w.value}%</span></div>
            <input type="range" defaultValue={w.value} className="w-full accent-neutral-700" />
          </div>
        ))}
        <div className="text-xs text-neutral-500">Weights sum to 100%.</div>
      </CardContent>
    </Card>
  );
}
function ReportsCard() {
  const data = [{ tier: "High", count: 7, color: "#ef4444" }, { tier: "Medium", count: 19, color: "#f59e0b" }, { tier: "Low", count: 34, color: "#10b981" }];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle>Vendor Risk Distribution</CardTitle><CardDescription>Portfolio by risk tier</CardDescription></CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tier" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} tick={{ fontSize: 12 }} /><Bar dataKey="count" radius={[6,6,0,0]}>{data.map((d,i)=><Cell key={i} fill={d.color} />)}</Bar></BarChart>
        </ResponsiveContainer>
        <div className="text-xs text-neutral-500 mt-2">Export: CSV, PDF (mock)</div>
      </CardContent>
    </Card>
  );
}
function IntegrationsGrid() {
  const items = ["AWS Security Hub", "Okta", "GitHub", "CrowdStrike", "ServiceNow", "Jira"];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Map className="h-5 w-5 text-sky-500" />Integrations</CardTitle><CardDescription>Connectors (placeholders)</CardDescription></CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">{items.map(i => (<div key={i} className="p-3 rounded-xl bg-neutral-50 border text-sm">{i}</div>))}</CardContent>
    </Card>
  );
}
function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (<div className="p-3 rounded-xl border" style={{ borderColor: `${color}40` }}><div className="text-xs text-neutral-500">{label}</div><div className="text-lg font-semibold" style={{ color }}>{value}</div></div>);
}
function SupplyChainMap() {
  const vendors = [{ name: "Acme Analytics", tier: "T2", risk: 72 }, { name: "CloudHelper Inc.", tier: "T3", risk: 58 }, { name: "SecureMail", tier: "T1", risk: 84 }];
  const subs = [{ name: "Stripe", risk: 20 }, { name: "AWS", risk: 35 }, { name: "Twilio", risk: 40 }];
  const chip = (v: number) => (<span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${severityColor(v)}20`, color: severityColor(v) }}>{v}</span>);
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Map className="h-5 w-5 text-emerald-500" />Supply Chain Visibility</CardTitle><CardDescription>First- & third-party relationships</CardDescription></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="p-4 rounded-xl border bg-neutral-50"><div className="text-xs text-neutral-500 mb-1">Your Org</div><div className="text-lg font-semibold">GRC Atlas</div><div className="text-xs text-neutral-500 mt-2">Systems: Billing, Analytics, Email</div></div>
          <div className="space-y-3"><div className="text-xs text-neutral-500">Vendors</div>{vendors.map(v => (<div key={v.name} className="p-3 rounded-xl border flex items-center justify-between"><div className="flex items-center gap-2"><Badge>{v.tier}</Badge><span className="font-medium">{v.name}</span></div>{chip(v.risk)}</div>))}</div>
          <div className="space-y-3"><div className="text-xs text-neutral-500">Sub-processors</div>{subs.map(s => (<div key={s.name} className="p-3 rounded-xl border flex items-center justify-between"><span className="font-medium">{s.name}</span>{chip(s.risk)}</div>))}</div>
        </div>
      </CardContent>
    </Card>
  );
}
function RemediationBoard() {
  const cols = [
    { title: "Backlog", color: "bg-neutral-100", items: [{ id: "T-101", title: "Enforce TLS 1.2+", owner: "Alice", sla: 7 }, { id: "T-124", title: "Rotate S3 keys", owner: "Raj", sla: 3 }] },
    { title: "In Progress", color: "bg-sky-50", items: [{ id: "T-205", title: "MFA for prod access", owner: "Mina", sla: 5 }] },
    { title: "Ready for Audit", color: "bg-emerald-50", items: [{ id: "T-233", title: "Vendor DPA signed", owner: "Leo", sla: 0 }] }
  ];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><GitMerge className="h-5 w-5 text-purple-500" />Automated Remediation</CardTitle><CardDescription>Kanban with SLA timers</CardDescription></CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cols.map(c => (
          <div key={c.title} className={`rounded-xl border p-3 ${c.color}`}>
            <div className="text-sm font-medium mb-2">{c.title}</div>
            <div className="space-y-2">
              {c.items.map(it => (
                <div key={it.id} className="rounded-lg bg-white border p-3 flex items-center justify-between">
                  <div><div className="font-medium text-sm">{it.title}</div><div className="text-xs text-neutral-500">{it.id} • {it.owner}</div></div>
                  <div className="flex items-center gap-1 text-xs"><Clock className="h-4 w-4" />{it.sla}d</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
function AttackSurface() {
  const rows = [{ domain: "api.example.com", services: ["443/tls", "80/http"], issues: 2, lastScan: "2025-10-15" }, { domain: "app.example.com", services: ["443/tls"], issues: 0, lastScan: "2025-10-15" }, { domain: "mail.example.com", services: ["25/smtp", "587/smtps"], issues: 1, lastScan: "2025-10-14" }];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-sky-500" />Attack Surface Snapshot</CardTitle><CardDescription>External assets & findings</CardDescription></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Domain</TableHead><TableHead>Services</TableHead><TableHead className="text-right">Issues</TableHead><TableHead>Last Scan</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.domain}>
                <TableCell className="font-medium">{r.domain}</TableCell>
                <TableCell><div className="flex flex-wrap gap-1">{r.services.map(s => (<Badge key={s} className="text-xs">{s}</Badge>))}</div></TableCell>
                <TableCell className="text-right">{r.issues}</TableCell>
                <TableCell className="text-xs text-neutral-500">{new Date(r.lastScan).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
function TrustPortal() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-500" />Trust Portal</CardTitle><CardDescription>Share read-only security profile</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2"><Badge className="bg-emerald-100 text-emerald-700">SOC 2 Type II</Badge><Badge className="bg-sky-100 text-sky-700">ISO 27001</Badge><Badge className="bg-purple-100 text-purple-700">GDPR Ready</Badge></div>
        <div className="text-xs text-neutral-500">Includes policies, reports, control coverage & attestations.</div>
        <div className="flex gap-2"><Button size="sm" className="gap-1"><Share2 className="h-4 w-4" />Generate Link</Button><Button size="sm" variant="outline">Preview</Button></div>
      </CardContent>
    </Card>
  );
}
function PrivacyROPA() {
  const rows = [{ activity: "Customer Analytics", data: "Email, IP, Usage", basis: "Legitimate interests", dpia: false }, { activity: "Billing", data: "Name, Address, Card last4", basis: "Contract", dpia: false }, { activity: "Support", data: "Email, Ticket content", basis: "Contract", dpia: true }];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-amber-500" />ROPA / DPIA</CardTitle><CardDescription>Processing activities & privacy impact</CardDescription></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Activity</TableHead><TableHead>Data</TableHead><TableHead>Lawful Basis</TableHead><TableHead>DPIA</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.activity}>
                <TableCell className="font-medium">{r.activity}</TableCell><TableCell>{r.data}</TableCell><TableCell>{r.basis}</TableCell>
                <TableCell>{r.dpia ? <Badge className="bg-rose-100 text-rose-700">Required</Badge> : <Badge className="bg-emerald-100 text-emerald-700">Not required</Badge>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-3"><Button size="sm" variant="outline">Start DPIA Wizard</Button></div>
      </CardContent>
    </Card>
  );
}
function AutoAnswer() {
  const rows = [
    { q: "Do you enforce MFA for production?", a: "Yes—Okta + device posture.", conf: 0.92 },
    { q: "Data retention policy documented?", a: "Yes—12 months logs; DPI deletion in 30 days.", conf: 0.88 },
    { q: "Encryption at rest?", a: "Yes—AES-256 in AWS KMS across all stores.", conf: 0.95 }
  ];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-emerald-500" />Questionnaire Auto-Answer</CardTitle><CardDescription>Suggested responses (mock)</CardDescription></CardHeader>
      <CardContent>
        <Table><TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Suggested Answer</TableHead><TableHead className="text-right">Confidence</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map(r => (<TableRow key={r.q}><TableCell className="text-sm">{r.q}</TableCell><TableCell className="text-sm">{r.a}</TableCell><TableCell className="text-right text-xs">{Math.round(r.conf * 100)}%</TableCell></TableRow>))}
          </TableBody>
        </Table>
        <div className="mt-3 flex gap-2"><Button size="sm">Apply to Draft</Button><Button size="sm" variant="outline">Review All</Button></div>
      </CardContent>
    </Card>
  );
}
function CollaborationCenter() {
  const comments = [{ user: "Alice", text: "Linking evidence to CC6.6 now.", ts: "2025-10-15 10:12" }, { user: "Raj", text: "SIG Lite draft ready for review.", ts: "2025-10-15 09:40" }, { user: "Mina", text: "PII flag acknowledged; redaction queued.", ts: "2025-10-14 18:05" }];
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2">Team Collaboration</CardTitle><CardDescription>Updates & discussion</CardDescription></CardHeader>
      <CardContent className="space-y-2">
        {comments.map((c, i) => (<div key={i} className="p-3 rounded-xl bg-neutral-50 border"><div className="text-sm"><span className="font-medium">{c.user}</span> — {c.text}</div><div className="text-xs text-neutral-500">{new Date(c.ts).toLocaleString()}</div></div>))}
        <div className="flex gap-2 mt-2"><Input placeholder="Add a comment" /><Button size="sm">Post</Button></div>
      </CardContent>
    </Card>
  );
}
