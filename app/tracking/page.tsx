"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle,
  Clock,
  Truck,
  ChefHat,
  Package,
  ThumbsUp,
  MessageCircle,
  Phone,
} from "lucide-react";
import { RESTAURANT_INFO } from "@/lib/data";
import { useAuthStore } from "@/store/authStore";
import { hasAccounts } from "@/lib/demoAuth";
import toast from "react-hot-toast";

const ORDERS: Record<
  string,
  { status: number; items: string; type: string; eta: string }
> = {
  "EA-DEMO1": {
    status: 2,
    items: "Ember Jollof Rice × 2, Fried Plantain × 1",
    type: "Delivery",
    eta: "~20 mins",
  },
  "EA-DEMO2": {
    status: 4,
    items: "T-Bone Steak × 1, Chapman × 2",
    type: "Delivery",
    eta: "~5 mins",
  },
  "EA-DEMO3": {
    status: 3,
    items: "Suya Skewers × 3, Zobo Royale × 2",
    type: "Pickup",
    eta: "Ready!",
  },
};

const STEPS = [
  {
    id: "placed",
    icon: <ThumbsUp size={20} />,
    label: "Order Placed",
    desc: "We received your order",
  },
  {
    id: "confirmed",
    icon: <CheckCircle size={20} />,
    label: "Confirmed",
    desc: "Kitchen accepted your order",
  },
  {
    id: "preparing",
    icon: <ChefHat size={20} />,
    label: "Preparing",
    desc: "Chef is crafting your meal",
  },
  {
    id: "ready",
    icon: <Package size={20} />,
    label: "Ready",
    desc: "Your order is packed & ready",
  },
  {
    id: "delivery",
    icon: <Truck size={20} />,
    label: "Out for Delivery",
    desc: "Rider is on the way to you",
  },
  {
    id: "delivered",
    icon: <ThumbsUp size={20} />,
    label: "Delivered",
    desc: "Enjoy your meal! 🔥",
  },
];

export default function TrackingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState<(typeof ORDERS)[string] | null>(
    null,
  );

  // Auto-progress demo
  useEffect(() => {
    if (!orderData) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [orderData]);

  const handleSearch = () => {
    const id = orderId.trim().toUpperCase();
    if (!id) {
      toast.error("Enter an order ID");
      return;
    }

    // Check orders
    const demo = ORDERS[id];
    if (demo) {
      setOrderData(demo);
      setCurrentStep(demo.status);
      setSearched(true);
      return;
    }

    // Accept any EA- format as a new order
    if (id.startsWith("EA-") || id.startsWith("RES-")) {
      setOrderData({
        status: 0,
        items: "Your order items",
        type: "Delivery",
        eta: "~35 mins",
      });
      setCurrentStep(0);
      setSearched(true);
      return;
    }

    toast.error("Order not found. Try EA-001 to see a live tracking example.");
  };

  const progress = Math.round((currentStep / (STEPS.length - 1)) * 100);

  const openWhatsApp = (message?: string) => {
    if (!isAuthenticated) {
      const hasAccount = hasAccounts();
      toast.error(
        hasAccount
          ? "Please log in with your email and password first"
          : "Please sign up first before using WhatsApp",
      );
      router.push("/auth?next=/tracking");
      return;
    }
    const encoded = message ? `?text=${encodeURIComponent(message)}` : "";
    window.open(
      `https://wa.me/${RESTAURANT_INFO.whatsapp.replace(/\+/g, "")}${encoded}`,
      "_blank",
    );
  };

  return (
    <div
      className="page-shell"
      style={{ paddingTop: "64px", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        className="section-shell"
        style={{
          background: "#221C16",
          borderBottom: "1px solid #3D3028",
          padding: "48px 24px 40px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>
            Real-time updates
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              color: "#F5EDD8",
              marginBottom: "12px",
            }}
          >
            Track Your Order (Demo)
          </h1>
          <p style={{ color: "#8A7566", marginBottom: "32px" }}>
            Enter your order ID below. Try{" "}
            <span
              style={{ color: "#E8541A", cursor: "pointer", fontWeight: 600 }}
              onClick={() => {
                setOrderId("EA-DEMO1");
              }}
            >
              EA-DEMO1
            </span>{" "}
            or{" "}
            <span
              style={{ color: "#E8541A", cursor: "pointer", fontWeight: 600 }}
              onClick={() => setOrderId("EA-DEMO2")}
            >
              EA-DEMO2
            </span>{" "}
            for a live demo.
          </p>
          <div style={{ display: "flex", gap: "12px", maxWidth: "560px" }}>
            <input
              className="input-field"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. EA-DEMO1 or your order ID"
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSearch}
              className="btn-ember"
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
            >
              <Search size={16} /> Track
            </button>
          </div>
        </div>
      </div>

      <div
        className="section-shell"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}
      >
        {!searched ? (
          /* Empty state */
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>📦</div>
            <h2
              className="font-display"
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#F5EDD8",
                marginBottom: "12px",
              }}
            >
              Where&apos;s my order?
            </h2>
            <p
              style={{
                color: "#8A7566",
                marginBottom: "32px",
                lineHeight: "1.6",
              }}
            >
              You&apos;ll find your order ID in the confirmation SMS we sent
              you, or in your checkout confirmation screen.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                style={{ textDecoration: "none" }}
              >
                <button
                  className="btn-ghost"
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Phone size={16} /> Call Us
                </button>
              </a>
              <button
                onClick={() =>
                  openWhatsApp("Hi! I'd like to check on my order status.")
                }
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
                <MessageCircle size={16} /> WhatsApp Us
              </button>
            </div>
          </div>
        ) : (
          <div className="page-enter">
            {/* Order card */}
            <div
              style={{
                background: "#221C16",
                border: "1px solid #3D3028",
                borderRadius: "16px",
                padding: "28px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#8A7566",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Order ID
                  </p>
                  <p
                    className="font-display"
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#D4A843",
                    }}
                  >
                    {orderId.toUpperCase()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    className="badge"
                    style={{
                      background:
                        currentStep === STEPS.length - 1
                          ? "rgba(37,211,102,0.15)"
                          : "rgba(232,84,26,0.15)",
                      color:
                        currentStep === STEPS.length - 1
                          ? "#25D366"
                          : "#E8541A",
                      border: `1px solid ${currentStep === STEPS.length - 1 ? "rgba(37,211,102,0.3)" : "rgba(232,84,26,0.3)"}`,
                    }}
                  >
                    <span
                      className={
                        currentStep < STEPS.length - 1 ? "pulse-ember" : ""
                      }
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "currentColor",
                        display: "inline-block",
                        marginRight: "6px",
                      }}
                    />
                    {STEPS[currentStep].label}
                  </span>
                  {orderData && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#8A7566",
                        marginTop: "6px",
                      }}
                    >
                      <Clock
                        size={12}
                        style={{ display: "inline", marginRight: "4px" }}
                      />
                      ETA:{" "}
                      {currentStep === STEPS.length - 1
                        ? "Delivered ✓"
                        : orderData.eta}
                    </p>
                  )}
                </div>
              </div>

              {orderData && (
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#8A7566",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      Items
                    </p>
                    <p style={{ fontSize: "13px", color: "#F5EDD8" }}>
                      {orderData.items}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#8A7566",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      Type
                    </p>
                    <p style={{ fontSize: "13px", color: "#F5EDD8" }}>
                      {orderData.type}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress bar */}
              <div style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#8A7566" }}>
                    Progress
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#E8541A",
                      fontWeight: 600,
                    }}
                  >
                    {progress}%
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "#3D3028",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "3px",
                      background: "linear-gradient(90deg, #E8541A, #FF7040)",
                      width: `${progress}%`,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "0" }}
              >
                {STEPS.map((step, index) => {
                  const isDone = index < currentStep;
                  const isActive = index === currentStep;
                  const isPending = index > currentStep;
                  return (
                    <div
                      key={step.id}
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Icon & line */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isDone
                              ? "#E8541A"
                              : isActive
                                ? "rgba(232,84,26,0.15)"
                                : "#3D3028",
                            border: isActive ? "2px solid #E8541A" : "none",
                            color: isDone
                              ? "white"
                              : isActive
                                ? "#E8541A"
                                : "#8A7566",
                            transition: "all 0.5s ease",
                            boxShadow: isActive
                              ? "0 0 20px rgba(232,84,26,0.3)"
                              : "none",
                          }}
                        >
                          {isDone ? <CheckCircle size={18} /> : step.icon}
                        </div>
                        {index < STEPS.length - 1 && (
                          <div
                            style={{
                              width: "2px",
                              height: "32px",
                              marginTop: "4px",
                              background: isDone ? "#E8541A" : "#3D3028",
                              transition: "background 0.5s ease",
                            }}
                          />
                        )}
                      </div>
                      {/* Text */}
                      <div
                        style={{
                          paddingBottom:
                            index < STEPS.length - 1 ? "16px" : "0",
                          paddingTop: "8px",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: isActive ? 700 : 500,
                            fontSize: "15px",
                            color: isPending
                              ? "#3D3028"
                              : isActive
                                ? "#F5EDD8"
                                : "#F5EDD8",
                            marginBottom: "2px",
                            transition: "color 0.5s ease",
                          }}
                        >
                          {step.label}
                          {isActive && (
                            <span
                              className="pulse-ember"
                              style={{
                                display: "inline-block",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#E8541A",
                                marginLeft: "8px",
                                verticalAlign: "middle",
                              }}
                            />
                          )}
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: isPending ? "#3D3028" : "#8A7566",
                            transition: "color 0.5s ease",
                          }}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <div
              style={{
                background: "#221C16",
                border: "1px solid #3D3028",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "#F5EDD8",
                    marginBottom: "4px",
                  }}
                >
                  Need help with your order?
                </p>
                <p style={{ fontSize: "13px", color: "#8A7566" }}>
                  Our team is available during restaurant hours
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className="btn-ghost"
                    style={{
                      padding: "10px 18px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Phone size={14} /> Call
                  </button>
                </a>
                <button
                  onClick={() => openWhatsApp()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    background: "#25D366",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
