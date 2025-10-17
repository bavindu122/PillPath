# Notification System Migration Guide

## Overview
This guide helps you migrate from the old notification system (single floating bell for all users) to the new role-based system (floating bell for customers only, navbar bell for all roles).

---

## What Changed?

### Before (Old System)
```
✗ NotificationBell.jsx - Showed for all authenticated users
✗ NotificationPanel.jsx - Standalone dropdown component
✗ useNotifications.jsx - Standalone hook without context
```

### After (New System)
```
✓ NotificationsContext.jsx - Global state provider
✓ FloatingBell.jsx - Customer-only floating bell
✓ NavbarBell.jsx - Navbar bell for all roles
✓ NotificationsDropdown.jsx - Reusable dropdown
```

---

## Migration Steps

### Step 1: Update App.jsx

**Old Code**:
```jsx
import NotificationBell from "./components/Notifications/NotificationBell";

// Show bell for all authenticated users
const showNotificationBell = isAuthenticated && (isCustomerPath || isPharmacistPath || isPharmacyAdminPath);

{showNotificationBell && <NotificationBell />}
```

**New Code**:
```jsx
import { NotificationsProvider } from "./contexts/NotificationsContext";
import FloatingBell from "./components/Notifications/FloatingBell";

// Wrap app in provider
<NotificationsProvider>
  <AppContent />
</NotificationsProvider>

// Show floating bell ONLY for customers
const showFloatingBell = isAuthenticated && userType === "customer" && isCustomerPath;

{showFloatingBell && <FloatingBell />}
```

---

### Step 2: Add NavbarBell to Header Components

**For Pharmacist Header** (`src/features/pharmacist/components/Header.jsx`):

```jsx
import NavbarBell from "../../../components/Notifications/NavbarBell";

// Replace old bell code with:
<NavbarBell position="left" />
```

**For Pharmacy Admin Header** (`src/features/pharmacy-admin/components/Header.jsx`):

```jsx
import NavbarBell from "../../../components/Notifications/NavbarBell";

// Replace old bell code with:
<NavbarBell position="left" />
```

**For Customer Navbar** (if exists):

```jsx
import NavbarBell from "../../components/Notifications/NavbarBell";

// Add to navbar:
<NavbarBell position="right" />
```

---

### Step 3: Use Notifications in Components

**Old Way** (Standalone Hook):
```jsx
import useNotifications from "../hooks/useNotifications";

const MyComponent = () => {
  const { notifications, unreadCount } = useNotifications();
  // ...
};
```

**New Way** (Context Hook):
```jsx
import { useNotifications } from "../contexts/NotificationsContext";

const MyComponent = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  // ...
};
```

**Important**: Component must be wrapped in `NotificationsProvider` to use the hook!

---

### Step 4: Clean Up Old Files

**Archive or Delete**:
- `src/components/Notifications/NotificationBell.jsx`
- `src/components/Notifications/NotificationPanel.jsx`
- `src/hooks/useNotifications.jsx` (if standalone version exists)

**Keep as Reference** (optional):
- Move to `archive/` folder instead of deleting

---

## API Changes

### Old Hook API
```javascript
const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = useNotifications();
```

### New Context API
```javascript
const {
  notifications,      // Array of notification objects
  unreadCount,        // Number of unread notifications
  loading,            // Boolean - loading state
  error,              // String - error message
  markAsRead,         // Function(id) - mark notification as read
  markAllAsRead,      // Function() - mark all as read
  deleteNotification, // Function(id) - delete notification
  refresh            // Function() - manually refresh notifications
} = useNotifications();
```

**New Features**:
- `loading` - Show loading indicator
- `error` - Handle error states
- `refresh` - Manual refresh button

---

## Component Props

### FloatingBell
No props required. Automatically:
- Positions itself (top: 16px, right: 16px)
- Shows unread badge
- Opens dropdown on click

```jsx
<FloatingBell />
```

### NavbarBell
Optional props for customization:

```jsx
<NavbarBell 
  position="left"    // "left" | "right" - dropdown alignment
  className=""       // Additional CSS classes
/>
```

### NotificationsDropdown
Typically used internally by FloatingBell and NavbarBell, but can be used standalone:

```jsx
<NotificationsDropdown
  ref={dropdownRef}
  anchorRef={bellButtonRef}
  isOpen={isOpen}
  onClose={handleClose}
  position="right"   // "left" | "right"
/>
```

---

## Common Issues & Solutions

### Issue 1: "useNotifications must be used within NotificationsProvider"

**Cause**: Component using `useNotifications` is not wrapped in `NotificationsProvider`

**Solution**: Ensure your app is wrapped:
```jsx
<NotificationsProvider>
  <App />
</NotificationsProvider>
```

### Issue 2: Floating bell shows for pharmacists/pharmacy admins

**Cause**: Role check missing in App.jsx

**Solution**: Update condition:
```jsx
const showFloatingBell = isAuthenticated && userType === "customer" && isCustomerPath;
```

### Issue 3: Dropdown doesn't anchor to button correctly

**Cause**: Missing or incorrect ref

**Solution**: Ensure button has ref and passes it to dropdown:
```jsx
const bellRef = useRef(null);

<button ref={bellRef}>...</button>
<NotificationsDropdown anchorRef={bellRef} />
```

### Issue 4: Notifications don't auto-refresh

**Cause**: Component unmounted before auto-refresh starts

**Solution**: Auto-refresh is handled by context. Ensure provider is mounted before components that need notifications.

---

## Testing After Migration

### ✅ Customer Role
1. Login as customer
2. Navigate to `/customer`
3. Verify floating bell in top-right
4. Click bell, verify dropdown opens
5. Test marking as read, deleting
6. Navigate to different customer pages, verify bell persists

### ✅ Pharmacist Role
1. Login as pharmacist
2. Navigate to `/pharmacist`
3. Verify NO floating bell
4. Verify navbar bell in header
5. Click navbar bell, verify dropdown opens
6. Test all dropdown features

### ✅ Pharmacy Admin Role
1. Login as pharmacy admin
2. Navigate to `/pharmacy`
3. Verify NO floating bell
4. Verify navbar bell in header
5. Click navbar bell, verify dropdown opens
6. Test all dropdown features

---

## Rollback Plan

If issues arise, you can temporarily rollback:

1. **Restore old App.jsx**:
   ```jsx
   import NotificationBell from "./components/Notifications/NotificationBell";
   const showNotificationBell = isAuthenticated && (isCustomerPath || isPharmacistPath || isPharmacyAdminPath);
   {showNotificationBell && <NotificationBell />}
   ```

2. **Remove NavbarBell from headers**:
   - Restore old notification bell code in Header components

3. **Keep using old hook** (if not deleted yet):
   ```jsx
   import useNotifications from "../hooks/useNotifications";
   ```

---

## Benefits of New System

1. **Role-Based Rendering**: Only customers get floating bell
2. **Navbar Integration**: Bell icons in headers for all roles
3. **Shared State**: Single source of truth for notifications
4. **Better UX**: Consistent dropdown behavior across components
5. **Accessibility**: Improved keyboard navigation and ARIA labels
6. **Performance**: Optimized with context API, auto-refresh
7. **Maintainability**: Reusable components, cleaner architecture

---

## Need Help?

**Documentation**:
- `NOTIFICATION_SYSTEM_ROLE_BASED_SUMMARY.md` - Complete system overview
- `NOTIFICATION_BELL_README.md` - Original documentation
- `NOTIFICATION_SYSTEM_IMPLEMENTATION_GUIDE.md` - Implementation details

**Debugging**:
- Check browser console for errors
- Verify `NotificationsProvider` is wrapping app
- Check user role and route path conditions
- Test with mock data first before API integration

---

**Migration Completed**: January 16, 2025  
**System Version**: 2.0 (Role-Based)
