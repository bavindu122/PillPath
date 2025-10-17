# Notification System Quick Reference

## 🎯 Quick Start

### 1. Wrap Your App
```jsx
import { NotificationsProvider } from "./contexts/NotificationsContext";

<NotificationsProvider>
  <App />
</NotificationsProvider>
```

### 2. Use Notifications Hook
```jsx
import { useNotifications } from "../contexts/NotificationsContext";

const MyComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
};
```

### 3. Add Bells

**Floating Bell (Customers Only)**:
```jsx
import FloatingBell from "./components/Notifications/FloatingBell";

{isCustomer && <FloatingBell />}
```

**Navbar Bell (All Roles)**:
```jsx
import NavbarBell from "./components/Notifications/NavbarBell";

<NavbarBell position="left" />
```

---

## 📦 Components

| Component | Purpose | Who Sees It |
|-----------|---------|-------------|
| `FloatingBell` | Fixed top-right bell | Customers only |
| `NavbarBell` | Bell in navbar/header | All roles |
| `NotificationsDropdown` | Dropdown panel | Used by both bells |

---

## 🎨 Styling Props

### FloatingBell
No props - automatically positioned at top-right

### NavbarBell
```jsx
<NavbarBell 
  position="left"     // "left" | "right" (default: "left")
  className="ml-2"    // Additional CSS classes
/>
```

---

## 🔧 Hook API

```javascript
const {
  notifications,      // Notification[] - list of notifications
  unreadCount,        // number - count of unread
  loading,            // boolean - loading state
  error,              // string | null - error message
  markAsRead,         // (id: number) => void
  markAllAsRead,      // () => void
  deleteNotification, // (id: number) => void
  refresh            // () => void - manual refresh
} = useNotifications();
```

---

## 🎭 Role-Based Visibility

```
Customer:
  ✅ FloatingBell on /customer/* routes
  ✅ NavbarBell (if navbar exists)

Pharmacist:
  ❌ NO FloatingBell
  ✅ NavbarBell in header

Pharmacy Admin:
  ❌ NO FloatingBell
  ✅ NavbarBell in header
```

---

## 📝 Notification Object

```typescript
{
  id: number;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  createdAt: string; // ISO 8601
  link?: string;     // Optional navigation link
}
```

---

## 🎨 Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `success` | ✓ Check | Green | Order ready, payment success |
| `info` | 🔔 Bell | Blue | General updates |
| `warning` | 🔔 Bell | Yellow | Low stock, expiring items |
| `error` | ✗ X | Red | Failed actions, errors |

---

## 🔄 Auto-Refresh

- **Interval**: 60 seconds
- **On Mount**: Fetches immediately
- **Manual**: Call `refresh()` function

```jsx
const { refresh } = useNotifications();

<button onClick={refresh}>Refresh Now</button>
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ESC` | Close dropdown |
| `Tab` | Next focusable element |
| `Shift+Tab` | Previous focusable element |
| `Enter` | Activate button/notification |

---

## 🎬 Animations

```css
/* Defined in animations.css */
.animate-slideDown   /* Dropdown entrance */
.animate-bellRing    /* Bell shake when unread */
.animate-badgePulse  /* Badge pulse animation */
```

---

## 🐛 Quick Debug

### Bell not showing?
```jsx
// Check role condition
console.log({ isAuthenticated, userType, isCustomerPath });

// For customers: all 3 should be true
// For others: floating bell should NOT show
```

### Dropdown not opening?
```jsx
// Check refs
console.log({ bellRef, dropdownRef });

// Both should be defined
```

### Hook error?
```jsx
// Error: "must be used within NotificationsProvider"
// Solution: Wrap app in provider
<NotificationsProvider>
  <App />
</NotificationsProvider>
```

---

## 📚 Documentation Files

1. `NOTIFICATION_SYSTEM_ROLE_BASED_SUMMARY.md` - Complete overview
2. `NOTIFICATION_SYSTEM_MIGRATION_GUIDE.md` - Migration steps
3. `NOTIFICATION_BELL_README.md` - Original docs
4. `NOTIFICATION_SYSTEM_IMPLEMENTATION_GUIDE.md` - Implementation details
5. `NOTIFICATION_SYSTEM_QUICK_REFERENCE.md` - This file

---

## 🚀 Common Patterns

### Custom Notification Button
```jsx
import { useNotifications } from "../contexts/NotificationsContext";
import { Bell } from "lucide-react";

const CustomBell = () => {
  const { unreadCount } = useNotifications();
  
  return (
    <button className="relative">
      <Bell />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
```

### Filter Notifications
```jsx
const { notifications } = useNotifications();

const unreadOnly = notifications.filter(n => !n.read);
const successOnly = notifications.filter(n => n.type === 'success');
const today = notifications.filter(n => 
  new Date(n.createdAt).toDateString() === new Date().toDateString()
);
```

### Notification Sound
```jsx
import { useEffect } from 'react';
import { useNotifications } from "../contexts/NotificationsContext";

const NotificationSound = () => {
  const { unreadCount } = useNotifications();
  const prevCount = useRef(unreadCount);
  
  useEffect(() => {
    if (unreadCount > prevCount.current) {
      new Audio('/notification.mp3').play();
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);
  
  return null;
};
```

---

## 📞 Support

**Need Help?**
- Check console for errors
- Verify `NotificationsProvider` wrapper
- Check role and route conditions
- Review documentation files above

**Found a Bug?**
- Document steps to reproduce
- Include role, route, and browser info
- Check if mock data is working

---

**Version**: 2.0 (Role-Based)  
**Last Updated**: January 16, 2025
