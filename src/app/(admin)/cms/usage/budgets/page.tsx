import { BudgetManager } from '@/components/usage/budget-manager';

export default function BudgetsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div>
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-muted-foreground">
              Set spending limits and configure alerts for your AI usage
            </p>
          </div>

          <BudgetManager />
        </div>
      </div>
    </div>
  );
}