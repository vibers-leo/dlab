'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/components/portal-auth-context';

interface Client {
  id: number;
  login_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  entity_id: number | null;
  entity_name: string | null;
  credits: number;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
}

interface Entity {
  id: number;
  name: string;
}

export default function AdminClientsPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = usePortalAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creditModal, setCreditModal] = useState<Client | null>(null);
  const [addForm, setAddForm] = useState({ login_id: '', password: '', name: '', email: '', phone: '', entity_id: '', role: 'client' });
  const [creditForm, setCreditForm] = useState({ amount: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/portal');
  }, [loading, user, router]);

  const fetchClients = () => {
    setFetching(true);
    Promise.all([
      fetch('/api/portal/admin/clients').then(r => r.json()),
      fetch('/api/portal/admin/entities').then(r => r.json()).catch(() => ({ items: [] })),
    ]).then(([c, e]) => {
      setClients(c.items ?? c ?? []);
      setEntities(e.items ?? e ?? []);
    }).finally(() => setFetching(false));
  };

  useEffect(() => { if (isAdmin) fetchClients(); }, [isAdmin]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = { ...addForm, entity_id: addForm.entity_id ? Number(addForm.entity_id) : null };
      const r = await fetch('/api/portal/admin/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error();
      setShowAddModal(false);
      setAddForm({ login_id: '', password: '', name: '', email: '', phone: '', entity_id: '', role: 'client' });
      fetchClients();
    } catch { alert('계정 추가 실패'); }
    finally { setSubmitting(false); }
  };

  const handleCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditModal) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/api/portal/admin/clients/${creditModal.id}/credits`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(creditForm.amount), description: creditForm.description }),
      });
      if (!r.ok) throw new Error();
      setCreditModal(null);
      setCreditForm({ amount: '', description: '' });
      fetchClients();
    } catch { alert('크레딧 지급 실패'); }
    finally { setSubmitting(false); }
  };

  if (loading || !isAdmin) return null;

  const inputStyle = { backgroundColor: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)', color: 'rgba(255,255,255,0.85)' };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = { admin: '#F59E0B', client: '#60A5FA' };
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${colors[role] ?? '#60A5FA'}20`, color: colors[role] ?? '#60A5FA' }}>
        {role}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white/90">클라이언트 관리</h1>
        <button onClick={() => setShowAddModal(true)} className="text-xs font-medium px-4 py-2 rounded-xl transition-all"
          style={{ backgroundColor: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)' }}>
          계정 추가
        </button>
      </div>

      {fetching ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(96,165,250,0.08)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'rgba(96,165,250,0.04)' }}>
                {['이름', '로그인 ID', '엔티티', '크레딧', '역할', '상태', '마지막 로그인', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="transition-colors" style={{ borderTop: '1px solid rgba(96,165,250,0.06)' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(96,165,250,0.03)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td className="px-4 py-3 text-white/80 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-white/50">{c.login_id}</td>
                  <td className="px-4 py-3 text-white/40">{c.entity_name ?? '-'}</td>
                  <td className="px-4 py-3 text-white/70 font-mono">{c.credits.toLocaleString()}</td>
                  <td className="px-4 py-3">{roleBadge(c.role)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      backgroundColor: c.is_active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                      color: c.is_active ? '#22C55E' : 'rgba(255,255,255,0.3)',
                    }}>{c.is_active ? 'active' : 'inactive'}</span>
                  </td>
                  <td className="px-4 py-3 text-white/30 text-xs">{c.last_login_at ? new Date(c.last_login_at).toLocaleDateString('ko') : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setCreditModal(c); setCreditForm({ amount: '', description: '' }); }}
                        className="text-[10px] px-2 py-1 rounded-lg" style={{ color: '#60A5FA', border: '1px solid rgba(96,165,250,0.15)' }}>
                        크레딧
                      </button>
                      <button className="text-[10px] px-2 py-1 rounded-lg" style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        편집
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleAdd}
            className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#0a1a2f', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 className="text-sm font-bold text-white/90">계정 추가</h3>
            {[
              { k: 'login_id', label: '로그인 ID', required: true },
              { k: 'password', label: '비밀번호', required: true, type: 'password' },
              { k: 'name', label: '이름', required: true },
              { k: 'email', label: '이메일', type: 'email' },
              { k: 'phone', label: '연락처' },
            ].map(f => (
              <div key={f.k} className="space-y-1">
                <label className="text-xs text-white/40">{f.label}</label>
                <input type={f.type ?? 'text'} required={f.required}
                  value={(addForm as Record<string, string>)[f.k]} onChange={e => setAddForm(prev => ({ ...prev, [f.k]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-xs text-white/40">엔티티</label>
              <select value={addForm.entity_id} onChange={e => setAddForm(prev => ({ ...prev, entity_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="">없음</option>
                {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">역할</label>
              <select value={addForm.role} onChange={e => setAddForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="client">client</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl text-sm text-white/30" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>취소</button>
              <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                style={{ backgroundColor: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }}>
                {submitting ? '...' : '추가'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Credit Modal */}
      {creditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setCreditModal(null)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleCredit}
            className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ backgroundColor: '#0a1a2f', border: '1px solid rgba(96,165,250,0.15)' }}>
            <h3 className="text-sm font-bold text-white/90">크레딧 지급 — {creditModal.name}</h3>
            <p className="text-xs text-white/40">현재 잔액: <span className="text-white/70 font-mono">{creditModal.credits.toLocaleString()}</span></p>
            <div className="space-y-1">
              <label className="text-xs text-white/40">금액 (+/-)</label>
              <input type="number" required value={creditForm.amount} onChange={e => setCreditForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} placeholder="예: 10000 또는 -5000" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/40">사유</label>
              <input type="text" value={creditForm.description} onChange={e => setCreditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setCreditModal(null)} className="flex-1 py-2 rounded-xl text-sm text-white/30" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>취소</button>
              <button type="submit" disabled={submitting} className="flex-1 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                style={{ backgroundColor: 'rgba(96,165,250,0.15)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)' }}>
                {submitting ? '...' : '지급'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
