import { StockEntryForm } from './_components/stock-entry-form';

export default function StockEntryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Entrée de Stock</h1>
                <p className="text-muted-foreground">
                    Enregistrer une réception de produits (fournisseur, retour, etc.)
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <StockEntryForm />
            </div>
        </div>
    );
}
