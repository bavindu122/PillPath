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
  Gift,
  Info,
} from "lucide-react";
import AdminWalletService from "../../../services/api/AdminWalletService";

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
  const [moderators, setModerators] = useState(dummySettingsData.moderators);
  const [newModeratorUsername, setNewModeratorUsername] = useState("");
  const [newModeratorPassword, setNewModeratorPassword] = useState("");
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
  // Loyalty points settings
  const [loyaltyRate, setLoyaltyRate] = useState(null);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [loyaltyMsg, setLoyaltyMsg] = useState("");
  const [auditLog, setAuditLog] = useState(dummySettingsData.auditLog);

  const [passwordChangeOld, setPasswordChangeOld] = useState("");
  const [passwordChangeNew, setPasswordChangeNew] = useState("");
  const [passwordChangeConfirm, setPasswordChangeConfirm] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  const handleAddModerator = (e) => {
    e.preventDefault();
    if (
      newModeratorUsername.trim() === "" ||
      newModeratorPassword.trim() === ""
    ) {
      // In a real application, replace alert with a custom modal/toast
      alert("Username and password cannot be empty.");
      return;
    }

    const newMod = {
      id: `mod_${Date.now()}`, // Simple unique ID
      username: newModeratorUsername,
      lastLogin: "Never", // New moderator hasn't logged in yet
    };
    setModerators([...moderators, newMod]);
    setAuditLog([
      {
        id: `log_${Date.now()}`,
        action: `Added moderator: ${newModeratorUsername}`,
        timestamp: new Date().toLocaleString(),
        admin: "SuperAdmin",
      },
      ...auditLog,
    ]);
    setNewModeratorUsername("");
    setNewModeratorPassword("");
    // In a real application, replace alert with a custom modal/toast
    alert(
      `Moderator '${newModeratorUsername}' added successfully! Please ensure the password is stored securely.' (Please note this down securely, as it will not be displayed again).`
    );
  };

  const handleDeleteModerator = (id, username) => {
    // In a real application, replace window.confirm with a custom modal
    if (
      window.confirm(`Are you sure you want to delete moderator '${username}'?`)
    ) {
      setModerators(moderators.filter((mod) => mod.id !== id));
      setAuditLog([
        {
          id: `log_${Date.now()}`,
          action: `Deleted moderator: ${username}`,
          timestamp: new Date().toLocaleString(),
          admin: "SuperAdmin",
        },
        ...auditLog,
      ]);
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

  // Load current global wallet settings and loyalty rate on mount
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
    
    // Load loyalty rate
    (async () => {
      try {
        setLoyaltyLoading(true);
        const token = localStorage.getItem('admin_token');
        if (!token) {
          console.warn('No admin token found');
          if (mounted) setLoyaltyLoading(false);
          return;
        }
        
        const response = await fetch('http://localhost:8080/api/v1/admin/settings/loyalty-rate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (!mounted) return;
          setLoyaltyRate({ rate: data });
        } else {
          console.error('Failed to load loyalty rate:', response.status);
        }
      } catch (e) {
        console.error('Error loading loyalty rate:', e);
      } finally {
        if (mounted) setLoyaltyLoading(false);
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

  const handleSaveLoyaltyRate = async (e) => {
    e?.preventDefault?.();
    setLoyaltyMsg("");
    try {
      setLoyaltyLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        throw new Error("Admin authentication required. Please log in again.");
      }
      
      if (!loyaltyRate || loyaltyRate.rate === undefined || loyaltyRate.rate === null || loyaltyRate.rate === "") {
        throw new Error("Please enter a valid loyalty rate");
      }
      
      const rateValue = parseFloat(loyaltyRate.rate);
      if (isNaN(rateValue) || rateValue < 0) {
        throw new Error("Loyalty rate must be a positive number");
      }
      
      const response = await fetch('http://localhost:8080/api/v1/admin/settings/loyalty-rate', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rate: rateValue })
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to update loyalty rate';
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
          else if (errorData.error) errorMessage = errorData.error;
        } catch (e) {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const updated = await response.json();
      setLoyaltyRate({ rate: updated });
      setLoyaltyMsg("✅ Loyalty rate updated successfully!");
    } catch (e) {
      setLoyaltyMsg(`❌ ${e.message || "Failed to update loyalty rate"}`);
    } finally {
      setLoyaltyLoading(false);
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

      {/* Add Moderator Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <UserPlus className="w-6 h-6 mr-2 text-blue-600" /> Add New Moderator
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
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Add Moderator
            </button>
          </div>
        </form>
      </section>

      {/* Existing Moderators Section */}
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
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Last Login
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
              {moderators.map((mod) => (
                <tr key={mod.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mod.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mod.lastLogin}
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* General Settings Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-purple-600" /> General Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="siteName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={generalSettings.siteName}
              onChange={handleGeneralSettingsChange}
            />
          </div>
          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={generalSettings.contactEmail}
              onChange={handleGeneralSettingsChange}
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="notificationsEnabled"
              name="notificationsEnabled"
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              checked={generalSettings.notificationsEnabled}
              onChange={handleGeneralSettingsChange}
            />
            <label
              htmlFor="notificationsEnabled"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              Enable System Notifications
            </label>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={handleUpdateGeneralSettings}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Save Settings
            </button>
          </div>
        </div>
      </section>

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

      {/* Loyalty Points Settings */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <Gift className="w-6 h-6 mr-2 text-green-600" /> Loyalty Points Settings
        </h2>
        
        {loyaltyMsg && (
          <div className={`mb-4 p-3 rounded-lg ${
            loyaltyMsg.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {loyaltyMsg}
          </div>
        )}
        
        {loyaltyLoading ? (
          <div className="text-sm text-gray-600">Loading loyalty settings...</div>
        ) : loyaltyRate ? (
          <form onSubmit={handleSaveLoyaltyRate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points per LKR 1 Spent (Card Payments Only)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={loyaltyRate?.rate ?? ""}
                  onChange={(e) =>
                    setLoyaltyRate({
                      ...loyaltyRate,
                      rate: e.target.value === "" ? "" : parseFloat(e.target.value)
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 1.0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current rate: <strong>{loyaltyRate?.rate || "Not set"}</strong> point(s) per LKR 1
                </p>
              </div>
              
              <div className="flex items-end">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 w-full">
                  <p className="text-xs text-gray-600 mb-1">Example Calculation</p>
                  <p className="text-sm font-semibold text-gray-800">
                    LKR 1,000 order = {((loyaltyRate?.rate || 0) * 1000).toFixed(0)} points
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    (Only for credit/debit card payments)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" /> How Loyalty Points Work
              </h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Points are awarded only when customers pay with credit or debit cards</li>
                <li>• Cash payments do not earn loyalty points</li>
                <li>• Points are calculated and credited automatically when payment is confirmed</li>
                <li>• Customers can view their points balance in their dashboard</li>
              </ul>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loyaltyLoading}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center ${
                  loyaltyLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {loyaltyLoading ? "Saving..." : "Save Loyalty Rate"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-sm text-gray-600">No loyalty settings found.</div>
        )}
      </section>

      {/* Security Settings Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <Lock className="w-6 h-6 mr-2 text-red-600" /> Security Settings
        </h2>
        <form
          onSubmit={handleChangeAdminPassword}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={passwordChangeOld}
              onChange={(e) => setPasswordChangeOld(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={passwordChangeNew}
              onChange={(e) => setPasswordChangeNew(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={passwordChangeConfirm}
              onChange={(e) => setPasswordChangeConfirm(e.target.value)}
              required
            />
          </div>
          {passwordChangeMessage && (
            <div
              className={`md:col-span-2 p-3 rounded-lg text-sm ${
                passwordChangeMessage.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {passwordChangeMessage}
            </div>
          )}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <Lock className="w-5 h-5 mr-2" /> Change Password
            </button>
          </div>
        </form>
      </section>

      {/* Audit Log Section */}
      <section className="mb-12 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 flex items-center">
          <List className="w-6 h-6 mr-2 text-blue-600" /> Audit Log
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider"
                >
                  Admin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLog.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.admin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Setting;
