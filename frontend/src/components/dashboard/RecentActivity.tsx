import { StockMovement } from "@/types/stock";
import { ArrowUpRight, ArrowDownRight, History } from "lucide-react";

interface RecentActivityProps {
    activities: StockMovement[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <div className="space-y-8">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-200">
                            {activity.batch?.product?.name || 'Unknown Product'}
                            <span className="text-xs text-gray-400 ml-2">({activity.batch?.batchNumber})</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            {activity.user?.username || 'System'} • {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">
                        {activity.type === 'IN' ? (
                            <span className="flex items-center text-emerald-400">
                                <ArrowUpRight className="mr-1 h-4 w-4" /> +{activity.quantityChange}
                            </span>
                        ) : activity.type === 'OUT' ? (
                            <span className="flex items-center text-rose-400">
                                <ArrowDownRight className="mr-1 h-4 w-4" /> {activity.quantityChange}
                            </span>
                        ) : (
                            <span className="flex items-center text-blue-400">
                                <History className="mr-1 h-4 w-4" /> {activity.quantityChange}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
