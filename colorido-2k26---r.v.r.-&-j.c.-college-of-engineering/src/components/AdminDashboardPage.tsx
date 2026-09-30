import React, { useState, useEffect } from 'react';
import { Registration } from '../types/index.ts';
import {
  Shield,
  Search,
  Filter,
  Trash2,
  Download,
  Users,
  Bus,
  School,
  Building2,
  Calendar,
  Clock,
  Eye,
  Lock,
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  X
} from 'lucide-react';

interface AdminDashboardPageProps {
  onBackToSite: () => void;
}

interface AdminStats {
  totalRegistrations: number;
  internalRegistrations: number;
  externalRegistrations: number;
  busRequirements: number;
  totalEvents: number;
}

interface EventAnalytics {
  event_id: string;
  event_name: string;
  category: string;
  total: number;
  internal: number;
  external: number;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBackToSite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for immediate evaluation or password toggle
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('colorido2026');
  const [authError, setAuthError] = useState<string | null>(null);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<EventAnalytics[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [busFilter, setBusFilter] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, typeFilter, eventFilter, busFilter]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/event-analytics'),
      ]);

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();
      setStats(statsData);
      setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);

      let url = `/api/admin/registrations?student_type=${typeFilter}`;
      if (busFilter) url += '&bus_required=1';
      if (eventFilter !== 'all') url += `&event_id=${encodeURIComponent(eventFilter)}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const regRes = await fetch(url);
      const regData = await regRes.json();
      setRegistrations(Array.isArray(regData) ? regData : []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      setIsAuthenticated(true);
      loadAdminData();
    } catch (err: any) {
      setAuthError(err.message || 'Invalid username or password');
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete record');

      setActionNotice(`Registration ${id} deleted successfully.`);
      setTimeout(() => setActionNotice(null), 3000);
      setDeleteConfirmId(null);
      if (selectedReg && (selectedReg.id === id || selectedReg.registration_id === id)) {
        setSelectedReg(null);
      }
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // CSV Extraction
  const exportCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations available to extract.');
      return;
    }

    const headers = [
      'Registration ID',
      'Student Type',
      'Student Name',
      'Roll Number',
      'College Name',
      'Department',
      'Year',
      'Section',
      'Email',
      'Phone',
      'Event Name',
      'Participation Type',
      'Team Name',
      'Team Size',
      'Emergency Contact',
      'Bus Required',
      'Bus Time Slot',
      'Registration Timestamp'
    ];

    const rows = registrations.map((r) => [
      `"${r.registration_id}"`,
      `"${r.student_type.toUpperCase()}"`,
      `"${r.student_name.replace(/"/g, '""')}"`,
      `"${r.roll_number || 'N/A'}"`,
      `"${(r.college_name || '').replace(/"/g, '""')}"`,
      `"${r.department || ''}"`,
      `"${r.year || ''}"`,
      `"${r.section || 'N/A'}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.event_name.replace(/"/g, '""')}"`,
      `"${r.participation_type}"`,
      `"${r.team_name ? r.team_name.replace(/"/g, '""') : 'N/A'}"`,
      `"${r.team_size || 1}"`,
      `"${r.emergency_contact || 'N/A'}"`,
      `"${r.bus_required === 1 ? 'YES' : 'NO'}"`,
      `"${r.bus_time || 'N/A'}"`,
      `"${r.created_at}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `COLORIDO_2K26_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionNotice('CSV file extracted and downloaded successfully!');
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Festival Site</span>
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <img src="/college-logo.png" alt="RVR&JC" className="w-8 h-8 object-contain" />
              <div>
                <h1 className="text-sm font-extrabold text-white tracking-wider uppercase">
                  COLORIDO 2K26 Admin Portal
                </h1>
                <p className="text-[10px] text-amber-400 font-semibold">
                  R.V.R. & J.C. College of Engineering (Autonomous)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
                  title="Extract registrations into CSV spreadsheet"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline">Extract CSV File</span>
                  <span className="sm:hidden">CSV</span>
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Sign out from admin panel"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Log Out</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="max-w-md mx-auto py-16">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Administrator Access</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Access student counts, participation records, bus rosters, and CSV exports.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Demo credentials: <span className="font-mono text-amber-400">admin</span> / <span className="font-mono text-amber-400">colorido2026</span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl active:scale-95 transition-all"
                >
                  Verify & Enter Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Real Admin Dashboard matching reference image bottom-right */
          <div className="space-y-8 animate-in fade-in duration-300">
            {actionNotice && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{actionNotice}</span>
              </div>
            )}

            {/* Dashboard Title & Quick Stats Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Registration <span className="text-amber-400">Analytics & Controls</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Real-time SQLite database metrics for COLORIDO 2K26 participants and transit logistics.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={loadAdminData}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh Counts</span>
                  </button>
                  <button
                    onClick={exportCSV}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Extract CSV File</span>
                  </button>
                </div>
              </div>

              {/* Stat Metric Cards (reference image structure) */}
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Total Registrations */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>Total Registrations</span>
                      <Users className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-3xl font-black text-white block">
                      {stats.totalRegistrations}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                      100% Free Entries
                    </span>
                  </div>

                  {/* Internal Students */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>Internal (RVR&JC)</span>
                      <School className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-3xl font-black text-amber-300 block">
                      {stats.internalRegistrations}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Autonomous Campus
                    </span>
                  </div>

                  {/* External Students */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>External Students</span>
                      <Building2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-3xl font-black text-blue-300 block">
                      {stats.externalRegistrations}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Visiting Colleges
                    </span>
                  </div>

                  {/* Bus Requirements */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>Bus Transit Slots</span>
                      <Bus className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-3xl font-black text-cyan-300 block">
                      {stats.busRequirements}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      External Students Only
                    </span>
                  </div>

                  {/* Total Events */}
                  <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>Total Events</span>
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-3xl font-black text-purple-300 block">
                      {stats.totalEvents}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Cultural & Sports
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Participation Analytics Chart Representation (from reference image) */}
            {analytics.length > 0 && (
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">
                      Participation Analytics by Event
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    Distribution of Internal vs External Competitors
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {analytics.slice(0, 9).map((ev) => {
                    const maxVal = Math.max(...analytics.map(a => a.total), 1);
                    const pct = Math.round((ev.total / maxVal) * 100);
                    return (
                      <div key={ev.event_id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-white truncate max-w-[170px]">
                            {ev.event_name}
                          </span>
                          <span className="font-mono text-amber-400 font-bold">
                            {ev.total} delegates
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                          <div
                            style={{ width: `${ev.total === 0 ? 0 : Math.max(pct, 10)}%` }}
                            className={`h-full rounded-full ${
                              ev.category === 'Cultural'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-400'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                          <span>Internal: {ev.internal}</span>
                          <span>External: {ev.external}</span>
                          <span className="uppercase font-semibold text-slate-300">{ev.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Registration Management & CSV Extraction Toolbar */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, roll, reg ID, college..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadAdminData()}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                  {/* Type Filter */}
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="all">All Student Types</option>
                    <option value="internal">Internal Only (RVR&JC)</option>
                    <option value="external">External Only</option>
                  </select>

                  {/* Bus Filter */}
                  <button
                    onClick={() => setBusFilter(!busFilter)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                      busFilter
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Bus Only</span>
                  </button>

                  {/* Extract CSV Button */}
                  <button
                    onClick={exportCSV}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Extract CSV File</span>
                  </button>
                </div>
              </div>

              {/* Registrations Details Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Registration ID</th>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Institution / College</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5">Registered Event</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Bus Slot</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500">
                            {loading ? 'Querying registrations...' : 'No registrations matching current filter.'}
                          </td>
                        </tr>
                      ) : (
                        registrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-3.5 font-mono font-bold text-amber-400 whitespace-nowrap">
                              {reg.registration_id}
                            </td>
                            <td className="p-3.5 whitespace-nowrap font-bold text-white">
                              {reg.student_name}
                              {reg.roll_number && (
                                <span className="block text-[10px] text-slate-400 font-mono">
                                  {reg.roll_number}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 max-w-[180px] truncate text-slate-300">
                              {reg.college_name}
                            </td>
                            <td className="p-3.5 whitespace-nowrap text-slate-300">
                              {reg.department} ({reg.year})
                            </td>
                            <td className="p-3.5 font-medium text-amber-300 whitespace-nowrap">
                              {reg.event_name}
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  reg.student_type === 'internal'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {reg.student_type}
                              </span>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              {reg.bus_required === 1 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                                  <Bus className="w-3 h-3" />
                                  <span>{reg.bus_time || 'YES'}</span>
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[11px]">No Bus</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedReg(reg)}
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                                  title="View Registration Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(reg.registration_id)}
                                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                                  title="Delete Registration"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Selected Registration Details Modal */}
            {selectedReg && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Official Delegate Record
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {selectedReg.student_name} ({selectedReg.registration_id})
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedReg(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Student Type</span>
                      <span className="text-white font-bold uppercase">{selectedReg.student_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Institution / College</span>
                      <span className="text-white font-medium">{selectedReg.college_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Department / Year</span>
                      <span className="text-white font-medium">{selectedReg.department} ({selectedReg.year})</span>
                    </div>
                    {selectedReg.roll_number && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Roll Number</span>
                        <span className="text-white font-mono">{selectedReg.roll_number}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email Address</span>
                      <span className="text-white font-mono">{selectedReg.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Contact Phone</span>
                      <span className="text-white font-mono">{selectedReg.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Registered Event</span>
                      <span className="text-amber-400 font-bold text-sm">{selectedReg.event_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Participation Mode</span>
                      <span className="text-white font-medium">
                        {selectedReg.participation_type} {selectedReg.team_name ? `(${selectedReg.team_name})` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bus Transportation</span>
                      <span className="text-cyan-300 font-bold">
                        {selectedReg.bus_required === 1 ? `YES (${selectedReg.bus_time} Coach)` : 'NO'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Timestamp: {selectedReg.created_at}
                    </span>
                    <button
                      onClick={() => setSelectedReg(null)}
                      className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Alert */}
            {deleteConfirmId && (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-red-200">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>
                    Confirm permanent deletion of registration <strong className="text-white font-mono">{deleteConfirmId}</strong> from SQLite?
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmId)}
                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
