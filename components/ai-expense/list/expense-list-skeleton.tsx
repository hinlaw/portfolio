import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function ExpenseListDesktopSkeleton() {
    return (
        <div className="hidden md:block p-6">
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Upload zone skeleton */}
                <Skeleton className="h-20 w-full rounded-lg" />
                {/* Table skeleton */}
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]"> </TableHead>
                                <TableHead> </TableHead>
                                <TableHead className="text-right w-24"> </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-16 w-16 rounded flex-shrink-0" />
                                            <div className="flex flex-col gap-2 flex-1">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export function ExpenseListMobileSkeleton() {
    return (
        <div className="md:hidden px-4 pt-3 pb-8">
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-center px-4 py-4">
                        <Skeleton className="h-14 w-14 rounded flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

