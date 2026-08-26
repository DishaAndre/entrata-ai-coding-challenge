import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProfileForm from './ProfileForm';

describe('Task 1: Profile Settings Form', () => {
  it('disables submit button initially when required fields are empty', () => {
    render(<ProfileForm />);
    const submitBtn = screen.getByRole('button', { name: /save profile/i });
    expect(submitBtn).toBeDisabled();
  });

  it('shows error when URL lacks scheme (http/https)', async () => {
    render(<ProfileForm />);
    const websiteInput = screen.getByLabelText(/website url/i);

    fireEvent.change(websiteInput, { target: { value: 'example.com' } });
    fireEvent.blur(websiteInput);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid url including http/i)).toBeInTheDocument();
    });
  });

  it('clears URL error when valid scheme is added', async () => {
    render(<ProfileForm />);
    const websiteInput = screen.getByLabelText(/website url/i);

    fireEvent.change(websiteInput, { target: { value: 'example.com' } });
    fireEvent.blur(websiteInput);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid url including http/i)).toBeInTheDocument();
    });

    fireEvent.change(websiteInput, { target: { value: 'https://example.com' } });

    await waitFor(() => {
      expect(screen.queryByText(/enter a valid url including http/i)).not.toBeInTheDocument();
    });
  });

  it('enables submit button and shows toast on valid form submission', async () => {
    render(<ProfileForm />);
    const nameInput = screen.getByLabelText(/display name/i);
    const submitBtn = screen.getByRole('button', { name: /save profile/i });

    fireEvent.change(nameInput, { target: { value: 'Helena' } });

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/profile settings saved successfully/i);
    });
  });
});