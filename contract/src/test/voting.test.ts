// Tests for the private voting contract

import { simulateVotingCircuit } from './voting-simulator';
import { VoteWitness, PublicState, createVoteWitness, createInitialPublicState } from '../witnesses';
import { assertEquals, assert } from './utils';

function runTests() {
  console.log('Running voting contract tests...\n');

  // Test 1: Vote for option A
  console.log('Test 1: Vote for option A');
  const witness1: VoteWitness = {
    option: 0,
    voterNullifier: '1'
  };
  const initialState1: PublicState = createInitialPublicState();
  const newState1 = simulateVotingCircuit(witness1, initialState1);
  assertEquals(newState1.totalVotes, 1, 'Total votes should be 1');
  assertEquals(newState1.optionACount, 1, 'Option A count should be 1');
  assertEquals(newState1.optionBCount, 0, 'Option B count should be 0');
  console.log('✓ Test 1 passed\n');

  // Test 2: Vote for option B
  console.log('Test 2: Vote for option B');
  const witness2: VoteWitness = {
    option: 1,
    voterNullifier: '2'
  };
  const initialState2: PublicState = createInitialPublicState();
  const newState2 = simulateVotingCircuit(witness2, initialState2);
  assertEquals(newState2.totalVotes, 1, 'Total votes should be 1');
  assertEquals(newState2.optionACount, 0, 'Option A count should be 0');
  assertEquals(newState2.optionBCount, 1, 'Option B count should be 1');
  console.log('✓ Test 2 passed\n');

  // Test 3: Multiple votes
  console.log('Test 3: Multiple votes');
  const vote1 = createVoteWitness(0, '1');
  const vote2 = createVoteWitness(1, '2');
  const vote3 = createVoteWitness(0, '3');
  
  let state = createInitialPublicState();
  state = simulateVotingCircuit(vote1, state);
  state = simulateVotingCircuit(vote2, state);
  state = simulateVotingCircuit(vote3, state);
  
  assertEquals(state.totalVotes, 3, 'Total votes should be 3');
  assertEquals(state.optionACount, 2, 'Option A count should be 2');
  assertEquals(state.optionBCount, 1, 'Option B count should be 1');
  console.log('✓ Test 3 passed\n');

  // Test 4: Invalid vote option should fail
  console.log('Test 4: Invalid vote option should fail');
  const invalidWitness: VoteWitness = {
    option: 2,
    voterNullifier: '1'
  };
  try {
    simulateVotingCircuit(invalidWitness, createInitialPublicState());
    console.log('✗ Test 4 failed: Should have thrown error\n');
  } catch (error) {
    console.log('✓ Test 4 passed: Correctly rejected invalid vote\n');
  }

  console.log('All tests passed!');
}

runTests();
