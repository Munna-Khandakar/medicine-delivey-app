import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {Bar, BarChart, Label, Rectangle, ReferenceLine, XAxis} from 'recharts';
import api from '@/lib/apiInstance';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const WeeklySales = () => {

    const {
        data,
        isLoading,
        mutate
    } = useSWR<any>('report/order/weekly-details', fetcher, {revalidateOnFocus: false});

    return (
        <Card x-chunk="charts-01-chunk-0">
            <CardHeader className="space-y-0 pb-2">
                <CardDescription>Sales of the week</CardDescription>
            </CardHeader>
            <CardContent>

                {
                    isLoading
                        ?  <WeeklySalesSkeleton />
                        :
                        <ChartContainer
                            config={{
                                steps: {
                                    label: 'Orders',
                                    color: 'hsl(var(--chart-1))',
                                },
                            }}
                        >
                            <BarChart
                                accessibilityLayer
                                margin={{
                                    left: -4,
                                    right: -4,
                                }}
                                data={[
                                    ...data,
                                ]}
                            >
                                <Bar
                                    dataKey="count"
                                    fill="var(--color-steps)"
                                    radius={5}
                                    fillOpacity={0.6}
                                    activeBar={<Rectangle fillOpacity={0.8}/>}
                                />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={4}
                                    tickFormatter={(value) => {
                                        return new Date(value).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                        });
                                    }}
                                />
                                <ChartTooltip
                                    defaultIndex={2}
                                    content={
                                        <ChartTooltipContent
                                            hideIndicator
                                            labelFormatter={(value) => {
                                                return new Date(value).toLocaleDateString('en-US', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                });
                                            }}
                                        />
                                    }
                                    cursor={false}
                                />
                                <ReferenceLine
                                    y={1200}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="3 3"
                                    strokeWidth={1}
                                >
                                    <Label
                                        position="insideBottomLeft"
                                        value="Average Steps"
                                        offset={10}
                                        fill="hsl(var(--foreground))"
                                    />
                                    <Label
                                        position="insideTopLeft"
                                        value="12,343"
                                        className="text-lg"
                                        fill="hsl(var(--foreground))"
                                        offset={10}
                                        startOffset={100}
                                    />
                                </ReferenceLine>
                            </BarChart>
                        </ChartContainer>
                }
            </CardContent>
        </Card>
    );
};

export function WeeklySalesSkeleton() {
    return (
        <Card x-chunk="charts-01-chunk-0">
            <CardHeader className="space-y-0 pb-2">
                <CardDescription>
                    <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                </CardDescription>
                <CardTitle className="text-4xl tabular-nums">
                    <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1">
                <CardDescription>
                    <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                </CardDescription>
                <CardDescription>
                    <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                </CardDescription>
            </CardFooter>
        </Card>
    );
}