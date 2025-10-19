import PageHeader from "../components/PageHeader";

import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Settings,
  Lock,
  List,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  Home,
  LogOut,
} from "lucide-react";
import AdminWalletService from "../../../services/api/AdminWalletService";
import AdminService from "../../../services/api/AdminService";

// Dummy Data for Admin Settings
const dummySettingsData = {
  moderators: [
    { id: "mod_001", username: "moderator1", lastLogin: "2024-07-15 10:30 AM" },
    {
      id: "mod_002",
      username: "content_mod",
      lastLogin: "2024-07-18 02:00 PM",
    },
    {
      id: "mod_003",
      username: "support_mod",
      lastLogin: "2024-07-17 09:15 AM",
    },
  ],
  generalSettings: {
    siteName: "PillPath",
    contactEmail: "support@pillpath.com",
    notificationsEnabled: true,
  },
  commissionSettings: [
    { id: "tier_001", minAmount: 0, maxAmount: 10000, rate: 0.1 }, // 10% for <= 10000
    { id: "tier_002", minAmount: 10000.01, maxAmount: Infinity, rate: 0.07 }, // 7% for > 10000
  ],
  auditLog: [
    {
      id: "log_001",
      action: "Added moderator: moderator1",
      timestamp: "2024-07-15 10:35 AM",
      admin: "SuperAdmin",
    },
    {
      id: "log_002",
      action: "Updated site name to PillPath",
      timestamp: "2024-07-14 09:00 AM",
      admin: "SuperAdmin",
    },
    {
      id: "log_003",
      action: "Changed password for moderator1",
      timestamp: "2024-07-15 10:40 AM",
      admin: "SuperAdmin",
    },
  ],
};

const Setting = () => {
  const [moderators, setModerators] = useState([]);
  const [modsLoading, setModsLoading] = useState(false);
  const [modsError, setModsError] = useState("");
  const [newModeratorUsername, setNewModeratorUsername] = useState("");
  const [newModeratorPassword, setNewModeratorPassword] = useState("");
  const [addingModerator, setAddingModerator] = useState(false);
  const [addModMsg, setAddModMsg] = useState("");
  // Admin profile (to detect moderator vs admin)
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminProfileLoading, setAdminProfileLoading] = useState(true);
  const [generalSettings, setGeneralSettings] = useState(
    dummySettingsData.generalSettings
  );
  // Global commission/fees (no defaults; will be loaded from DB)
  const [walletSettings, setWalletSettings] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [walletSuccess, setWalletSuccess] = useState("");
  // Pharmacy override
  const [pharmacyIdInput, setPharmacyIdInput] = useState("");
  const [pharmacyCommission, setPharmacyCommission] = useState(null);
  const [pharmacyLoading, setPharmacyLoading] = useState(false);
  const [pharmacyMsg, setPharmacyMsg] = useState("");
  const [auditLog, setAuditLog] = useState(dummySettingsData.auditLog);

  const [passwordChangeOld, setPasswordChangeOld] = useState("");
  const [passwordChangeNew, setPasswordChangeNew] = useState("");
  const [passwordChangeConfirm, setPasswordChangeConfirm] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  // Load admin profile to determine privileges
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setAdminProfileLoading(true);
        const profile = await AdminService.getAdminProfile();
        if (!mounted) return;
        setAdminProfile(profile || null);
      } catch (e) {
        if (!mounted) return;
        setAdminProfile(null);
      } finally {
        if (mounted) setAdminProfileLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Permission: only full admins can manage moderators
  const canManageModerators = (() => {
    const lvl = String(adminProfile?.adminLevel || "").toUpperCase();
    // Treat SUPER as full admin; STANDARD behaves like moderator for this feature
    return lvl === "SUPER";
  })();

  // Helper: format date-time to YYYY-MM-DD HH:mm:ss
  const formatDateTime = (value) => {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    } catch {
      return String(value);
    }
  };

  // Helper: display moderator ID as MOD_<first-digits>
  const formatModeratorId = (value) => {
    if (!value) return "MOD_";
    const str = String(value);
    const match = str.match(/\d+/);
    const digits = match ? match[0] : str.replace(/\D/g, "").slice(0, 6);
    return `MOD_${digits || str.slice(0, 6)}`;
  };

  // Load moderators from backend when admin can manage
  useEffect(() => {
    let mounted = true;
    const fetchMods = async () => {
      if (!canManageModerators) return; // don't fetch for STANDARD
      setModsError("");
      setModsLoading(true);
      try {
        const list = await AdminService.getModerators();
        if (!mounted) return;
        const normalized = Array.isArray(list)
          ? list.map((m) => ({
              id: m.id || m._id || `mod_${Math.random().toString(36).slice(2)}`,
              username: m.username || m.name || "",
              registrationDate: formatDateTime(
                m.createdAt || m.registrationDate || m.registeredAt
              ),
            }))
          : [];
        setModerators(normalized);
      } catch (e) {
        if (!mounted) return;
        setModsError(e?.message || "Failed to load moderators");
      } finally {
        if (mounted) setModsLoading(false);
      }
    };
    fetchMods();
    return () => {
      mounted = false;
    };
  }, [canManageModerators]);

  const handleAddModerator = async (e) => {
    e.preventDefault();
    if (!canManageModerators) {
      setAddModMsg("You don't have permission to add moderators.");
      return;
    }
    setAddModMsg("");
    if (newModeratorUsername.trim() === "") {
      setAddModMsg("Username is required");
      return;
    }
    // password is optional; backend can generate if omitted
    try {
      setAddingModerator(true);
      const payload = {
        username: newModeratorUsername.trim(),
        // if empty, omit password field so backend generates one
        ...(newModeratorPassword.trim()
          ? { password: newModeratorPassword.trim() }
          : {}),
      };
      const created = await AdminService.addModerator(payload);
      // Best-effort normalization
      const newMod = {
        id: created?.id || `mod_${Date.now()}`,
        username: created?.username || newModeratorUsername.trim(),
        registrationDate: formatDateTime(
          created?.createdAt || created?.registrationDate || new Date()
        ),
      };
      setModerators((prev) => [newMod, ...prev]);
      setNewModeratorUsername("");
      setNewModeratorPassword("");
      setAddModMsg(
        created?.temporaryPassword
          ? `Moderator added. Temporary password: ${created.temporaryPassword}`
          : "Moderator added successfully."
      );
    } catch (err) {
      setAddModMsg(err?.message || "Failed to add moderator");
    } finally {
      setAddingModerator(false);
    }
  };

  const handleDeleteModerator = async (id, username) => {
    if (!canManageModerators) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete moderator '${username}'?`
    );
    if (!confirmed) return;
    try {
      await AdminService.deleteModerator(id);
      setModerators((prev) => prev.filter((mod) => mod.id !== id));
      setAuditLog((prev) => [
        {
          id: `log_${Date.now()}`,
          action: `Deleted moderator: ${username}`,
          timestamp: new Date().toLocaleString(),
          admin: adminProfile?.username || "Admin",
        },
        ...prev,
      ]);
    } catch (e) {
      alert(e?.message || "Failed to delete moderator");
    }
  };

  const handleGeneralSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateGeneralSettings = () => {
    setAuditLog([
      {
        id: `log_${Date.now()}`,
        action: `Updated general settings`,
        timestamp: new Date().toLocaleString(),
        admin: "SuperAdmin",
      },
      ...auditLog,
    ]);
    // In a real application, replace alert with a custom modal/toast
    alert("General settings updated!");
  };

  // Load current global wallet settings on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setWalletLoading(true);
        const data = await AdminWalletService.getGlobalSettings();
        if (!mounted) return;
        setWalletSettings(data);
      } catch (e) {
        if (!mounted) return;
        setWalletError(e.message || "Failed to load wallet settings");
      } finally {
        if (mounted) setWalletLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveWalletSettings = async (e) => {
    e?.preventDefault?.();
    setWalletError("");
    setWalletSuccess("");
    try {
      setWalletLoading(true);
      if (!walletSettings) throw new Error("No settings loaded");
      const { currency, commissionPercent, convenienceFee, version } =
        walletSettings || {};
      if (
        !currency ||
        commissionPercent === undefined ||
        commissionPercent === null ||
        isNaN(Number(commissionPercent)) ||
        convenienceFee === undefined ||
        convenienceFee === null ||
        isNaN(Number(convenienceFee))
      ) {
        throw new Error("Please fill all fields before saving");
      }
      const payload = {
        currency,
        commissionPercent: Number(commissionPercent),
        convenienceFee: Number(convenienceFee),
        version: Number(version ?? 0),
      };
      const saved = await AdminWalletService.updateGlobalSettings(payload);
      setWalletSettings(saved);
      setWalletSuccess("Global commission settings updated");
    } catch (e) {
      setWalletError(e.message || "Failed to update settings");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleLoadPharmacyCommission = async () => {
    setPharmacyMsg("");
    setPharmacyCommission(null);
    const pid = pharmacyIdInput.trim();
    if (!pid) return setPharmacyMsg("Enter a pharmacy ID");
    try {
      setPharmacyLoading(true);
      const data = await AdminWalletService.getPharmacyCommission(pid);
      setPharmacyCommission(data || null);
      setPharmacyMsg(data ? "Loaded override" : "No override (uses global)");
    } catch (e) {
      setPharmacyMsg(e.message || "Failed to load commission");
    } finally {
      setPharmacyLoading(false);
    }
  };

  const handleSavePharmacyCommission = async () => {
    setPharmacyMsg("");
    const pid = pharmacyIdInput.trim();
    if (!pid) return setPharmacyMsg("Enter a pharmacy ID");
    try {
      setPharmacyLoading(true);
      if (
        !pharmacyCommission ||
        pharmacyCommission.commissionPercent === "" ||
        pharmacyCommission.commissionPercent === undefined ||
        pharmacyCommission.commissionPercent === null
      ) {
        throw new Error("Enter a commission percent");
      }
      const body = {
        commissionPercent: Number(pharmacyCommission?.commissionPercent),
        version: Number(pharmacyCommission?.version ?? 0),
      };
      if (isNaN(body.commissionPercent)) {
        throw new Error("Commission percent must be a number");
      }
      const saved = await AdminWalletService.updatePharmacyCommission(
        pid,
        body
      );
      setPharmacyCommission(saved);
      setPharmacyMsg("Pharmacy commission saved");
    } catch (e) {
      setPharmacyMsg(e.message || "Failed to save commission");
    } finally {
      setPharmacyLoading(false);
    }
  };

  const handleRemovePharmacyCommission = async () => {
    setPharmacyMsg("");
    const pid = pharmacyIdInput.trim();
    if (!pid) return setPharmacyMsg("Enter a pharmacy ID");
    try {
      setPharmacyLoading(true);
      await AdminWalletService.removePharmacyCommission(pid);
      setPharmacyCommission(null);
      setPharmacyMsg("Override removed (now uses global)");
    } catch (e) {
      setPharmacyMsg(e.message || "Failed to remove override");
    } finally {
      setPharmacyLoading(false);
    }
  };

  const handleChangeAdminPassword = (e) => {
    e.preventDefault();
    setPasswordChangeMessage("");

    if (
      passwordChangeOld === "" ||
      passwordChangeNew === "" ||
      passwordChangeConfirm === ""
    ) {
      setPasswordChangeMessage("All password fields are required.");
      return;
    }
    if (passwordChangeNew !== passwordChangeConfirm) {
      setPasswordChangeMessage(
        "New password and confirm password do not match."
      );
      return;
    }
    if (passwordChangeNew.length < 6) {
      // Example minimum length
      setPasswordChangeMessage(
        "New password must be at least 6 characters long."
      );
      return;
    }
    // In a real application, you would verify old password with backend
    // and then update the password securely.
    if (passwordChangeOld !== "adminpass") {
      // Dummy old password check
      setPasswordChangeMessage("Incorrect old password.");
      return;
    }

    // Simulate password change success
    setPasswordChangeMessage("Password changed successfully!");
    setAuditLog([
      {
        id: `log_${Date.now()}`,
        action: `Admin password changed`,
        timestamp: new Date().toLocaleString(),
        admin: "SuperAdmin",
      },
      ...auditLog,
    ]);
    setPasswordChangeOld("");
    setPasswordChangeNew("");
    setPasswordChangeConfirm("");
  };

  // Removed legacy demo commission tier handlers and state to avoid unused/undefined references.

  const handleLogout = () => {
    setIsLoggingOut(true);
    setLogoutMessage("Logging out...");
    setTimeout(() => {
      setLogoutMessage("Redirecting to home page...");
      // In a real application, you would perform actual logout (e.g., clear tokens)
      // and then redirect using window.location.href or a router.
      // For this isolated component, we'll just show the message.
      setTimeout(() => {
        // Simulate redirect by clearing content and showing final message
        setLogoutMessage(
          "You have been logged out. Redirecting to home page..."
        );
        window.location.href = "/";
      }, 1500); // Simulate redirect delay
    }, 1000); // Simulate logout process delay
  };

  // Helpers: display formats
  const formatCurrency = (amount, currency = "LKR") => {
    if (amount === undefined || amount === null || amount === "") return "-";
    try {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: currency || "LKR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(amount));
    } catch {
      return `${currency || "LKR"} ${Number(amount).toFixed(2)}`;
    }
  };

  const formatCommission = (value) => {
    if (value === undefined || value === null || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    // Display both raw and percentage for clarity
    const pct = (num * 100).toFixed(2);
    return `${num} (${pct}%)`;
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-inter">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">
            {logoutMessage}
          </h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="flex items-center justify-between mb-8">
        <PageHeader
          icon={Settings}
          title="Admin Settings"
          subtitle="Manage system configurations and user roles."
        />

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>

      {/* Add Moderator Section (Admins only) */}
      {canManageModerators && (
        <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-blue-600" /> Add New
            Moderator
          </h2>
          <form
            onSubmit={handleAddModerator}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label
                htmlFor="modUsername"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="modUsername"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newModeratorUsername}
                onChange={(e) => setNewModeratorUsername(e.target.value)}
                placeholder="Enter moderator username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="modPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="text" // Changed to 'text' for demonstration to show generated password
                id="modPassword"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newModeratorPassword}
                onChange={(e) => setNewModeratorPassword(e.target.value)}
                placeholder="Enter temporary password"
                required
              />
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              {addModMsg && (
                <div className="text-sm text-gray-700 bg-gray-100 rounded px-3 py-2">
                  {addModMsg}
                </div>
              )}
              <button
                type="submit"
                disabled={addingModerator}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center ${
                  addingModerator ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                {addingModerator ? "Adding..." : "Add Moderator"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Existing Moderators Section (Admins only) */}
      {canManageModerators && (
        <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
            <List className="w-6 h-6 mr-2 text-blue-600" /> Existing Moderators
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    mod_id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Registration Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modsLoading ? (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500" colSpan={4}>
                      Loading moderators…
                    </td>
                  </tr>
                ) : modsError ? (
                  <tr>
                    <td className="px-6 py-4 text-sm text-red-600" colSpan={4}>
                      {modsError}
                    </td>
                  </tr>
                ) : moderators.length === 0 ? (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500" colSpan={4}>
                      No moderators found.
                    </td>
                  </tr>
                ) : (
                  moderators.map((mod) => (
                    <tr key={mod.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatModeratorId(mod.id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mod.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mod.registrationDate || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleDeleteModerator(mod.id, mod.username)
                          }
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                        >
                          <Trash2 className="w-5 h-5 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Global Commission & Fees (DB-backed only; hidden until loaded) */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-indigo-600" /> Platform
          Commission & Fees
        </h2>
        {walletError && (
          <div className="mb-3 p-2 rounded bg-red-100 text-red-800 text-sm">
            {walletError}
          </div>
        )}
        {walletSuccess && (
          <div className="mb-3 p-2 rounded bg-green-100 text-green-800 text-sm">
            {walletSuccess}
          </div>
        )}
        {walletLoading ? (
          <div className="text-sm text-gray-600">
            Loading platform settings…
          </div>
        ) : walletSettings ? (
          <form
            onSubmit={handleSaveWalletSettings}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Current platform settings summary */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">Currency</div>
                <div className="text-sm font-semibold text-gray-800">
                  {walletSettings.currency || "LKR"}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">Commission</div>
                <div className="text-sm font-semibold text-gray-800">
                  {formatCommission(walletSettings.commissionPercent)}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">Convenience Fee</div>
                <div className="text-sm font-semibold text-gray-800">
                  {formatCurrency(
                    walletSettings.convenienceFee,
                    walletSettings.currency || "LKR"
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={walletSettings.currency ?? ""}
                onChange={(e) =>
                  setWalletSettings({
                    ...walletSettings,
                    currency: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Percent
              </label>
              <input
                type="number"
                step="0.01"
                value={walletSettings.commissionPercent ?? ""}
                onChange={(e) =>
                  setWalletSettings({
                    ...walletSettings,
                    commissionPercent:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convenience Fee (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                value={walletSettings.convenienceFee ?? ""}
                onChange={(e) =>
                  setWalletSettings({
                    ...walletSettings,
                    convenienceFee:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-3 flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">
                Version: {walletSettings.version ?? 0}
              </div>
              <button
                type="submit"
                disabled={walletLoading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center ${
                  walletLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />{" "}
                {walletLoading ? "Saving..." : "Save Platform Settings"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-gray-600">
            No platform settings found.
          </div>
        )}
      </section>

      {/* Pharmacy-specific Commission Override */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-indigo-600" /> Pharmacy
          Commission Override
        </h2>
        {pharmacyMsg && (
          <div className="mb-3 p-2 rounded bg-gray-100 text-gray-800 text-sm">
            {pharmacyMsg}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pharmacy ID
            </label>
            <input
              type="text"
              value={pharmacyIdInput}
              onChange={(e) => setPharmacyIdInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter pharmacy ID"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLoadPharmacyCommission}
              disabled={pharmacyLoading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ${
                pharmacyLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Load
            </button>
            <button
              onClick={handleRemovePharmacyCommission}
              disabled={pharmacyLoading}
              className={`bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ${
                pharmacyLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Remove Override
            </button>
          </div>
        </div>

        {pharmacyCommission !== null && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Existing override summary */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">Commission Override</div>
                <div className="text-sm font-semibold text-gray-800">
                  {formatCommission(pharmacyCommission?.commissionPercent)}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">Effective Currency</div>
                <div className="text-sm font-semibold text-gray-800">
                  {walletSettings?.currency || "LKR"}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500">Using Global Fee</div>
                <div className="text-sm font-semibold text-gray-800">
                  {formatCurrency(
                    walletSettings?.convenienceFee,
                    walletSettings?.currency || "LKR"
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commission Percent
              </label>
              <input
                type="number"
                step="0.01"
                value={pharmacyCommission?.commissionPercent ?? ""}
                onChange={(e) =>
                  setPharmacyCommission({
                    ...pharmacyCommission,
                    commissionPercent:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs text-gray-500">
              Version: {pharmacyCommission?.version ?? 0}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSavePharmacyCommission}
                disabled={pharmacyLoading}
                className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ${
                  pharmacyLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2 inline" />{" "}
                {pharmacyLoading ? "Saving..." : "Save Override"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Setting;
