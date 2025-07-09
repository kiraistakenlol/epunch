import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Eye } from 'lucide-react';
import { apiClient } from 'e-punch-common-ui';
import { UserDto } from 'e-punch-common-core';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { ROUTES } from '@/lib/cn';
import { toast } from 'sonner';

interface CustomerListResponse {
  customers: UserDto[];
  total: number;
  page: number;
  limit: number;
}

export function CustomersPage() {
  const navigate = useNavigate();
  const merchantId = useAppSelector((state) => state.merchant.merchant?.id);
  
  const [data, setData] = useState<CustomerListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchCustomers = async () => {
    if (!merchantId) return;
    
    setLoading(true);
    
    try {
      const response = await apiClient.getMerchantCustomers(
        merchantId,
        currentPage,
        pageSize,
        search || undefined,
        sortBy,
        sortOrder
      );
      setData(response);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error(error.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [merchantId, currentPage, pageSize, search, sortBy, sortOrder]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size));
    setCurrentPage(1);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const handleRowClick = (customer: UserDto) => {
    navigate(`${ROUTES.CUSTOMERS}/${customer.id}`);
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  if (loading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Customers</h1>
              <p className="text-muted-foreground">
                Manage your loyalty program customers
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {data ? `${data.total} total customers` : ''}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or ID..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 min-w-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('email')}
                    >
                      Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('created_at')}
                    >
                      Joined {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.customers.map((customer) => (
                    <TableRow 
                      key={customer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(customer)}
                    >
                      <TableCell className="font-medium">
                        {customer.email || 'Anonymous User'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.externalId ? 'default' : 'secondary'}>
                          {customer.externalId ? 'Registered' : 'Anonymous'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(customer.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleRowClick(customer);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {data?.customers.map((customer) => (
                <Card 
                  key={customer.id} 
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRowClick(customer)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1 break-all">
                        {customer.email || 'Anonymous User'}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={customer.externalId ? 'default' : 'secondary'} className="text-xs">
                          {customer.externalId ? 'Registered' : 'Anonymous'}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Joined: {formatDate(customer.createdAt)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                                             onClick={(e: React.MouseEvent) => {
                         e.stopPropagation();
                         handleRowClick(customer);
                       }}
                      className="ml-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {data?.customers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                <p className="text-muted-foreground">
                  {search ? 'No customers match your search criteria.' : 'No customers have used your loyalty programs yet.'}
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data?.total || 0)} of {data?.total} customers
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}