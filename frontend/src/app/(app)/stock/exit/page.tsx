import { StockExitForm } from './_components/stock-exit-form';

export default function StockExitPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sortie de Stock</h1>
                <p className="text-muted-foreground">
                    Enregistrer une sortie de produits (dispensation, rebut, etc.).
                </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <StockExitForm />
            </div>
        </div>
    );
}
