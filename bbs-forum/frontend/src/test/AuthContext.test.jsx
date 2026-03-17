import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';

function TestComponent() {
  const { user, loginUser, logout } = useAuth();
  return (
    <div>
      <p data-testid="user">{user ? user.username : 'none'}</p>
      <button onClick={() => loginUser('token123', { id: 1, username: 'testuser', role: 'user' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  it('loginUser sets user and saves to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    expect(localStorage.getItem('token')).toBe('token123');
  });

  it('logout clears user', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('user')).toHaveTextContent('testuser');

    await user.click(screen.getByText('Logout'));
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('restores user from localStorage', () => {
    localStorage.setItem('token', 'saved-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'saved', role: 'user' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('saved');
  });
});
