import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AdminPage from '../pages/AdminPage';
import * as api from '../api';

vi.mock('../api');

describe('AdminPage', () => {
  beforeEach(() => {
    api.getAdminStats.mockResolvedValue({ users: 10, posts: 25, comments: 50 });
    api.getAdminUsers.mockResolvedValue([
      { id: 1, username: 'admin', email: 'admin@test.com', role: 'admin', banned: 0 },
      { id: 2, username: 'user1', email: 'user1@test.com', role: 'user', banned: 0 },
    ]);
  });

  it('renders stats tab by default', async () => {
    render(<MemoryRouter><AdminPage /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  it('switches to users tab', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AdminPage /></MemoryRouter>);

    await user.click(screen.getByText('Users'));

    await waitFor(() => {
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
    });
  });

  it('can ban a user', async () => {
    api.toggleBanUser.mockResolvedValue({ id: 2, username: 'user1', email: 'user1@test.com', role: 'user', banned: 1 });
    const user = userEvent.setup();

    render(<MemoryRouter><AdminPage /></MemoryRouter>);

    await user.click(screen.getByText('Users'));

    await waitFor(() => {
      expect(screen.getByText('Ban')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Ban'));

    await waitFor(() => {
      expect(screen.getByText('Banned')).toBeInTheDocument();
      expect(screen.getByText('Unban')).toBeInTheDocument();
    });
  });
});
