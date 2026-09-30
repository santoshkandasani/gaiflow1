import React, { useState, useEffect } from 'react';
import { Registration } from '../types/index.ts';
import {
  X,
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
  AlertCircle
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

interface AdminStats {
  totalRegistrations: number;
  internalRegistrations: number;
  externalRegistrations: number;
  busRequirements: number;
  totalEvents: number;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('colorido2026');
  const [authError, setAuthError] = useState<string | null>(null);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [busFilter, setBusFilter] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAdminData();
    }
  }, [isOpen, isAuthenticated, typeFilter, busFilter]);

  if (!isOpen) return null;

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

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      let url = `/api/admin/registrations?student_type=${typeFilter}`;
      if (busFilter) url += '&bus_required=1';
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
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
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
      'Bus Required',
      'Bus Time',
      'Registration Date',
    ];

    const rows = registrations.map((r) => [
      `"${r.registration_id}"`,
      `"${r.student_type}"`,
      `"${r.student_name}"`,
      `"${r.roll_number || ''}"`,
      `"${r.college_name}"`,
      `"${r.department}"`,
      `"${r.year}"`,
      `"${r.section || ''}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.event_name}"`,
      `"${r.participation_type}"`,
      `"${r.bus_required === 1 ? 'YES' : 'NO'}"`,
      `"${r.bus_time || ''}"`,
      `"${r.created_at}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `colorido_2k26_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/40">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Faculty & Admin Dashboard
              </h3>
              <p className="text-[11px] text-amber-400 font-semibold">
                COLORIDO 2K26 Registration Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-100">
          {!isAuthenticated ? (
            /* Login Screen */
            <div className="max-w-md mx-auto py-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto mb-3">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">Admin Authentication</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access live student registrations, bus dispatch lists, and festival analytics.
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Demo credentials: <span className="text-amber-400 font-mono">admin</span> / <span className="text-amber-400 font-mono">colorido2026</span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95"
                >
                  Verify & Enter Dashboard
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard Content */
            <div className="space-y-6">
              {actionNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{actionNotice}</span>
                </div>
              )}

              {/* Stats Widgets */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                      Total Registered
                    </span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {stats.totalRegistrations}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-amber-400 font-semibold uppercase block">
                      Internal (RVR&JC)
                    </span>
                    <span className="text-2xl font-black text-amber-300 mt-1 block">
                      {stats.internalRegistrations}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-blue-400 font-semibold uppercase block">
                      External Students
                    </span>
                    <span className="text-2xl font-black text-blue-300 mt-1 block">
                      {stats.externalRegistrations}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-cyan-400 font-semibold uppercase block">
                      Bus Passengers
                    </span>
                    <span className="text-2xl font-black text-cyan-300 mt-1 block">
                      {stats.busRequirements}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-purple-400 font-semibold uppercase block">
                      Total Events
                    </span>
                    <span className="text-2xl font-black text-purple-300 mt-1 block">
                      {stats.totalEvents}
                    </span>
                  </div>
                </div>
              )}

              {/* Filter & Search Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex-1 w-full md:w-auto relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, ID (e.g. CLR26-), roll number, college..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadAdminData()}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="all">All Student Types</option>
                    <option value="internal">Internal Students</option>
                    <option value="external">External Students</option>
                  </select>

                  <button
                    onClick={() => setBusFilter(!busFilter)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                      busFilter
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Bus Only</span>
                  </button>

                  <button
                    onClick={loadAdminData}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={exportCSV}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:from-amber-400 hover:to-yellow-300 transition-all shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Table / List View */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 sticky top-0 z-10">
                      <tr>
                        <th className="p-3">Reg ID</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Affiliation / College</th>
                        <th className="p-3">Event</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Bus Details</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            {loading ? 'Fetching records...' : 'No registrations found matching the filters.'}
                          </td>
                        </tr>
                      ) : (
                        registrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                              {reg.registration_id}
                            </td>
                            <td className="p-3 whitespace-nowrap font-semibold text-white">
                              {reg.student_name}
                              {reg.roll_number && (
                                <span className="block text-[10px] text-slate-400 font-mono">
                                  {reg.roll_number}
                                </span>
                              )}
                            </td>
                            <td className="p-3 max-w-[180px] truncate text-slate-300">
                              {reg.college_name}
                            </td>
                            <td className="p-3 font-medium text-slate-200 whitespace-nowrap">
                              {reg.event_name}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  reg.student_type === 'internal'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {reg.student_type}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              {reg.bus_required === 1 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                  <Bus className="w-3 h-3" />
                                  <span>{reg.bus_time || 'Yes'}</span>
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedReg(reg)}
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(reg.registration_id)}
                                  className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

              {/* Selected Registration Details Modal */}
              {selectedReg && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-400/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Full Registration Profile
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {selectedReg.student_name} ({selectedReg.registration_id})
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedReg(null)}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
                    >
                      Close Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Affiliation</span>
                      <span className="text-white font-medium">{selectedReg.college_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Department / Year</span>
                      <span className="text-white font-medium">
                        {selectedReg.department} ({selectedReg.year})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email</span>
                      <span className="text-white font-mono">{selectedReg.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone</span>
                      <span className="text-white font-mono">{selectedReg.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Event Name</span>
                      <span className="text-amber-400 font-bold">{selectedReg.event_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Participation Mode</span>
                      <span className="text-white">
                        {selectedReg.participation_type} {selectedReg.team_name ? `(${selectedReg.team_name})` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Bus Requirement</span>
                      <span className="text-cyan-300">
                        {selectedReg.bus_required === 1 ? `YES (${selectedReg.bus_time})` : 'NO'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Timestamp</span>
                      <span className="text-slate-400 font-mono text-[11px]">{selectedReg.created_at}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Alert */}
              {deleteConfirmId && (
                <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-red-200">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>
                      Are you sure you want to permanently delete registration <strong className="text-white font-mono">{deleteConfirmId}</strong> from SQLite?
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirmId)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
