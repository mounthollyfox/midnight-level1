// Simulator for the voting contract circuit

import { VoteWitness, PublicState } from '../witnesses';

export function simulateVotingCircuit(
  witness: VoteWitness,
  currentState: PublicState
): PublicState {
  // Validate vote option (must be 0 or 1)
  if (witness.option !== 0 && witness.option !== 1) {
    throw new Error('Invalid vote option: must be 0 or 1');
  }

  // Compute new state based on vote
  if (witness.option === 0) {
    return {
      totalVotes: currentState.totalVotes + 1,
      optionACount: currentState.optionACount + 1,
      optionBCount: currentState.optionBCount
    };
  } else {
    return {
      totalVotes: currentState.totalVotes + 1,
      optionACount: currentState.optionACount,
      optionBCount: currentState.optionBCount + 1
    };
  }
}
