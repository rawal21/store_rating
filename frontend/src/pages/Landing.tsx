import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { toggleTheme } from "@/store/theme.slice";
import StoreIcon from "@/assets/svgs/StoreIcon";

// ── Feature card data ─────────────────────────────────────────────────────────
const features = [
  {
    icon: "⭐",
    title: "Rate Stores",
    desc: "Submit honest ratings from 1 to 5 for any store on the platform.",
  },
  {
    icon: "🔍",
    title: "Discover Stores",
    desc: "Search and filter stores by name, address or rating to find the best ones.",
  },
  {
    icon: "📊",
    title: "Owner Insights",
    desc: "Store owners get a live dashboard showing ratings and customer feedback.",
  },
  {
    icon: "🛡️",
    title: "Role-Based Access",
    desc: "Admins, normal users and store owners each get a tailored experience.",
  },
];

// ── Stat items ────────────────────────────────────────────────────────────────
const stats = [
  { value: "3", label: "User Roles" },
  { value: "1–5", label: "Rating Scale" },
  { value: "100%", label: "Secure JWT Auth" },
  { value: "∞", label: "Stores Supported" },
];

const Landing = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.theme.theme);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary-600 rounded-lg text-white">
              <StoreIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Store Rating</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </button>

            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span>⭐</span> Discover and rate the best stores
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          Find stores you{" "}
          <span className="text-primary-600 dark:text-primary-400">love</span>
          <br />and share your experience
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Store Rating lets customers discover great stores, submit honest ratings,
          and help store owners grow — all in one simple platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-base shadow-lg shadow-primary-200 dark:shadow-primary-900/40"
          >
            Create free account
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-xl transition-colors text-base"
          >
            Sign in →
          </Link>
        </div>

        {/* Star preview */}
        <div className="flex items-center justify-center gap-1 mt-8">
          {[1,2,3,4,5].map((s) => (
            <svg key={s} className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.5 9l6.6-.9z"/>
            </svg>
          ))}
          <span className="ml-2 text-sm text-gray-400">Rate stores from 1 to 5</span>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-primary-600 dark:bg-primary-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-primary-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Everything you need
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A complete platform built for customers, store owners, and administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md dark:hover:shadow-gray-900 transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role cards ── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Built for every role
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              One platform, three tailored experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: "Normal User",
                color: "bg-blue-500",
                items: [
                  "Browse all registered stores",
                  "Search by name and address",
                  "Submit ratings from 1 to 5",
                  "Edit your submitted rating",
                  "Update your password",
                ],
              },
              {
                role: "Store Owner",
                color: "bg-green-500",
                items: [
                  "View your store dashboard",
                  "See your average rating",
                  "See who rated your store",
                  "Update your password",
                ],
              },
              {
                role: "System Administrator",
                color: "bg-purple-500",
                items: [
                  "Dashboard with platform stats",
                  "Create users of any role",
                  "Create and manage stores",
                  "Assign store owners",
                  "Filter and sort all listings",
                ],
              },
            ].map((card) => (
              <div
                key={card.role}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden"
              >
                <div className={`${card.color} px-6 py-4`}>
                  <h3 className="font-bold text-white text-lg">{card.role}</h3>
                </div>
                <ul className="px-6 py-5 space-y-2.5">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
          Create a free account in seconds. No credit card required.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors text-base shadow-lg shadow-primary-200 dark:shadow-primary-900/40"
        >
          Create your account →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary-600 rounded text-white">
              <StoreIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Store Rating</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Store Rating. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="text-xs text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
