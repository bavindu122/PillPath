import React, { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";

import DesktopNav from "./components/DesktopNav";
import ProfileDropdown from "./components/ProfileDropdown";
import MobileFloatingNav from "./components/MobileFloatingNav";
import NavbarBell from "../Notifications/NavbarBell";
import { useAuth } from "../../hooks/useAuth";
import ProfileImage from "../common/ProfileImage";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  // Google Translate refs/state
  const gtInitializedRef = useRef(false);
  const gtContainerRef = useRef(null);
  const [gtReady, setGtReady] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeLang, setActiveLang] = useState("en");

  const { logout, isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Determine where to show Google Translate: only customer/public routes (incl. Home)
  const shouldShowTranslate = (() => {
    const p = location.pathname || "/";
    // Hide on admin and staff areas. Adjust prefixes if your routes differ.
    if (
      p.startsWith("/admin") ||
      p.startsWith("/pharmacy-admin") ||
      p.startsWith("/pharmacist")
    ) {
      return false;
    }
    return true; // Show on home and all customer-facing pages
  })();

  // Initialize Google Translate element when script is ready and on allowed pages
  useEffect(() => {
    if (!shouldShowTranslate) {
      // If navigating to a restricted area, mark uninitialized for future allowed pages
      gtInitializedRef.current = false;
      // Try to cleanup any previous widget instance
      if (gtContainerRef.current) {
        try {
          gtContainerRef.current.innerHTML = "";
        } catch {}
      }
      return;
    }

    let pollId;
    const initIfPossible = () => {
      // Guard against SSR and missing script
      if (
        typeof window === "undefined" ||
        !window.googleTranslateReady ||
        !(window.google && window.google.translate)
      ) {
        return false;
      }

      if (gtInitializedRef.current) return true;

      // Ensure container exists
      const mount =
        gtContainerRef.current ||
        document.getElementById("google_translate_element");
      if (!mount) return false;

      try {
        // Create the translate element with only English and Sinhala
        /* global google */
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,si",
            autoDisplay: false,
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          mount
        );
        gtInitializedRef.current = true;
        // Wait until the select is injected and mark ready
        const waitForCombo = () => {
          const sel = document.querySelector(
            "#google_translate_element select.goog-te-combo"
          );
          if (sel) {
            setGtReady(true);
            return true;
          }
          return false;
        };
        if (!waitForCombo()) {
          const comboPoll = setInterval(() => {
            if (waitForCombo()) clearInterval(comboPoll);
          }, 200);
        }
        return true;
      } catch (e) {
        return false;
      }
    };

    // Try immediately, then poll briefly until script is ready
    if (!initIfPossible()) {
      pollId = window.setInterval(() => {
        if (initIfPossible()) {
          window.clearInterval(pollId);
        }
      }, 300);
    }

    return () => {
      if (pollId) window.clearInterval(pollId);
    };
  }, [shouldShowTranslate, location.pathname]);

  // Keep active language in sync with the googtrans cookie when navigating
  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]+)/);
      const val = match ? decodeURIComponent(match[1]) : "";
      if (val.endsWith("/si")) setActiveLang("si");
      else setActiveLang("en");
    } catch {}
  }, [location.pathname]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  // Helper to change Google Translate language with retries
  const setGoogleLanguage = (lang, attempts = 0) => {
    const MAX_ATTEMPTS = 10;
    const from = "en";
    const cookieVal = `/${from}/${lang}`;

    // Set googtrans cookie so Google applies translation globally
    try {
      if (lang === "en") {
        // Clear cookie or set reset value to revert to original English
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        const host = window.location.hostname;
        if (host && host !== "localhost") {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${host}; path=/;`;
        }
        document.cookie = `googtrans=/en/en; path=/;`;
        if (host && host !== "localhost") {
          document.cookie = `googtrans=/en/en; domain=.${host}; path=/;`;
        }
      } else {
        document.cookie = `googtrans=${cookieVal}; path=/;`;
        const host = window.location.hostname;
        if (host && host !== "localhost") {
          document.cookie = `googtrans=${cookieVal}; domain=.${host}; path=/;`;
        }
      }
    } catch {}

    const select = document.querySelector(
      "#google_translate_element select.goog-te-combo"
    );
    if (select) {
      try {
        select.value = lang;
        // Dispatch change event (modern + legacy)
        try {
          const evt = new Event("change", { bubbles: true });
          select.dispatchEvent(evt);
        } catch {
          const evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", true, true);
          select.dispatchEvent(evt);
        }
      } catch {}
      return;
    }

    // Widget not ready yet: retry a few times then fallback to reload
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(() => setGoogleLanguage(lang, attempts + 1), 200);
    } else {
      // Last resort: reload to let Google script apply cookie on boot
      setTimeout(() => {
        try {
          window.location.reload();
        } catch {}
      }, 150);
    }
  };

  // Wait for translation to apply (heuristic): checks cookie/select/html classes with timeout fallback
  const waitForTranslation = (lang, timeoutMs = 4000) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        let cookieOk = false;
        try {
          const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]+)/);
          const val = match ? decodeURIComponent(match[1]) : "";
          if (lang === "en") {
            cookieOk =
              val === "/en/en" || val === "" || typeof val !== "string";
          } else {
            cookieOk = val.endsWith(`/${lang}`);
          }
        } catch {}

        const html = document.documentElement;
        const hasTranslatedClass = Array.from(html.classList || []).some((c) =>
          c.startsWith("translated")
        );
        const select = document.querySelector(
          "#google_translate_element select.goog-te-combo"
        );
        const selectOk = select ? select.value === lang : false;

        const done =
          lang === "en"
            ? cookieOk && (!hasTranslatedClass || selectOk)
            : cookieOk && (hasTranslatedClass || selectOk);

        if (done || Date.now() - start > timeoutMs) {
          // small debounce for smoother UX
          setTimeout(resolve, 200);
        } else {
          setTimeout(check, 150);
        }
      };
      setTimeout(check, 200);
    });
  };

  const handleLanguageClick = async (lang) => {
    if (isTranslating || !shouldShowTranslate) return;
    setIsTranslating(true);
    setGoogleLanguage(lang);
    await waitForTranslation(lang);
    setActiveLang(lang);
    setIsTranslating(false);
  };

  return (
    <>
      <div className="h-[72px] md:h-[60px]"></div>

      {/* Top Navigation Bar */}
      <div
        className={`fixed top-0 left-0 right-0 flex items-center justify-between text-sm py-2 z-40 transition-all duration-300 ${
          scrolled ? "navbar-bg-scrolled" : "navbar-bg-default"
        }`}
      >
        {/* Logo */}
        <img
          className="w-32 sm:w-36 md:w-44 cursor-pointer ml-4 md:ml-6"
          src={assets.logo1}
          alt="logo"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Google Translate (visible on all breakpoints when allowed) */}
        {shouldShowTranslate && (
          <div className="flex items-center gap-2 mr-3">
            {/* Glass-themed futuristic language toggle */}
            <div
              className={`relative flex items-center rounded-full border border-white/10 bg-zinc-900/80 text-white backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)] overflow-hidden transition ${
                isTranslating ? "opacity-80" : ""
              }`}
              aria-busy={isTranslating}
            >
              <button
                type="button"
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed border-r border-white/10 ${
                  activeLang === "en"
                    ? "text-white bg-zinc-800/80 ring-1 ring-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                    : "text-zinc-200 hover:text-white hover:bg-zinc-800/50"
                }`}
                onClick={() => handleLanguageClick("en")}
                title="Switch to English"
                aria-pressed={activeLang === "en"}
                disabled={isTranslating}
              >
                <span className="notranslate" translate="no">
                  EN
                </span>
              </button>
              <button
                type="button"
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-200 focus:outline-none disabled:cursor-not-allowed ${
                  activeLang === "si"
                    ? "text-white bg-zinc-800/80 ring-1 ring-cyan-400/60 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                    : "text-zinc-200 hover:text-white hover:bg-zinc-800/50"
                }`}
                onClick={() => handleLanguageClick("si")}
                title="සිංහල"
                aria-pressed={activeLang === "si"}
                disabled={isTranslating}
              >
                සිං
              </button>

              {/* Subtle glow line */}
              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/5" />
            </div>

            {/* Inline spinner while translating */}
            {isTranslating && (
              <div className="ml-1 text-cyan-400" title="Translating…">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    d="M22 12a10 10 0 00-10-10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            {/* Keep Google widget mounted but hidden to avoid visible badge */}
            <div className="gt-inline-container gt-hidden" aria-hidden="true">
              <div id="google_translate_element" ref={gtContainerRef} />
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center gap-4 mr-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-5">
              {/* User greeting */}
              <div className="hidden lg:block text-right">
                <p className="text-sm navbar-text-welcome font-medium">
                  Welcome back,
                </p>
                <p className="text-sm navbar-text-username font-semibold truncate max-w-[140px]">
                  {user?.fullName || user?.firstName || "User"}
                </p>
              </div>

              {/* Notification bell */}
              <NavbarBell position="left" />

              {/* Profile section */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center gap-2 cursor-pointer group p-1 rounded-full navbar-hover-bg transition-all duration-200">
                  <ProfileImage
                    src={user?.profilePictureUrl}
                    alt="profile"
                    className="navbar-avatar rounded-full shadow-sm"
                    onClick={toggleDropdown}
                  />
                  <svg
                    className="w-4 h-4 navbar-text-muted group-hover:navbar-blue-text transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <ProfileDropdown show={showDropdown} setToken={setToken} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Sign in button */}
              <button
                onClick={() => navigate("/login")}
                className="group relative px-6 py-2.5 lg:px-8 lg:py-3 navbar-btn-outline rounded-full font-medium whitespace-nowrap overflow-hidden"
              >
                <span className="relative z-10 font-semibold">Sign in</span>
                <div className="absolute inset-0 navbar-gradient-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              {/* Create account button */}
              <button
                onClick={() => navigate("/register")}
                className="group relative px-6 py-2.5 lg:px-8 lg:py-3 navbar-btn-filled rounded-full font-semibold whitespace-nowrap overflow-hidden"
              >
                <span className="relative z-10">Create account</span>
                <div className="absolute inset-0 navbar-gradient-blue-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 navbar-gradient-shine -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Header Actions */}
        <div className="md:hidden flex items-center gap-4 mr-4">
          {isAuthenticated ? (
            <ProfileImage
              src={user?.profilePictureUrl}
              alt="profile"
              className="navbar-avatar-mobile rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="navbar-btn-outline px-4 py-2 rounded-full font-light whitespace-nowrap text-sm"
            >
              Sign in
            </button>
          )}
          <Menu
            className="w-6 h-6 cursor-pointer navbar-text-primary"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 navbar-bg-mobile-menu rounded-b-2xl z-50 p-4 border-t border-gray-100">
            <div className="flex flex-col gap-3 font-medium navbar-text-primary">
              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 text-left flex items-center gap-3"
              >
                <LogOut size={18} />
                Logout
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setShowMobileMenu(false);
                }}
                className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 text-left"
              >
                Settings
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileFloatingNav />
    </>
  );
};

export default Navbar;
