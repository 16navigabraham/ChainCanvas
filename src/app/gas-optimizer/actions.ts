'use server';

import {
  gasOptimizationSuggestions,
  type GasOptimizationSuggestionsInput,
  type GasOptimizationSuggestionsOutput,
} from '@/ai/flows/gas-optimization-suggestions';
import { z } from 'zod';

const formSchema = z.object({
  userAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  currentGasPrice: z.coerce.number().min(0.1, 'Gas price must be positive'),
  pendingTransactions: z.array(
    z.object({
      nftContractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
      tokenId: z.string().min(1, 'Token ID is required'),
      toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid recipient address'),
    })
  ).min(1, 'At least one transaction is required.'),
});

interface ActionState {
  success: boolean;
  data?: GasOptimizationSuggestionsOutput;
  error?: string;
  issues?: z.ZodIssue[];
}

export async function getGasOptimizationSuggestion(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
      userAddress: formData.get('userAddress'),
      currentGasPrice: formData.get('currentGasPrice'),
      pendingTransactions: JSON.parse(formData.get('pendingTransactions') as string || '[]'),
  }

  const validatedFields = formSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.issues,
      error: 'Invalid form data. Please check the fields.',
    };
  }

  try {
    const suggestion = await gasOptimizationSuggestions(validatedFields.data as GasOptimizationSuggestionsInput);
    return { success: true, data: suggestion };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to get suggestion from AI. Please try again.' };
  }
}
