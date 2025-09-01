
"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllUsers, getAllPartners } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type CombinedUser = {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Partner';
  createdAt: Date;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<CombinedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        combined.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View, search, and manage all users and partners on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Card className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right"><Skeleton className="h-5 w-12" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Partner' ? 'secondary' : 'outline'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {/* Action buttons will go here */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No users found.</TableCell>
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
