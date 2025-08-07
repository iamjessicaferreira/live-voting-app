import { Contestant, VotingError } from '@/types';

export interface VoteValidationResult {
  isValid: boolean;
  error?: VotingError;
}

export class VoteValidator {
  static validateContestantExists(
    contestantId: string,
    contestants: Contestant[],
  ): VoteValidationResult {
    const contestant = contestants.find((c) => c.id === contestantId);

    if (!contestant) {
      return {
        isValid: false,
        error: {
          message: 'Contestant not found',
          type: 'validation',
        },
      };
    }

    return { isValid: true };
  }

  static validateContestantActive(contestant: Contestant): VoteValidationResult {
    if (!contestant.isActive) {
      return {
        isValid: false,
        error: {
          message: 'This contestant is no longer active',
          type: 'validation',
        },
      };
    }

    return { isValid: true };
  }

  static validateNoDuplicateVote(
    contestantId: string,
    hasVotedFor: (id: string) => boolean,
  ): VoteValidationResult {
    if (hasVotedFor(contestantId)) {
      return {
        isValid: false,
        error: {
          message: 'You have already voted for this contestant',
          type: 'duplicate',
        },
      };
    }

    return { isValid: true };
  }

  static validateVotingEnabled(isLive: boolean): VoteValidationResult {
    if (!isLive) {
      return {
        isValid: false,
        error: {
          message: 'Voting is currently disabled',
          type: 'validation',
        },
      };
    }

    return { isValid: true };
  }

  static validateHydration(isHydrated: boolean): VoteValidationResult {
    if (!isHydrated) {
      return {
        isValid: false,
        error: {
          message: 'Application is still loading, please try again',
          type: 'validation',
        },
      };
    }

    return { isValid: true };
  }

  static validateCompleteVote(
    contestantId: string,
    contestants: Contestant[],
    hasVotedFor: (id: string) => boolean,
    isLive: boolean,
    isHydrated: boolean,
  ): VoteValidationResult {
    const contestantValidation = this.validateContestantExists(contestantId, contestants);
    if (!contestantValidation.isValid) {
      return contestantValidation;
    }

    const contestant = contestants.find((c) => c.id === contestantId)!;

    const activeValidation = this.validateContestantActive(contestant);
    if (!activeValidation.isValid) {
      return activeValidation;
    }

    const votingValidation = this.validateVotingEnabled(isLive);
    if (!votingValidation.isValid) {
      return votingValidation;
    }

    const hydrationValidation = this.validateHydration(isHydrated);
    if (!hydrationValidation.isValid) {
      return hydrationValidation;
    }

    const duplicateValidation = this.validateNoDuplicateVote(contestantId, hasVotedFor);
    if (!duplicateValidation.isValid) {
      return duplicateValidation;
    }

    return { isValid: true };
  }
}
