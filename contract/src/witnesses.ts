// Witness definitions for the private voting contract

export interface VoteWitness {
  option: number;  // 0 for option A, 1 for option B
  voterNullifier: string;
}

export interface PublicState {
  totalVotes: number;
  optionACount: number;
  optionBCount: number;
}

export function createVoteWitness(option: number, voterNullifier: string): VoteWitness {
  return {
    option,
    voterNullifier
  };
}

export function createInitialPublicState(): PublicState {
  return {
    totalVotes: 0,
    optionACount: 0,
    optionBCount: 0
  };
}
