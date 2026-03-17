import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../pages/HomePage';
import * as AuthContext from '../AuthContext';
import * as api from '../api';

vi.mock('../api');

describe('HomePage', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, logout: vi.fn() });
  });

  it('renders post list', async () => {
    api.getPosts.mockResolvedValue({
      posts: [
        { id: 1, title: 'First Post', authorName: 'alice', category: 'general', pinned: 0, createdAt: '2024-01-01' },
        { id: 2, title: 'Second Post', authorName: 'bob', category: 'tech', pinned: 0, createdAt: '2024-01-02' },
      ],
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 }
    });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  it('shows empty state', async () => {
    api.getPosts.mockResolvedValue({
      posts: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
    });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('No posts yet.')).toBeInTheDocument();
    });
  });

  it('shows New Post button when logged in', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { id: 1, username: 'test', role: 'user' },
      logout: vi.fn()
    });
    api.getPosts.mockResolvedValue({ posts: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });

    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(screen.getByText('New Post')).toBeInTheDocument();
  });
});
