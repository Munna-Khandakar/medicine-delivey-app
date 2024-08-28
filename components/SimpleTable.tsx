'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableHeader,

} from '@/components/ui/table';


type SimpleTableProps = {
    title: string;
    subTitle?: string;
    tableHeader: any;
    tableBody: any;
    actionItems?: any;
};

export function SimpleTable(props: SimpleTableProps) {

    const {title, subTitle, tableHeader, tableBody, actionItems} = props;

    return (
        <Card className="rounded" style={{height: 'calc(100vh - 100px)'}}>
            <CardHeader className="flex justify-between flex-col md:flex-row items-center">
             <div>
                 <CardTitle>{title}</CardTitle>
                 {
                     subTitle &&
                     <CardDescription className="mt-2"> {subTitle}  </CardDescription>
                 }
             </div>
             {
                 actionItems
             }
            </CardHeader>
            <CardContent className="h-[65%] md:h-[80%] overflow-y-scroll">
                <Table>
                    <TableHeader>
                        {tableHeader}
                    </TableHeader>
                    <TableBody>
                        {tableBody}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="py-2">
                {/*<div className="text-xs text-muted-foreground">*/}
                {/*    Showing <strong>1-10</strong> of <strong>32</strong> products*/}
                {/*</div>*/}
            </CardFooter>
        </Card>
    );
}
