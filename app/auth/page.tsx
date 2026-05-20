"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { readAccounts, saveAccounts, type Account } from "@/lib/demoAuth";
import toast from "react-hot-toast";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState<null | {
    name: string;
    action: "logged in" | "signed up";
  }>(null);

  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = (event: FormEvent) => {
    event.preventDefault();
    const email = signinForm.email.trim().toLowerCase();
    const password = signinForm.password;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    const account = readAccounts().find(
      (item: Account) =>
        item.email.toLowerCase() === email && item.password === password,
    );

    if (!account) {
      setLoading(false);
      toast.error("Account not found. Please sign up first.");
      return;
    }

    signIn({ name: account.name, email: account.email, phone: account.phone });
    setLoading(false);
    toast.success("Welcome back");
    setSuccessState({ name: account.name, action: "logged in" });
  };

  const handleSignUp = (event: FormEvent) => {
    event.preventDefault();
    const name = signupForm.name.trim();
    const email = signupForm.email.trim().toLowerCase();
    const phone = signupForm.phone.trim();
    const password = signupForm.password;
    const confirmPassword = signupForm.confirmPassword;

    if (!name || !email || !password) {
      toast.error("Name, email and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const accounts = readAccounts();
    const exists = accounts.some(
      (item: Account) => item.email.toLowerCase() === email,
    );
    if (exists) {
      setLoading(false);
      toast.error("Email already exists. Please sign in.");
      return;
    }

    const newAccount: Account = { name, email, phone, password };
    saveAccounts([...accounts, newAccount]);
    signIn({ name, email, phone });
    setLoading(false);
    toast.success("Account created");
    setSuccessState({ name, action: "signed up" });
  };

  if (successState) {
    return (
      <div
        style={{
          paddingTop: "64px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          className="card page-enter"
          style={{
            width: "100%",
            maxWidth: "520px",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              background: "rgba(52,211,153,0.12)",
              border: "2px solid rgba(52,211,153,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#34D399",
              fontSize: "36px",
            }}
          >
            ✓
          </div>
          <p
            className="section-label"
            style={{ marginBottom: "10px", color: "#34D399" }}
          >
            {successState.action === "logged in"
              ? "Login successful"
              : "Sign up successful"}
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "34px",
              fontWeight: 800,
              color: "#F5EDD8",
              marginBottom: "10px",
            }}
          >
            Welcome, {successState.name}
          </h1>
          <p
            style={{
              color: "#8A7566",
              marginBottom: "28px",
              lineHeight: "1.6",
            }}
          >
            Your account is active and you are now signed in.
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-ember"
            style={{
              padding: "14px 22px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-shell"
      style={{
        paddingTop: "64px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div
        className="card page-enter"
        style={{ width: "100%", maxWidth: "520px", padding: "28px" }}
      >
        <p className="section-label" style={{ marginBottom: "10px" }}>
          Customer Account
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#F5EDD8",
            marginBottom: "20px",
          }}
        >
          {mode === "signin"
            ? "Login with Email and Password"
            : "Create Account"}
        </h1>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            onClick={() => setMode("signin")}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: mode === "signin" ? "none" : "1px solid #3D3028",
              background: mode === "signin" ? "#E8541A" : "transparent",
              color: mode === "signin" ? "white" : "#8A7566",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: mode === "signup" ? "none" : "1px solid #3D3028",
              background: mode === "signup" ? "#E8541A" : "transparent",
              color: mode === "signup" ? "white" : "#8A7566",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>

        {mode === "signin" ? (
          <form
            onSubmit={handleSignIn}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "#8A7566",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@email.com"
                value={signinForm.email}
                onChange={(event) =>
                  setSigninForm({ ...signinForm, email: event.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "#8A7566",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="Enter password"
                value={signinForm.password}
                onChange={(event) =>
                  setSigninForm({ ...signinForm, password: event.target.value })
                }
              />
            </div>
            <button
              className="btn-ember"
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "12px 18px",
                borderRadius: "10px",
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#8A7566" }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#D4A843",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSignUp}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "#8A7566",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Full Name
              </label>
              <input
                className="input-field"
                placeholder="Your name"
                value={signupForm.name}
                onChange={(event) =>
                  setSignupForm({ ...signupForm, name: event.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "#8A7566",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@email.com"
                value={signupForm.email}
                onChange={(event) =>
                  setSignupForm({ ...signupForm, email: event.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "#8A7566",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Phone
              </label>
              <input
                className="input-field"
                type="tel"
                placeholder="+234..."
                value={signupForm.phone}
                onChange={(event) =>
                  setSignupForm({ ...signupForm, phone: event.target.value })
                }
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#8A7566",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Password
                </label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="At least 6 chars"
                  value={signupForm.password}
                  onChange={(event) =>
                    setSignupForm({
                      ...signupForm,
                      password: event.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#8A7566",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Confirm
                </label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Repeat password"
                  value={signupForm.confirmPassword}
                  onChange={(event) =>
                    setSignupForm({
                      ...signupForm,
                      confirmPassword: event.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button
              className="btn-ember"
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "12px 18px",
                borderRadius: "10px",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#8A7566" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#D4A843",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Login with email and password
              </button>
            </p>
          </form>
        )}

        <p style={{ marginTop: "16px", fontSize: "12px", color: "#8A7566" }}>
          Continue as guest? Go back to{" "}
          <Link href="/menu" style={{ color: "#D4A843" }}>
            menu
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
