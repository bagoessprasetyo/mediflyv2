import { TokenCounter } from '@/components/usage/token-counter';
import { UsageCharts } from '@/components/usage/usage-charts';
import { BudgetManager } from '@/components/usage/budget-manager';

export default function UsagePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:p-6">
          <div>
            <h1 className="text-3xl font-bold">Token Usage Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your AI usage, costs, and budget limits
            </p>
          </div>

          {/* Current Usage Overview */}
          {/* <TokenCounter variant="expanded" /> */}

          {/* Usage Analytics Charts */}
          <UsageCharts />

          {/* Budget Management */}
          <BudgetManager />
        </div>
      </div>
    </div>
  );
}