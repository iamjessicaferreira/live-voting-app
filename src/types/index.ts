export interface Contestant {
  id: string;
  name: string;
  talent: string;
  description: string;
  imageUrl: string;
  currentVotes: number;
  isActive: boolean;
  voteHistory?: VoteHistoryEntry[];
}

export interface VoteHistoryEntry {
  timestamp: number;
  votes: number;
}

export interface VoteState {
  [contestantId: string]: boolean;
}

export interface VotingError {
  message: string;
  type: 'duplicate' | 'network' | 'validation' | 'server' | 'storage';
}

export interface ApiError {
  message: string;
  status?: number;
  type: 'network' | 'server' | 'validation' | 'storage';
}

export interface VoteValidationResult {
  isValid: boolean;
  error?: VotingError;
}

export interface ContestantData {
  id: string;
  name: string;
  talent: string;
  description: string;
  imageUrl: string;
  currentVotes: number;
  isActive: boolean;
}
