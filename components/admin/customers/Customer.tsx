'use client';

import {Fragment, useState} from 'react';
import useSWR from 'swr';
import {useParams} from 'next/navigation';
import {ExclamationTriangleIcon} from '@radix-ui/react-icons';
import {SimpleTable} from '@/components/SimpleTable';
import {TableCell, TableHead, TableRow} from '@/components/ui/table';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Badge} from '@/components/ui/badge';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
import Modal from '@/components/Modal';
import {DownloadPdfButton} from '@/components/common/DownloadPdfButton';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {useToast} from '@/components/ui/use-toast';
import {OrderResponse} from '@/types/OrderResponse';
import {MedicineUtils} from '@/utils/MedicineUtils';
import {User} from '@/types/User';
import {OrderStauts} from '@/types/enum/OrderStauts';
import api from '@/lib/apiInstance';
import {ProfileCardLoader} from '@/components/admin/customers/ProfileCardLoader';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export const Customer = () => {

    const {customer_id} = useParams();
    const {toast} = useToast();
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [openImageViewModal, setOpenImageViewModal] = useState(false);
    const [openDeactivateModal, setOpenDeactivateModal] = useState(false);

    const {
        data: userData,
        isLoading: userIsLoading,
        error: userError,
        mutate: userMutate
    } = useSWR<User>(customer_id ? `users/${customer_id}` : null, fetcher, {revalidateOnFocus: false});

    const {
        data: customerOrders,
        isLoading: customerOrdersLoading,
        error: customerOrdersError
    } = useSWR<OrderResponse[]>(customer_id ? `orders/user/${customer_id}` : null, fetcher, {revalidateOnFocus: false});


    const toggleUserDeactivationStatus = async () => {
        api.put(`/users/${customer_id}`, {
            deactivated: userData?.deactivated === 'true' ? 'false' : 'true'
        }).then(() => {
            userMutate();
            toast({
                title: 'Updated',
                description: 'User Status Updated successfully',
            });
        }).catch((error) => {
            console.error(error);
            toast({
                title: error.response.data.code,
                description: error.response.data.message,
            });
        }).finally(() => {
            setSelectedOrderId('');
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="col-span-2">
                {
                    customerOrdersError
                        ? <Alert>
                            <ExclamationTriangleIcon className="h-4 w-4"/>
                            <AlertTitle>Something went wrong</AlertTitle>
                            <AlertDescription>
                                Sorry, there is something wrong with internet.
                            </AlertDescription>
                        </Alert>
                        : <SimpleTable
                            title="Orders"
                            subTitle="List of all orders of this user"
                            tableHeader={
                                <TableRow>
                                    <TableHead>Order Id</TableHead>
                                    <TableHead className="hidden md:table-cell">Items</TableHead>
                                    <TableHead className="hidden md:table-cell">Delivery Charge</TableHead>
                                    <TableHead>Total Cost</TableHead>
                                    <TableHead>Delivery Date</TableHead>
                                    <TableHead>Prescription</TableHead>
                                    <TableHead>Cash Memo</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            }
                            tableBody={
                                customerOrdersLoading
                                    ? <Fragment>
                                        <TableRow>
                                            <TableCell className="hidden sm:table-cell">
                                                <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Skeleton className="h-6 w-3/4"/>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-6 w-1/2"/>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-1/4"/>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-6 w-1/4"/>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-6"/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="hidden sm:table-cell">
                                                <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Skeleton className="h-6 w-3/4"/>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-6 w-1/2"/>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-1/4"/>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-6 w-1/4"/>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-6"/>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="hidden sm:table-cell">
                                                <Skeleton className="aspect-square rounded-md object-cover h-16 w-16"/>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Skeleton className="h-6 w-3/4"/>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-6 w-1/2"/>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-1/4"/>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Skeleton className="h-6 w-1/4"/>
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-6"/>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                    : customerOrders?.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.transactionId}</TableCell>
                                            <TableCell
                                                className="hidden md:table-cell">{MedicineUtils.getNamesFromOrderItems(order.orderItems)}</TableCell>
                                            <TableCell className="hidden md:table-cell">{order.deliveryCharge}</TableCell>
                                            <TableCell>{order.totalAmount}</TableCell>
                                            <TableCell>{order.deliveryDate}</TableCell>
                                            <TableCell>
                                                {
                                                    !order.prescriptionUrl
                                                        ? <span className="text-muted-foreground">No Prescription</span>
                                                        : <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    className="w-fit h-fit p-0"
                                                                    variant="ghost"
                                                                    onClick={() => {
                                                                        setSelectedOrderId(order.id);
                                                                        setOpenImageViewModal(true);
                                                                    }}
                                                                >
                                                                    <img
                                                                        alt="customr prescription"
                                                                        className="aspect-square rounded-md object-cover"
                                                                        height="64"
                                                                        src={order.prescriptionUrl}
                                                                        width="64"
                                                                    />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>{'See Prescription'}</TooltipContent>
                                                        </Tooltip>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <DownloadPdfButton
                                                            url={'https://morth.nic.in/sites/default/files/dd12-13_0.pdf'}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>{'Download Cash Memo'}</TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={order.status === OrderStauts.INITIATED ? 'default' : 'secondary'}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        />
                }
            </div>
            <div className="col-span-1">
                {
                    userIsLoading ? <div><ProfileCardLoader/></div>
                        : <Card className="rounded">
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>
                                    Used to identify your store in the marketplace.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <Label htmlFor="userName">Profile Picture</Label>
                                <div className={'w-[6rem] rounded-full h-[6rem] mx-auto border'}>
                                    <img src={userData?.profilePictureUrl}/>
                                </div>
                                <Label htmlFor="userName">Name</Label>
                                <Input
                                    id="userName"
                                    type="text"
                                    className="w-full"
                                    placeholder="User Name"
                                    disabled={true}
                                    value={userData?.userName}
                                />

                                <Label htmlFor="phoneNumber">Phone</Label>
                                <Input
                                    id="phoneNumber"
                                    type="text"
                                    className="w-full"
                                    placeholder="phone number"
                                    disabled={true}
                                    value={userData?.phoneNumber}
                                />

                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    className="w-full"
                                    placeholder="address"
                                    disabled={true}
                                    value={userData?.address}
                                />
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button variant={userData?.deactivated === 'true' ? 'default' : 'destructive'}
                                        onClick={() => setOpenDeactivateModal(true)}
                                >
                                    {
                                        userData?.deactivated === 'true'
                                            ? 'Activate'
                                            : 'Deactivate'
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                }

            </div>
            <Modal isOpen={openImageViewModal} onClose={() => {
                setSelectedOrderId('');
                setOpenImageViewModal(false);
            }} title={'View Prescription'}>
                {
                    selectedOrderId
                    && <div>
                        <img
                            alt="customr prescription"
                            className="rounded-md object-cover"
                            src={customerOrders?.find((order) => order.id === selectedOrderId)?.prescriptionUrl}
                        />
                    </div>
                }
            </Modal>
            <Modal isOpen={openDeactivateModal} onClose={() => {
                setOpenDeactivateModal(false);
            }} title={'Deactivate User'}>
                <div>
                    <div className="text-lg font-normal">Are you sure you want to delete this order?</div>
                    <div className="flex gap-2 mt-4">
                        <Button variant={'outline'} onClick={() => {

                        }}>Cancel</Button>
                        <Button
                            variant={userData?.deactivated === 'true' ? 'default' : 'destructive'}
                            onClick={async () => {
                                await toggleUserDeactivationStatus();
                                setSelectedOrderId('');
                                setOpenDeactivateModal(false);
                            }}>
                            {
                                userData?.deactivated === 'true'
                                    ? 'Activate'
                                    : 'Deactivate'
                            }
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};


