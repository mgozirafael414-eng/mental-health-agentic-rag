
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  UserRound,
  X,
} from "lucide-react";

import {
  getAdminAppointments,
  getAdminDashboard,
  getAdminNotifications,
  getAdminResources,
  getAdminProfessionals,
  getAdminUsers,
  getAuditLogs,
  getOwnerAdmins,
  getUserProfile,
  updateAdminAppointment,
  updateAdminUser,
  createAdminNotification,
  uploadAdminResource,
} from "./services/api";

import "./admin.css";


/* =========================================================
   HELPERS
========================================================= */

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};


const roleLabel = (role) =>
  role === "OWNER"
    ? "Owner"
    : role === "ADMIN"
      ? "Admin"
      : role === "PROFESSIONAL"
        ? "Professional"
        : "User";


/* =========================================================
   GENERIC DATA LOADER
========================================================= */

const useLoader = (load, dependencies = [], onError) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setState((current) => ({
        ...current,
        loading: true,
      }));

      try {
        const data = await load();

        if (!cancelled) {
          setState({
            data,
            loading: false,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
          });

          if (onError) {
            onError(
              error?.message ||
                "Something went wrong while loading the data."
            );
          }
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [load, onError, ...dependencies]);

  return state;
};


/* =========================================================
   ADMIN APP
========================================================= */

export default function AdminApp({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  /*
    IMPORTANT:
    refresh must be state.
    Previously it was:
      const refresh = 0;

    That value never changed, so updated data
    could not be reloaded.
  */
  const [refresh, setRefresh] = useState(0);

  /*
    Stable refresh function.
  */
  const handleRefresh = useCallback(() => {
    setRefresh((value) => value + 1);
  }, []);

  /*
    Stable error handler.
    This prevents useLoader effects from being
    unnecessarily recreated because onError changes.
  */
  const handleError = useCallback((message) => {
    setError(
      message ||
        "Something went wrong. Please try again."
    );
  }, []);


  /* =======================================================
     AUTH CHECK
  ======================================================= */

  useEffect(() => {
    let active = true;

    getUserProfile()
      .then((result) => {
        if (!active) return;

        const currentUser = result?.user;

        if (currentUser) {
          localStorage.setItem(
            "mental_health_user",
            JSON.stringify(currentUser)
          );
        }

        /*
          Only ADMIN and OWNER can access this console.
        */
        if (
          !["ADMIN", "OWNER"].includes(
            currentUser?.role
          )
        ) {
          onLogout();
          return;
        }

        setAuthChecked(true);
      })
      .catch((authError) => {
        if (!active) return;

        setError(
          authError?.message ||
            "Your session is no longer valid. Please log in again."
        );

        onLogout();
      });

    return () => {
      active = false;
    };
  }, [onLogout]);


  /* =======================================================
     ROLE
  ======================================================= */

  const isOwner = user?.role === "OWNER";


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigation = isOwner
    ? [
        ["overview", BarChart3, "Overview"],
        ["users", Users, "Users"],
        ["appointments", CalendarDays, "Appointments"],
        ["notifications", Bell, "Notifications"],
        ["activity", ClipboardList, "System Activity"],
      ]
    : [
        ["overview", BarChart3, "Overview"],
        ["users", Users, "Users"],
        ["professionals", UserRound, "Professionals"],
        ["appointments", CalendarDays, "Appointments"],
        ["notifications", Bell, "Notifications"],
        ["resources", BookOpen, "Resources"],
        ["activity", ClipboardList, "System Activity"],
      ];


  /* =======================================================
     AUTH LOADING
  ======================================================= */

  if (!authChecked) {
    return (
      <div className="admin-state admin-console-loading">
        <RefreshCw className="admin-spin" />
        Verifying secure session…
      </div>
    );
  }


  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="admin-shell">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <ShieldCheck size={22} />

          <span>
            MindCare
            <br />

            <small>
              {isOwner
                ? "Owner Console"
                : "Admin Dashboard"}
            </small>
          </span>
        </div>


        <nav>
          {navigation.map(
            ([id, Icon, label]) => (
              <button
                className={
                  page === id
                    ? "active"
                    : ""
                }
                key={id}
                onClick={() => {
                  setPage(id);
                  setError("");
                }}
              >
                <Icon size={17} />
                {label}
              </button>
            )
          )}


          {isOwner && (
            <button
              className={
                page === "admins"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setPage("admins");
                setError("");
              }}
            >
              <ShieldCheck size={17} />
              Administrators
            </button>
          )}
        </nav>


        <button
          className="admin-logout"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Log out
        </button>

      </aside>


      {/* MAIN */}
      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <span className="admin-kicker">
              {isOwner
                ? "Owner"
                : "Administrator"}
            </span>

            <h1>
              {page[0].toUpperCase() +
                page.slice(1)}
            </h1>
          </div>

          <span className="admin-user">
            {user?.name}
          </span>

        </header>


        {/* ERROR */}
        {error && (
          <div className="admin-error">
            <AlertTriangle size={15} />

            {error}

            <button
              onClick={() =>
                setError("")
              }
            >
              <X size={14} />
            </button>
          </div>
        )}


        {/* CONTENT */}
        <AdminContent
          page={page}
          isOwner={isOwner}
          refresh={refresh}
          onError={handleError}
          onRefresh={handleRefresh}
        />

      </main>

    </div>
  );
}


/* =========================================================
   ADMIN CONTENT ROUTER
========================================================= */

function AdminContent({
  page,
  isOwner,
  refresh,
  onError,
  onRefresh,
}) {
  if (page === "overview") {
    return (
      <Overview
        refresh={refresh}
        onError={onError}
      />
    );
  }

  if (page === "users") {
    return (
      <UsersPage
        refresh={refresh}
        onError={onError}
        onRefresh={onRefresh}
      />
    );
  }

  if (
    page === "professionals" &&
    !isOwner
  ) {
    return (
      <ProfessionalsPage
        refresh={refresh}
        onError={onError}
      />
    );
  }

  if (
    page === "resources" &&
    !isOwner
  ) {
    return <ResourcesPage refresh={refresh} onError={onError} onRefresh={onRefresh} />;
  }

  if (page === "appointments") {
    return (
      <AppointmentsPage
        refresh={refresh}
        onError={onError}
        onRefresh={onRefresh}
      />
    );
  }

  if (page === "notifications") {
    return (
      <NotificationsPage
        refresh={refresh}
        onError={onError}
        onRefresh={onRefresh}
      />
    );
  }

  if (page === "activity") {
    return (
      <ActivityPage
        refresh={refresh}
        onError={onError}
      />
    );
  }

  if (
    page === "admins" &&
    isOwner
  ) {
    return (
      <AdminsPage
        refresh={refresh}
        onError={onError}
      />
    );
  }

  return null;
}


/* =========================================================
   LOAD STATE
========================================================= */

function LoadState({
  loading,
  error,
  retry,
}) {
  if (loading) {
    return (
      <div className="admin-state">
        <RefreshCw className="admin-spin" />
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-state">
        <AlertTriangle size={22} />

        <p>{error}</p>

        <button onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

  return null;
}


/* =========================================================
   OVERVIEW
========================================================= */

function Overview({
  refresh,
  onError,
}) {
  const { data, loading } =
    useLoader(
      getAdminDashboard,
      [refresh],
      onError
    );

  if (loading) {
    return <LoadState loading />;
  }

  if (!data) {
    return (
      <LoadState
        error="Unable to load overview."
        retry={() =>
          window.location.reload()
        }
      />
    );
  }

  const stats = data?.stats || {};

  const cards = [
    [
      "Total users",
      stats.totalUsers ?? 0,
    ],
    [
      "Active users",
      stats.activeUsers ?? 0,
    ],
    [
      "Admin users",
      stats.adminUsers ?? 0,
    ],
    [
      "Professionals",
      stats.professionals ??
        "Not available",
    ],
    [
      "Appointments",
      stats.totalAppointments ?? 0,
    ],
    [
      "Pending appointments",
      stats.pendingAppointments ?? 0,
    ],
    [
      "Completed appointments",
      stats.completedAppointments ?? 0,
    ],
    ["Wellness check-ins", stats.wellnessCheckIns ?? 0],
    ["Resources", stats.resources ?? 0],
    ["Conversations", stats.conversations ?? 0],
  ];

  return (
    <section className="admin-grid">

      {cards.map(
        ([label, value]) => (
          <article
            className="admin-stat"
            key={label}
          >
            <span>{label}</span>

            <strong>{value}</strong>
          </article>
        )
      )}

    </section>
  );
}


/* =========================================================
   USERS
========================================================= */

function UsersPage({
  refresh,
  onError,
  onRefresh,
}) {
  const [search, setSearch] =
    useState("");


  /*
    IMPORTANT FIX:

    Previously:
      useLoader(
        () => getAdminUsers({ search }),
        ...
      )

    The anonymous function was recreated
    on every render.

    That caused useLoader's useEffect to run
    repeatedly and generate many API requests.

    useCallback keeps the function stable until
    search actually changes.
  */
  const loadUsers = useCallback(
    () => getAdminUsers({ search }),
    [search]
  );


  const { data, loading } =
    useLoader(
      loadUsers,
      [refresh],
      onError
    );


  const users =
    data?.users || [];


  return (
    <section className="admin-panel">

      <div className="admin-toolbar">

        <div className="admin-search">
          <Search size={15} />

          <input
            placeholder="Search users…"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

      </div>


      {loading ? (
        <LoadState loading />
      ) : (
        <div className="admin-table-wrap">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {users.map(
                (item) => (
                  <tr
                    key={item.id}
                  >

                    <td>
                      {item.name}
                    </td>

                    <td>
                      {item.email}
                    </td>

                    <td>
                      <span className="admin-badge">
                        {roleLabel(
                          item.role
                        )}
                      </span>
                    </td>

                    <td>
                      {item.isActive
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td>
                      {formatDate(
                        item.createdAt
                      )}
                    </td>

                    <td>
                      {item.role !==
                        "OWNER" && (
                        <button
                          onClick={async () => {
                            try {
                              await updateAdminUser(
                                item.id,
                                {
                                  isActive:
                                    !item.isActive,
                                }
                              );

                              /*
                                Refresh users
                                after successful update.
                              */
                              onRefresh();
                            } catch (e) {
                              onError(
                                e?.message ||
                                  "Unable to update user."
                              );
                            }
                          }}
                        >
                          {item.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>


          {!users.length && (
            <div className="admin-empty">
              No users found.
            </div>
          )}

        </div>
      )}

    </section>
  );
}


/* =========================================================
   PROFESSIONALS
========================================================= */

function ProfessionalsPage({
  refresh,
  onError,
}) {
  const { data, loading } =
    useLoader(
      getAdminProfessionals,
      [refresh],
      onError
    );

  const professionals =
    data?.professionals || [];


  return (
    <section className="admin-panel">

      <div className="admin-panel-title">
        <h2>Professionals</h2>
      </div>


      {loading ? (
        <LoadState loading />
      ) : (
        <div className="admin-table-wrap">

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>


            <tbody>

              {professionals.map(
                (item) => (
                  <tr
                    key={item.id}
                  >
                    <td>
                      {item.name}
                    </td>

                    <td>
                      {item.email}
                    </td>

                    <td>
                      {item.isActive
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td>
                      {formatDate(
                        item.createdAt
                      )}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>


          {!professionals.length && (
            <div className="admin-empty">
              No professional accounts found.
            </div>
          )}

        </div>
      )}

    </section>
  );
}


/* =========================================================
   RESOURCES
========================================================= */

function ResourcesPage({ refresh, onError, onRefresh }) {
  const { data, loading } = useLoader(getAdminResources, [refresh], onError);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setStatus("");
    if (!file) return setStatus("Select a .txt or .md file first.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    setSubmitting(true);
    try {
      const result = await uploadAdminResource(formData);
      setStatus(result.message || "Resource uploaded successfully.");
      setTitle("");
      setDescription("");
      setFile(null);
      event.target.reset();
      onRefresh();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-panel">

      <div className="admin-panel-title">
        <h2>Resources</h2>
      </div>

      <form className="admin-content-form" onSubmit={submit}>
        <label>Resource title<input value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
        <label>Category<input value={category} onChange={(event) => setCategory(event.target.value)} required /></label>
        <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="2" /></label>
        <label>File (.txt or .md)<input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={(event) => setFile(event.target.files?.[0] || null)} required /></label>
        <button className="admin-primary-button" type="submit" disabled={submitting}>{submitting ? "Uploading..." : "Upload Resource"}</button>
        {status && <p className="admin-form-status">{status}</p>}
      </form>

      {loading ? <LoadState loading /> : (
        <div className="admin-list">
          {(data?.resources || []).map((resource) => (
            <div className="admin-list-item" key={resource.id}>
              <BookOpen size={16} />
              <div><strong>{resource.title}</strong><p>{resource.shortDescription || "No description"}</p><small>{resource.category} · {formatDate(resource.dateUpdated)}</small></div>
            </div>
          ))}
          {!data?.resources?.length && <div className="admin-empty">No resources found.</div>}
        </div>
      )}

    </section>
  );
}


/* =========================================================
   APPOINTMENTS
========================================================= */

function AppointmentsPage({
  refresh,
  onError,
  onRefresh,
}) {
  const { data, loading } =
    useLoader(
      getAdminAppointments,
      [refresh],
      onError
    );

  const items =
    data?.appointments || [];


  return (
    <section className="admin-panel">

      <div className="admin-panel-title">
        <h2>System appointments</h2>
      </div>


      {loading ? (
        <LoadState loading />
      ) : (
        <div className="admin-table-wrap">

          <table>

            <thead>
              <tr>
                <th>User</th>
                <th>Provider</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {items.map(
                (item) => (
                  <tr
                    key={item.id}
                  >

                    <td>
                      {item.user?.name}

                      <small>
                        {item.user?.email}
                      </small>
                    </td>


                    <td>
                      {item.providerName}

                      <small>
                        {item.providerRole}
                      </small>
                    </td>


                    <td>
                      {formatDate(
                        item.startsAt
                      )}
                    </td>


                    <td>
                      <span className="admin-badge">
                        {item.status}
                      </span>
                    </td>


                    <td>

                      <select
                        value={
                          item.status
                        }
                        onChange={async (
                          e
                        ) => {
                          try {
                            await updateAdminAppointment(
                              item.id,
                              {
                                status:
                                  e.target
                                    .value,
                              }
                            );

                            /*
                              Refresh after
                              successful update.
                            */
                            onRefresh();
                          } catch (
                            error
                          ) {
                            onError(
                              error?.message ||
                                "Unable to update appointment."
                            );
                          }
                        }}
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                      </select>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>


          {!items.length && (
            <div className="admin-empty">
              No appointments found.
            </div>
          )}

        </div>
      )}

    </section>
  );
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationsPage({
  refresh,
  onError,
  onRefresh,
}) {
  const { data, loading } =
    useLoader(
      getAdminNotifications,
      [refresh],
      onError
    );

  const items =
    data?.notifications || [];
  const { data: usersData } = useLoader(getAdminUsers, [], onError);
  const [audience, setAudience] = useState("ALL");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const users = usersData?.users || [];
  const recipients = users.filter((user) => user.isActive && ((audience === "USER" && user.role === "USER") || (audience === "PROFESSIONAL" && user.role === "PROFESSIONAL")));

  const send = async (event) => {
    event.preventDefault();
    setStatus("");
    setSending(true);
    try {
      const result = await createAdminNotification({
        audience,
        ...(recipient ? { userId: Number(recipient) } : {}),
        title,
        message,
      });
      setStatus(`Notification sent to ${result.count} recipient${result.count === 1 ? "" : "s"}.`);
      setTitle("");
      setMessage("");
      setRecipient("");
      onRefresh();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSending(false);
    }
  };


  return (
    <section className="admin-panel">

      <div className="admin-panel-title">
        <h2>Notification activity</h2>
      </div>

      <form className="admin-content-form" onSubmit={send}>
        <label>Audience<select value={audience} onChange={(event) => { setAudience(event.target.value); setRecipient(""); }}><option value="ALL">All active users</option><option value="USERS">Users only</option><option value="PROFESSIONALS">Professionals only</option><option value="USER">Specific user</option><option value="PROFESSIONAL">Specific professional</option></select></label>
        {(audience === "USER" || audience === "PROFESSIONAL") && <label>Recipient<select value={recipient} onChange={(event) => setRecipient(event.target.value)} required><option value="">Select recipient</option>{recipients.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}</select></label>}
        <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
        <label>Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows="3" required /></label>
        <button className="admin-primary-button" type="submit" disabled={sending}>{sending ? "Sending..." : "Send Notification"}</button>
        {status && <p className="admin-form-status">{status}</p>}
      </form>


      {loading ? (
        <LoadState loading />
      ) : (
        <div className="admin-list">

          {items.map(
            (item) => (
              <div
                className="admin-list-item"
                key={item.id}
              >

                <Bell size={16} />

                <div>

                  <strong>
                    {item.title}
                  </strong>

                  <p>
                    {item.message}
                  </p>

                  <small>
                    {item.user?.name ||
                      "User"}{" "}
                    ·{" "}
                    {formatDate(
                      item.createdAt
                    )}
                  </small>

                </div>

              </div>
            )
          )}


          {!items.length && (
            <div className="admin-empty">
              No notification activity found.
            </div>
          )}

        </div>
      )}

    </section>
  );
}


/* =========================================================
   SYSTEM ACTIVITY
========================================================= */

function ActivityPage({
  refresh,
  onError,
}) {
  const { data, loading } =
    useLoader(
      getAuditLogs,
      [refresh],
      onError
    );

  const logs =
    data?.logs || [];


  return (
    <section className="admin-panel">

      <div className="admin-panel-title">
        <h2>System activity</h2>
      </div>


      {loading ? (
        <LoadState loading />
      ) : (
        <div className="admin-list">

          {logs.map(
            (log) => (
              <div
                className="admin-list-item"
                key={log.id}
              >

                <ClipboardList size={16} />

                <div>

                  <strong>
                    {log.action}
                  </strong>

                  <p>
                    {log.entity}{" "}
                    {log.entityId || ""}
                  </p>

                  <small>
                    {log.user?.name ||
                      "System"}{" "}
                    ·{" "}
                    {formatDate(
                      log.createdAt
                    )}
                  </small>

                </div>

              </div>
            )
          )}


          {!logs.length && (
            <div className="admin-empty">
              No audit activity found.
            </div>
          )}

        </div>
      )}

    </section>
  );
}


/* =========================================================
   ADMINISTRATORS
========================================================= */

function AdminsPage({
  refresh,
  onError,
}) {
  const { data, loading } =
    useLoader(
      getOwnerAdmins,
      [refresh],
      onError
    );

  const admins =
    data?.admins || [];


  return (
    <section className="admin-panel">

      <div className="admin-panel-title">
        <h2>Administrators</h2>
      </div>


      {loading ? (
        <LoadState loading />
      ) : (
        <div className="admin-list">

          {admins.map(
            (admin) => (
              <div
                className="admin-list-item"
                key={admin.id}
              >

                <ShieldCheck size={16} />

                <div>

                  <strong>
                    {admin.name}
                  </strong>

                  <p>
                    {admin.email}
                  </p>

                  <small>
                    {roleLabel(
                      admin.role
                    )}{" "}
                    ·{" "}
                    {admin.isActive
                      ? "Active"
                      : "Inactive"}
                  </small>

                </div>

              </div>
            )
          )}


          {!admins.length && (
            <div className="admin-empty">
              No administrators found.
            </div>
          )}

        </div>
      )}

    </section>
  );
}
