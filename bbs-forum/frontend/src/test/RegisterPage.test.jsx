import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import RegisterPage from '../pages/RegisterPage';
import * as AuthContext from '../AuthContext';
import * as api from '../api';

vi.mock('../api');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterPage', () => {
  const mockLoginUser = vi.fn();

  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      loginUser: mockLoginUser,
      logout: vi.fn()
    });
    mockNavigate.mockReset();
  });

  it('renders register form', () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    api.register.mockResolvedValue({ token: 'abc', user: { id: 1, username: 'new', role: 'user' } });
    const user = userEvent.setup();

    render(<MemoryRouter><RegisterPage /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText('Username'), 'newuser');
    await user.type(screen.getByPlaceholderText('Email'), 'new@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error on failed registration', async () => {
    api.register.mockResolvedValue({ error: 'Username already exists' });
    const user = userEvent.setup();

    render(<MemoryRouter><RegisterPage /></MemoryRouter>);

    await user.type(screen.getByPlaceholderText('Username'), 'existing');
    await user.type(screen.getByPlaceholderText('Email'), 'e@test.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Username already exists');
    });
  });
});
