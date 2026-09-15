import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import {
  loginUser,
  registerUser,
} from "../services/api";

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await loginUser(
          email.trim(),
          password
        );
      } else {
        result = await registerUser(
          name.trim(),
          email.trim(),
          password
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
            "Authentication failed."
        );
      }

      localStorage.setItem(
        "mental_health_token",
        result.token
      );

      localStorage.setItem(
        "mental_health_user",
        JSON.stringify(result.user)
      );

      onAuthenticated(result.user);

    } catch (err) {
      console.error(
        "Authentication error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setError("");
    setMode(
      isLogin
        ? "register"
        : "login"
    );
  };

  return (
    <div className="auth-page">

      {/* ========================================
          LEFT BRANDING SECTION
      ======================================== */}

      <section className="auth-visual">

        <div className="auth-visual-content">

          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Heart
                size={23}
                fill="currentColor"
              />
            </div>

            <div>
              <strong>MindCare</strong>
              <span>
                Mental Health Platform
              </span>
            </div>
          </div>

          <div className="auth-hero">

            <span className="auth-eyebrow">
              <Sparkles size={15} />
              Your wellbeing matters
            </span>

            <h1>
              A safe space
              <br />
              for your mind.
            </h1>

            <p>
              Get thoughtful support, explore
              mental health resources, and take
              small steps toward better wellbeing.
            </p>

          </div>

          <div className="auth-benefits">

            <div className="auth-benefit">
              <div className="benefit-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>
                  Private & secure
                </strong>

                <span>
                  Your personal information is
                  handled with care.
                </span>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="benefit-icon">
                <Sparkles size={18} />
              </div>

              <div>
                <strong>
                  AI-powered support
                </strong>

                <span>
                  Get general mental health
                  information whenever you need it.
                </span>
              </div>
            </div>

            <div className="auth-benefit">
              <div className="benefit-icon">
                <Heart
                  size={18}
                  fill="currentColor"
                />
              </div>

              <div>
                <strong>
                  Built around wellbeing
                </strong>

                <span>
                  Track your wellness and discover
                  helpful resources.
                </span>
              </div>
            </div>

          </div>

        </div>

        <div className="auth-decoration decoration-one"></div>
        <div className="auth-decoration decoration-two"></div>
        <div className="auth-decoration decoration-three"></div>

      </section>


      {/* ========================================
          RIGHT AUTH SECTION
      ======================================== */}

      <section className="auth-form-section">

        <div className="auth-form-wrapper">

          <div className="auth-mobile-brand">

            <div className="auth-brand-icon">
              <Heart
                size={21}
                fill="currentColor"
              />
            </div>

            <div>
              <strong>MindCare</strong>
              <span>
                Mental Health Platform
              </span>
            </div>

          </div>


          <div className="auth-heading">

            <span className="auth-heading-label">
              {isLogin
                ? "WELCOME BACK"
                : "GET STARTED"}
            </span>

            <h2>
              {isLogin
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {isLogin
                ? "Sign in to continue your mental wellness journey."
                : "Create your account and start your mental wellness journey."}
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

            {!isLogin && (
              <div className="auth-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="auth-input-wrapper">

                  <User size={18} />

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    autoComplete="name"
                    required
                  />

                </div>

              </div>
            )}


            <div className="auth-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="auth-input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            <div className="auth-field">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>

                {isLogin && (
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => {
                      setError(
                        "Password recovery will be added later."
                      );
                    }}
                  >
                    Forgot password?
                  </button>
                )}

              </div>


              <div className="auth-input-wrapper">

                <LockKeyhole size={18} />

                <input
                  id="password"
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
                  autoComplete={
                    isLogin
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {!isLogin && (
                <small className="auth-help">
                  Use at least 6 characters.
                </small>
              )}

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="auth-spinner"></span>

                  <span>
                    {isLogin
                      ? "Signing in..."
                      : "Creating account..."}
                  </span>
                </>
              ) : (
                <>
                  {isLogin ? (
                    <LockKeyhole size={18} />
                  ) : (
                    <UserPlus size={18} />
                  )}

                  <span>
                    {isLogin
                      ? "Sign In"
                      : "Create Account"}
                  </span>

                  <ArrowRight
                    size={17}
                    className="auth-submit-arrow"
                  />
                </>
              )}

            </button>

          </form>


          <div className="auth-divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>


          <div className="auth-switch">

            <span>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
            >
              {isLogin
                ? "Create account"
                : "Sign in"}
            </button>

          </div>


          <div className="auth-security">

            <ShieldCheck size={17} />

            <div>
              <strong>
                Your privacy matters
              </strong>

              <span>
                Your account information is
                protected and handled securely.
              </span>
            </div>

          </div>


          <p className="auth-footer">
            By continuing, you agree to use MindCare
            responsibly as a general mental health
            support platform.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Auth;