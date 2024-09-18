'use client';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Table, TableBody, TableHeader} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {Pagination} from '@/types/Pagination';
import {useRouter} from 'next/navigation';

type SimpleTableProps = {
    title: string;
    subTitle?: string;
    tableHeader: any;
    tableBody: any;
    actionItems?: any;
    pagination?: Pagination;
};

export function SimpleTable(props: SimpleTableProps) {
    const {title, subTitle, tableHeader, tableBody, actionItems, pagination} = props;
    const router = useRouter();

    const handlePageChange = (page: number) => {
        // Update the URL with the new page number
        router.push(`?page=${page}`);
    };

    const totalPages = pagination ? Math.ceil(pagination.totalElements / pagination.size) : 1;
    const currentPage = pagination?.currentPage || 0;

    const getPaginationButtons = () => {
        const buttons = [];
        const startPage = Math.max(0, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        // Always show the first page button
        if (currentPage > 1) {
            buttons.push(
                <Button
                    key={0}
                    variant={currentPage === 0 ? 'default' : 'outline'}
                    size={'icon'}
                    className="w-8 h-6 rounded px-1"
                    onClick={() => handlePageChange(0)}
                >
                    1
                </Button>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? 'default' : 'outline'}
                    size={'icon'}
                    className="w-8 h-6 rounded px-1"
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </Button>
            );
        }

        // Always show the last page button
        if (totalPages > 3 && currentPage < totalPages - 2) {
            buttons.push(
                <Button
                    key={totalPages - 1}
                    variant={currentPage === totalPages - 1 ? 'default' : 'outline'}
                    size={'icon'}
                    className="w-8 h-6 rounded px-1"
                    onClick={() => handlePageChange(totalPages - 1)}
                >
                    {totalPages}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Card className="rounded" style={{height: 'calc(100vh - 100px)'}}>
            <CardHeader className="flex justify-between flex-col md:flex-row items-center">
                <div>
                    <CardTitle>{title}</CardTitle>
                    {subTitle && <CardDescription className="mt-2">{subTitle}</CardDescription>}
                </div>
                {actionItems}
            </CardHeader>
            <CardContent className="h-[65%] md:h-[80%] overflow-y-scroll">
                <Table>
                    <TableHeader>{tableHeader}</TableHeader>
                    <TableBody>{tableBody}</TableBody>
                </Table>
            </CardContent>
            {
                pagination &&
                <CardFooter className="py-2 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{pagination?.currentPage * pagination?.size + 1}</strong> to <strong>{Math.min((pagination?.currentPage + 1) * pagination?.size, pagination?.totalElements)}</strong> of <strong>{pagination?.totalElements}</strong> products
                    </div>
                    <div className="flex gap-1">
                        {getPaginationButtons()}
                    </div>
                </CardFooter>
            }

        </Card>
    );
}