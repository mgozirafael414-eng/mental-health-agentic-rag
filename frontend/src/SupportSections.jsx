import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bell, CalendarDays, Check, Clock, Eye, Lock, LogOut, RefreshCw, Save, Settings, Trash2, UserRound, X } from "lucide-react";
import { cancelAppointment, changeUserPassword, createAppointment, deleteNotification, getAppointments, getNotifications, getUserProfile, markAllNotificationsRead, markNotificationRead, updateAppointment, updateNotificationPreferences, updateUserProfile } from "./services/api";

const types = ["Video consultation", "Phone consultation", "In-person consultation"];
const defaultPreferences = { appointmentReminders: true, wellnessReminders: true, generalNotifications: true };
const statusClass = (status) => `support-status support-status-${String(status).toLowerCase()}`;
const formatDate = (value) => new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

function SectionState({ loading, error, empty, onRetry }) {
  if (loading) return <div className="support-state"><div className="support-spinner" /><p>Loading…</p></div>;
  if (error) return <div className="support-state support-state-error"><AlertTriangle size={28} /><p>{error}</p><button className="support-button" onClick={onRetry}><RefreshCw size={15} /> Retry</button></div>;
  if (empty) return <div className="support-state"><CalendarDays size={30} /><h3>No appointments yet</h3><p>Book an appointment with a mental-health professional when you need additional support.</p></div>;
  return null;
}

export function AppointmentsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [selected, setSelected] = useState(null); const [showForm, setShowForm] = useState(false); const [notice, setNotice] = useState("");
  const emptyForm = { providerName: "", providerRole: "", date: "", time: "", type: types[0], notes: "", communicationMethod: "" };
  const [form, setForm] = useState(emptyForm);
  const load = async () => { setLoading(true); setError(""); try { const result = await getAppointments(); setItems(result.appointments || []); } catch (e) { setError(e.message || "Unable to load appointments."); } finally { setLoading(false); } };
  useEffect(() => {
    let cancelled = false;
    const loadAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getAppointments();
        if (!cancelled) setItems(result.appointments || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Unable to load appointments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAppointments();
    return () => { cancelled = true; };
  }, []);
  const submit = async (event) => { event.preventDefault(); setNotice(""); const startsAt = new Date(`${form.date}T${form.time}`); if (!form.providerName.trim() || !form.providerRole.trim() || !form.date || !form.time || Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) { setNotice("Enter a provider, valid future date, and valid time."); return; } try { const result = await createAppointment({ ...form, startsAt: startsAt.toISOString() }); setItems((previous) => [...previous, result.appointment].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))); setForm(emptyForm); setShowForm(false); setNotice("Appointment requested successfully."); } catch (e) { setNotice(e.message || "Unable to book appointment."); } };
  const cancel = async (appointment) => { try { const result = await cancelAppointment(appointment.id); setItems((previous) => previous.map((item) => item.id === appointment.id ? result.appointment : item)); setSelected(null); } catch (e) { setNotice(e.message || "Unable to cancel appointment."); } };
  const reschedule = async (appointment) => { const next = window.prompt("Enter a new date and time (YYYY-MM-DD HH:MM)"); if (!next) return; const date = new Date(next.replace(" ", "T")); if (Number.isNaN(date.getTime()) || date <= new Date()) { setNotice("Choose a valid future date and time."); return; } try { const result = await updateAppointment(appointment.id, { startsAt: date.toISOString() }); setItems((previous) => previous.map((item) => item.id === appointment.id ? result.appointment : item)); setSelected(result.appointment); } catch (e) { setNotice(e.message || "Unable to reschedule appointment."); } };
  return <div className="support-page"><div className="support-header"><div><p className="support-eyebrow">Professional support</p><h1>Appointments</h1><p>Request and manage appointments with your mental-health professional.</p></div><button className="support-button support-button-primary" onClick={() => setShowForm(true)}><CalendarDays size={16} /> Book Appointment</button></div>{notice && <div className="support-feedback">{notice}</div>}{showForm && <form className="support-card support-form" onSubmit={submit}><div className="support-card-heading"><h2>Book an appointment</h2><button type="button" className="support-icon-button" onClick={() => setShowForm(false)}><X size={17} /></button></div><div className="support-form-grid"><label>Professional/provider<input value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })} placeholder="Provider name" /></label><label>Role/specialization<input value={form.providerRole} onChange={(e) => setForm({ ...form, providerRole: e.target.value })} placeholder="e.g. Clinical psychologist" /></label><label>Date<input type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>Available time<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label><label>Appointment type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{types.map((type) => <option key={type}>{type}</option>)}</select></label><label>Preferred communication<select value={form.communicationMethod} onChange={(e) => setForm({ ...form, communicationMethod: e.target.value })}><option value="">No preference</option><option>Phone</option><option>Email</option></select></label><label className="support-form-wide">Reason/notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></label></div><div className="support-form-actions"><button type="button" className="support-button" onClick={() => setShowForm(false)}>Cancel</button><button className="support-button support-button-primary"><Save size={15} /> Request appointment</button></div></form>}{!showForm && <SectionState loading={loading} error={error} empty={!items.length} onRetry={load} />}{!loading && !error && items.length > 0 && <div className="support-list">{items.map((appointment) => <button className="support-card support-list-item" key={appointment.id} onClick={() => setSelected(appointment)}><div className="support-list-icon"><UserRound size={18} /></div><div className="support-list-main"><strong>{appointment.providerName}</strong><span>{appointment.providerRole}</span><small><CalendarDays size={12} /> {formatDate(appointment.startsAt)} · {appointment.type}</small></div><span className={statusClass(appointment.status)}>{appointment.status}</span></button>)}</div>}{selected && <div className="support-modal-backdrop" onClick={() => setSelected(null)}><div className="support-modal" onClick={(e) => e.stopPropagation()}><div className="support-card-heading"><h2>Appointment details</h2><button className="support-icon-button" onClick={() => setSelected(null)}><X size={17} /></button></div><dl className="support-details"><dt>Provider</dt><dd>{selected.providerName} · {selected.providerRole}</dd><dt>Date and time</dt><dd>{formatDate(selected.startsAt)}</dd><dt>Type</dt><dd>{selected.type}</dd><dt>Status</dt><dd><span className={statusClass(selected.status)}>{selected.status}</span></dd><dt>Notes</dt><dd>{selected.notes || "No notes provided."}</dd><dt>Created</dt><dd>{formatDate(selected.createdAt)}</dd></dl>{!["Completed", "Cancelled"].includes(selected.status) && <div className="support-form-actions"><button className="support-button" onClick={() => reschedule(selected)}>Reschedule</button><button className="support-button support-button-danger" onClick={() => cancel(selected)}>Cancel appointment</button></div>}</div></div>}</div>;
}

export function NotificationsPage() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const loadNotifications = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getNotifications();
        if (!cancelled) setItems(result.notifications || []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Unable to load notifications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadNotifications();
    return () => { cancelled = true; };
  }, []); const unread = useMemo(() => items.filter((item) => !item.isRead).length, [items]);
  const markAll = async () => { try { await markAllNotificationsRead(); setItems((previous) => previous.map((item) => ({ ...item, isRead: true }))); } catch (e) { setError(e.message); } };
  const markRead = async (id) => { try { await markNotificationRead(id); setItems((previous) => previous.map((item) => item.id === id ? { ...item, isRead: true } : item)); } catch (e) { setError(e.message); } };
  const remove = async (id) => { try { await deleteNotification(id); setItems((previous) => previous.filter((item) => item.id !== id)); } catch (e) { setError(e.message); } };
  return <div className="support-page"><div className="support-header"><div><p className="support-eyebrow">Your updates</p><h1>Notifications {unread > 0 && <span className="support-count-badge">{unread}</span>}</h1><p>Appointment updates, wellness reminders, and system messages.</p></div><button className="support-button" disabled={!unread} onClick={markAll}><Check size={15} /> Mark all as read</button></div>{error && <div className="support-feedback support-feedback-error">{error}</div>}{loading ? <SectionState loading /> : !items.length ? <div className="support-state"><Bell size={30} /><h3>No notifications</h3><p>You're all caught up.</p></div> : <div className="support-list">{items.map((item) => <div className={`support-card notification-item ${item.isRead ? "" : "notification-unread"}`} key={item.id} onClick={() => !item.isRead && markRead(item.id)}><div className="support-list-icon"><Bell size={17} /></div><div className="support-list-main"><strong>{item.title}</strong><span>{item.message}</span><small><Clock size={12} /> {formatDate(item.createdAt)} · {item.type}</small></div><button className="support-icon-button" onClick={(e) => { e.stopPropagation(); remove(item.id); }} aria-label="Delete notification"><Trash2 size={15} /></button></div>)}</div>}</div>;
}

export function SettingsPage({ user, onUserUpdated, onLogout }) {
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "" }); const [preferences, setPreferences] = useState(defaultPreferences); const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" }); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(""); const [notice, setNotice] = useState(""); const [theme, setTheme] = useState(localStorage.getItem("mindcare_theme") || "system");
  useEffect(() => {
    let cancelled = false;
    const loadSettings = async () => {
      try {
        const result = await getUserProfile();
        if (!cancelled) {
          setProfile({ name: result.user.name, email: result.user.email });
          setPreferences(result.user.notificationPreferences || defaultPreferences);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Unable to load settings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadSettings();
    return () => { cancelled = true; };
  }, []);
  const saveProfile = async (event) => { event.preventDefault(); setSaving(true); setError(""); try { const result = await updateUserProfile(profile); onUserUpdated(result.user); localStorage.setItem("mental_health_user", JSON.stringify(result.user)); setNotice("Settings updated successfully."); } catch (e) { setError(e.message); } finally { setSaving(false); } };
  const savePreferences = async (next) => { setPreferences(next); try { const result = await updateNotificationPreferences(next); onUserUpdated(result.user); setNotice("Notification preferences updated."); } catch (e) { setError(e.message); } };
  const savePassword = async (event) => { event.preventDefault(); setSaving(true); try { await changeUserPassword(passwords.currentPassword, passwords.newPassword); setPasswords({ currentPassword: "", newPassword: "" }); setNotice("Password changed successfully."); } catch (e) { setError(e.message); } finally { setSaving(false); } };
  const changeTheme = (value) => { setTheme(value); localStorage.setItem("mindcare_theme", value); document.documentElement.dataset.theme = value; };
  if (loading) return <div className="support-page"><SectionState loading /></div>;
  return <div className="support-page"><div className="support-header"><div><p className="support-eyebrow">MindCare account</p><h1>Settings</h1><p>Manage your profile, preferences, privacy, and security.</p></div></div>{error && <div className="support-feedback support-feedback-error">{error}</div>}{notice && <div className="support-feedback">{notice}</div>}<div className="settings-grid"><form className="support-card settings-card" onSubmit={saveProfile}><div className="support-card-heading"><h2><UserRound size={18} /> Profile</h2></div><label>Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required /></label><label>Email<input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required /></label><button className="support-button support-button-primary" disabled={saving}><Save size={15} /> Save profile</button></form><div className="support-card settings-card"><div className="support-card-heading"><h2><Settings size={18} /> Appearance</h2></div><label>Theme<select value={theme} onChange={(e) => changeTheme(e.target.value)}><option value="system">System default</option><option value="light">Light mode</option><option value="dark">Dark mode</option></select></label><p className="support-muted">Your preference is stored locally on this device.</p></div><div className="support-card settings-card"><div className="support-card-heading"><h2><Bell size={18} /> Notifications</h2></div>{Object.entries(preferences).map(([key, value]) => <label className="support-toggle" key={key}><span>{key.replace(/([A-Z])/g, " $1")}</span><input type="checkbox" checked={value} onChange={(e) => savePreferences({ ...preferences, [key]: e.target.checked })} /><i /></label>)}</div><form className="support-card settings-card" onSubmit={savePassword}><div className="support-card-heading"><h2><Lock size={18} /> Security</h2></div><label>Current password<input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required /></label><label>New password<input type="password" minLength={6} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required /></label><button className="support-button support-button-primary" disabled={saving}><Lock size={15} /> Change password</button></form><div className="support-card settings-card"><div className="support-card-heading"><h2><Eye size={18} /> Privacy</h2></div><p className="support-muted">Your conversations, appointments, notifications, and profile data are scoped to your authenticated account. MindCare does not display another user’s private information.</p><button className="support-button support-button-danger" onClick={onLogout}><LogOut size={15} /> Log out</button></div></div></div>;
}
