'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getGasOptimizationSuggestion } from '@/app/gas-optimizer/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Bot, Zap, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  nftContractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid contract address.' }),
  tokenId: z.string().min(1, 'Token ID required.'),
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid recipient address.' }),
});

const formSchema = z.object({
  userAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid wallet address.' }),
  currentGasPrice: z.coerce.number().positive('Must be positive.'),
  pendingTransactions: z.array(transactionSchema).min(1),
});

type FormData = z.infer<typeof formSchema>;

const initialState = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" /> Get AI Suggestion
        </>
      )}
    </Button>
  );
}

export function GasOptimizerForm() {
  const [state, formAction] = useFormState(getGasOptimizationSuggestion, initialState);
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userAddress: '0x1234567890abcdef1234567890abcdef1234aBcd',
      currentGasPrice: 0.1,
      pendingTransactions: [
        {
          nftContractAddress: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
          tokenId: '1234',
          toAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pendingTransactions',
  });
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
    }
  }, [state.error, toast])

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-card/60 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Enter your address, current gas price, and pending transactions.
          </CardDescription>
        </CardHeader>
        <form
          action={(formData) => {
            const values = getValues();
            formData.set('pendingTransactions', JSON.stringify(values.pendingTransactions));
            formAction(formData);
          }}
          className="space-y-6"
        >
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userAddress">Your Address</Label>
              <Input
                id="userAddress"
                {...register('userAddress')}
                placeholder="0x..."
              />
              {errors.userAddress && <p className="text-sm text-destructive">{errors.userAddress.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentGasPrice">Current Gas Price (gwei)</Label>
              <Input
                id="currentGasPrice"
                type="number"
                step="0.01"
                {...register('currentGasPrice')}
              />
               {errors.currentGasPrice && <p className="text-sm text-destructive">{errors.currentGasPrice.message}</p>}
            </div>

            <div>
              <Label>Pending Transactions</Label>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-2 bg-background/50 relative">
                    <div className="space-y-2">
                       <Label htmlFor={`tx-contract-${index}`} className="text-xs">NFT Contract Address</Label>
                       <Input id={`tx-contract-${index}`} {...register(`pendingTransactions.${index}.nftContractAddress`)} placeholder="0x..."/>
                       {errors.pendingTransactions?.[index]?.nftContractAddress && <p className="text-sm text-destructive">{errors.pendingTransactions[index]?.nftContractAddress?.message}</p>}
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor={`tx-tokenid-${index}`} className="text-xs">Token ID</Label>
                       <Input id={`tx-tokenid-${index}`} {...register(`pendingTransactions.${index}.tokenId`)} placeholder="1234"/>
                        {errors.pendingTransactions?.[index]?.tokenId && <p className="text-sm text-destructive">{errors.pendingTransactions[index]?.tokenId?.message}</p>}
                    </div>
                     <div className="space-y-2">
                       <Label htmlFor={`tx-to-${index}`} className="text-xs">Recipient Address</Label>
                       <Input id={`tx-to-${index}`} {...register(`pendingTransactions.${index}.toAddress`)} placeholder="0x..."/>
                        {errors.pendingTransactions?.[index]?.toAddress && <p className="text-sm text-destructive">{errors.pendingTransactions[index]?.toAddress?.message}</p>}
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
             <Button
                type="button"
                variant="outline"
                onClick={() => append({ nftContractAddress: '', tokenId: '', toAddress: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary"/>
            AI Suggestion
          </CardTitle>
          <CardDescription>
            Our AI will analyze your transactions and provide gas-saving advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.success && state.data ? (
              <div className="space-y-4 p-6 bg-background/50 rounded-lg">
                <p className="text-lg font-medium">{state.data.suggestion}</p>
                {state.data.estimatedGasSavings && (
                  <div className="flex items-center gap-2 text-accent-foreground bg-accent/30 p-3 rounded-md">
                      <Zap className="h-5 w-5 text-accent" />
                      <p>
                        Estimated Gas Savings: <span className="font-bold">{state.data.estimatedGasSavings} gwei</span>
                      </p>
                  </div>
                )}
              </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 h-48 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Your gas optimization suggestion will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
