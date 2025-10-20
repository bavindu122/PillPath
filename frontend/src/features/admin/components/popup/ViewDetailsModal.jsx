import React from "react";
import { User } from "lucide-react";
import ModalWrapper from "./ModalWrapper";

// Helper function to format datetime
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  try {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    return dateTimeString; // Return original if parsing fails
  }
};

const ViewDetailsModal = ({ user, onClose }) => {
  const isSuspended = user?.status === "Suspended" || user?.isActive === false;

  const parseSuspendReason = (val) => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "object") {
      if (val.reason) return String(val.reason);
      if (val.message) return String(val.message);
      const parts = Object.values(val).filter(Boolean);
      return parts.length ? parts.join(", ") : "—";
    }
    if (typeof val === "string") {
      const trimmed = val.trim();
      // try JSON
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          const parsed = JSON.parse(trimmed);
          return parseSuspendReason(parsed);
        } catch (e) {
          // fall through
        }
      }
      // try parse plain JSON fragments
      try {
        const maybe = JSON.parse(trimmed);
        return parseSuspendReason(maybe);
      } catch (e) {
        return trimmed || "—";
      }
    }
    return String(val);
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h3 className="text-2xl font-bold text-blue-800 mb-4">
        Customer Details
      </h3>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left: User Details */}
        <div className="space-y-2 text-gray-700 flex-1">
          <p>
            <strong>Name:</strong> {user?.fullName || ""}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || ""}
          </p>
          <p>
            <strong>Role:</strong> {user?.role || "Customer"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {user?.status || (user?.isActive ? "Active" : "Suspended")}
          </p>
          <p>
            <strong>Joined:</strong> {formatDateTime(user?.createdAt) || ""}
          </p>

          <p>
            <strong>Prescriptions:</strong> {user?.prescriptionCount ?? 0}
          </p>
          <p>
            <strong>Orders:</strong> {user?.orderCount ?? 0}
          </p>
          {user?.status === "Loyalty" && (
            <p>
              <strong>Loyalty Points:</strong> {user?.loyaltyPoints}
            </p>
          )}

          {isSuspended && (
            <div className="mt-3">
              <p>
                <strong className="text-red-600">Suspend Reason:</strong>{" "}
                {parseSuspendReason(
                  user?.suspendReason ??
                    user?.suspend_reason ??
                    user?.reason ??
                    user?.suspensionReason ??
                    user?.suspension_reason
                )}
              </p>
            </div>
          )}
        </div>

        {/* Right: Profile Picture */}
        <div className="w-25 h-25 rounded-full overflow-hidden shadow border border-gray-300">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <User size={34} className="text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewDetailsModal;
