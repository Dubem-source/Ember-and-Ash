"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  MessageCircle,
  CheckCircle,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { TIMES, RESTAURANT_INFO } from "@/lib/data";
import {
  buildWhatsAppReservationMessage,
  getWhatsAppUrl,
  generateOrderId,
} from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { hasAccounts } from "@/lib/demoAuth";
import toast from "react-hot-toast";

type ReservationStatus = "idle" | "success";

export default function ReservationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<ReservationStatus>("idle");
  const [confirmId, setConfirmId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    requests: "",
  });
  const [minDateStr, setMinDateStr] = useState("");

  useEffect(() => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    setMinDateStr(minDate.toISOString().split("T")[0]);
  }, []);

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name) return "Please enter your name";
    if (!form.phone) return "Please enter your phone number";
    if (!form.date) return "Please select a date";
    if (!form.time) return "Please select a time";
    if (!form.guests) return "Please select number of guests";
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    const id = generateOrderId().replace("EA-", "RES-");
    setConfirmId(id);
    setStatus("success");
    toast.success("Reservation confirmed!");
  };

  const guardWhatsAppAccess = () => {
    if (isAuthenticated) return true;
    const hasAccount = hasAccounts();
    toast.error(
      hasAccount
        ? "Please log in with your email and password first"
        : "Please sign up first before using WhatsApp",
    );
    router.push("/auth?next=/reservations");
    return false;
  };

  const handleWhatsApp = () => {
    if (!guardWhatsAppAccess()) return;
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    const msg = buildWhatsAppReservationMessage(
      form.name,
      form.date,
      form.time,
      parseInt(form.guests),
      form.requests,
    );
    window.open(getWhatsAppUrl(msg), "_blank");
  };

  if (status === "success") {
    return (
      <div
        style={{
          paddingTop: "64px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            padding: "48px 24px",
          }}
          className="page-enter"
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background: "rgba(212,168,67,0.12)",
              border: "2px solid #D4A843",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
            }}
          >
            <CheckCircle size={40} color="#D4A843" />
          </div>
          <p className="section-label" style={{ marginBottom: "12px" }}>
            Booking confirmed
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "42px",
              fontWeight: 900,
              color: "#F5EDD8",
              marginBottom: "8px",
            }}
          >
            See You Soon!
          </h2>
          <p
            style={{
              color: "#D4A843",
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "32px",
            }}
          >
            {confirmId}
          </p>

          <div
            style={{
              background: "#221C16",
              border: "1px solid #3D3028",
              borderRadius: "14px",
              padding: "24px",
              marginBottom: "32px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {[
                { label: "Name", value: form.name, icon: "👤" },
                { label: "Guests", value: `${form.guests} people`, icon: "👥" },
                { label: "Date", value: form.date, icon: "📅" },
                { label: "Time", value: form.time, icon: "⏰" },
              ].map((d) => (
                <div key={d.label}>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#8A7566",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {d.label}
                  </p>
                  <p style={{ fontWeight: 600, color: "#F5EDD8" }}>
                    {d.icon} {d.value}
                  </p>
                </div>
              ))}
            </div>
            {form.requests && (
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #3D3028",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#8A7566",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Special Requests
                </p>
                <p style={{ color: "#F5EDD8", fontSize: "14px" }}>
                  {form.requests}
                </p>
              </div>
            )}
          </div>

          <p
            style={{
              color: "#8A7566",
              marginBottom: "32px",
              lineHeight: "1.6",
            }}
          >
            We&apos;ll send a confirmation to {form.phone}. If you need to
            modify or cancel, call us at{" "}
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              style={{ color: "#E8541A", textDecoration: "none" }}
            >
              {RESTAURANT_INFO.phone}
            </a>
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                setStatus("idle");
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  date: "",
                  time: "",
                  guests: "2",
                  requests: "",
                });
              }}
              className="btn-ember"
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
              }}
            >
              New Reservation
            </button>
            <button
              onClick={() => {
                if (!guardWhatsAppAccess()) return;
                window.open(
                  `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/\+/g, "")}`,
                  "_blank",
                );
              }}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                background: "#25D366",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <MessageCircle size={16} /> Message Us
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-shell"
      style={{ paddingTop: "64px", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        className="section-shell"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "340px",
            filter: "brightness(0.25)",
            position: "absolute",
            inset: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "80px 24px 60px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <p className="section-label" style={{ marginBottom: "14px" }}>
            Reserve your place
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 900,
              color: "#F5EDD8",
              marginBottom: "12px",
            }}
          >
            Book a Table
          </h1>
          <p style={{ color: "#8A7566", fontSize: "16px", maxWidth: "480px" }}>
            A memorable dining experience awaits. Reserve your table and let us
            take care of the rest.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div
        className="section-shell"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "40px",
        }}
      >
        {/* Form */}
        <div className="page-enter">
          <div
            style={{
              background: "#221C16",
              border: "1px solid #3D3028",
              borderRadius: "16px",
              padding: "36px",
            }}
          >
            <h2
              className="font-display"
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#F5EDD8",
                marginBottom: "28px",
              }}
            >
              Reservation Details
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Name + Phone */}
              <div
                className="mobile-grid-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#8A7566",
                      display: "block",
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Full Name *
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="input-field"
                      name="name"
                      value={form.name}
                      onChange={handleInput}
                      placeholder="Amaka Okonkwo"
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#8A7566",
                      display: "block",
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Phone Number *
                  </label>
                  <input
                    className="input-field"
                    name="phone"
                    value={form.phone}
                    onChange={handleInput}
                    placeholder="+234 801 234 5678"
                    type="tel"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    color: "#8A7566",
                    display: "block",
                    marginBottom: "8px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Email Address (optional)
                </label>
                <input
                  className="input-field"
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                  placeholder="amaka@example.com"
                  type="email"
                />
              </div>

              {/* Date + Time + Guests */}
              <div
                className="mobile-grid-1"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#8A7566",
                      display: "block",
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Date *
                  </label>
                  <input
                    className="input-field"
                    name="date"
                    value={form.date}
                    onChange={handleInput}
                    type="date"
                    min={minDateStr}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#8A7566",
                      display: "block",
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Time *
                  </label>
                  <select
                    className="input-field"
                    name="time"
                    value={form.time}
                    onChange={handleInput}
                  >
                    <option value="">Select time</option>
                    {TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#8A7566",
                      display: "block",
                      marginBottom: "8px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Guests *
                  </label>
                  <select
                    className="input-field"
                    name="guests"
                    value={form.guests}
                    onChange={handleInput}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                    <option value="13+">13+ (contact us)</option>
                  </select>
                </div>
              </div>

              {/* Special requests */}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    color: "#8A7566",
                    display: "block",
                    marginBottom: "8px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Special Requests
                </label>
                <textarea
                  className="input-field"
                  name="requests"
                  value={form.requests}
                  onChange={handleInput}
                  placeholder="Birthday celebration, dietary restrictions, seating preference, high chair needed..."
                  style={{ minHeight: "100px", resize: "vertical" }}
                />
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "28px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleSubmit}
                className="btn-ember"
                style={{
                  padding: "15px 32px",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Calendar size={18} /> Confirm Reservation
              </button>
              <button
                onClick={handleWhatsApp}
                style={{
                  padding: "15px 24px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "opacity 0.2s",
                }}
              >
                <MessageCircle size={16} /> Book via WhatsApp
              </button>
            </div>
            <p
              style={{ fontSize: "12px", color: "#8A7566", marginTop: "16px" }}
            >
              By booking, you agree to our cancellation policy. Please cancel at
              least 2 hours before your reservation.
            </p>
          </div>
        </div>

        {/* Sidebar info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Restaurant info */}
          <div
            style={{
              background: "#221C16",
              border: "1px solid #3D3028",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <h3
              className="font-display"
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#F5EDD8",
                marginBottom: "20px",
              }}
            >
              Good to Know
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {[
                {
                  icon: <Clock size={18} color="#E8541A" />,
                  title: "Opening Hours",
                  lines: [
                    `Mon–Fri: ${RESTAURANT_INFO.hours.weekday}`,
                    `Sat–Sun: ${RESTAURANT_INFO.hours.weekend}`,
                  ],
                },
                {
                  icon: <Users size={18} color="#E8541A" />,
                  title: "Party Size",
                  lines: [
                    "For 13+ guests, please call us directly to arrange.",
                  ],
                },
                {
                  icon: <Phone size={18} color="#E8541A" />,
                  title: "Phone",
                  lines: [RESTAURANT_INFO.phone],
                },
                {
                  icon: <Mail size={18} color="#E8541A" />,
                  title: "Email",
                  lines: [RESTAURANT_INFO.email],
                },
              ].map((info) => (
                <div
                  key={info.title}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flexShrink: 0, marginTop: "2px" }}>
                    {info.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "#F5EDD8",
                        marginBottom: "2px",
                      }}
                    >
                      {info.title}
                    </p>
                    {info.lines.map((l) => (
                      <p key={l} style={{ fontSize: "12px", color: "#8A7566" }}>
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy */}
          <div
            style={{
              background: "rgba(232,84,26,0.06)",
              border: "1px solid rgba(232,84,26,0.2)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div
              style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
            >
              <FileText
                size={18}
                color="#E8541A"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "#F5EDD8",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Reservation Policy
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {[
                    "Tables held for 15 mins after booking time",
                    "Free cancellation up to 2 hours before",
                    "Large groups may require a deposit",
                    "Dress code: Smart casual",
                  ].map((p) => (
                    <li
                      key={p}
                      style={{
                        fontSize: "12px",
                        color: "#8A7566",
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <span style={{ color: "#E8541A", flexShrink: 0 }}>•</span>{" "}
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
