import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalErrorProvider, useGlobalError } from '@/components/GlobalErrorHandler';
import { simulateVoteApi } from '@/utils/api';

const TestComponent: React.FC = () => {
  const { showError, clearError, currentError } = useGlobalError();

  const triggerError = () => {
    showError({
      message: 'Voting service temporarily unavailable, please try again in a moment.',
      type: 'server',
    });
  };

  return (
    <div>
      <button onClick={triggerError}>Trigger Error</button>
      <button onClick={clearError}>Clear Error</button>
      {currentError && <div data-testid="error-display">{currentError.message}</div>}
    </div>
  );
};

describe('Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GlobalErrorHandler', () => {
    it('should show error message when triggered', () => {
      render(
        <GlobalErrorProvider>
          <TestComponent />
        </GlobalErrorProvider>,
      );

      const triggerButton = screen.getByText('Trigger Error');
      fireEvent.click(triggerButton);

      expect(screen.getByTestId('error-display')).toHaveTextContent(
        'Voting service temporarily unavailable, please try again in a moment.',
      );
    });

    it('should clear error when clear button is clicked', () => {
      render(
        <GlobalErrorProvider>
          <TestComponent />
        </GlobalErrorProvider>,
      );

      const triggerButton = screen.getByText('Trigger Error');
      const clearButton = screen.getByText('Clear Error');

      fireEvent.click(triggerButton);
      expect(screen.getByTestId('error-display')).toBeInTheDocument();

      fireEvent.click(clearButton);
      expect(screen.queryByTestId('error-display')).not.toBeInTheDocument();
    });
  });

  describe('API Utilities', () => {
    it('should handle API errors gracefully', async () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.01);

      const result = await simulateVoteApi('1');

      expect(result.error).toBeTruthy();
      expect(result.error?.message).toBe(
        'Voting service temporarily unavailable, please try again in a moment.',
      );
      expect(result.error?.type).toBe('server');

      Math.random = originalRandom;
    });

    it('should return success for successful API calls', async () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.5);

      const result = await simulateVoteApi('1');

      expect(result.error).toBeNull();
      expect(result.data).toEqual({ success: true });

      Math.random = originalRandom;
    });
  });
});
