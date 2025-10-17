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
  ClipboardCheck, Map, Globe, Share2, GitMerge, ListChecks, Clock, LogOut, User
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
function useRisks() { const [d, s] = React.useState<any[]>([]); React.useEffect(() => { (async () => { const res = await api("/api/risks"); s(res?.data ?? []); })(); }, []); return d; }
function useVendors() { const [d, s] = React.useState<any[]>([]); React.useEffect(() => { (async () => { const res = await api("/api/vendors"); s(res?.data ?? []); })(); }, []); return d; }
function useAudits() { const [d, s] = React.useState<any[]>([]); React.useEffect(() => { (async () => { const res = await api("/api/audits"); s(res?.data ?? []); })(); }, []); return d; }

export default function MockGRCApp() {
  const [activeTab, setActiveTab] = React.useState<string>('dashboard');
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = React.useState(false);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = React.useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState('');
  const risks = useRisks();
  const vendors = useVendors();
  const audits = useAudits();

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem('authed');
    localStorage.removeItem('user');
    
    // Clear any auth cookies by making a request to signout endpoint
    fetch('/api/auth/signout', { method: 'POST' })
      .then(() => {
        // Redirect to sign-in page
        window.location.href = '/signin';
      })
      .catch(() => {
        // Even if the API call fails, redirect to sign-in
        window.location.href = '/signin';
      });
  };

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
              <NavItem 
                icon={<Layers className="h-4 w-4" />} 
                label="Dashboard" 
                active={activeTab === 'dashboard'}
                onClick={() => setActiveTab('dashboard')}
              />
              <NavItem 
                icon={<AlertTriangle className="h-4 w-4" />} 
                label="Risks" 
                active={activeTab === 'risks'}
                onClick={() => setActiveTab('risks')}
              />
              <NavItem 
                icon={<ShieldCheck className="h-4 w-4" />} 
                label="Controls" 
                active={activeTab === 'controls'}
                onClick={() => setActiveTab('controls')}
              />
              <NavItem 
                icon={<FolderOpen className="h-4 w-4" />} 
                label="Evidence" 
                active={activeTab === 'evidence'}
                onClick={() => setActiveTab('evidence')}
              />
              <NavItem 
                icon={<Building2 className="h-4 w-4" />} 
                label="Vendors" 
                active={activeTab === 'vendors'}
                onClick={() => setActiveTab('vendors')}
              />
              <NavItem 
                icon={<FileText className="h-4 w-4" />} 
                label="Policies" 
                active={activeTab === 'policies'}
                onClick={() => setActiveTab('policies')}
              />
              <NavItem 
                icon={<FileSignature className="h-4 w-4" />} 
                label="Audits" 
                active={activeTab === 'audits'}
                onClick={() => setActiveTab('audits')}
              />
              <NavItem 
                icon={<Settings className="h-4 w-4" />} 
                label="Settings" 
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              />
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
          <Topbar onSignOut={handleSignOut} showUserMenu={showUserMenu} setShowUserMenu={setShowUserMenu} />

          {activeTab === 'dashboard' && (
            <>
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
                        <TableCell><Badge className="bg-blue-100 text-blue-700">T{v.tier}</Badge></TableCell>
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
                          <Badge className="bg-blue-100 text-blue-700 mr-1">SOC2 CC6.6</Badge><Badge className="bg-green-100 text-green-700 mr-1">ISO A.9.4.2</Badge><Badge className="bg-purple-100 text-purple-700">NIST AC-7</Badge>
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
            </>
          )}

          {activeTab === 'risks' && (
            <div className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Risk Management</CardTitle>
                  <CardDescription>Manage and track security risks across your organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-amber-600">High Risk</h3>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-neutral-500">Critical issues requiring immediate attention</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-orange-600">Medium Risk</h3>
                        <p className="text-2xl font-bold">15</p>
                        <p className="text-sm text-neutral-500">Issues that need attention soon</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-green-600">Low Risk</h3>
                        <p className="text-2xl font-bold">23</p>
                        <p className="text-sm text-neutral-500">Issues to monitor</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Recent Risk Assessments</h3>
                      <div className="space-y-2">
                        {risks.map((risk, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{risk.title}</h4>
                              <p className="text-sm text-neutral-500">Owner: {risk.owner}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={risk.inherent > 70 ? "bg-red-100 text-red-700" : risk.inherent > 50 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}>
                                {risk.inherent}%
                              </Badge>
                              <p className="text-sm text-neutral-500 mt-1">{risk.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Control Management</CardTitle>
                  <CardDescription>Monitor and manage security controls and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-emerald-600">Implemented</h3>
                        <p className="text-3xl font-bold">72%</p>
                        <p className="text-sm text-neutral-500">Controls in place</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-blue-600">In Progress</h3>
                        <p className="text-3xl font-bold">18%</p>
                        <p className="text-sm text-neutral-500">Being implemented</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-orange-600">Planned</h3>
                        <p className="text-3xl font-bold">8%</p>
                        <p className="text-sm text-neutral-500">Scheduled</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-red-600">Gaps</h3>
                        <p className="text-3xl font-bold">2%</p>
                        <p className="text-sm text-neutral-500">Need attention</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Control Framework Coverage</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>ISO 27001</span>
                          <div className="flex items-center gap-2">
                            <Progress value={85} className="w-32" />
                            <span className="text-sm font-medium">85%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SOC 2 Type II</span>
                          <div className="flex items-center gap-2">
                            <Progress value={78} className="w-32" />
                            <span className="text-sm font-medium">78%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>NIST Cybersecurity</span>
                          <div className="flex items-center gap-2">
                            <Progress value={92} className="w-32" />
                            <span className="text-sm font-medium">92%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Evidence Management</CardTitle>
                  <CardDescription>Collect, organize, and manage compliance evidence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-blue-600">Total Evidence</h3>
                        <p className="text-3xl font-bold">1,247</p>
                        <p className="text-sm text-neutral-500">Documents collected</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-green-600">Validated</h3>
                        <p className="text-3xl font-bold">1,156</p>
                        <p className="text-sm text-neutral-500">Approved evidence</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-orange-600">Pending Review</h3>
                        <p className="text-3xl font-bold">91</p>
                        <p className="text-sm text-neutral-500">Awaiting validation</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Recent Evidence</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <h4 className="font-medium">Access Control Policy</h4>
                              <p className="text-sm text-neutral-500">Updated 2 days ago</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Validated</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-orange-500" />
                            <div>
                              <h4 className="font-medium">Incident Response Plan</h4>
                              <p className="text-sm text-neutral-500">Updated 1 week ago</p>
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="mt-4 space-y-6">
              {/* Vendor Management Tabs */}
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg w-fit">
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'vendors' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  onClick={() => setActiveTab('vendors')}
                >
                  Vendor Overview
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'vendor-list' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  onClick={() => setActiveTab('vendor-list')}
                >
                  Vendors
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'vendor-tasks' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  onClick={() => setActiveTab('vendor-tasks')}
                >
                  Vendor Tasks
                </button>
                <button 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'vendor-questionnaires' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  onClick={() => setActiveTab('vendor-questionnaires')}
                >
                  Vendor Questionnaires
                </button>
              </div>

              {/* Supplier Overview Score */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Supplier Overview Score */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Supplier Overview Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#10b981"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40 * 0.73} ${2 * Math.PI * 40 * 0.27}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-neutral-900">73</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-neutral-600">Overall Score</p>
                      <p className="text-xs text-orange-600 mt-1">Awaiting approval</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk by Business Impact */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Risk by Business Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Minor</span>
                        <span className="text-neutral-600">Moderate</span>
                        <span className="text-neutral-600">Significant</span>
                        <span className="text-neutral-600">Major</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {/* Risk Matrix Grid */}
                        {[
                          { risk: 'Low', impact: 'Minor', color: 'bg-green-200' },
                          { risk: 'Low', impact: 'Moderate', color: 'bg-green-100' },
                          { risk: 'Low', impact: 'Significant', color: 'bg-yellow-100' },
                          { risk: 'Low', impact: 'Major', color: 'bg-orange-100' },
                          { risk: 'Medium', impact: 'Minor', color: 'bg-green-100' },
                          { risk: 'Medium', impact: 'Moderate', color: 'bg-yellow-100' },
                          { risk: 'Medium', impact: 'Significant', color: 'bg-orange-100' },
                          { risk: 'Medium', impact: 'Major', color: 'bg-red-100' },
                          { risk: 'High', impact: 'Minor', color: 'bg-yellow-100' },
                          { risk: 'High', impact: 'Moderate', color: 'bg-orange-100' },
                          { risk: 'High', impact: 'Significant', color: 'bg-red-100' },
                          { risk: 'High', impact: 'Major', color: 'bg-red-200' },
                        ].map((cell, index) => (
                          <div
                            key={index}
                            className={`h-8 rounded ${cell.color} border border-neutral-200 flex items-center justify-center text-xs font-medium`}
                          >
                            {index === 2 && '3'}
                            {index === 6 && '2'}
                            {index === 10 && '1'}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
                        <span>Low Risk</span>
                        <span>High Risk</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cyber Posture */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Cyber Posture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">72 Assessments</span>
                        <span className="text-xs text-green-600">Good</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">33 Suppliers</span>
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Avg. rating</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">4.2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row - Awaiting Approval, Outstanding Tasks, Questionnaires */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {/* Awaiting Approval */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Awaiting Approval</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Pacific Metals</p>
                          <p className="text-xs text-neutral-500">5 items pending</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Network className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Innovate Technologies</p>
                          <p className="text-xs text-neutral-500">1 item pending</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">DataCorp Solutions</p>
                          <p className="text-xs text-neutral-500">3 items pending</p>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Outstanding Remediation Tasks */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Outstanding Remediation Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: 'Oct 15, 2023', task: 'Security Assessment Review', vendor: 'Acme Analytics' },
                        { date: 'Nov 1, 2023', task: 'Compliance Documentation', vendor: 'CloudHelper Inc.' },
                        { date: 'Apr 25, 2023', task: 'Risk Assessment Update', vendor: 'SecureMail' },
                        { date: 'Apr 26, 2023', task: 'Contract Renewal', vendor: 'DataCorp Solutions' },
                        { date: 'Apr 10, 2024', task: 'Security Audit', vendor: 'TechFlow Systems' },
                        { date: 'Apr 16, 2024', task: 'Vendor Onboarding', vendor: 'Innovate Technologies' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">{item.task}</p>
                              <p className="text-xs text-neutral-500">{item.vendor}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">{item.date}</span>
                            <Button size="sm" variant="outline" className="text-xs h-6 px-2">
                              Approve
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Questionnaires */}
                <Card className="rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold">Questionnaires</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">23 Suppliers</span>
                        <span className="text-xs text-blue-600">In Progress</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">0 Suppliers</span>
                        <span className="text-xs text-neutral-500">Pending</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-neutral-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Avg. rating</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">3.8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button className="gap-2" onClick={() => setShowAddVendorModal(true)}>
                    <Plus className="h-4 w-4" />
                    Add New Vendor
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search vendors..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Vendor List */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Vendor Assessments</CardTitle>
                  <CardDescription>Manage and assess third-party vendor security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vendors.map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                            {vendor.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{vendor.name}</h4>
                            <p className="text-sm text-neutral-500">Tier {vendor.tier} • {vendor.redFlags} red flags • {vendor.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={vendor.score > 80 ? "bg-green-100 text-green-700" : vendor.score > 60 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}>
                            {vendor.score}%
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => { setSelectedQuestionnaire('SigLite'); setShowQuestionnaireModal(true); }}>
                              <FileText className="h-3 w-3" />
                              SigLite
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => { setSelectedQuestionnaire('Intake'); setShowQuestionnaireModal(true); }}>
                              <ClipboardCheck className="h-3 w-3" />
                              Intake
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => { setSelectedQuestionnaire('AI'); setShowQuestionnaireModal(true); }}>
                              <Network className="h-3 w-3" />
                              AI Q&A
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Questionnaire Templates */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Questionnaire Templates</CardTitle>
                  <CardDescription>Send different types of security questionnaires to vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {/* SigLite Questionnaire */}
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">SigLite Questionnaire</h3>
                          <p className="text-sm text-neutral-500">Quick security assessment</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-4">A streamlined questionnaire for basic security posture assessment. Perfect for low-risk vendors.</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-neutral-500">
                          <span className="font-medium">15 questions</span> • 5 min completion
                        </div>
                        <Button size="sm" className="gap-1" onClick={() => { setSelectedQuestionnaire('SigLite'); setShowQuestionnaireModal(true); }}>
                          <Plus className="h-3 w-3" />
                          Send
                        </Button>
                      </div>
                    </div>

                    {/* Intake Questionnaire */}
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <ClipboardCheck className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Intake Questionnaire</h3>
                          <p className="text-sm text-neutral-500">Comprehensive vendor onboarding</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-4">Detailed questionnaire covering all aspects of vendor security, compliance, and risk management.</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-neutral-500">
                          <span className="font-medium">45 questions</span> • 20 min completion
                        </div>
                        <Button size="sm" className="gap-1" onClick={() => { setSelectedQuestionnaire('Intake'); setShowQuestionnaireModal(true); }}>
                          <Plus className="h-3 w-3" />
                          Send
                        </Button>
                      </div>
                    </div>

                    {/* AI Questionnaire */}
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Network className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">AI Questionnaire</h3>
                          <p className="text-sm text-neutral-500">Intelligent adaptive assessment</p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-4">AI-powered questionnaire that adapts based on vendor responses and industry best practices.</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-neutral-500">
                          <span className="font-medium">Dynamic</span> • 10-30 min completion
                        </div>
                        <Button size="sm" className="gap-1" onClick={() => { setSelectedQuestionnaire('AI'); setShowQuestionnaireModal(true); }}>
                          <Plus className="h-3 w-3" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Questionnaire Activity */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Recent Questionnaire Activity</CardTitle>
                  <CardDescription>Track questionnaire responses and completion status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Acme Analytics - SigLite</h4>
                          <p className="text-sm text-neutral-500">Completed 2 days ago • Score: 85%</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Completed</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">CloudHelper Inc. - Intake</h4>
                          <p className="text-sm text-neutral-500">In progress • 60% complete</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">In Progress</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Network className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">SecureMail - AI Q&A</h4>
                          <p className="text-sm text-neutral-500">Sent 1 week ago • Awaiting response</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'vendor-list' && (
            <div className="mt-4 space-y-6">
              {/* Vendor List Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Vendors</h2>
                  <p className="text-neutral-600">Manage and monitor your vendor relationships</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="gap-2" onClick={() => setShowAddVendorModal(true)}>
                    <Plus className="h-4 w-4" />
                    Add Vendor
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Enhanced Filters and Search */}
              <div className="space-y-4">
                {/* Search and Export Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input 
                        placeholder="Search supplier" 
                        className="pl-10 pr-4 w-80" 
                      />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <ChevronDown className="h-4 w-4" />
                      Export All
                    </Button>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {vendors.length} Suppliers
                  </div>
                </div>

                {/* Filter Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Approval Status</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Business Impact</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Questionnaire Rating</option>
                    <option>1 Star</option>
                    <option>2 Stars</option>
                    <option>3 Stars</option>
                    <option>4 Stars</option>
                    <option>5 Stars</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Evaluation Type</option>
                    <option>Initial</option>
                    <option>Periodic</option>
                    <option>Ad-hoc</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Cyber Posture</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Risk Rating</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Relationship</option>
                    <option>Strategic</option>
                    <option>Tactical</option>
                    <option>Operational</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Industry</option>
                    <option>Technology</option>
                    <option>Manufacturing</option>
                    <option>Services</option>
                    <option>Healthcare</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Location</option>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia Pacific</option>
                    <option>Other</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Business Info</option>
                    <option>Public</option>
                    <option>Private</option>
                    <option>Non-profit</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Segments</option>
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Operations</option>
                    <option>HR</option>
                  </select>
                  <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-white">
                    <option>Tags</option>
                    <option>Critical</option>
                    <option>High Priority</option>
                    <option>Compliance</option>
                    <option>Security</option>
                  </select>
                  <Button variant="outline" className="text-sm">
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Enhanced Vendor List Table */}
              <Card className="rounded-2xl">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Company Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Business</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Quest. Rating</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Assessment</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Posture Rating</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Risk Rating</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Contacts</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Added By</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Date Added</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {vendors.map((vendor, index) => (
                          <tr key={index} className="hover:bg-neutral-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                  {vendor.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-neutral-900 text-sm">{vendor.name}</div>
                                  <div className="text-xs text-neutral-500">{vendor.industry}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center">
                                {vendor.status === 'Active' || vendor.status === 'Approved' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="w-4 h-4 border border-neutral-300 rounded-full"></div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {Array.from({ length: 4 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-sm ${
                                      i < vendor.tier ? 'bg-blue-500' : 'bg-neutral-200'
                                    }`}
                                  ></div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-neutral-400">-</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-sm font-medium">{vendor.tier}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="w-6 h-6 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-neutral-400">-</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-neutral-400">-</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-neutral-600">GRC Atlas</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-neutral-600">
                                {new Date(vendor.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {/* Additional sample vendors to match the interface */}
                        {[
                          { name: "Luke Cham", industry: "Technology", tier: 2, status: "Active", createdAt: "2024-10-17" },
                          { name: "Panorays", industry: "Security", tier: 1, status: "Active", createdAt: "2024-10-17" },
                          { name: "Security", industry: "Cybersecurity", tier: 3, status: "Under Review", createdAt: "2024-10-16" },
                          { name: "Racing Tool", industry: "Manufacturing", tier: 2, status: "Active", createdAt: "2024-10-16" },
                          { name: "Agility", industry: "Software", tier: 1, status: "Active", createdAt: "2024-10-16" },
                          { name: "Quantum", industry: "Technology", tier: 2, status: "Active", createdAt: "2024-10-16" },
                        ].map((vendor, index) => (
                          <tr key={`sample-${index}`} className="hover:bg-neutral-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                  {vendor.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-neutral-900 text-sm">{vendor.name}</div>
                                  <div className="text-xs text-neutral-500">{vendor.industry}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center">
                                {vendor.status === 'Active' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="w-4 h-4 border border-neutral-300 rounded-full"></div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {Array.from({ length: 4 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-sm ${
                                      i < vendor.tier ? 'bg-blue-500' : 'bg-neutral-200'
                                    }`}
                                  ></div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-neutral-400">-</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-sm font-medium">{vendor.tier}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="w-6 h-6 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-neutral-400">-</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="text-neutral-400">-</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-neutral-600">GRC Atlas</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-neutral-600">
                                {new Date(vendor.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'vendor-tasks' && (
            <div className="mt-4 space-y-6">
              {/* Vendor Tasks Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Vendor Tasks</h2>
                  <p className="text-neutral-600">Manage tasks and activities for your vendors</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Task Filters */}
              <div className="flex items-center gap-4">
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                  <option>All Vendors</option>
                  <option>Acme Analytics</option>
                  <option>CloudHelper Inc.</option>
                  <option>SecureMail</option>
                </select>
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                </select>
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                  <option>All Priorities</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
                <Input placeholder="Search tasks..." className="w-64" />
              </div>

              {/* Task Kanban Board */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Open Tasks */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="font-semibold text-neutral-900">Open</h3>
                    <Badge className="bg-blue-100 text-blue-700">3</Badge>
                  </div>
                  <div className="space-y-3">
                    <Card className="p-4 border-l-4 border-l-blue-500">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Complete Security Assessment</h4>
                        <p className="text-xs text-neutral-500">Acme Analytics</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-orange-100 text-orange-700 text-xs">High</Badge>
                          <span className="text-xs text-neutral-500">Due: Jan 25</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 border-l-4 border-l-blue-500">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Update DPA</h4>
                        <p className="text-xs text-neutral-500">CloudHelper Inc.</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">Medium</Badge>
                          <span className="text-xs text-neutral-500">Due: Feb 1</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* In Progress Tasks */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h3 className="font-semibold text-neutral-900">In Progress</h3>
                    <Badge className="bg-orange-100 text-orange-700">2</Badge>
                  </div>
                  <div className="space-y-3">
                    <Card className="p-4 border-l-4 border-l-orange-500">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Review Compliance Report</h4>
                        <p className="text-xs text-neutral-500">SecureMail</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-700 text-xs">Low</Badge>
                          <span className="text-xs text-neutral-500">Due: Jan 30</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Completed Tasks */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="font-semibold text-neutral-900">Completed</h3>
                    <Badge className="bg-green-100 text-green-700">5</Badge>
                  </div>
                  <div className="space-y-3">
                    <Card className="p-4 border-l-4 border-l-green-500">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Initial Risk Assessment</h4>
                        <p className="text-xs text-neutral-500">Acme Analytics</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                          <span className="text-xs text-neutral-500">Jan 15</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Overdue Tasks */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h3 className="font-semibold text-neutral-900">Overdue</h3>
                    <Badge className="bg-red-100 text-red-700">1</Badge>
                  </div>
                  <div className="space-y-3">
                    <Card className="p-4 border-l-4 border-l-red-500">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Contract Renewal</h4>
                        <p className="text-xs text-neutral-500">CloudHelper Inc.</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-red-100 text-red-700 text-xs">Critical</Badge>
                          <span className="text-xs text-red-600">Overdue: 3 days</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vendor-questionnaires' && (
            <div className="mt-4 space-y-6">
              {/* Questionnaire Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">Vendor Questionnaires</h2>
                  <p className="text-neutral-600">Manage and track vendor questionnaires</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Questionnaire
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Questionnaire Toggle and Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">Questionnaire Type:</span>
                    <div className="flex bg-neutral-100 rounded-lg p-1">
                      <button className="px-3 py-1 text-sm font-medium bg-white rounded-md shadow-sm text-neutral-900">
                        My Questionnaires
                      </button>
                      <button className="px-3 py-1 text-sm font-medium text-neutral-600 hover:text-neutral-900">
                        Active Questionnaires
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">Type:</span>
                    <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                      <option>All Types</option>
                      <option>External</option>
                      <option>Internal</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search questionnaires..." className="w-64" />
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Questionnaire List */}
              <div className="grid gap-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Security Assessment - Acme Analytics</h3>
                          <p className="text-sm text-neutral-500">External • SIG Lite • Created Jan 15, 2024</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-green-100 text-green-700">Completed</Badge>
                            <span className="text-xs text-neutral-500">Score: 85%</span>
                            <span className="text-xs text-neutral-500">Due: Jan 25, 2024</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <ChevronDown className="h-3 w-3" />
                          Actions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <ClipboardCheck className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Compliance Review - CloudHelper Inc.</h3>
                          <p className="text-sm text-neutral-500">Internal • CAIQ • Created Jan 10, 2024</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-orange-100 text-orange-700">In Progress</Badge>
                            <span className="text-xs text-neutral-500">Progress: 60%</span>
                            <span className="text-xs text-neutral-500">Due: Feb 10, 2024</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <ChevronDown className="h-3 w-3" />
                          Actions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Network className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">AI Assessment - SecureMail</h3>
                          <p className="text-sm text-neutral-500">External • AI-Powered • Created Jan 20, 2024</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-blue-100 text-blue-700">Pending</Badge>
                            <span className="text-xs text-neutral-500">Awaiting Response</span>
                            <span className="text-xs text-neutral-500">Due: Feb 20, 2024</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <ChevronDown className="h-3 w-3" />
                          Actions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Policy Management</CardTitle>
                  <CardDescription>Create, review, and manage security policies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-blue-600">Total Policies</h3>
                        <p className="text-3xl font-bold">28</p>
                        <p className="text-sm text-neutral-500">Active policies</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-green-600">Current</h3>
                        <p className="text-3xl font-bold">24</p>
                        <p className="text-sm text-neutral-500">Up to date</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-orange-600">Under Review</h3>
                        <p className="text-3xl font-bold">3</p>
                        <p className="text-sm text-neutral-500">Being updated</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-red-600">Expired</h3>
                        <p className="text-3xl font-bold">1</p>
                        <p className="text-sm text-neutral-500">Need renewal</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Policy Categories</h3>
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span>Information Security</span>
                            <Badge className="bg-blue-100 text-blue-700">8 policies</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span>Access Control</span>
                            <Badge className="bg-green-100 text-green-700">5 policies</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span>Incident Response</span>
                            <Badge className="bg-orange-100 text-orange-700">4 policies</Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span>Data Protection</span>
                            <Badge className="bg-purple-100 text-purple-700">6 policies</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span>Vendor Management</span>
                            <Badge className="bg-yellow-100 text-yellow-700">3 policies</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span>Compliance</span>
                            <Badge className="bg-red-100 text-red-700">2 policies</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'audits' && (
            <div className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Audit Management</CardTitle>
                  <CardDescription>Plan, execute, and track compliance audits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-blue-600">Total Audits</h3>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-sm text-neutral-500">Scheduled this year</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-green-600">Completed</h3>
                        <p className="text-3xl font-bold">8</p>
                        <p className="text-sm text-neutral-500">Successfully finished</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-orange-600">In Progress</h3>
                        <p className="text-3xl font-bold">2</p>
                        <p className="text-sm text-neutral-500">Currently running</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <h3 className="font-semibold text-purple-600">Planned</h3>
                        <p className="text-3xl font-bold">2</p>
                        <p className="text-sm text-neutral-500">Upcoming</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Upcoming Audits</h3>
                      <div className="space-y-2">
                        {audits.map((audit, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{audit.name}</h4>
                              <p className="text-sm text-neutral-500">Due: {audit.due}</p>
                            </div>
                            <Badge className={audit.status === 'Completed' ? "bg-green-100 text-green-700" : audit.status === 'In Progress' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}>
                              {audit.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="mt-4">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your GRC Atlas preferences and system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">User Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-neutral-500">Receive alerts for high-risk items</p>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Dashboard Layout</h4>
                            <p className="text-sm text-neutral-500">Customize your dashboard view</p>
                          </div>
                          <Button variant="outline" size="sm">Customize</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Data Export</h4>
                            <p className="text-sm text-neutral-500">Export reports and data</p>
                          </div>
                          <Button variant="outline" size="sm">Export</Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">API Keys</h4>
                            <p className="text-sm text-neutral-500">Manage integration keys</p>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">User Management</h4>
                            <p className="text-sm text-neutral-500">Add and manage users</p>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Backup & Recovery</h4>
                            <p className="text-sm text-neutral-500">Configure data backup</p>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add New Vendor</h2>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Vendor Name</label>
                <Input placeholder="Enter vendor name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <Input placeholder="vendor@company.com" type="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                <select className="w-full p-2 border border-neutral-300 rounded-lg">
                  <option>Analytics</option>
                  <option>Cloud Services</option>
                  <option>Communication</option>
                  <option>Security</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Risk Tier</label>
                <select className="w-full p-2 border border-neutral-300 rounded-lg">
                  <option>Tier 1 (Low Risk)</option>
                  <option>Tier 2 (Medium Risk)</option>
                  <option>Tier 3 (High Risk)</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddVendorModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setShowAddVendorModal(false)} className="flex-1">
                Add Vendor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Send Questionnaire Modal */}
      {showQuestionnaireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Send {selectedQuestionnaire} Questionnaire</h2>
              <button
                onClick={() => setShowQuestionnaireModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Select Vendor</label>
                <select className="w-full p-2 border border-neutral-300 rounded-lg">
                  <option>Acme Analytics</option>
                  <option>CloudHelper Inc.</option>
                  <option>SecureMail</option>
                  <option>Add new vendor...</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Recipient Email</label>
                <Input placeholder="security@vendor.com" type="email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Due Date</label>
                <Input type="date" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Message (Optional)</label>
                <textarea 
                  className="w-full p-2 border border-neutral-300 rounded-lg h-20 resize-none"
                  placeholder="Add a personal message to the vendor..."
                />
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    {selectedQuestionnaire === 'SigLite' && <FileText className="h-3 w-3 text-blue-600" />}
                    {selectedQuestionnaire === 'Intake' && <ClipboardCheck className="h-3 w-3 text-orange-600" />}
                    {selectedQuestionnaire === 'AI' && <Network className="h-3 w-3 text-purple-600" />}
                  </div>
                  <span className="font-medium text-sm">{selectedQuestionnaire} Questionnaire</span>
                </div>
                <p className="text-xs text-neutral-600">
                  {selectedQuestionnaire === 'SigLite' && '15 questions • 5 min completion • Basic security assessment'}
                  {selectedQuestionnaire === 'Intake' && '45 questions • 20 min completion • Comprehensive vendor onboarding'}
                  {selectedQuestionnaire === 'AI' && 'Dynamic questions • 10-30 min completion • AI-powered adaptive assessment'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowQuestionnaireModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setShowQuestionnaireModal(false)} className="flex-1">
                Send Questionnaire
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar({ onSignOut, showUserMenu, setShowUserMenu }: { onSignOut: () => void; showUserMenu: boolean; setShowUserMenu: (show: boolean) => void }) {
  // Get user info from localStorage
  const [user, setUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-dropdown')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">Dashboard</span>
        <Badge className="rounded-full">Preview</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1"><Filter className="h-4 w-4" /> Saved Views</Button>
        <Button size="sm" className="gap-1">Export <ChevronDown className="h-4 w-4" /></Button>
        
        {/* User Dropdown */}
        <div className="relative user-dropdown">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">
                {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{user?.name || 'Demo User'}</div>
                    <div className="text-xs text-neutral-500">{user?.email || 'demo@example.com'}</div>
                    <div className="text-xs text-neutral-400 capitalize">{user?.role || 'user'}</div>
                  </div>
                </div>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // You can add profile settings here
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profile Settings
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
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
function NavItem({ icon, label, badge, active, onClick }: { icon: React.ReactNode; label: string; badge?: string; active?: boolean; onClick?: () => void }) {
  return (
    <li>
      <button 
        onClick={onClick}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-neutral-100 transition-colors ${active ? "bg-neutral-100 font-medium" : ""}`}
      >
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
          <Badge className="bg-blue-100 text-blue-700">Onboarding</Badge><Badge className="bg-emerald-100 text-emerald-700">Monitoring</Badge><Badge className="bg-orange-100 text-orange-700">Offboarding</Badge>
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
          <div className="space-y-3"><div className="text-xs text-neutral-500">Vendors</div>{vendors.map(v => (<div key={v.name} className="p-3 rounded-xl border flex items-center justify-between"><div className="flex items-center gap-2"><Badge className="bg-blue-100 text-blue-700">{v.tier}</Badge><span className="font-medium">{v.name}</span></div>{chip(v.risk)}</div>))}</div>
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
