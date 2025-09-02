
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { getAllUsers, getAllPartners } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Ban, UserX, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type CombinedUser = {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Partner';
  createdAt: string; // Changed to string for serialization
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<CombinedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const regularUsers = await getAllUsers();
        const partnerUsers = await getAllPartners();

        const combined: CombinedUser[] = [
          ...regularUsers.map(u => ({
            id: u.id,
            name: u.email.split('@')[0], // Use part of email as name for now
            email: u.email,
            role: 'User' as const,
            createdAt: u.createdAt,
          })),
          ...partnerUsers.map(p => ({
            id: p.id,
            name: p.businessName,
            email: p.email,
            role: 'Partner' as const,
            createdAt: p.createdAt,
          })),
        ];

        // Sort combined list by creation date
        combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setUsers(combined);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleSuspend = (user: CombinedUser) => {
    startTransition(() => {
        // Placeholder for actual suspend logic
        console.log(`Suspending user: ${user.email}`);
        toast({ title: t('adminUserSuspended'), description: t('adminUserSuspendedDesc', { email: user.email }) });
    });
  }

  const handleBan = (user: CombinedUser) => {
      startTransition(() => {
        // Placeholder for actual ban logic
        console.log(`Banning user: ${user.email}`);
        toast({ title: t('adminUserBanned'), description: t('adminUserBannedDesc', { email: user.email }), variant: "destructive" });
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('adminUsersTitle')}</CardTitle>
          <CardDescription>{t('adminUsersDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('adminUsersSearchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Card className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('adminUsersHeaderName')}</TableHead>
                  <TableHead>{t('adminUsersHeaderEmail')}</TableHead>
                  <TableHead>{t('adminUsersHeaderRole')}</TableHead>
                  <TableHead>{t('adminUsersHeaderRegistered')}</TableHead>
                  <TableHead className="text-right">{t('adminUsersHeaderActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Partner' ? 'secondary' : 'outline'}>{t(user.role.toLowerCase())}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                                <span className="sr-only">Open menu</span>
                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t('adminUsersHeaderActions')}</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleSuspend(user)}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  {t('adminSuspendUser')}
                                </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleBan(user)}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                {t('adminBanUser')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">{t('adminNoUsersFound')}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

