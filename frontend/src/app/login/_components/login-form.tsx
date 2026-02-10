"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { sendAlertEmail } from '@/lib/email-service';
import api from '@/lib/api';

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
  }),
  password: z.string().min(4, {
    message: "Le mot de passe doit contenir au moins 4 caractères.",
  }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      await login(values);

      // Fetch alerts and send email notification asynchronously
      // We await this to ensure the email is sent before navigation,
      // creating a slight delay but ensuring reliability.
      try {
        const alertsResponse = await api.get('/dashboard/alerts');
        console.log('Alerts response received:', alertsResponse.data);
        await sendAlertEmail(alertsResponse.data, values.username);
      } catch (emailErr) {
        console.error("Failed to process email alerts (login continues):", emailErr);
      }

      router.push('/dashboard');
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Login failed:', err);
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d&apos;utilisateur</FormLabel>
              <FormControl>
                <Input placeholder="admin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erreur de connexion</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </Form >
  );
}
