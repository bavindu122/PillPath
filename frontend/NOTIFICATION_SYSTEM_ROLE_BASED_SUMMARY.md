# Notification System - Role-Based Implementation Summary

## Overview
This document summarizes the role-based notification system refactoring completed for the PillPath application. The system now features separate notification bells for customers (floating bell) and all roles (navbar bell), with shared state management and reusable dropdown components.

---

## Architecture

### Components Structure

```
src/
├── contexts/
│   └── NotificationsContext.jsx        # Global notification state provider
├── components/
│   └── Notifications/
│       ├── NotificationsDropdown.jsx   # Reusable dropdown panel (portal-rendered)
│       ├── FloatingBell.jsx            # Fixed-position bell (customers only)
│       └── NavbarBell.jsx              # Navbar bell icon (all roles)
├── hooks/
│   └── useClickOutside.jsx             # Click outside detection
└── services/
    └── notificationService.js          # API service with mock data
```

---

## Component Details

### 1. NotificationsContext.jsx
**Purpose**: Global state management for notifications across all components

**Exports**:
- `NotificationsProvider` - Context provider component
- `useNotifications` - Custom hook for accessing notification state

**State**:
- `notifications: Array` - List of notification objects
- `unreadCount: Number` - Count of unread notifications
- `loading: Boolean` - Loading state for async operations
- `error: String` - Error message if any

**Actions**:
- `markAsRead(id)` - Mark a single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `deleteNotification(id)` - Delete a notification
- `refresh()` - Manually refresh notifications

**Features**:
- Auto-refresh every 60 seconds
- Initial fetch on mount
- Error handling with fallback state
- Optimistic UI updates

**Usage**:
```jsx
// Wrap app in provider
<NotificationsProvider>
  <App />
</NotificationsProvider>

// Use in components
const { notifications, unreadCount, markAsRead } = useNotifications();
```

---

### 2. NotificationsDropdown.jsx
**Purpose**: Reusable dropdown panel for displaying notifications

**Props**:
- `anchorRef: React.RefObject` - Reference to the button that triggered the dropdown
- `isOpen: Boolean` - Whether the dropdown is open
- `onClose: Function` - Callback to close the dropdown
- `position: 'left' | 'right'` (default: 'right') - Dropdown alignment

**Features**:
- Portal rendering (appends to `document.body`)
- Position calculation based on anchor button
- Focus trap for keyboard navigation
- Auto-focus on open
- Keyboard support (Tab, Shift+Tab, ESC)
- Notification actions: mark as read, delete
- Loading and empty states
- Responsive design (max-width: calc(100vw - 2rem))

**Styling**:
- Fixed position relative to anchor
- Max height: 60vh
- Scrollable content area
- Smooth animations (slideDown)
- Dark mode support

---

### 3. FloatingBell.jsx
**Purpose**: Fixed-position notification bell for customers only

**Visibility**: 
- **ONLY** renders when `userType === 'customer'` on `/customer/*` routes
- Hidden for pharmacists and pharmacy admins

**Position**:
- Fixed: `top: 16px`, `right: 16px`
- Z-index: 9998

**Features**:
- Unread badge with count (shows "99+" for 99+)
- Bell ring animation when unread notifications exist
- Badge pulse animation
- Click to toggle dropdown
- ESC key to close dropdown
- Click outside to close dropdown
- Accessible (ARIA labels, keyboard navigation)

**Styling**:
- White background (dark mode: gray-800)
- Shadow: `shadow-lg` (hover: `shadow-xl`)
- Hover scale: 105%
- Active scale: 95%
- Rounded: `rounded-full`

---

### 4. NavbarBell.jsx
**Purpose**: Navbar notification bell for all roles

**Visibility**:
- Can be used by **ANY** role (customers, pharmacists, pharmacy admins)
- Integrated into navbar/header components

**Props**:
- `position: 'left' | 'right'` (default: 'left') - Dropdown alignment
- `className: String` - Additional CSS classes

**Features**:
- Same dropdown functionality as FloatingBell
- Unread badge with count
- Bell ring animation
- Responsive design
- Matches navbar styling

**Integration**:
Currently integrated into:
- `src/features/pharmacist/components/Header.jsx`
- `src/features/pharmacy-admin/components/Header.jsx`

**Usage**:
```jsx
<NavbarBell position="left" />
```

---

## Role-Based Logic

### Customer Role
- **Floating Bell**: ✅ Visible on `/customer/*` routes
- **Navbar Bell**: ✅ Can be added to customer navbar if present

### Pharmacist Role
- **Floating Bell**: ❌ NOT visible
- **Navbar Bell**: ✅ Integrated in pharmacist header

### Pharmacy Admin Role
- **Floating Bell**: ❌ NOT visible
- **Navbar Bell**: ✅ Integrated in pharmacy admin header

### Implementation (App.jsx)
```jsx
// Wrap app in NotificationsProvider
<NotificationsProvider>
  <AppContent />
</NotificationsProvider>

// Show floating bell ONLY for customers
const showFloatingBell = isAuthenticated && userType === "customer" && isCustomerPath;

{showFloatingBell && <FloatingBell />}
```

---

## User Experience

### Notifications Flow

1. **Notification Arrives**:
   - `NotificationsContext` fetches from API (or mock data)
   - Unread count updates
   - Badge appears on bell icon
   - Bell icon animates (`animate-bellRing`)

2. **User Clicks Bell**:
   - Dropdown opens (portal-rendered)
   - Anchored to bell button
   - Shows list of notifications (newest first)
   - Unread notifications highlighted (purple background)

3. **User Interacts**:
   - Click notification → mark as read, navigate to link (if present)
   - Click "Mark all as read" → all notifications marked as read
   - Click delete button → notification removed
   - Click outside or ESC → dropdown closes

4. **Auto-Refresh**:
   - Notifications auto-refresh every 60 seconds
   - Manual refresh button available in dropdown

### Accessibility

- **ARIA labels**: Descriptive labels for screen readers
- **Keyboard navigation**: Tab, Shift+Tab, ESC
- **Focus trap**: Keeps focus inside dropdown
- **Focus management**: Auto-focus on open, return focus on close
- **Color contrast**: WCAG compliant colors
- **Semantic HTML**: Proper use of buttons, roles, etc.

---

## API Integration

### Current State: Mock Data
The system currently uses mock data from `notificationService.js` for development and testing.

### Mock Notifications
```javascript
{
  id: 1,
  title: "Prescription Ready",
  message: "Your prescription #12345 is ready for pickup at Downtown Pharmacy",
  type: "success",
  read: false,
  createdAt: "2024-01-16T10:30:00Z",
  link: "/customer/orders/12345"
}
```

### API Endpoints (To Be Implemented)

**GET /api/v1/notifications**
- Fetch all notifications for the authenticated user
- Returns: `{ notifications: Array, unreadCount: Number }`

**PUT /api/v1/notifications/:id/read**
- Mark a notification as read
- Returns: Updated notification object

**PUT /api/v1/notifications/read-all**
- Mark all notifications as read
- Returns: Success message

**DELETE /api/v1/notifications/:id**
- Delete a notification
- Returns: Success message

### Notification Types
- `success`: Green icon (Check) - Positive actions (order ready, payment success)
- `info`: Blue icon (Bell) - General information
- `warning`: Yellow icon (Bell) - Warnings (low stock, expiring prescription)
- `error`: Red icon (X) - Errors (payment failed, order cancelled)

---

## Testing Checklist

### Manual Testing

#### Customer Role
- [ ] Login as customer
- [ ] Navigate to `/customer` dashboard
- [ ] Verify floating bell appears in top-right corner
- [ ] Verify bell shows unread count badge
- [ ] Click bell to open dropdown
- [ ] Verify dropdown shows mock notifications
- [ ] Click a notification to mark as read
- [ ] Verify unread count decreases
- [ ] Click "Mark all as read"
- [ ] Verify all notifications marked as read
- [ ] Delete a notification
- [ ] Verify notification removed from list
- [ ] Click outside dropdown to close
- [ ] Press ESC to close dropdown

#### Pharmacist Role
- [ ] Login as pharmacist
- [ ] Navigate to `/pharmacist` dashboard
- [ ] Verify NO floating bell appears
- [ ] Verify navbar bell appears in header
- [ ] Click navbar bell to open dropdown
- [ ] Verify dropdown anchored to navbar bell
- [ ] Test all dropdown interactions

#### Pharmacy Admin Role
- [ ] Login as pharmacy admin
- [ ] Navigate to `/pharmacy` dashboard
- [ ] Verify NO floating bell appears
- [ ] Verify navbar bell appears in header
- [ ] Click navbar bell to open dropdown
- [ ] Verify dropdown anchored to navbar bell
- [ ] Test all dropdown interactions

### Responsive Testing
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Verify dropdown stays within viewport
- [ ] Verify floating bell doesn't overlap content

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Accessibility Testing
- [ ] Screen reader navigation (NVDA, JAWS)
- [ ] Keyboard-only navigation
- [ ] Focus indicators visible
- [ ] Color contrast (WCAG AA)

---

## Performance Considerations

### Auto-Refresh
- Interval: 60 seconds
- Cleanup: `useEffect` cleanup removes interval on unmount
- Debouncing: Not implemented (consider for production)

### Portal Rendering
- Dropdowns append to `document.body`
- Avoids z-index stacking issues
- Single portal per dropdown instance

### State Management
- Context API for global state
- No unnecessary re-renders (useCallback, useMemo where needed)
- Optimistic UI updates for better UX

---

## Future Enhancements

### Backend Integration
1. Replace mock data with real API calls
2. Implement WebSocket/Server-Sent Events for real-time notifications
3. Add notification preferences (email, push, in-app)
4. Implement notification categories/filters

### Features
1. Notification sound/vibration
2. Desktop notifications (Web Notifications API)
3. Mark as unread
4. Notification history pagination
5. Search/filter notifications
6. Notification settings page

### Analytics
1. Track notification open rate
2. Track notification action rate
3. Track notification deletion rate
4. A/B test notification copy/timing

---

## Troubleshooting

### Issue: Floating bell shows for all roles
**Solution**: Check `App.jsx` - ensure `showFloatingBell` condition includes `userType === "customer"`

### Issue: Dropdown doesn't close on outside click
**Solution**: Verify `useClickOutside` hook is working, check refs are correctly passed

### Issue: Unread count not updating
**Solution**: Check `NotificationsContext` - ensure `markAsRead` is updating state correctly

### Issue: Dropdown positioned incorrectly
**Solution**: Check anchor ref is correctly passed to dropdown, verify position calculation in `getDropdownStyle()`

### Issue: Notifications not loading
**Solution**: Check `notificationService.js` - verify mock data is being returned, check console for errors

### Issue: Bell icon not animating
**Solution**: Verify `animations.css` is imported in `index.css`, check `animate-bellRing` class is applied

---

## Migration from Old System

### Old Components (To Be Removed)
- `src/components/Notifications/NotificationBell.jsx` (old floating bell)
- `src/components/Notifications/NotificationPanel.jsx` (old dropdown)
- `src/hooks/useNotifications.jsx` (old standalone hook)

### New Components (Now Active)
- `src/contexts/NotificationsContext.jsx` (replaces standalone hook)
- `src/components/Notifications/FloatingBell.jsx` (replaces NotificationBell)
- `src/components/Notifications/NotificationsDropdown.jsx` (replaces NotificationPanel)
- `src/components/Notifications/NavbarBell.jsx` (new for navbar integration)

### Breaking Changes
- `useNotifications` now requires `NotificationsProvider` wrapper
- Old `NotificationBell` component no longer works (replaced)
- Navbar bells now use `NavbarBell` component

---

## Files Modified

### New Files Created
1. `src/contexts/NotificationsContext.jsx`
2. `src/components/Notifications/NotificationsDropdown.jsx`
3. `src/components/Notifications/FloatingBell.jsx`
4. `src/components/Notifications/NavbarBell.jsx`

### Files Modified
1. `src/App.jsx` - Added `NotificationsProvider`, changed to `FloatingBell`
2. `src/features/pharmacist/components/Header.jsx` - Integrated `NavbarBell`
3. `src/features/pharmacy-admin/components/Header.jsx` - Integrated `NavbarBell`

### Files To Be Archived (Next Step)
1. `src/components/Notifications/NotificationBell.jsx`
2. `src/components/Notifications/NotificationPanel.jsx`
3. `src/hooks/useNotifications.jsx`

---

## Summary

✅ **Completed**:
- Global notification state with `NotificationsContext`
- Reusable `NotificationsDropdown` component
- Customer-only `FloatingBell` component
- Role-agnostic `NavbarBell` component
- Integration into pharmacist/pharmacy admin headers
- Role-based rendering logic in `App.jsx`
- Comprehensive documentation

🔄 **In Progress**:
- Testing role-based rendering across all roles
- Browser/device testing

⏳ **Pending**:
- Clean up old components
- Backend API implementation
- Real-time notification delivery (WebSocket)
- Customer navbar bell integration (if customer navbar exists)

---

**Last Updated**: January 16, 2025  
**Version**: 2.0 (Role-Based Refactor)
