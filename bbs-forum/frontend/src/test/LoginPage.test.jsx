import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import * as AuthContext from '../AuthContext';
import * as api from '../api';

vi.mock('../api');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('LoginPage', () => {
  const mockLoginUser = vi.fn();

  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      loginUser: mockLoginUser,
      logout: vi.fn()
    });
    mockNavigate.mockReset();
  });

  it('renders login form', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    api.login.mockResolvedValue({ token: 'abc', user: { id: 1, username: 'test', role: 'user' } });
    const user = userEvent.setup();

    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText('Username'), 'test');
    await user.type(screen.getByPlaceholderText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith('abc', { id: 1, username: 'test', role: 'user' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error on failed login', async () => {
    api.login.mockResolvedValue({ error: 'Invalid credentials' });
    const user = userEvent.setup();

    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText('Username'), 'test');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });
  });
});
