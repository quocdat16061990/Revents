import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrderSummary } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils';
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react';
import { Metadata } from 'next';
import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-guard';
import Charts from './charts';
import { Button } from '@/components/ui/button';


export const metadata: Metadata = {
      title: 'Admin Dashboard',
};

const AdminOverviewPage = async () => {
      await requireAdmin();
      const session = await auth();

      // Make sure the user is an admin
      if (session?.user.role !== 'ADMIN')
            throw new Error('admin permission required');

      // Get order summary
      const summary = await getOrderSummary();

      return (
            <div className='space-y-2'>
                  <h1 className='h2-bold'>Dashboard</h1>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <Card>
                              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                                    <BadgeDollarSign />
                              </CardHeader>
                              <CardContent>
                                    <div className='text-2xl font-bold'>
                                          {summary.totalSales._sum.totalPrice && formatCurrency(summary.totalSales._sum.totalPrice!.toString())}
                                    </div>
                              </CardContent>
                        </Card>
                        <Card>
                              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>Sales</CardTitle>
                                    <CreditCard />
                              </CardHeader>
                              <CardContent>
                                    <div className='text-2xl font-bold'>
                                          {formatNumber(summary.ordersCount)}
                                    </div>
                              </CardContent>
                        </Card>
                        <Card>
                              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>Customers</CardTitle>
                                    <Users />
                              </CardHeader>
                              <CardContent>
                                    <div className='text-2xl font-bold'>{summary.usersCount}</div>
                              </CardContent>
                        </Card>
                        <Card>
                              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>Products</CardTitle>
                                    <Barcode />
                              </CardHeader>
                              <CardContent>
                                    <div className='text-2xl font-bold'>{summary.productsCount}</div>
                              </CardContent>
                        </Card>
                  </div>
                  <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                        <Card className='col-span-4'>
                              <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                              </CardHeader>
                              <CardContent className='pl-2'>
                                    <Charts
                                          data={{
                                                salesData: summary.salesData,
                                          }}
                                    />
                              </CardContent>
                        </Card>
                        <Card className='col-span-3'>
                              <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                              </CardHeader>
                              <CardContent>
                                    <Table>
                                          <TableHeader>
                                                <TableRow>
                                                      <TableHead>BUYER</TableHead>
                                                      <TableHead>EMAIL</TableHead>
                                                      <TableHead>DATE</TableHead>
                                                      <TableHead>TOTAL</TableHead>
                                                      <TableHead>STATUS</TableHead>
                                                      <TableHead>ACTIONS</TableHead>
                                                </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                                {summary.latestOrders.map((order) => (
                                                      <TableRow key={order.id}>
                                                            <TableCell className="font-medium">
                                                                  {order.user?.name || 'Deleted user'}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-500">
                                                                  {order.user?.email || '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                  {formatDateTime(order.createdAt).dateTime}
                                                            </TableCell>
                                                            <TableCell className="font-semibold">
                                                                  {formatCurrency(order.totalPrice.toString())}
                                                            </TableCell>
                                                            <TableCell>
                                                                  <div className="flex flex-col gap-1">
                                                                    <span className={order.isPaid ? 'text-green-600' : 'text-red-600'}>
                                                                      {order.isPaid ? '✓ Paid' : '✗ Not Paid'}
                                                                    </span>
                                                                    <span className={order.isDelivered ? 'text-green-600' : 'text-gray-500'}>
                                                                      {order.isDelivered ? '✓ Delivered' : '⏳ Pending'}
                                                                    </span>
                                                                  </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                  <Link href={`/order/${order.id}`}>
                                                                        <Button variant='outline' size='sm'>
                                                                              View
                                                                        </Button>
                                                                  </Link>
                                                            </TableCell>
                                                      </TableRow>
                                                ))}
                                          </TableBody>
                                    </Table>
                              </CardContent>
                        </Card>
                  </div>
            </div>
      );
};

export default AdminOverviewPage;