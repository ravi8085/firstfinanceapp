import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/auth', () => ({ authClient: null, demoEnabled: false }));
import AuthProvider from './AuthProvider';

describe('customer sign-in gate', () => {
  it('hides the application and demo bypass when no customer is authenticated', () => {
    render(<MemoryRouter><AuthProvider><div>Private money plan</div></AuthProvider></MemoryRouter>);
    expect(screen.queryByText('Private money plan')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name:/continue with google/i})).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile number')).toBeInTheDocument();
    expect(screen.queryByText('Explore the interactive demo')).not.toBeInTheDocument();
  });
});
