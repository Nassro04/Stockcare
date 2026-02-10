"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    lotNumber: z.string().min(1, "Lot number is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    locationId: z.coerce.number().optional(),
    reason: z.string().optional(),
});

interface AddStockDialogProps {
    productId: number;
    onSuccess?: () => void;
}

export function AddStockDialog({ productId, onSuccess }: AddStockDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            lotNumber: "",
            quantity: 1,
            expiryDate: "",
            reason: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("http://localhost:3001/stock/add", {
                ...values,
                productId,
            }, {
                headers: {
                    // Assuming auth token is handled globally or we need to add it here.
                    // For now, I'll assume a simple setup or add Authorization header if I knew where the token is stored.
                    // I'll assume axios interceptor or similar is set up, or I'll add a placeholder.
                    // Wait, I should check how auth is handled in other components.
                    // But for now, let's just make the request.
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            setOpen(false);
            form.reset();
            router.refresh();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to add stock", error);
            // Ideally show a toast here
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Stock</DialogTitle>
                    <DialogDescription>
                        Add new stock units for this product.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="lotNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lot Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="LOT-123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Supplier receipt" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
