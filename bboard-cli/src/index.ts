#!/usr/bin/env node

// CLI interface for the voting DApp

import { VotingAPIClient } from '../../api/src/index';
import { NETWORKS } from '../../api/src/common-types';
import { createVoteWitness, createInitialPublicState } from '../../contract/src/witnesses';

const args = process.argv.slice(2);

function showHelp() {
  console.log('Midnight Voting CLI');
  console.log('');
  console.log('Usage:');
  console.log('  vote-cli <command> [options]');
  console.log('');
  console.log('Commands:');
  console.log('  vote <option>          Cast a vote (0 for option A, 1 for option B)');
  console.log('  status                 Get current voting status');
  console.log('  deploy                 Deploy contract to network');
  console.log('  help                   Show this help message');
  console.log('');
  console.log('Options:');
  console.log('  --network <name>       Network to use (preview, preprod, mainnet)');
  console.log('  --address <address>    Contract address');
  console.log('');
  console.log('Examples:');
  console.log('  vote-cli vote 0 --network preview');
  console.log('  vote-cli status --address 0x123...');
}

async function main() {
  const command = args[0];
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }

  const networkIndex = args.indexOf('--network');
  const network = networkIndex !== -1 ? args[networkIndex + 1] : 'preview';
  
  const addressIndex = args.indexOf('--address');
  const contractAddress = addressIndex !== -1 ? args[addressIndex + 1] : '0x0000000000000000000000000000000000000000';

  const api = new VotingAPIClient(contractAddress, network as any);

  switch (command) {
    case 'vote':
      const option = parseInt(args[1]);
      if (isNaN(option) || (option !== 0 && option !== 1)) {
        console.error('Invalid vote option. Use 0 for option A or 1 for option B.');
        process.exit(1);
      }
      
      const witness = createVoteWitness(option, Math.random().toString(36).substring(7));
      const currentState = await api.getCurrentState();
      const newState = await api.castVote(witness, currentState);
      
      console.log('Vote cast successfully!');
      console.log(`Total votes: ${newState.totalVotes}`);
      console.log(`Option A: ${newState.optionACount}`);
      console.log(`Option B: ${newState.optionBCount}`);
      break;

    case 'status':
      const state = await api.getCurrentState();
      console.log('Current voting status:');
      console.log(`Total votes: ${state.totalVotes}`);
      console.log(`Option A: ${state.optionACount}`);
      console.log(`Option B: ${state.optionBCount}`);
      console.log(`Contract: ${api.getContractAddress()}`);
      console.log(`Network: ${network}`);
      break;

    case 'deploy':
      console.log(`Deploying contract to ${network}...`);
      console.log('This would deploy the Compact contract to the network.');
      console.log('Contract address would be returned here.');
      break;

    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
