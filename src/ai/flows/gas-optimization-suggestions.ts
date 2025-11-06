'use server';

/**
 * @fileOverview This file defines a Genkit flow that analyzes pending NFT transactions and suggests batch transfers to reduce gas costs.
 *
 * - GasOptimizationSuggestionsInput - The input type for the gasOptimizationSuggestions function.
 * - GasOptimizationSuggestionsOutput - The return type for the gasOptimizationSuggestions function.
 * - gasOptimizationSuggestions - A function that suggests batch transfers for gas optimization.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GasOptimizationSuggestionsInputSchema = z.object({
  pendingTransactions: z
    .array(z.object({
      nftContractAddress: z.string().describe('The contract address of the NFT.'),
      tokenId: z.string().describe('The token ID of the NFT.'),
      toAddress: z.string().describe('The recipient address of the NFT.'),
    }))
    .describe('An array of pending NFT transactions.'),
  userAddress: z.string().describe('The address of the user initiating the transactions.'),
  currentGasPrice: z.number().describe('The current gas price in gwei.'),
});

export type GasOptimizationSuggestionsInput = z.infer<typeof GasOptimizationSuggestionsInputSchema>;

const GasOptimizationSuggestionsOutputSchema = z.object({
  suggestion: z.string().describe('A suggestion on whether to perform batch transfers to optimize gas costs.'),
  estimatedGasSavings: z.number().optional().describe('The estimated gas savings if batch transfer is used, in gwei. Only present if batch transfer is recommended.'),
});

export type GasOptimizationSuggestionsOutput = z.infer<typeof GasOptimizationSuggestionsOutputSchema>;

export async function gasOptimizationSuggestions(
  input: GasOptimizationSuggestionsInput
): Promise<GasOptimizationSuggestionsOutput> {
  return gasOptimizationSuggestionsFlow(input);
}

const gasOptimizationSuggestionsPrompt = ai.definePrompt({
  name: 'gasOptimizationSuggestionsPrompt',
  input: {schema: GasOptimizationSuggestionsInputSchema},
  output: {schema: GasOptimizationSuggestionsOutputSchema},
  prompt: `You are a gas optimization expert for NFT transactions on the Base blockchain.

  You will analyze a list of pending NFT transactions for a user and determine if batch transferring the NFTs would significantly reduce gas costs.

  Here is the user's address: {{{userAddress}}}
  Here is the current gas price: {{{currentGasPrice}}} gwei
  Here are the pending transactions:
  {{#each pendingTransactions}}
  - NFT Contract Address: {{{nftContractAddress}}}, Token ID: {{{tokenId}}}, To Address: {{{toAddress}}}
  {{/each}}

  Consider the overhead of batch transfers (e.g., increased data size) and the potential savings from reduced transaction count.

  If batch transferring would save a significant amount of gas, suggest it and provide an estimate of the gas savings in gwei. Otherwise, suggest that individual transfers are fine.

  Be concise and clear in your suggestion.
`,
});

const gasOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'gasOptimizationSuggestionsFlow',
    inputSchema: GasOptimizationSuggestionsInputSchema,
    outputSchema: GasOptimizationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await gasOptimizationSuggestionsPrompt(input);
    return output!;
  }
);
