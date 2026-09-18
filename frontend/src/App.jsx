import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import AdminApp from "./AdminApp.jsx";
import ProfessionalApp from "./ProfessionalApp.jsx";

import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Filter,
  HeartPulse,
  Home,
  Info,
  LogOut,
  Menu,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  Pause,
  Pencil,
  Pin,
  PinOff,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";

import {
  createConversation,
  deleteConversation,
  getConversation,
  getConversations,
  getStoredUser,
  isAuthenticated,
  loginUser,
  logoutUser,
  registerUser,
  sendChatMessage,
  renameConversation,
  togglePinConversation,
  toggleArchiveConversation,
  clearConversationMessages,
  getResources,
  getResource,
  getResourceCategories,
  toggleResourceBookmark,
  getBookmarkedResources,
  getRecentlyViewedResources,
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUserProfile,
  getWellnessCheckIns,
  createWellnessCheckIn,
  updateUserProfile,
  changeUserPassword,
  updateNotificationPreferences,
} from "./services/api";

import "./App.css";
import "./chat-ui-overrides.css";
import { AppointmentsPage, NotificationsPage, SettingsPage } from "./SupportSections.jsx";

// ========================================
// MARKDOWN CLEANER
// ========================================

const cleanMarkdown = (content = "") => {
  return String(content)
    .replace(/\\\*\*/g, "**")
    .replace(/\\#/g, "#")
    .replace(/\\_/g, "_")
    .replace(/\\`/g, "`")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")");
};

// ========================================
// APP
// ========================================

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    isAuthenticated()
  );

  const [user, setUser] = useState(
    getStoredUser()
  );

  const [authMode, setAuthMode] = useState("login");

  const [currentPage, setCurrentPage] = useState(
    "dashboard"
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantConversationId, setAssistantConversationId] = useState(null);

  const [authLoading, setAuthLoading] = useState(
    true
  );

  // ========================================
  // AUTH CHECK
  // ========================================

  useEffect(() => {
    let cancelled = false;

    const checkAuthentication = async () => {
      const authenticated = isAuthenticated();
      const storedUser = getStoredUser();

      if (!authenticated || !storedUser) {
        if (!cancelled) {
          setIsLoggedIn(false);
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      try {
        // The backend is authoritative. Do not trust a stale localStorage role.
        const profileResponse = await getUserProfile();
        const currentUser = profileResponse.user;
        localStorage.setItem("mental_health_user", JSON.stringify(currentUser));

        if (!cancelled) {
          setUser(currentUser);
          setIsLoggedIn(true);
          setCurrentPage(["ADMIN", "OWNER"].includes(currentUser.role) ? "admin" : currentUser.role === "PROFESSIONAL" ? "professional" : "dashboard");
        }
      } catch (error) {
        console.error("Session validation error:", error);
        logoutUser();
        if (!cancelled) {
          setIsLoggedIn(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };

    checkAuthentication();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const applyTheme = (preference) => {
      document.documentElement.dataset.theme = preference;
    };

    applyTheme(localStorage.getItem("mindcare_theme") || "system");
  }, []);

  // ========================================
  // LOGIN
  // ========================================

  const handleLoginSuccess = (loginData) => {
    localStorage.setItem(
      "mental_health_token",
      loginData.token
    );

    localStorage.setItem(
      "mental_health_user",
      JSON.stringify(loginData.user)
    );

    setUser(loginData.user);
    setIsLoggedIn(true);
    setCurrentPage(["ADMIN", "OWNER"].includes(loginData.user?.role) ? "admin" : loginData.user?.role === "PROFESSIONAL" ? "professional" : "dashboard");
  };

  // ========================================
  // REGISTER
  // ========================================

  const handleRegisterSuccess = (registerData) => {
    localStorage.setItem(
      "mental_health_token",
      registerData.token
    );

    localStorage.setItem(
      "mental_health_user",
      JSON.stringify(registerData.user)
    );

    setUser(registerData.user);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    logoutUser();

    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage("dashboard");
    setSidebarOpen(false);
  };

  // ========================================
  // AUTH LOADING
  // ========================================

  if (authLoading) {
    return <AuthLoading />;
  }

  // ========================================
  // AUTH PAGE
  // ========================================

  if (!isLoggedIn) {
    return (
      <AuthPage
        mode={authMode}
        setMode={setAuthMode}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  // ========================================
  // MAIN APPLICATION
  // ========================================

  if (["ADMIN", "OWNER"].includes(user?.role) && currentPage === "admin") {
    return <AdminApp user={user} onLogout={handleLogout} />;
  }

  if (user?.role === "PROFESSIONAL" && currentPage === "professional") {
    return <ProfessionalApp user={user} onLogout={handleLogout} onUserUpdated={setUser} />;
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-area">
        <Topbar
          currentPage={currentPage}
          user={user}
          onNavigate={setCurrentPage}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {currentPage === "dashboard" && (
          <Dashboard
            user={user}
            onOpenAssistant={() => {
              setAssistantConversationId(null);
              setCurrentPage("assistant");
            }}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === "assistant" && (
          <ChatWorkspace
            user={user}
            initialConversationId={assistantConversationId}
            onLogout={handleLogout}
          />
        )}

        {currentPage === "conversations" && (
          <ConversationsPage
            user={user}
            onOpenAssistant={(conversationId = null) => {
              setAssistantConversationId(conversationId);
              setCurrentPage("assistant");
            }}
          />
        )}

        {currentPage === "resources" && (
          <ResourcesPage user={user} />
        )}

        {currentPage === "wellness" && (
          <WellnessPage user={user} />
        )}

        {currentPage === "appointments" && <AppointmentsPage />}

        {currentPage === "notifications" && <NotificationsPage />}

        {currentPage === "settings" && (
          <SettingsPage user={user} onUserUpdated={setUser} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

// ========================================
// AUTH LOADING
// ========================================

function AuthLoading() {
  return (
    <div className="auth-loading">
      <div className="auth-loading-card">
        <div className="brand-icon">
          <HeartPulse size={27} />
        </div>

        <h2>MindCare</h2>

        <p>
          Preparing your mental wellness space...
        </p>
      </div>
    </div>
  );
}

// ========================================
// AUTH PAGE
// ========================================

function AuthPage({
  mode,
  setMode,
  onLoginSuccess,
  onRegisterSuccess,
}) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <HeartPulse size={23} />
            </div>

            <div>
              <strong>MindCare</strong>
              <span>
                Mental Health & Wellness Platform
              </span>
            </div>
          </div>

          <div className="auth-hero">
            <div className="auth-eyebrow">
              <Sparkles size={12} />
              Intelligent Mental Wellness
            </div>

            <h1>
              Your wellbeing
              <br />
              matters.
            </h1>

            <p>
              A private and supportive digital space
              designed to help you understand,
              reflect and take care of your mental
              wellbeing.
            </p>
          </div>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <div className="benefit-icon">
                <Bot size={16} />
              </div>

              <div>
                <strong>
                  AI Mental Health Assistant
                </strong>

                <span>
                  Get supportive and informative
                  conversations whenever you need
                  them.
                </span>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="benefit-icon">
                <ShieldCheck size={16} />
              </div>

              <div>
                <strong>
                  Private & Secure
                </strong>

                <span>
                  Your conversations and account
                  information are protected.
                </span>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="benefit-icon">
                <Activity size={16} />
              </div>

              <div>
                <strong>
                  Wellness Journey
                </strong>

                <span>
                  Learn, reflect and build healthier
                  habits over time.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-decoration decoration-one" />
        <div className="auth-decoration decoration-two" />
        <div className="auth-decoration decoration-three" />
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="auth-mobile-brand">
            <div className="auth-brand-icon">
              <HeartPulse size={21} />
            </div>

            <div>
              <strong>MindCare</strong>
              <span>Mental Wellness Platform</span>
            </div>
          </div>

          {mode === "login" ? (
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              onSwitch={() => setMode("register")}
            />
          ) : (
            <RegisterForm
              onRegisterSuccess={onRegisterSuccess}
              onSwitch={() => setMode("login")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// LOGIN FORM
// ========================================

function LoginForm({
  onLoginSuccess,
  onSwitch,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(
        email.trim(),
        password
      );

      onLoginSuccess(response);
    } catch (err) {
      setError(
        err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-heading">
        <span className="auth-heading-label">
          WELCOME BACK
        </span>

        <h2>Sign in to MindCare</h2>

        <p>
          Continue your mental wellness journey
          from where you left off.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          <span>!</span>

          <p>{error}</p>
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <div className="auth-field">
          <label>Email address</label>

          <div className="auth-input-wrapper">
            <User size={16} />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
            />
          </div>
        </div>

        <div className="auth-field">
          <div className="password-label-row">
            <label>Password</label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot password?
            </button>
          </div>

          <div className="auth-input-wrapper">
            <ShieldCheck size={16} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <X size={15} />
              ) : (
                <CircleHelp size={15} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="auth-spinner" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight
                size={16}
                className="auth-submit-arrow"
              />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span />
        <p>ACCOUNT</p>
        <span />
      </div>

      <div className="auth-switch">
        <span>
          Don't have an account?
        </span>

        <button
          type="button"
          onClick={onSwitch}
        >
          Create account
        </button>
      </div>

      <div className="auth-security">
        <ShieldCheck size={16} />

        <div>
          <strong>
            Your privacy matters
          </strong>

          <span>
            MindCare is designed to keep your
            account and conversations private.
          </span>
        </div>
      </div>

      <p className="auth-footer">
        MindCare provides supportive information
        and is not a replacement for professional
        medical or mental health care.
      </p>
    </>
  );
}

// ========================================
// REGISTER FORM
// ========================================

function RegisterForm({
  onRegisterSuccess,
  onSwitch,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError(
        "Please complete all required fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(
        name.trim(),
        email.trim(),
        password
      );

      onRegisterSuccess(response);
    } catch (err) {
      setError(
        err.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-heading">
        <span className="auth-heading-label">
          GET STARTED
        </span>

        <h2>Create your account</h2>

        <p>
          Create a private space for your mental
          wellness journey.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          <span>!</span>

          <p>{error}</p>
        </div>
      )}

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <div className="auth-field">
          <label>Full name</label>

          <div className="auth-input-wrapper">
            <User size={16} />

            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              disabled={loading}
            />
          </div>
        </div>

        <div className="auth-field">
          <label>Email address</label>

          <div className="auth-input-wrapper">
            <MessageCircle size={16} />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
            />
          </div>
        </div>

        <div className="auth-field">
          <label>Password</label>

          <div className="auth-input-wrapper">
            <ShieldCheck size={16} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <X size={15} />
              ) : (
                <CircleHelp size={15} />
              )}
            </button>
          </div>

          <span className="auth-help">
            Use at least 6 characters.
          </span>
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="auth-spinner" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight
                size={16}
                className="auth-submit-arrow"
              />
            </>
          )}
        </button>
      </form>

      <div className="auth-divider">
        <span />
        <p>ACCOUNT</p>
        <span />
      </div>

      <div className="auth-switch">
        <span>
          Already have an account?
        </span>

        <button
          type="button"
          onClick={onSwitch}
        >
          Sign in
        </button>
      </div>

      <div className="auth-security">
        <ShieldCheck size={16} />

        <div>
          <strong>
            Secure account
          </strong>

          <span>
            Your account information is protected
            using secure authentication.
          </span>
        </div>
      </div>

      <p className="auth-footer">
        MindCare provides supportive information
        and is not a replacement for professional
        medical or mental health care.
      </p>
    </>
  );
}

// ========================================
// SIDEBAR
// ========================================

function Sidebar({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  user,
  onLogout,
}) {
  const navigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <div className="brand">
        <div className="brand-icon">
          <HeartPulse size={21} />
        </div>

        <div>
          <strong>MindCare</strong>
          <span>Mental Wellness Platform</span>
        </div>
      </div>

      <button
        className="mobile-close"
        onClick={() =>
          setSidebarOpen(false)
        }
      >
        <X size={18} />
      </button>

      <div className="sidebar-section-title">
        MAIN
      </div>

      <nav className="sidebar-nav">
        <button
          className={
            currentPage === "dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("dashboard")
          }
        >
          <Home size={17} />
          <span>Dashboard</span>
        </button>

        <button
          className={
            currentPage === "assistant"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("assistant")
          }
        >
          <Bot size={17} />
          <span>AI Assistant</span>
        </button>

        <button
          className={
            currentPage === "conversations"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("conversations")
          }
        >
          <MessageCircle size={17} />
          <span>Conversations</span>
        </button>

        <button
          className={
            currentPage === "resources"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("resources")
          }
        >
          <FileText size={17} />
          <span>Resources</span>
        </button>

        <button
          className={
            currentPage === "wellness"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("wellness")
          }
        >
          <HeartPulse size={17} />
          <span>Wellness Check</span>
        </button>
      </nav>

      <div className="sidebar-section-title support-title">
        SUPPORT
      </div>

      <nav className="sidebar-nav">
        <button
          className={
            currentPage === "appointments"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("appointments")
          }
        >
          <CalendarDays size={17} />
          <span>Appointments</span>
        </button>

        <button
          className={
            currentPage === "notifications"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("notifications")
          }
        >
          <Bell size={17} />
          <span>Notifications</span>
        </button>

        <button
          className={
            currentPage === "settings"
              ? "active"
              : ""
          }
          onClick={() =>
            navigate("settings")
          }
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-profile">
        <div className="profile-avatar">
          <User size={17} />
        </div>

        <div className="profile-info">
          <strong>
            {user?.name || "MindCare User"}
          </strong>

          <span>
            {user?.email || "User account"}
          </span>
        </div>

        <button
          onClick={onLogout}
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

// ========================================
// TOPBAR
// ========================================

function Topbar({
  currentPage,
  user,
  onNavigate,
  onMenuClick,
}) {
  const titles = {
    dashboard: [
      "Your mental wellness space",
      "Dashboard",
    ],
    assistant: [
      "Supportive AI conversation",
      "AI Assistant",
    ],
    conversations: [
      "Your conversation history",
      "Conversations",
    ],
    resources: [
      "Mental health information",
      "Resources",
    ],
    wellness: [
      "Understand your wellbeing",
      "Wellness Check",
    ],
    appointments: [
      "Professional support",
      "Appointments",
    ],
    notifications: [
      "Stay updated",
      "Notifications",
    ],
    settings: [
      "Manage your account",
      "Settings",
    ],
  };

  const title =
    titles[currentPage] || titles.dashboard;

  return (
    <header className="topbar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          className="mobile-menu"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="topbar-title">
          <span>{title[0]}</span>
          <strong>{title[1]}</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="notification-button"
          onClick={() => onNavigate("notifications")}
          aria-label="Open notifications"
        >
          <Bell size={17} />
          <span />
        </button>

        <button
          className="topbar-user"
          onClick={() => onNavigate("settings")}
          aria-label="Open profile settings"
        >
          <div className="small-avatar">
            <User size={15} />
          </div>

          <span>
            {user?.name || "User"}
          </span>
        </button>
      </div>
    </header>
  );
}

// ========================================
// DASHBOARD
// ========================================

function Dashboard({
  user,
  onOpenAssistant,
  onNavigate,
}) {
  return (
    <div className="dashboard-content">
      <section className="welcome-card">
        <div className="welcome-text">
          <div className="eyebrow">
            <Sparkles size={13} />
            MindCare AI Wellness Assistant
          </div>

          <h1>
            Hello,{" "}
            {user?.name?.split(" ")[0] ||
              "there"}
          </h1>

          <p>
            Welcome to your private mental wellness
            space. You can talk to the AI Assistant,
            explore resources and keep track of your
            wellbeing journey.
          </p>

          <button
            className="primary-button"
            onClick={onOpenAssistant}
          >
            <MessageCircle size={15} />
            Start a conversation
          </button>
        </div>

        <div className="welcome-art">
          <div className="heart-circle">
            <HeartPulse size={64} />
          </div>

          <div className="floating-dot dot-one" />
          <div className="floating-dot dot-two" />
          <div className="floating-dot dot-three" />
        </div>
      </section>

      <div className="section-heading">
        <div>
          <h2>Your wellness tools</h2>

          <p>
            Explore the tools available in your
            MindCare platform.
          </p>
        </div>
      </div>

      <div className="tool-grid">
        <DashboardToolCard
          icon={<Bot size={20} />}
          iconClass="purple"
          title="AI Assistant"
          description="Talk with your supportive AI assistant and ask mental wellness questions."
          action="Open Assistant"
          onClick={onOpenAssistant}
        />

        <DashboardToolCard
          icon={<FileText size={20} />}
          iconClass="blue"
          title="Resources"
          description="Explore trusted educational resources about mental health and wellbeing."
          action="Explore Resources"
          onClick={() => onNavigate("resources")}
        />

        <DashboardToolCard
          icon={<HeartPulse size={20} />}
          iconClass="green"
          title="Wellness Check"
          description="Reflect on your wellbeing through guided self-assessment activities."
          action="Start Check"
          onClick={() => onNavigate("wellness")}
        />

        <DashboardToolCard
          icon={<CalendarDays size={20} />}
          iconClass="orange"
          title="Appointments"
          description="Manage professional support appointments and follow-up sessions."
          action="View Appointments"
          onClick={() => onNavigate("appointments")}
        />
      </div>

      <div className="dashboard-bottom">
        <div className="journey-card">
          <div className="card-header-row">
            <div>
              <h2>Your wellness journey</h2>

              <p>
                Small steps can make a meaningful
                difference.
              </p>
            </div>

            <Activity size={19} />
          </div>

          <div className="progress-area">
            <div className="progress-label">
              <span>Getting started</span>

              <strong>40%</strong>
            </div>

            <div className="progress-track">
              <div className="progress-fill" />
            </div>
          </div>

          <div className="journey-items">
            <div>
              <span className="journey-check">
                <Check size={11} />
              </span>

              Create your MindCare account
            </div>

            <div>
              <span className="journey-check">
                <Check size={11} />
              </span>

              Explore the AI Assistant
            </div>

            <div>
              <span className="journey-empty" />

              Complete a wellness check
            </div>
          </div>
        </div>

        <div className="secure-card">
          <div className="secure-icon">
            <ShieldCheck size={20} />
          </div>

          <h2>Your privacy</h2>

          <p>
            Your conversations are connected to your
            account and protected by authentication.
          </p>

          <button>
            Learn more
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================
// DASHBOARD TOOL CARD
// ========================================

function DashboardToolCard({
  icon,
  iconClass,
  title,
  description,
  action,
  onClick,
}) {
  return (
    <div className="tool-card">
      <div
        className={`tool-icon ${iconClass}`}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button
        className="card-link"
        onClick={onClick}
      >
        {action}
        <ChevronRight size={12} />
      </button>
    </div>
  );
}

// ========================================
// HELPERS
// ========================================

// Detect crisis-level content in a message
const CRISIS_PATTERNS = [
  /\b(suicid|kill myself|end my life|want to die|don't want to live|no reason to live|self.harm|cut myself|hurt myself)\b/i,
  /\b(overdose|hang myself|jump off|take my life)\b/i,
];

const detectCrisis = (text = "") =>
  CRISIS_PATTERNS.some((p) => p.test(text));

// Format relative time
const formatRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const formatFullDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Truncate text
const truncate = (str = "", max = 80) =>
  str.length > max ? str.slice(0, max).trimEnd() + "…" : str;

// ========================================
// RENAME MODAL
// ========================================

function RenameModal({ title, onConfirm, onCancel }) {
  const [value, setValue] = useState(title || "");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onConfirm(value.trim());
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Rename conversation"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-box">
        <div className="modal-header">
          <Pencil size={16} />
          <h3>Rename conversation</h3>
          <button
            className="modal-close"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="modal-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={120}
            placeholder="Conversation title"
          />
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn-confirm"
              disabled={!value.trim()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========================================
// DELETE CONFIRM MODAL
// ========================================

function DeleteModal({ title, onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Delete conversation"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-box">
        <div className="modal-header modal-header-danger">
          <Trash2 size={16} />
          <h3>Delete conversation</h3>
          <button
            className="modal-close"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
        <p className="modal-body">
          Delete <strong>"{truncate(title || "this conversation", 50)}"</strong>?
          All messages will be permanently removed.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn-danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================
// CLEAR CONFIRM MODAL
// ========================================

function ClearModal({ onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Clear conversation"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-box">
        <div className="modal-header modal-header-danger">
          <Trash2 size={16} />
          <h3>Clear conversation</h3>
          <button
            className="modal-close"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
        <p className="modal-body">
          All messages in this conversation will be permanently deleted. The
          conversation itself will remain in history.
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn-danger"
            onClick={onConfirm}
          >
            Clear messages
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================================
// CRISIS BANNER
// ========================================

function CrisisBanner({ onDismiss }) {
  return (
    <div className="crisis-banner" role="alert">
      <div className="crisis-banner-icon">
        <AlertTriangle size={16} />
      </div>
      <div className="crisis-banner-text">
        <strong>Are you in crisis?</strong>
        <span>
          If you are in immediate danger, please call emergency services
          (999 / 112 / 911) or go to your nearest emergency department.
          Crisis lines are available 24 hours a day.
        </span>
      </div>
      <button
        className="crisis-banner-close"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ========================================
// RAG INFO PANEL
// ========================================

// ========================================
// CONVERSATION ITEM MENU
// ========================================

function ConvItemMenu({ conv, onRename, onPin, onArchive, onDelete, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="conv-menu" ref={ref} role="menu">
      <button role="menuitem" onClick={onRename}>
        <Pencil size={13} /> Rename
      </button>
      <button role="menuitem" onClick={onPin}>
        {conv.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
        {conv.isPinned ? "Unpin" : "Pin"}
      </button>
      <button role="menuitem" onClick={onArchive}>
        <Archive size={13} />
        {conv.isArchived ? "Unarchive" : "Archive"}
      </button>
      <div className="conv-menu-divider" />
      <button role="menuitem" className="conv-menu-danger" onClick={onDelete}>
        <Trash2 size={13} /> Delete
      </button>
    </div>
  );
}

// ========================================
// CHAT WORKSPACE
// ========================================

function ChatWorkspace({ user, initialConversationId }) {
  // ── Conversations state ──
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // ── Panel controls ──
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);


  // ── Modals ──
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // ── Chat state ──
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [sendError, setSendError] = useState("");
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(true);
  const activeConversationStorageKey = `mindcare_active_conversation_${user?.id || "guest"}`;
  const speechRecognitionRef = useRef(null);
  const pendingSendRef = useRef(false);

  const suggestionPrompts = [
    "Help me understand what I’m feeling",
    "Give me a simple grounding exercise",
    "How can I improve my sleep tonight?",
    "I need a safe space to talk",
  ];

  // ── Busy flag (prevents concurrent ops) ──
  const busy = typing || loadingMessages || pendingSendRef.current;

  // ── Scroll anchor ──
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    return () => {
      speechRecognitionRef.current?.stop();
    };
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [messageInput]);

  // ── Load conversations on mount + when an external conversation is selected ──
  useEffect(() => {
    loadConversations(initialConversationId);
  }, [initialConversationId]);

  // ========================================
  // LOAD CONVERSATIONS
  // ========================================

  const loadConversations = async (requestedConversationId = null) => {
    try {
      setLoadingConversations(true);
      const res = await getConversations({});
      const list = res.conversations || [];
      setConversations(list);

      if (requestedConversationId || list.length > 0) {
        const storedId = requestedConversationId || sessionStorage.getItem(activeConversationStorageKey);
        const target = list.find(
          (conversation) => String(conversation.id) === String(storedId)
        ) || list[0];

        if (target) {
          setActiveConversationId(target.id);
          sessionStorage.setItem(activeConversationStorageKey, String(target.id));
          await loadMessages(target.id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Load conversations error:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  // ========================================
  // LOAD MESSAGES
  // ========================================

  const loadMessages = async (conversationId) => {
    if (!conversationId) { setMessages([]); return; }
    try {
      setLoadingMessages(true);
      const res = await getConversation(conversationId);
      setMessages(res.conversation?.messages || []);
    } catch (err) {
      console.error("Load messages error:", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ========================================
  // OPEN CONVERSATION
  // ========================================

  const handleOpenConversation = async (id) => {
    if (busy || id === activeConversationId) return;
    setActiveConversationId(id);
    sessionStorage.setItem(activeConversationStorageKey, String(id));
    setSendError("");
    setShowCrisisBanner(false);
    await loadMessages(id);
  };

  // ========================================
  // NEW CONVERSATION
  // ========================================

  const handleNewConversation = () => {
    if (busy) return;
    setActiveConversationId(null);
    sessionStorage.removeItem(activeConversationStorageKey);
    setMessages([]);
    setMessageInput("");
    setSendError("");
    setShowCrisisBanner(false);
  };


  // ========================================
  // RENAME
  // ========================================

  const handleRenameConfirm = async (newTitle) => {
    const id = renameTarget?.id;
    setRenameTarget(null);
    if (!id) return;
    try {
      const res = await renameConversation(id, newTitle);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: res.conversation.title } : c))
      );
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  // ========================================
  // PIN
  // ========================================

  const handleTogglePin = async (conv) => {
    setOpenMenuId(null);
    try {
      const res = await togglePinConversation(conv.id);
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conv.id ? { ...c, isPinned: res.isPinned } : c
        );
        // re-sort: pinned first, then by updatedAt
        return [...updated].sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          const ta = new Date(a.updatedAt);
          const tb = new Date(b.updatedAt);
          return tb - ta; // Always sort newest first
        });
      });
    } catch (err) {
      console.error("Pin error:", err);
    }
  };

  // ========================================
  // ARCHIVE
  // ========================================

  const handleToggleArchive = async (conv) => {
    setOpenMenuId(null);
    try {
      await toggleArchiveConversation(conv.id);
      // Remove from current list (it moved to the other view)
      setConversations((prev) => prev.filter((c) => c.id !== conv.id));
      if (activeConversationId === conv.id) {
        setActiveConversationId(null);
        sessionStorage.removeItem(activeConversationStorageKey);
        setMessages([]);
      }
    } catch (err) {
      console.error("Archive error:", err);
    }
  };

  // ========================================
  // DELETE
  // ========================================

  const handleDeleteConfirm = async () => {
    const id = deleteTarget?.id;
    setDeleteTarget(null);
    if (!id) return;
    try {
      await deleteConversation(id);
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (activeConversationId === id) {
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
          await loadMessages(remaining[0].id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ========================================
  // CLEAR MESSAGES
  // ========================================

  const handleClearConfirm = async () => {
    setShowClearModal(false);
    if (!activeConversationId) return;
    try {
      await clearConversationMessages(activeConversationId);
      setMessages([]);
    } catch (err) {
      console.error("Clear error:", err);
    }
  };

  // ========================================
  // MICROPHONE / VOICE INPUT
  // ========================================

  const stopVoiceInput = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      stopVoiceInput();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVoiceError("");
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .join(" ")
          .trim();

        if (transcript) {
          setMessageInput((previous) => (previous ? `${previous} ${transcript}`.trim() : transcript));
        }
      };

      recognition.onerror = (event) => {
        const message = event.error === "not-allowed"
          ? "Microphone permission was denied. Please allow access and try again."
          : event.error === "no-speech"
            ? "No speech was detected. Please try again."
            : "Voice input is unavailable right now.";

        setVoiceError(message);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        speechRecognitionRef.current = null;
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("Voice input error:", error);
      setVoiceError("Unable to start microphone input.");
      setIsListening(false);
    }
  };

  // ========================================
  // SEND / RETRY
  // ========================================

  const handleSendMessage = async (overrideText, { retry = false, regenerate = false } = {}) => {
    const text = (overrideText ?? messageInput).trim();
    if (!text || typing || pendingSendRef.current) return;

    pendingSendRef.current = true;
    setSendError("");
    setLastUserMessage(text);
    if (detectCrisis(text)) setShowCrisisBanner(true);

    let conversationId = activeConversationId;
    let newConvCreated = false;
    const optimisticId = `tmp-${Date.now()}`;

    try {
      if (!conversationId) {
        const title = text.length > 60 ? text.slice(0, 60).trim() + "…" : text;
        const res = await createConversation(title);
        conversationId = res.conversation.id;
        newConvCreated = true;
        setActiveConversationId(conversationId);
        sessionStorage.setItem(activeConversationStorageKey, String(conversationId));
      }

      if (!retry && !regenerate) {
        setMessages((prev) => [
          ...prev,
          { id: optimisticId, role: "user", content: text, createdAt: new Date().toISOString() },
        ]);
        setMessageInput("");
      } else if (regenerate) {
        setMessages((prev) => {
          const copy = [...prev];
          const lastAssistantIndex = copy.map((item) => item.role).lastIndexOf("assistant");
          if (lastAssistantIndex >= 0) copy.splice(lastAssistantIndex, 1);
          return copy;
        });
      }

      setTyping(true);
      const result = await sendChatMessage(conversationId, text);
      const { userMessage, assistantMessage } = result?.data || {};

      setMessages((prev) => {
        const next = prev.filter((message) => message.id !== optimisticId);

        if (userMessage) {
          next.push({
            ...userMessage,
            id: userMessage.id ?? `${conversationId}-user-${Date.now()}`,
          });
        }

        if (assistantMessage) {
          next.push({
            ...assistantMessage,
            id: assistantMessage.id ?? `${conversationId}-assistant-${Date.now()}`,
          });
        }

        return next;
      });

      if (newConvCreated) {
        setConversations((prev) => [{
          id: conversationId,
          title: text.length > 60 ? text.slice(0, 60).trim() + "…" : text,
          updatedAt: new Date().toISOString(),
          isPinned: false,
          isArchived: false,
          _count: { messages: 2 },
          messages: [{ content: text, role: "user", createdAt: new Date().toISOString() }],
        }, ...prev]);
      } else {
        setConversations((prev) => prev.map((conversation) => conversation.id === conversationId ? { ...conversation, updatedAt: new Date().toISOString() } : conversation));
      }
    } catch (err) {
      console.error("Send error:", err);
      setSendError(err.message || "Unable to send your message. Please try again.");
      if (!retry && !regenerate) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      }
    } finally {
      pendingSendRef.current = false;
      setTyping(false);
    }
  };

  const handleRetry = () => {
    if (lastUserMessage && !typing) handleSendMessage(lastUserMessage, { retry: true });
  };

  // ========================================
  // COPY AI RESPONSE
  // ========================================

  const handleCopy = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback: ignore silently
    }
  };

  // ========================================
  // REGENERATE LAST RESPONSE
  // ========================================

  const handleRegenerate = async () => {
    if (!activeConversationId || typing) return;
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    await handleSendMessage(lastUser.content, { regenerate: true });
  };

  // ========================================
  // KEYBOARD
  // ========================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ========================================
  // FILTERED CONVERSATIONS
  // ========================================

  const filteredConversations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const preview = (c.messages?.[0]?.content || "").toLowerCase();
      return title.includes(q) || preview.includes(q);
    });
  }, [conversations, searchTerm]);

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.isPinned);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      {/* ── Modals ── */}
      {renameTarget && (
        <RenameModal
          title={renameTarget.title}
          onConfirm={handleRenameConfirm}
          onCancel={() => setRenameTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showClearModal && (
        <ClearModal
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClearModal(false)}
        />
      )}

      <div className="chat-workspace">

        {/* ════════════════════════════════
            CONVERSATION PANEL
        ════════════════════════════════ */}
        <aside className={`conversation-panel ${!showHistoryPanel ? "hidden" : ""}`}>

          {/* Header */}
          <div className="conversation-panel-header">
            <div>
              <h2>Conversations</h2>
              <p>
                {`${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              className="new-chat-button"
              onClick={handleNewConversation}
              disabled={busy}
              title="New conversation"
              aria-label="New conversation"
            >
              <Plus size={17} />
            </button>
          </div>

          {/* Search */}
          <div className="conversation-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search conversations…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="conv-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>



          {/* List */}
          <div className="conversation-list">
            {loadingConversations ? (
              <div className="conv-loading">
                <div className="conv-loading-dot" />
                <div className="conv-loading-dot" />
                <div className="conv-loading-dot" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="conversation-empty">
                <div className="conversation-empty-icon">
                  <MessageCircle size={18} />
                </div>
                <strong>
                  {searchTerm
                    ? "No results found"
                    : "No conversations yet"}
                </strong>
                <span>
                  {searchTerm
                    ? "Try a different keyword."
                    : "Start a new conversation to begin."}
                </span>
              </div>
            ) : (
              <>
                {/* Pinned section */}
                {pinnedConversations.length > 0 && (
                  <>
                    <div className="conv-section-label">
                      <Pin size={10} /> Pinned
                    </div>
                    {pinnedConversations.map((conv) => (
                      <ConversationItem
                        key={conv.id}
                        conv={conv}
                        isActive={conv.id === activeConversationId}
                        openMenuId={openMenuId}
                        onOpen={handleOpenConversation}
                        onMenuOpen={(id) => setOpenMenuId(id)}
                        onRename={(c) => { setOpenMenuId(null); setRenameTarget(c); }}
                        onPin={handleTogglePin}
                        onArchive={handleToggleArchive}
                        onDelete={(c) => { setOpenMenuId(null); setDeleteTarget(c); }}
                        onMenuClose={() => setOpenMenuId(null)}
                        disabled={busy}
                      />
                    ))}
                    {unpinnedConversations.length > 0 && (
                      <div className="conv-section-label">
                        <MessageCircle size={10} /> All
                      </div>
                    )}
                  </>
                )}

                {/* Unpinned / all */}
                {unpinnedConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConversationId}
                    openMenuId={openMenuId}
                    onOpen={handleOpenConversation}
                    onMenuOpen={(id) => setOpenMenuId(id)}
                    onRename={(c) => { setOpenMenuId(null); setRenameTarget(c); }}
                    onPin={handleTogglePin}
                    onArchive={handleToggleArchive}
                    onDelete={(c) => { setOpenMenuId(null); setDeleteTarget(c); }}
                    onMenuClose={() => setOpenMenuId(null)}
                    disabled={busy}
                  />
                ))}
              </>
            )}
          </div>
        </aside>

        {/* ════════════════════════════════
            CHAT PANEL
        ════════════════════════════════ */}
        <section className="chat-panel">

          {/* Chat header */}
          <div className="chat-header">
            <div className="chat-header-actions">
              <button
                className="header-toggle-history"
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                title={showHistoryPanel ? "Hide history" : "Show history"}
                aria-label={showHistoryPanel ? "Hide conversation history" : "Show conversation history"}
              >
                {showHistoryPanel ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
              <button
                className="header-new-chat"
                onClick={handleNewConversation}
                disabled={busy}
              >
                <Plus size={14} />
                New Chat
              </button>
            </div>
          </div>

          {/* Crisis banner */}
          {showCrisisBanner && (
            <CrisisBanner onDismiss={() => setShowCrisisBanner(false)} />
          )}

          {/* Messages */}
          <div className="messages-container">
            {loadingMessages ? (
              <div className="chat-intro">
                <div className="chat-intro-icon">
                  <Bot size={25} />
                </div>
                <h1>Loading conversation…</h1>
                <p>Please wait while your conversation history loads.</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-empty-state">
                <div className="chat-intro">
                  <div className="chat-intro-icon">
                    <Sparkles size={25} />
                  </div>
                  <p className="chat-eyebrow">MindCare AI</p>
                  <h1>
                    {activeConversationId
                      ? "Continue when you’re ready"
                      : "How are you feeling today?"}
                  </h1>
                  <p>
                    {activeConversationId
                      ? "This conversation is empty. Send a message to begin."
                      : "A private, supportive space to reflect, learn, and take the next small step."}
                  </p>
                </div>
                {!activeConversationId && (
                  <div className="suggestion-grid" aria-label="Suggested prompts">
                    {suggestionPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        className="suggestion-card"
                        onClick={() => handleSendMessage(prompt)}
                        disabled={busy}
                      >
                        <Sparkles size={16} />
                        <span>{prompt}</span>
                        <ArrowRight size={15} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    copiedId={copiedId}
                    onCopy={handleCopy}
                  />
                ))}

                {typing && (
                  <div className="message-row assistant-message">
                    <div className="message-avatar assistant-avatar"><Bot size={16} /></div>
                    <div className="message-content">
                      <span className="typing-label">MindCare is thinking</span>
                      <div className="typing-bubble" aria-label="MindCare is typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error + retry */}
          {(sendError || voiceError) && (
            <div className="chat-error-bar">
              <AlertTriangle size={13} />
              <span>{sendError || voiceError}</span>
              {sendError && (
                <button onClick={handleRetry}>
                  <RefreshCw size={12} /> Retry
                </button>
              )}
              <button
                className="chat-error-dismiss"
                onClick={() => {
                  setSendError("");
                  setVoiceError("");
                }}
                aria-label="Dismiss"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Regenerate */}
          {!typing && !sendError && messages.length > 0 &&
            messages[messages.length - 1]?.role === "assistant" && (
              <div className="chat-regen-bar">
                <button
                  className="chat-regen-btn"
                  onClick={handleRegenerate}
                  disabled={busy}
                >
                  <RefreshCw size={12} />
                  Regenerate response
                </button>
              </div>
            )}

          {/* Composer */}
          <div className="composer-area">
            <div className="composer-box">
              <textarea
                ref={textareaRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message MindCare…"
                disabled={typing || pendingSendRef.current}
                rows={1}
                aria-label="Message input"
              />
              <span className="composer-hint">Enter to send · Shift+Enter for a new line</span>
              <button
                type="button"
                className={`voice-button ${isListening ? "listening" : ""}`}
                onClick={handleVoiceInput}
                disabled={typing || pendingSendRef.current}
                title={isListening ? "Stop recording" : "Use microphone"}
                aria-label={isListening ? "Stop recording" : "Use microphone"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                className="send-button"
                onClick={() => handleSendMessage()}
                disabled={!messageInput.trim() || typing || pendingSendRef.current}
                title="Send message"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="composer-disclaimer">
              MindCare provides supportive information and is not a replacement for
              professional mental health care. In a crisis, call emergency services.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

// ========================================
// CONVERSATION ITEM
// ========================================

function ConversationItem({
  conv,
  isActive,
  openMenuId,
  onOpen,
  onMenuOpen,
  onRename,
  onPin,
  onArchive,
  onDelete,
  onMenuClose,
  disabled,
}) {
  const preview = conv.messages?.[0]?.content || "";
  const msgCount = conv._count?.messages ?? 0;
  const isMenuOpen = openMenuId === conv.id;

  return (
    <div
      className={`conversation-item ${isActive ? "active" : ""} ${disabled ? "conversation-item-disabled" : ""}`}
    >
      <button
        className="conversation-item-main"
        onClick={() => onOpen(conv.id)}
        disabled={disabled}
        aria-current={isActive ? "true" : undefined}
      >
        <div className="conversation-item-icon">
          {conv.isPinned ? <Pin size={13} /> : <MessageCircle size={13} />}
        </div>

        <div className="conversation-item-text">
          <div className="conv-item-title-row">
            <strong>{conv.title || "Conversation"}</strong>
            <span className="conv-item-time">
              {formatRelativeTime(conv.updatedAt)}
            </span>
          </div>
          {preview && (
            <span className="conv-item-preview">
              {truncate(preview, 55)}
            </span>
          )}
          <div className="conv-item-meta">
            <span className="conv-item-count">
              <MessageCircle size={9} />
              {msgCount} msg{msgCount !== 1 ? "s" : ""}
            </span>
            <span className="conv-item-date">
              {formatFullDate(conv.createdAt)}
            </span>
          </div>
        </div>
      </button>

      {/* ⋯ menu trigger */}
      <div className="conv-item-menu-wrap">
        <button
          className={`conv-menu-trigger ${isMenuOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            isMenuOpen ? onMenuClose() : onMenuOpen(conv.id);
          }}
          aria-label="Conversation options"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          disabled={disabled}
        >
          <MoreHorizontal size={14} />
        </button>

        {isMenuOpen && (
          <ConvItemMenu
            conv={conv}
            onRename={() => onRename(conv)}
            onPin={() => onPin(conv)}
            onArchive={() => onArchive(conv)}
            onDelete={() => onDelete(conv)}
            onClose={onMenuClose}
          />
        )}
      </div>
    </div>
  );
}

// ========================================
// MESSAGE BUBBLE
// ========================================

function MessageBubble({ message, copiedId, onCopy }) {
  const isUser = message.role === "user";
  const isCopied = copiedId === message.id;

  const formattedContent = String(message.content || "")
    .replace(/\\\*\*/g, "**")
    .replace(/\\#/g, "#")
    .replace(/\\_/g, "_")
    .replace(/\\`/g, "`")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")");

  return (
    <div
      className={`message-row ${isUser ? "user-message" : "assistant-message"}`}
    >
      <div className="message-content">
        <div className="message-bubble">
          {isUser ? (
            <div className="plain-message">{message.content}</div>
          ) : (
            <div className="markdown-message">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {formattedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button for AI messages */}
        {!isUser && (
          <div className="message-actions">
            <button
              className={`msg-action-btn ${isCopied ? "copied" : ""}`}
              onClick={() => onCopy(message.id, message.content)}
              title={isCopied ? "Copied!" : "Copy response"}
              aria-label={isCopied ? "Copied" : "Copy response"}
            >
              {isCopied ? <Check size={11} /> : <Copy size={11} />}
              {isCopied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// RESOURCES PAGE
// ========================================

// Category emoji map
const CATEGORY_EMOJI = {
  "Mental Health": "🧠",
  "Anxiety": "😰",
  "Stress": "😓",
  "Depression": "😔",
  "Sleep & Rest": "😴",
  "Emotional Wellbeing": "❤️",
  "Self-Care": "🧘",
  "Physical Activity": "🏃",
  "Healthy Lifestyle": "🥗",
  "Relationships & Social Wellbeing": "👥",
  "Student Mental Health": "🎓",
  "Work & Study Stress": "💼",
  "Crisis & Emergency Support": "🆘",
  "Professional Help": "⭐",
};

// LocalStorage key for recently viewed
const RECENTLY_VIEWED_KEY = "mc_recently_viewed";

function getRecentlyViewedIds() {
  try {
    return JSON.parse(
      localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]"
    );
  } catch {
    return [];
  }
}

function addRecentlyViewed(id) {
  const ids = getRecentlyViewedIds().filter((i) => i !== id);
  ids.unshift(id);
  localStorage.setItem(
    RECENTLY_VIEWED_KEY,
    JSON.stringify(ids.slice(0, 8))
  );
}

// ---- Main ResourcesPage ----
function ResourcesPage({ user }) {
  // View: "list" | "read"
  const [view, setView] = useState("list");

  // List state
  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "bookmarks" | "recent"
  const [page, setPage] = useState(1);

  // Read state
  const [activeResource, setActiveResource] = useState(null);
  const [readLoading, setReadLoading] = useState(false);

  // Recently viewed
  const [recentResources, setRecentResources] = useState([]);

  // ========================================
  // LOAD CATEGORIES ONCE
  // ========================================

  useEffect(() => {
    loadCategories();
    loadRecentlyViewed();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getResourceCategories();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Load categories error:", err);
    }
  };

  const loadRecentlyViewed = async () => {
    const ids = getRecentlyViewedIds();
    if (ids.length === 0) return;
    try {
      const data = await getRecentlyViewedResources(ids);
      setRecentResources(data.resources || []);
    } catch (err) {
      console.error("Load recently viewed error:", err);
    }
  };

  // ========================================
  // LOAD RESOURCES WHEN FILTERS CHANGE
  // ========================================

  useEffect(() => {
    if (activeTab === "all") {
      loadResources();
    } else if (activeTab === "bookmarks") {
      loadBookmarks();
    }
  }, [search, activeCategory, page, activeTab]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources({
        search,
        category: activeCategory,
        page,
        limit: 9,
      });
      setResources(data.resources || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Load resources error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const data = await getBookmarkedResources();
      setResources(data.resources || []);
      setPagination(null);
    } catch (err) {
      console.error("Load bookmarks error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SEARCH SUBMIT
  // ========================================

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
    setActiveTab("all");
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // ========================================
  // CATEGORY FILTER
  // ========================================

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat === activeCategory ? "" : cat);
    setPage(1);
    setActiveTab("all");
  };

  // ========================================
  // TAB CHANGE
  // ========================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearch("");
    setSearchInput("");
    setActiveCategory("");
  };

  // ========================================
  // OPEN RESOURCE
  // ========================================

  const handleOpenResource = async (id) => {
    setReadLoading(true);
    setView("read");
    window.scrollTo(0, 0);

    try {
      const data = await getResource(id);
      setActiveResource(data.resource);
      addRecentlyViewed(id);
      loadRecentlyViewed();
    } catch (err) {
      console.error("Open resource error:", err);
      setView("list");
    } finally {
      setReadLoading(false);
    }
  };

  // ========================================
  // BACK TO LIST
  // ========================================

  const handleBack = () => {
    setView("list");
    setActiveResource(null);
  };

  // ========================================
  // TOGGLE BOOKMARK (list)
  // ========================================

  const handleToggleBookmarkInList = async (e, id) => {
    e.stopPropagation();
    try {
      const data = await toggleResourceBookmark(id);
      setResources((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isBookmarked: data.isBookmarked } : r
        )
      );
      if (activeTab === "bookmarks" && !data.isBookmarked) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Toggle bookmark error:", err);
    }
  };

  // ========================================
  // TOGGLE BOOKMARK (read view)
  // ========================================

  const handleToggleBookmarkInRead = async () => {
    if (!activeResource) return;
    try {
      const data = await toggleResourceBookmark(activeResource.id);
      setActiveResource((prev) => ({
        ...prev,
        isBookmarked: data.isBookmarked,
      }));
      setResources((prev) =>
        prev.map((r) =>
          r.id === activeResource.id
            ? { ...r, isBookmarked: data.isBookmarked }
            : r
        )
      );
    } catch (err) {
      console.error("Toggle bookmark error:", err);
    }
  };

  // ========================================
  // RENDER
  // ========================================

  if (view === "read") {
    return (
      <ResourceReadView
        resource={activeResource}
        loading={readLoading}
        onBack={handleBack}
        onToggleBookmark={handleToggleBookmarkInRead}
        onOpenRelated={handleOpenResource}
      />
    );
  }

  return (
    <div className="resources-page">

      {/* ---- HEADER ---- */}
      <div className="resources-header">
        <div className="resources-header-text">
          <h1>
            <span className="resources-header-emoji">📚</span>
            Resources
          </h1>
          <p>
            Trusted mental health guides — read, learn, and save what matters to you.
          </p>
        </div>

        {/* ---- SEARCH ---- */}
        <form
          className="resources-search-form"
          onSubmit={handleSearchSubmit}
        >
          <div className="resources-search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="resources-search-clear"
                onClick={handleSearchClear}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button type="submit" className="resources-search-btn">
            Search
          </button>
        </form>
      </div>

      {/* ---- TABS ---- */}
      <div className="resources-tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => handleTabChange("all")}
        >
          <BookOpen size={14} />
          All Resources
        </button>
        <button
          className={activeTab === "bookmarks" ? "active" : ""}
          onClick={() => handleTabChange("bookmarks")}
        >
          <BookmarkCheck size={14} />
          Saved
        </button>
        <button
          className={activeTab === "recent" ? "active" : ""}
          onClick={() => handleTabChange("recent")}
        >
          <Clock size={14} />
          Recently Viewed
        </button>
      </div>

      <div className="resources-body">

        {/* ---- SIDEBAR: CATEGORIES ---- */}
        <aside className="resources-sidebar">
          <div className="resources-sidebar-title">
            <Filter size={12} />
            CATEGORIES
          </div>

          <button
            className={`resources-cat-btn ${activeCategory === "" && activeTab === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveCategory("");
              setPage(1);
              setActiveTab("all");
            }}
          >
            <span className="cat-emoji">🗂️</span>
            <span>All Categories</span>
            <span className="cat-count">
              {categories.reduce((s, c) => s + c.count, 0)}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`resources-cat-btn ${activeCategory === cat.name && activeTab === "all" ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat.name)}
            >
              <span className="cat-emoji">
                {CATEGORY_EMOJI[cat.name] || "📄"}
              </span>
              <span>{cat.name}</span>
              <span className="cat-count">{cat.count}</span>
            </button>
          ))}
        </aside>

        {/* ---- MAIN CONTENT ---- */}
        <main className="resources-main">

          {/* Recently Viewed tab */}
          {activeTab === "recent" && (
            <ResourceGrid
              resources={recentResources}
              loading={false}
              emptyIcon={<Clock size={28} />}
              emptyTitle="No recently viewed resources"
              emptyMessage="Resources you open will appear here for quick access."
              onOpen={handleOpenResource}
              onToggleBookmark={handleToggleBookmarkInList}
            />
          )}

          {/* All / Bookmarks tab */}
          {activeTab !== "recent" && (
            <>
              {/* Active filter pills */}
              {(search || activeCategory) && (
                <div className="resources-active-filters">
                  {search && (
                    <span className="filter-pill">
                      <Search size={10} />
                      "{search}"
                      <button onClick={handleSearchClear} aria-label="Remove search filter">
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {activeCategory && (
                    <span className="filter-pill">
                      {CATEGORY_EMOJI[activeCategory] || "📄"} {activeCategory}
                      <button
                        onClick={() => { setActiveCategory(""); setPage(1); }}
                        aria-label="Remove category filter"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                </div>
              )}

              <ResourceGrid
                resources={resources}
                loading={loading}
                emptyIcon={
                  activeTab === "bookmarks"
                    ? <Bookmark size={28} />
                    : <FileText size={28} />
                }
                emptyTitle={
                  activeTab === "bookmarks"
                    ? "No saved resources yet"
                    : search
                    ? `No results for "${search}"`
                    : "No resources found"
                }
                emptyMessage={
                  activeTab === "bookmarks"
                    ? "Tap the bookmark icon on any resource to save it here."
                    : "Try a different search or category."
                }
                onOpen={handleOpenResource}
                onToggleBookmark={handleToggleBookmarkInList}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="resources-pagination">
                  <button
                    className="page-btn"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!pagination.hasPrev}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={15} />
                    Prev
                  </button>

                  <div className="page-numbers">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((n) => (
                      <button
                        key={n}
                        className={`page-number ${n === page ? "active" : ""}`}
                        onClick={() => setPage(n)}
                        aria-label={`Page ${n}`}
                        aria-current={n === page ? "page" : undefined}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <button
                    className="page-btn"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNext}
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// ========================================
// RESOURCE GRID
// ========================================

function ResourceGrid({
  resources,
  loading,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  onOpen,
  onToggleBookmark,
}) {
  if (loading) {
    return (
      <div className="resources-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="resource-card resource-card-skeleton">
            <div className="skeleton-badge" />
            <div className="skeleton-title" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="resources-empty">
        <div className="resources-empty-icon">{emptyIcon}</div>
        <strong>{emptyTitle}</strong>
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="resources-grid">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onOpen={onOpen}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}

// ========================================
// RESOURCE CARD
// ========================================

function ResourceCard({ resource, onOpen, onToggleBookmark }) {
  return (
    <article
      className="resource-card"
      onClick={() => onOpen(resource.id)}
      tabIndex={0}
      role="button"
      aria-label={`Read ${resource.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(resource.id);
        }
      }}
    >
      <div className="resource-card-top">
        <span className="resource-category-badge">
          {CATEGORY_EMOJI[resource.category] || "📄"} {resource.category}
        </span>
        <button
          className={`resource-bookmark-btn ${resource.isBookmarked ? "bookmarked" : ""}`}
          onClick={(e) => onToggleBookmark(e, resource.id)}
          aria-label={resource.isBookmarked ? "Remove bookmark" : "Bookmark this resource"}
          title={resource.isBookmarked ? "Remove bookmark" : "Save resource"}
        >
          {resource.isBookmarked
            ? <BookmarkCheck size={15} />
            : <Bookmark size={15} />
          }
        </button>
      </div>

      <h3 className="resource-card-title">{resource.title}</h3>

      <p className="resource-card-desc">{resource.shortDescription}</p>

      <div className="resource-card-footer">
        <span className="resource-read-time">
          <Clock size={11} />
          {resource.readTimeMinutes} min read
        </span>
        <span className="resource-card-cta">
          Read more <ChevronRight size={11} />
        </span>
      </div>
    </article>
  );
}

// ========================================
// RESOURCE READ VIEW
// ========================================

function ResourceReadView({
  resource,
  loading,
  onBack,
  onToggleBookmark,
  onOpenRelated,
}) {
  if (loading || !resource) {
    return (
      <div className="resource-read-page">
        <div className="resource-read-topbar">
          <button className="resource-back-btn" onClick={onBack}>
            <ChevronLeft size={15} />
            Back to Resources
          </button>
        </div>
        <div className="resource-read-loading">
          <div className="resource-read-loading-icon">
            <FileText size={24} />
          </div>
          <p>Loading resource...</p>
        </div>
      </div>
    );
  }

  const sections = parseResourceContent(resource.content);

  return (
    <div className="resource-read-page">

      {/* ---- TOP BAR ---- */}
      <div className="resource-read-topbar">
        <button className="resource-back-btn" onClick={onBack}>
          <ChevronLeft size={15} />
          Back to Resources
        </button>

        <div className="resource-read-topbar-actions">
          <button
            className={`resource-read-bookmark ${resource.isBookmarked ? "bookmarked" : ""}`}
            onClick={onToggleBookmark}
            aria-label={resource.isBookmarked ? "Remove bookmark" : "Save resource"}
          >
            {resource.isBookmarked
              ? <><BookmarkCheck size={15} /> Saved</>
              : <><Bookmark size={15} /> Save</>
            }
          </button>
        </div>
      </div>

      <div className="resource-read-layout">

        {/* ---- ARTICLE ---- */}
        <article className="resource-article">

          {/* Header */}
          <header className="resource-article-header">
            <span className="resource-article-category">
              {CATEGORY_EMOJI[resource.category] || "📄"} {resource.category}
            </span>

            <h1 className="resource-article-title">{resource.title}</h1>

            <p className="resource-article-intro">{resource.shortDescription}</p>

            <div className="resource-article-meta">
              <span>
                <Clock size={12} />
                {resource.readTimeMinutes} min read
              </span>
              {resource.source && (
                <span>
                  <ExternalLink size={12} />
                  {resource.source}
                </span>
              )}
              <span>
                Updated {new Date(resource.dateUpdated).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="resource-article-content">
            {sections.map((section, i) => (
              <ResourceSection key={i} section={section} />
            ))}
          </div>

          {/* Key Points */}
          {resource.keyPoints?.length > 0 && (
            <div className="resource-callout resource-callout-key">
              <h3>
                <Sparkles size={15} />
                Key Points
              </h3>
              <ul>
                {resource.keyPoints.map((point, i) => (
                  <li key={i}>
                    <span className="kp-dot" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Tips */}
          {resource.practicalTips?.length > 0 && (
            <div className="resource-callout resource-callout-tips">
              <h3>
                <Check size={15} />
                Practical Tips
              </h3>
              <ul>
                {resource.practicalTips.map((tip, i) => (
                  <li key={i}>
                    <span className="tip-num">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Signs */}
          {resource.warningSigns?.length > 0 && (
            <div className="resource-callout resource-callout-warning">
              <h3>
                <Bell size={15} />
                Warning Signs
              </h3>
              <ul>
                {resource.warningSigns.map((sign, i) => (
                  <li key={i}>
                    <span className="warn-dot" />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* When to Seek Help */}
          {resource.whenToSeekHelp && (
            <div className="resource-callout resource-callout-help">
              <h3>
                <HeartPulse size={15} />
                When to Seek Professional Help
              </h3>
              <p>{resource.whenToSeekHelp}</p>
            </div>
          )}
        </article>

        {/* ---- SIDEBAR ---- */}
        <aside className="resource-read-sidebar">

          {/* Related Resources */}
          {resource.relatedResources?.length > 0 && (
            <div className="resource-related">
              <h4 className="resource-related-title">
                <BookOpen size={13} />
                Related Resources
              </h4>

              <div className="resource-related-list">
                {resource.relatedResources.map((rel) => (
                  <button
                    key={rel.id}
                    className="resource-related-item"
                    onClick={() => onOpenRelated(rel.id)}
                  >
                    <span className="related-emoji">
                      {CATEGORY_EMOJI[rel.category] || "📄"}
                    </span>
                    <div className="related-text">
                      <strong>{rel.title}</strong>
                      <span>
                        <Clock size={10} />
                        {rel.readTimeMinutes} min
                      </span>
                    </div>
                    <ChevronRight size={13} className="related-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          {resource.source && (
            <div className="resource-source-box">
              <h4>
                <ExternalLink size={12} />
                Source
              </h4>
              <p>{resource.source}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// ========================================
// PARSE RESOURCE CONTENT INTO SECTIONS
// Splits markdown-style content on ## headings
// ========================================

function parseResourceContent(content = "") {
  const lines = content.split("\n");
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { heading: line.replace("## ", "").trim(), paragraphs: [] };
    } else if (line.startsWith("**") && line.endsWith("**") && current) {
      current.paragraphs.push({ type: "bold-heading", text: line.slice(2, -2) });
    } else if (line.trim() && current) {
      // Check if last paragraph is same type, else push new
      const cleaned = line.trim();
      current.paragraphs.push({ type: "para", text: cleaned });
    }
  }

  if (current) sections.push(current);
  return sections;
}

function ResourceSection({ section }) {
  return (
    <section className="resource-section">
      <h2>{section.heading}</h2>
      {section.paragraphs.map((p, i) => {
        if (p.type === "bold-heading") {
          return (
            <p key={i}>
              <strong>{p.text}</strong>
            </p>
          );
        }
        // Inline bold: replace **text** with <strong>
        const parts = p.text.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </section>
  );
}

// ========================================
// WELLNESS PAGE
// ========================================

function WellnessPage({ user }) {
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, mood, breathing, meditation, sleep, goals, journal, grounding
  const [checkIns, setCheckIns] = useState([]);
  const [wellnessError, setWellnessError] = useState("");
  const [wellnessLoading, setWellnessLoading] = useState(true);
  const [wellnessData, setWellnessData] = useState({
    todayMood: null,
    sleepHours: null,
    goals: [
      { id: 1, text: "10 min meditation", completed: true },
      { id: 2, text: "20 min walk", completed: true },
      { id: 3, text: "Sleep before 11 PM", completed: false },
      { id: 4, text: "Drink enough water", completed: false },
    ],
    journalEntries: [],
    moodHistory: [],
  });
  const moodLabels = ["", "Stressed", "Low", "Okay", "Good", "Great"];

  useEffect(() => {
    let cancelled = false;
    getWellnessCheckIns()
      .then((result) => {
        if (cancelled) return;
        const nextCheckIns = result.checkIns || [];
        const latest = nextCheckIns[0];
        setCheckIns(nextCheckIns);
        if (latest) {
          setWellnessData((previous) => ({
            ...previous,
            todayMood: moodLabels[latest.mood] || "Not checked",
            sleepHours: latest.sleepHours,
          }));
        }
      })
      .catch((error) => {
        if (!cancelled) setWellnessError(error.message || "Unable to load wellness history.");
      })
      .finally(() => {
        if (!cancelled) setWellnessLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  const saveWellnessCheckIn = async (data) => {
    setWellnessError("");
    try {
      const result = await createWellnessCheckIn(data);
      setCheckIns((previous) => [result.checkIn, ...previous]);
      setWellnessData((previous) => ({ ...previous, todayMood: moodLabels[result.checkIn.mood] || "Not checked", sleepHours: result.checkIn.sleepHours }));
      setCurrentView("dashboard");
    } catch (error) {
      setWellnessError(error.message || "Unable to save wellness check-in.");
    }
  };

  // Calculate wellness progress
  const wellnessProgress = useMemo(() => {
    const completedGoals = wellnessData.goals.filter(g => g.completed).length;
    const goalProgress = Math.round((completedGoals / wellnessData.goals.length) * 100);
    
    return {
      mood: wellnessData.todayMood || "Not checked",
      sleep: wellnessData.sleepHours ? `${wellnessData.sleepHours}h` : "Not tracked",
      meditation: "Not tracked",
      goals: `${goalProgress}% completed`
    };
  }, [wellnessData]);

  const handleMoodSelect = (mood) => {
    setWellnessData(prev => ({
      ...prev,
      todayMood: mood,
      moodHistory: [...prev.moodHistory, { mood, date: new Date().toISOString() }]
    }));
  };

  const handleSleepSelect = (hours) => {
    setWellnessData(prev => ({
      ...prev,
      sleepHours: hours
    }));
  };

  const toggleGoal = (goalId) => {
    setWellnessData(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId ? { ...g, completed: !g.completed } : g
      )
    }));
  };

  const addGoal = (text) => {
    if (text.trim()) {
      setWellnessData(prev => ({
        ...prev,
        goals: [...prev.goals, { id: Date.now(), text: text.trim(), completed: false }]
      }));
    }
  };

  const saveJournal = (content) => {
    if (content.trim()) {
      setWellnessData(prev => ({
        ...prev,
        journalEntries: [
          { id: Date.now(), content: content.trim(), date: new Date().toISOString() },
          ...prev.journalEntries
        ]
      }));
    }
  };

  return (
    <div className="wellness-page">
      {wellnessError && <div className="support-feedback support-feedback-error">{wellnessError}</div>}
      {wellnessLoading && currentView === "dashboard" && <div className="support-muted">Loading your saved wellness history...</div>}
      {currentView === "dashboard" && (
        <WellnessDashboard
          wellnessData={wellnessData}
          wellnessProgress={wellnessProgress}
          onNavigate={setCurrentView}
          onMoodSelect={handleMoodSelect}
          onSleepSelect={handleSleepSelect}
          onSaveCheckIn={saveWellnessCheckIn}
          checkIns={checkIns}
          onToggleGoal={toggleGoal}
          onAddGoal={addGoal}
        />
      )}

      {currentView === "mood" && (
        <MoodCheckIn
          currentMood={wellnessData.todayMood}
          onMoodSelect={handleMoodSelect}
          onSaveCheckIn={saveWellnessCheckIn}
          onBack={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "breathing" && (
        <BreathingExercise
          onBack={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "meditation" && (
        <MeditationSection
          onBack={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "sleep" && (
        <SleepWellness
          currentSleep={wellnessData.sleepHours}
          onSleepSelect={handleSleepSelect}
          onBack={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "goals" && (
        <WellnessGoals
          goals={wellnessData.goals}
          onToggleGoal={toggleGoal}
          onAddGoal={addGoal}
          onBack={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "journal" && (
        <JournalSection
          entries={wellnessData.journalEntries}
          onSave={saveJournal}
          onBack={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "grounding" && (
        <GroundingExercise
          onBack={() => setCurrentView("dashboard")}
        />
      )}
    </div>
  );
}

// ========================================
// WELLNESS DASHBOARD
// ========================================

function WellnessDashboard({
  wellnessData,
  wellnessProgress,
  checkIns,
  onNavigate,
  onMoodSelect,
  onSleepSelect,
  onSaveCheckIn,
  onToggleGoal,
  onAddGoal,
}) {
  const [newGoalText, setNewGoalText] = useState("");

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      onAddGoal(newGoalText);
      setNewGoalText("");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const moodEmojis = {
    "Great": "😊",
    "Good": "🙂", 
    "Okay": "😐",
    "Low": "😔",
    "Anxious": "😟",
    "Stressed": "😣"
  };

  return (
    <div className="wellness-dashboard">
      {/* Header */}
      <div className="wellness-header">
        <h1>{getGreeting()} 👋</h1>
        <p>Take a moment to check in with yourself.</p>
      </div>

      {/* Wellness Progress */}
      <div className="wellness-progress-card">
        <h2>Your Wellness</h2>
        <div className="wellness-progress-grid">
          <div className="progress-item">
            <span className="progress-label">Mood</span>
            <span className="progress-value">
              {moodEmojis[wellnessProgress.mood] || "🤔"} {wellnessProgress.mood}
            </span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Sleep</span>
            <span className="progress-value">{wellnessProgress.sleep}</span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Meditation</span>
            <span className="progress-value">{wellnessProgress.meditation}</span>
          </div>
          <div className="progress-item">
            <span className="progress-label">Goals</span>
            <span className="progress-value">{wellnessProgress.goals}</span>
          </div>
        </div>
      </div>

      {/* Wellness Tools Grid */}
      <div className="wellness-tools-grid">
        <WellnessToolCard
          icon="😊"
          title="Mood Check"
          description="Check in"
          onClick={() => onNavigate("mood")}
        />
        <WellnessToolCard
          icon="🫁"
          title="Breathing"
          description="2 minutes"
          onClick={() => onNavigate("breathing")}
        />
        <WellnessToolCard
          icon="🧘"
          title="Mindfulness"
          description="Relax"
          onClick={() => onNavigate("meditation")}
        />
        <WellnessToolCard
          icon="😴"
          title="Sleep"
          description="Track sleep"
          onClick={() => onNavigate("sleep")}
        />
      </div>

      <div className="wellness-goals-section">
        <div className="section-header"><h2>Recent check-ins</h2></div>
        {!checkIns.length ? <p className="support-muted">Your saved mood and wellness check-ins will appear here.</p> : checkIns.slice(0, 7).map((checkIn) => (
          <div className="goal-item" key={checkIn.id}>
            <span className="goal-text">{new Date(checkIn.createdAt).toLocaleDateString()} · Mood {checkIn.mood}/5 · Stress {checkIn.stressLevel}/5 · Energy {checkIn.energyLevel}/5{checkIn.sleepHours === null ? "" : ` · Sleep ${checkIn.sleepHours}h`}</span>
          </div>
        ))}
      </div>

      {/* Today's Wellness Goals */}
      <div className="wellness-goals-section">
        <div className="section-header">
          <h2>Today's Wellness Goals</h2>
        </div>
        <div className="goals-list">
          {wellnessData.goals.map(goal => (
            <div key={goal.id} className="goal-item">
              <button
                className={`goal-checkbox ${goal.completed ? "completed" : ""}`}
                onClick={() => onToggleGoal(goal.id)}
              >
                {goal.completed ? <Check size={16} /> : null}
              </button>
              <span className={goal.completed ? "goal-text-completed" : "goal-text"}>
                {goal.text}
              </span>
            </div>
          ))}
          <form onSubmit={handleAddGoal} className="add-goal-form">
            <input
              type="text"
              placeholder="Add a new goal..."
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
            />
            <button type="submit" className="add-goal-btn">
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Daily Journal */}
      <div className="wellness-journal-section">
        <div className="section-header">
          <h2>📔 Daily Journal</h2>
        </div>
        <p className="journal-prompt">How are you feeling today?</p>
        <button
          className="journal-button"
          onClick={() => onNavigate("journal")}
        >
          Write something...
        </button>
      </div>
    </div>
  );
}

// ========================================
// WELLNESS TOOL CARD
// ========================================

function WellnessToolCard({ icon, title, description, onClick }) {
  return (
    <button className="wellness-tool-card" onClick={onClick}>
      <div className="wellness-tool-icon">{icon}</div>
      <div className="wellness-tool-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </button>
  );
}

// ========================================
// MOOD CHECK-IN
// ========================================

function MoodCheckIn({ currentMood, onMoodSelect, onSaveCheckIn, onBack }) {
  const [stressLevel, setStressLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [sleepHours, setSleepHours] = useState("");
  const [notes, setNotes] = useState("");
  const moods = [
    { emoji: "😊", label: "Great", color: "#10b981" },
    { emoji: "🙂", label: "Good", color: "#3b82f6" },
    { emoji: "😐", label: "Okay", color: "#f59e0b" },
    { emoji: "😔", label: "Low", color: "#6b7280" },
    { emoji: "😟", label: "Anxious", color: "#8b5cf6" },
    { emoji: "😣", label: "Stressed", color: "#ef4444" },
  ];

  return (
    <div className="wellness-sub-page">
      <div className="wellness-sub-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1>Daily Mood Check-in</h1>
      </div>

      <div className="mood-check-container">
        <p className="mood-question">How are you feeling today?</p>
        
        <div className="mood-options">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className={`mood-option ${currentMood === mood.label ? "selected" : ""}`}
              onClick={() => onMoodSelect(mood.label)}
              style={{ "--mood-color": mood.color }}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>

        {currentMood && (
          <div className="mood-confirmation">
            <p>You're feeling {currentMood.toLowerCase()} today</p>
            <label>Stress level (1–5)<input type="number" min="1" max="5" value={stressLevel} onChange={(event) => setStressLevel(event.target.value)} /></label>
            <label>Energy level (1–5)<input type="number" min="1" max="5" value={energyLevel} onChange={(event) => setEnergyLevel(event.target.value)} /></label>
            <label>Sleep hours<input type="number" min="0" max="24" step="0.5" value={sleepHours} onChange={(event) => setSleepHours(event.target.value)} /></label>
            <label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="3" /></label>
            <button className="primary-button" onClick={() => onSaveCheckIn({ mood: { Great: 5, Good: 4, Okay: 3, Low: 2, Anxious: 2, Stressed: 1 }[currentMood] || 3, stressLevel, energyLevel, sleepHours, notes })}>
              Save check-in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// BREATHING EXERCISE
// ========================================

function BreathingExercise({ onBack }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle, inhale, hold1, exhale, hold2
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev > 1) return prev - 1;
          
          // Phase transitions
          setPhase(currentPhase => {
            switch (currentPhase) {
              case "idle":
                return "inhale";
              case "inhale":
                setCycleCount(c => c + 1);
                return "hold1";
              case "hold1":
                return "exhale";
              case "exhale":
                return "hold2";
              case "hold2":
                return "inhale";
              default:
                return "inhale";
            }
          });
          
          return 4; // Reset countdown
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setPhase("inhale");
    setCountdown(4);
    setCycleCount(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase("idle");
    setCountdown(4);
  };

  const phaseText = {
    idle: "Ready to begin",
    inhale: "Inhale",
    hold1: "Hold",
    exhale: "Exhale", 
    hold2: "Hold"
  };

  return (
    <div className="wellness-sub-page">
      <div className="wellness-sub-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1>Breathing Exercise</h1>
      </div>

      <div className="breathing-container">
        <div className="breathing-circle-container">
          <div className={`breathing-circle ${phase}`}>
            <div className="breathing-text">
              <span className="breathing-phase">{phaseText[phase]}</span>
              <span className="breathing-countdown">{isActive ? countdown : "4"}</span>
              <span className="breathing-seconds">sec</span>
            </div>
          </div>
        </div>

        <div className="breathing-instructions">
          <div className="breathing-step">
            <span className="step-label">Inhale</span>
            <span className="step-time">4 sec</span>
          </div>
          <div className="breathing-step">
            <span className="step-label">Hold</span>
            <span className="step-time">4 sec</span>
          </div>
          <div className="breathing-step">
            <span className="step-label">Exhale</span>
            <span className="step-time">4 sec</span>
          </div>
          <div className="breathing-step">
            <span className="step-label">Hold</span>
            <span className="step-time">4 sec</span>
          </div>
        </div>

        <div className="breathing-controls">
          <div className="cycle-counter">
            Cycles: {cycleCount}
          </div>
          {!isActive ? (
            <button className="primary-button breathing-start-btn" onClick={handleStart}>
              Start
            </button>
          ) : (
            <button className="secondary-button" onClick={handleStop}>
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// MEDITATION SECTION
// ========================================

function MeditationSection({ onBack }) {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);

  const meditations = [
    { id: 1, title: "2-minute mindfulness", duration: 120, description: "Quick grounding exercise" },
    { id: 2, title: "5-minute relaxation", duration: 300, description: "Deep relaxation technique" },
    { id: 3, title: "Body scan", duration: 600, description: "Full body awareness" },
    { id: 4, title: "Grounding exercise", duration: 180, description: "5-4-3-2-1 technique" },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying && selectedMeditation && timer < selectedMeditation.duration) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timer >= selectedMeditation?.duration) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedMeditation, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = (meditation) => {
    setSelectedMeditation(meditation);
    setTimer(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimer(0);
  };

  if (selectedMeditation) {
    const progress = (timer / selectedMeditation.duration) * 100;
    
    return (
      <div className="wellness-sub-page">
        <div className="wellness-sub-header">
          <button className="back-button" onClick={() => { setSelectedMeditation(null); handleReset(); }}>
            <ChevronLeft size={20} />
            Back
          </button>
          <h1>{selectedMeditation.title}</h1>
        </div>

        <div className="meditation-player">
          <div className="meditation-timer">
            <div className="timer-circle">
              <svg className="timer-progress" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="#667eea"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="timer-display">
                <span className="timer-time">{formatTime(timer)}</span>
                <span className="timer-total">/ {formatTime(selectedMeditation.duration)}</span>
              </div>
            </div>
          </div>

          <div className="meditation-controls">
            {!isPlaying ? (
              <button className="primary-button" onClick={() => setIsPlaying(true)}>
                <Play size={20} /> Start
              </button>
            ) : (
              <button className="secondary-button" onClick={() => setIsPlaying(false)}>
                <Pause size={20} /> Pause
              </button>
            )}
            <button className="secondary-button" onClick={handleReset}>
              <RefreshCw size={20} /> Reset
            </button>
          </div>

          <div className="meditation-instructions">
            <p>{selectedMeditation.description}</p>
            <p>Find a comfortable position and focus on your breath.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wellness-sub-page">
      <div className="wellness-sub-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1>Meditation & Mindfulness</h1>
      </div>

      <div className="meditation-list">
        {meditations.map(meditation => (
          <div key={meditation.id} className="meditation-card">
            <div className="meditation-info">
              <h3>{meditation.title}</h3>
              <p>{meditation.description}</p>
              <span className="meditation-duration">{formatTime(meditation.duration)}</span>
            </div>
            <button
              className="meditation-start-btn"
              onClick={() => handleStart(meditation)}
            >
              <Play size={16} /> Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// SLEEP WELLNESS
// ========================================

function SleepWellness({ currentSleep, onSleepSelect, onBack }) {
  const sleepOptions = [
    { label: "< 4h", value: "less4", description: "Very little sleep" },
    { label: "4–6h", value: "4-6", description: "Below recommended" },
    { label: "6–8h", value: "6-8", description: "Good amount" },
    { label: "> 8h", value: "more8", description: "Well rested" },
  ];

  return (
    <div className="wellness-sub-page">
      <div className="wellness-sub-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1>Sleep Wellness</h1>
      </div>

      <div className="sleep-container">
        <div className="sleep-icon">😴</div>
        <p className="sleep-question">How many hours did you sleep?</p>

        <div className="sleep-options">
          {sleepOptions.map(option => (
            <button
              key={option.value}
              className={`sleep-option ${currentSleep === option.value ? "selected" : ""}`}
              onClick={() => onSleepSelect(option.value)}
            >
              <span className="sleep-label">{option.label}</span>
              <span className="sleep-description">{option.description}</span>
            </button>
          ))}
        </div>

        {currentSleep && (
          <div className="sleep-tips">
            <h3>💡 Tips for better sleep</h3>
            <ul>
              <li>Maintain a consistent sleep schedule</li>
              <li>Create a relaxing bedtime routine</li>
              <li>Avoid screens 1 hour before bed</li>
              <li>Keep your bedroom cool and dark</li>
              <li>Avoid caffeine late in the day</li>
            </ul>
            <button className="primary-button" onClick={onBack}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// WELLNESS GOALS
// ========================================

function WellnessGoals({ goals, onToggleGoal, onAddGoal, onBack }) {
  const [newGoalText, setNewGoalText] = useState("");

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      onAddGoal(newGoalText);
      setNewGoalText("");
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = Math.round((completedCount / goals.length) * 100);

  return (
    <div className="wellness-sub-page">
      <div className="wellness-sub-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1>Daily Wellness Goals</h1>
      </div>

      <div className="goals-full-page">
        <div className="goals-progress-section">
          <div className="goals-progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="goals-progress-text">
            <span>{completedCount} of {goals.length} completed</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="goals-list-full">
          {goals.map(goal => (
            <div key={goal.id} className="goal-item-full">
              <button
                className={`goal-checkbox-full ${goal.completed ? "completed" : ""}`}
                onClick={() => onToggleGoal(goal.id)}
              >
                {goal.completed ? <Check size={18} /> : null}
              </button>
              <span className={goal.completed ? "goal-text-completed" : "goal-text"}>
                {goal.text}
              </span>
              <button
                className="goal-delete-btn"
                onClick={() => {/* Add delete functionality */}}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddGoal} className="add-goal-form-full">
          <div className="add-goal-input-group">
            <input
              type="text"
              placeholder="Add a new wellness goal..."
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
            />
            <button type="submit" className="add-goal-btn-full">
              <Plus size={18} />
            </button>
          </div>
        </form>

        <div className="goals-suggestions">
          <h3>Suggested goals</h3>
          <div className="suggestion-chips">
            {["💧 Drink water", "🚶 Walk/exercise", "😴 Sleep on time", "🧘 Meditation", "📵 Screen break"].map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => setNewGoalText(suggestion.replace(/^[^\s]+\s/, ''))}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// JOURNAL SECTION
// ========================================

function JournalSection({ entries, onSave, onBack }) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (content.trim()) {
      setIsSaving(true);
      onSave(content);
      setContent("");
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="wellness-sub-page">
      <div className="wellness-sub-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1>📔 Daily Journal</h1>
      </div>

      <div className="journal-full-page">
        <div className="journal-prompt-section">
          <p className="journal-prompt-large">How was your day?</p>
          <p className="journal-sub-prompt">Take a moment to reflect on your thoughts and feelings.</p>
        </div>

        <div className="journal-editor">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            rows={8}
            className="journal-textarea"
          />
          <button
            className={`journal-save-btn ${isSaving ? "saving" : ""}`}
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
          >
            {isSaving ? <Check size={16} /> : <Save size={16} />}
            {isSaving ? "Saved!" : "Save Journal"}
          </button>
        </div>

        {entries.length > 0 && (
          <div className="journal-entries-section">
            <h3>Previous Entries</h3>
            <div className="journal-entries-list">
              {entries.map(entry => (
                <div key={entry.id} className="journal-entry">
                  <div className="journal-entry-header">
                    <span className="journal-entry-date">{formatDate(entry.date)}</span>
                  </div>
                  <p className="journal-entry-content">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// GROUNDING EXERCISE
// ========================================

function GroundingExercise({ onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({
    see: [],
    touch: [],
    hear: [],
    smell: [],
    taste: ""
  });
  const [currentInput, setCurrentInput] = useState("");

  const steps = [
    { number: 5, sense: "see", prompt: "5 things you can see", icon: "👀" },
    { number: 4, sense: "touch", prompt: "4 things you can touch", icon: "✋" },
    { number: 3, sense: "hear", prompt: "3 things you can hear", icon: "👂" },
    { number: 2, sense: "smell", prompt: "2 things you can smell", icon: "👃" },
    { number: 1, sense: "taste", prompt: "1 thing you can taste", icon: "👅" },
  ];

  const handleAddResponse = () => {
    if (currentInput.trim()) {
      const sense = steps[currentStep].sense;
      setUserResponses(prev => ({
        ...prev,
        [sense]: [...prev[sense], currentInput.trim()]
      }));
      setCurrentInput("");
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentInput("");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const currentResponses = userResponses[currentStepData.sense];
  const isComplete = currentStep === steps.length - 1 && 
    (currentStepData.sense === "taste" ? userResponses.taste : currentResponses.length >= currentStepData.number);

  return (
    <div className="wellness-sub-page">
      <div className="wellness-sub-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1>Grounding Exercise</h1>
      </div>

      <div className="grounding-container">
        <div className="grounding-progress">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grounding-step-indicator ${index === currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""}`}
            >
              {step.number}
            </div>
          ))}
        </div>

        <div className="grounding-step-content">
          <div className="grounding-step-icon">{currentStepData.icon}</div>
          <h2>{currentStepData.prompt}</h2>
          
          <div className="grounding-responses">
            {currentResponses.map((response, index) => (
              <div key={index} className="grounding-response-item">
                <span>{response}</span>
                <button
                  className="grounding-response-remove"
                  onClick={() => {
                    const sense = currentStepData.sense;
                    setUserResponses(prev => ({
                      ...prev,
                      [sense]: prev[sense].filter((_, i) => i !== index)
                    }));
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="grounding-input-group">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={currentStepData.sense === "taste" ? "What can you taste?" : `Add something you can ${currentStepData.sense}...`}
              onKeyPress={(e) => e.key === "Enter" && handleAddResponse()}
            />
            <button
              className="grounding-add-btn"
              onClick={handleAddResponse}
              disabled={!currentInput.trim()}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="grounding-navigation">
            {currentStep > 0 && (
              <button className="secondary-button" onClick={handlePreviousStep}>
                <ChevronLeft size={16} /> Previous
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                className="primary-button"
                onClick={handleNextStep}
                disabled={currentResponses.length < currentStepData.number}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="primary-button"
                onClick={onBack}
                disabled={!isComplete}
              >
                Complete <Check size={16} />
              </button>
            )}
          </div>
        </div>

        {isComplete && (
          <div className="grounding-completion">
            <div className="grounding-summary">
              <h3>🎉 Grounding Complete!</h3>
              <p>Take a deep breath and notice how you feel now.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// CONVERSATIONS PAGE
// ========================================

function ConversationsPage({ user, onOpenAssistant }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [error, setError] = useState("");

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getConversations({});
      setConversations((res.conversations || []).filter((conversation) =>
        Number(conversation?._count?.messages || 0) > 0
      ));
    } catch (err) {
      console.error("Load conversations error:", err);
      setError(err.message || "Unable to load conversations.");
    } finally {
      setLoading(false);
    }
  };

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const preview = (c.messages?.[0]?.content || "").toLowerCase();
      return title.includes(q) || preview.includes(q);
    });
  }, [conversations, searchTerm]);

  // Group conversations by time
  const groupedConversations = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      previous7Days: [],
      older: []
    };

    filteredConversations.forEach((conv) => {
      const convDate = new Date(conv.updatedAt);
      const convDay = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());

      if (convDay.getTime() === today.getTime()) {
        groups.today.push(conv);
      } else if (convDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(conv);
      } else if (convDay >= weekAgo) {
        groups.previous7Days.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  }, [filteredConversations]);

  // Handle rename
  const handleRenameConfirm = async (newTitle) => {
    const id = renameTarget?.id;
    setRenameTarget(null);
    if (!id) return;
    try {
      const res = await renameConversation(id, newTitle);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: res.conversation.title, updatedAt: res.conversation.updatedAt } : c))
      );
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    const id = deleteTarget?.id;
    setDeleteTarget(null);
    if (!id) return;
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle open conversation
  const handleOpenConversation = (convId) => {
    sessionStorage.setItem(`mindcare_active_conversation_${user?.id || "guest"}`, String(convId));
    onOpenAssistant(convId);
  };

  // Format time for display
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const hasConversations = Object.values(groupedConversations).some(group => group.length > 0);

  return (
    <div className="conversations-page">
      {/* Header */}
      <div className="conversations-header">
        <div>
          <h1>Conversations</h1>
          <p>Your conversation history with MindCare</p>
        </div>
        <button
          className="primary-button"
          onClick={onOpenAssistant}
        >
          <Plus size={15} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="conversations-search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Modals */}
      {renameTarget && (
        <RenameModal
          title={renameTarget.title}
          onConfirm={handleRenameConfirm}
          onCancel={() => setRenameTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          title={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Content */}
      {error ? (
        <div className="conversations-empty conversations-error-state">
          <div className="conversations-empty-icon"><AlertTriangle size={28} /></div>
          <h2>We couldn’t load your conversations</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={loadConversations}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      ) : loading ? (
        <div className="conversations-loading">
          <div className="loading-spinner" />
          <p>Loading conversations...</p>
        </div>
      ) : !hasConversations ? (
        <div className="conversations-empty">
          {searchTerm && <Search size={28} className="conversations-no-results-icon" />}
          <div className="conversations-empty-icon">
            <MessageCircle size={32} />
          </div>
          <h2>{searchTerm ? "No conversations found" : "No conversations yet"}</h2>
          <p>
            {searchTerm
              ? `No saved conversations match “${searchTerm}”.`
              : "Start a conversation with MindCare to see your chat history here."}
          </p>
          <button
            className="primary-button"
            onClick={() => searchTerm ? setSearchTerm("") : onOpenAssistant()}
          >
            {searchTerm ? <X size={15} /> : <MessageCircle size={15} />}
            {searchTerm ? "Clear search" : "Start a Chat"}
          </button>
        </div>
      ) : (
        <div className="conversations-list">
          {/* Today */}
          {groupedConversations.today.length > 0 && (
            <div className="conversation-group">
              <div className="conversation-group-label">Today</div>
              {groupedConversations.today.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conv={conv}
                  openMenuId={openMenuId}
                  onOpen={() => handleOpenConversation(conv.id)}
                  onMenuOpen={(id) => setOpenMenuId(id)}
                  onMenuClose={() => setOpenMenuId(null)}
                  onRename={(c) => { setOpenMenuId(null); setRenameTarget(c); }}
                  onDelete={(c) => { setOpenMenuId(null); setDeleteTarget(c); }}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}

          {/* Yesterday */}
          {groupedConversations.yesterday.length > 0 && (
            <div className="conversation-group">
              <div className="conversation-group-label">Yesterday</div>
              {groupedConversations.yesterday.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conv={conv}
                  openMenuId={openMenuId}
                  onOpen={() => handleOpenConversation(conv.id)}
                  onMenuOpen={(id) => setOpenMenuId(id)}
                  onMenuClose={() => setOpenMenuId(null)}
                  onRename={(c) => { setOpenMenuId(null); setRenameTarget(c); }}
                  onDelete={(c) => { setOpenMenuId(null); setDeleteTarget(c); }}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}

          {/* Previous 7 days */}
          {groupedConversations.previous7Days.length > 0 && (
            <div className="conversation-group">
              <div className="conversation-group-label">Previous 7 days</div>
              {groupedConversations.previous7Days.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conv={conv}
                  openMenuId={openMenuId}
                  onOpen={() => handleOpenConversation(conv.id)}
                  onMenuOpen={(id) => setOpenMenuId(id)}
                  onMenuClose={() => setOpenMenuId(null)}
                  onRename={(c) => { setOpenMenuId(null); setRenameTarget(c); }}
                  onDelete={(c) => { setOpenMenuId(null); setDeleteTarget(c); }}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}

          {/* Older */}
          {groupedConversations.older.length > 0 && (
            <div className="conversation-group">
              <div className="conversation-group-label">Older</div>
              {groupedConversations.older.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conv={conv}
                  openMenuId={openMenuId}
                  onOpen={() => handleOpenConversation(conv.id)}
                  onMenuOpen={(id) => setOpenMenuId(id)}
                  onMenuClose={() => setOpenMenuId(null)}
                  onRename={(c) => { setOpenMenuId(null); setRenameTarget(c); }}
                  onDelete={(c) => { setOpenMenuId(null); setDeleteTarget(c); }}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================================
// CONVERSATION LIST ITEM
// ========================================

function ConversationListItem({
  conv,
  openMenuId,
  onOpen,
  onMenuOpen,
  onMenuClose,
  onRename,
  onDelete,
  formatTime,
}) {
  const isMenuOpen = openMenuId === conv.id;
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onMenuClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onMenuClose]);

  const preview = conv.messages?.[0]?.content || "";

  return (
    <div className={`conversation-list-item ${isMenuOpen ? "menu-open" : ""}`}>
      <button
        className="conversation-item-button"
        onClick={onOpen}
      >
        <div className="conversation-item-icon">
          <MessageCircle size={16} />
        </div>
        <div className="conversation-item-content">
          <div className="conversation-item-title">
            {conv.title || "Conversation"}
          </div>
          {preview && (
            <div className="conversation-item-preview">
              {truncate(preview, 80)}
            </div>
          )}
          <div className="conversation-item-time">
            {formatTime(conv.updatedAt)}
          </div>
        </div>
      </button>

      <div className="conversation-item-menu-wrapper" ref={menuRef}>
        <button
          className={`conversation-menu-trigger ${isMenuOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            isMenuOpen ? onMenuClose() : onMenuOpen(conv.id);
          }}
          aria-label="Conversation options"
        >
          <MoreHorizontal size={16} />
        </button>

        {isMenuOpen && (
          <div className="conversation-dropdown-menu">
            <button
              className="conversation-menu-item"
              onClick={() => onRename(conv)}
            >
              <Pencil size={13} />
              Rename
            </button>
            <div className="conversation-menu-divider" />
            <button
              className="conversation-menu-item conversation-menu-danger"
              onClick={() => onDelete(conv)}
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// PLACEHOLDER PAGE
// ========================================

function PlaceholderPage({
  icon,
  title,
  description,
}) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        {icon}
      </div>

      <h1>{title}</h1>

      <p>{description}</p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "#6259e5",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        <Sparkles size={13} />
        Coming in the next module
      </div>
    </div>
  );
}

export default App;
