# Notification Bell - Visual Layout Guide

## Overview
This guide shows where notification bells appear across different user interfaces in the PillPath application.

---

## 🖥️ Desktop Layout (≥ md breakpoint)

### Public Pages (Home, Services, OTC, Find Pharmacy, Contact)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]    [Home] [Services] [OTC] [Find Pharmacies] [Contact]  │
│                                                                  │
│                              [🔔] [👤 Profile ▼]  [Sign In]     │ <- NavbarBell here
└─────────────────────────────────────────────────────────────────┘
```

**When Authenticated**:
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]    [Home] [Services] [OTC] [Find Pharmacies] [Contact]  │
│                                                                  │
│          Welcome back,                                           │
│          John Doe         [🔔²³] [👤 Profile ▼]                  │ <- NavbarBell with badge
└─────────────────────────────────────────────────────────────────┘
                                  ↓ Click opens dropdown
                            ┌──────────────────────┐
                            │ Notifications    (23)│
                            ├──────────────────────┤
                            │ ● New prescription   │
                            │   ready for pickup   │
                            │   2 hours ago        │
                            ├──────────────────────┤
                            │   Order confirmed    │
                            │   Yesterday          │
                            ├──────────────────────┤
                            │ [Mark all as read]   │
                            └──────────────────────┘
```

---

### Customer Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                        Customer Dashboard                        │
│                                                                  │
│                                           [🔔²³] <- FloatingBell │ <- Fixed top-right
│                                                                  │
│  [Dashboard Content]                                             │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Note**: FloatingBell ONLY shows for customers, not pharmacists/admins.

---

### Pharmacist Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ [☰]  Pharmacist Panel                                           │
│      Green Valley Pharmacy                                       │
│                                                                  │
│                Welcome back,     [🔔⁵] [👤 Profile ▼]          │ <- NavbarBell in header
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│  [Dashboard Content]                                             │
│  No floating bell for pharmacists                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Pharmacy Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ [☰]  Administrator Panel                                        │
│      Green Valley Pharmacy                                       │
│                                                                  │
│                Welcome back,     [🔔⁸] [👤 Profile ▼]          │ <- NavbarBell in header
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│  [Dashboard Content]                                             │
│  No floating bell for pharmacy admins                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Layout (< lg breakpoint)

### Public Pages - Top Navbar

```
┌─────────────────────────────────────┐
│ [Logo]              [👤] [☰]        │
│                                     │
└─────────────────────────────────────┘
```

### Public Pages - Bottom Floating Nav (Authenticated)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│     [Page Content]                  │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏠  🛒  📍  ℹ️  ☎️  🔔  👤      │ │ <- Bottom Nav
│ │                      ↑           │ │    Bell shows here!
│ │                   Alerts         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
        Home  OTC  Serv Find Contact Alerts Profile
```

**With Unread Notifications**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│     [Page Content]                  │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏠  🛒  📍  ℹ️  ☎️  🔔¹²  👤    │ │ <- Badge on bell
│ │                      ↑           │ │
│ │                   Alerts         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Dropdown Open on Mobile**:
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ Notifications           (12) ❌ │ │
│ ├─────────────────────────────────┤ │
│ │ ● Prescription Ready            │ │
│ │   Your prescription #12345...   │ │
│ │   2 hours ago                   │ │
│ ├─────────────────────────────────┤ │
│ │   Order Confirmed               │ │
│ │   Order #67890 confirmed        │ │
│ │   Yesterday                     │ │
│ ├─────────────────────────────────┤ │
│ │ [Mark all as read] [Refresh]    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏠  🛒  📍  ℹ️  ☎️  🔔¹²  👤    │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Note**: Dropdown appears ABOVE the bottom nav, anchored to the bell icon.

---

### Customer Dashboard Mobile

```
┌─────────────────────────────────────┐
│ [☰] Customer Dashboard              │
│                                     │
│                          [🔔⁵]      │ <- FloatingBell (top-right)
│                                     │
│                                     │
│     [Dashboard Content]             │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ No bell in bottom nav on        │ │ <- No bell in bottom nav
│ │ customer dashboard pages        │ │    (FloatingBell is used instead)
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Note**: On customer dashboard routes (`/customer/*`), the FloatingBell appears in the top-right corner. Bottom nav doesn't show on dashboard pages.

---

### Pharmacist/Admin Dashboard Mobile

```
┌─────────────────────────────────────┐
│ [☰]  Pharmacist Panel               │
│                                     │
│      Welcome back,    [🔔³] [👤]   │ <- NavbarBell in header
│                                     │
│     [Dashboard Content]             │
│                                     │
│     NO floating bell here           │
│                                     │
└─────────────────────────────────────┘
```

**Note**: Pharmacists and pharmacy admins ONLY see the bell in their header, never the floating bell.

---

## 🎯 Bell Location Summary

| User Type | Page Type | Desktop | Mobile | Component |
|-----------|-----------|---------|--------|-----------|
| **Customer** | Public pages | Top navbar (right) | Bottom nav (right) | NavbarBell / Mobile bell |
| **Customer** | Dashboard (`/customer/*`) | Top-right corner | Top-right corner | FloatingBell |
| **Pharmacist** | Dashboard (`/pharmacist/*`) | Header (right) | Header (right) | NavbarBell |
| **Pharmacy Admin** | Dashboard (`/pharmacy/*`) | Header (right) | Header (right) | NavbarBell |
| **Not Authenticated** | Any page | ❌ No bell | ❌ No bell | N/A |

---

## 🎨 Visual States

### Bell Icon States

**No Notifications**:
```
🔔 (static, no animation)
```

**Unread Notifications**:
```
🔔 (animated ring)
²³ (red badge, animated pulse)
```

**Badge Variations**:
```
¹   -> 1 notification
⁹   -> 9 notifications
¹²  -> 12 notifications
⁹⁹⁺ -> 99+ notifications (for counts over 99)
```

---

## 📐 Positioning Details

### FloatingBell (Customer Only)
```css
position: fixed;
top: 16px;
right: 16px;
z-index: 9998;
```

### NavbarBell (Desktop)
- Inline with navbar items
- Right side of header
- Between welcome message and profile dropdown

### Mobile Bell (Bottom Nav)
- Rightmost position in nav bar
- Before profile icon
- Inline with other nav items

---

## 🔄 Dropdown Behavior

### Desktop
- **Anchor**: Bell icon
- **Position**: Opens downward-left
- **Alignment**: Right edge aligned with bell
- **Max Height**: 60vh
- **Width**: 384px (24rem)

### Mobile
- **Anchor**: Bell icon
- **Position**: Opens upward-right
- **Alignment**: Right edge aligned with bell
- **Max Height**: 60vh
- **Width**: calc(100vw - 2rem) (fits screen with margin)

---

## 🎬 Animation Effects

### Bell Ring Animation
```css
@keyframes bellRing {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20%, 40% { transform: rotate(10deg); }
}
```
**Trigger**: When `unreadCount > 0`

### Badge Pulse Animation
```css
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```
**Trigger**: When badge is visible

### Dropdown Slide Animation
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
**Trigger**: When dropdown opens

---

## 🧪 Testing Views

### To Test Desktop Navbar Bell:
1. Open browser at desktop width (≥ 768px)
2. Navigate to home page
3. Login as any user
4. Look for bell in top-right navbar

### To Test Mobile Bottom Nav Bell:
1. Resize browser to mobile width (< 768px)
2. Navigate to home page
3. Login as any user
4. Look for bell in bottom floating nav (rightmost, before profile)

### To Test Customer FloatingBell:
1. Login as customer
2. Navigate to `/customer` dashboard
3. Look for bell in top-right corner (fixed position)
4. Verify it appears on all customer routes

### To Test Pharmacist/Admin NavbarBell:
1. Login as pharmacist or pharmacy admin
2. Navigate to dashboard
3. Look for bell in header (right side)
4. Verify NO floating bell appears

---

**Last Updated**: October 17, 2025  
**Version**: 2.1 (Visual Guide with Public Navbar Integration)
