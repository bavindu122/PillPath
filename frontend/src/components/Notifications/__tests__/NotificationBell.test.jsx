import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotificationBell from '../NotificationBell';
import notificationService from '../../../services/api/notificationService';

// Mock the notification service
jest.mock('../../../services/api/notificationService');

// Mock the useAuth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    userType: 'customer',
  }),
}));

const mockNotifications = {
  notifications: [
    {
      id: 1,
      type: 'success',
      title: 'Prescription Ready',
      message: 'Your prescription is ready for pickup.',
      link: '/customer/prescriptions/123',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'info',
      title: 'New Pharmacy',
      message: 'A new pharmacy has been added near you.',
      link: '/customer/find-pharmacy',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      type: 'warning',
      title: 'Medication Reminder',
      message: 'Time to take your medication.',
      link: null,
      read: true,
      createdAt: new Date().toISOString(),
    },
  ],
  unreadCount: 2,
};

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <NotificationBell />
    </BrowserRouter>
  );
};

describe('NotificationBell Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    notificationService.getNotifications.mockResolvedValue(mockNotifications);
    notificationService.markAsRead.mockResolvedValue({ success: true });
    notificationService.markAllAsRead.mockResolvedValue({ success: true });
    notificationService.deleteNotification.mockResolvedValue({ success: true });
  });

  describe('Rendering', () => {
    it('renders the notification bell button', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      expect(bell).toBeInTheDocument();
    });

    it('displays the unread count badge', async () => {
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('displays "99+" for counts greater than 99', async () => {
      notificationService.getNotifications.mockResolvedValue({
        ...mockNotifications,
        unreadCount: 150,
      });
      
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText('99+')).toBeInTheDocument();
      });
    });

    it('does not display badge when unread count is 0', async () => {
      notificationService.getNotifications.mockResolvedValue({
        ...mockNotifications,
        unreadCount: 0,
      });
      
      renderComponent();
      
      await waitFor(() => {
        expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Toggle Behavior', () => {
    it('opens the notification panel when bell is clicked', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      fireEvent.click(bell);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Prescription Ready')).toBeInTheDocument();
      });
    });

    it('closes the panel when bell is clicked again', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      // Open panel
      fireEvent.click(bell);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Close panel
      fireEvent.click(bell);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('updates aria-expanded attribute', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      expect(bell).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(bell);
      
      await waitFor(() => {
        expect(bell).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Outside Click Behavior', () => {
    it('closes panel when clicking outside', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      // Open panel
      fireEvent.click(bell);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Click outside
      fireEvent.mouseDown(document.body);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('does not close panel when clicking inside', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      // Open panel
      fireEvent.click(bell);
      
      const panel = await screen.findByRole('dialog');
      
      // Click inside panel
      fireEvent.mouseDown(panel);
      
      // Panel should still be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes panel on ESC key', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      // Open panel
      fireEvent.click(bell);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Press ESC
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('refocuses bell after closing with ESC', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      // Open panel
      fireEvent.click(bell);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Press ESC
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(bell).toHaveFocus();
      });
    });
  });

  describe('Notification Actions', () => {
    it('marks notification as read when clicked', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      fireEvent.click(bell);
      
      const notification = await screen.findByText('Prescription Ready');
      fireEvent.click(notification);
      
      await waitFor(() => {
        expect(notificationService.markAsRead).toHaveBeenCalledWith(1);
      });
    });

    it('marks all notifications as read', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      fireEvent.click(bell);
      
      const markAllButton = await screen.findByText(/mark all as read/i);
      fireEvent.click(markAllButton);
      
      await waitFor(() => {
        expect(notificationService.markAllAsRead).toHaveBeenCalled();
      });
    });

    it('deletes notification when delete button clicked', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      fireEvent.click(bell);
      
      const deleteButtons = await screen.findAllByLabelText(/delete notification/i);
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(notificationService.deleteNotification).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no notifications', async () => {
      notificationService.getNotifications.mockResolvedValue({
        notifications: [],
        unreadCount: 0,
      });
      
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      fireEvent.click(bell);
      
      await waitFor(() => {
        expect(screen.getByText(/no notifications yet/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('displays loading spinner while fetching', async () => {
      // Delay the mock response
      notificationService.getNotifications.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockNotifications), 1000)
          )
      );
      
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      fireEvent.click(bell);
      
      // Should show loading spinner
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // Wait for notifications to load
      await waitFor(
        () => {
          expect(screen.getByText('Prescription Ready')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Route Change Behavior', () => {
    it('closes panel on route change', async () => {
      const { rerender } = renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      // Open panel
      fireEvent.click(bell);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Simulate route change
      window.dispatchEvent(new PopStateEvent('popstate'));
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      expect(bell).toHaveAttribute('aria-haspopup', 'true');
      expect(bell).toHaveAttribute('aria-expanded');
      expect(bell).toHaveAttribute('aria-label');
    });

    it('panel has dialog role and aria-modal', async () => {
      renderComponent();
      
      const bell = await screen.findByRole('button', {
        name: /notifications/i,
      });
      
      fireEvent.click(bell);
      
      const panel = await screen.findByRole('dialog');
      
      expect(panel).toHaveAttribute('aria-modal', 'true');
      expect(panel).toHaveAttribute('aria-labelledby');
    });
  });

  describe('Auto-refresh', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('refreshes notifications every 60 seconds', async () => {
      renderComponent();
      
      // Wait for initial load
      await waitFor(() => {
        expect(notificationService.getNotifications).toHaveBeenCalledTimes(1);
      });
      
      // Fast-forward 60 seconds
      jest.advanceTimersByTime(60000);
      
      await waitFor(() => {
        expect(notificationService.getNotifications).toHaveBeenCalledTimes(2);
      });
    });
  });
});
