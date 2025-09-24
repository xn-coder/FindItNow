
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { getAllItems, deleteItem, resolveItem } from "@/lib/actions";
import type { Item } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Trash2, CheckCircle, Loader2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function ItemManagementPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const fetchedItems = await getAllItems();
      setItems(fetchedItems as Item[]);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch items." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleDeleteRequest = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    startTransition(async () => {
      try {
        await deleteItem(itemToDelete.id);
        toast({ title: t('adminItemDeleted'), description: t('adminItemDeletedDesc', { name: itemToDelete.name }) });
        await fetchItems(); // Re-fetch items after deletion
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete the item." });
      } finally {
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    });
  };

  const handleResolve = (item: Item) => {
    startTransition(async () => {
      try {
        await resolveItem(item.id);
        toast({ title: t('adminItemResolved'), description: t('adminItemResolvedDesc', { name: item.name }) });
        await fetchItems(); // Re-fetch items
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to resolve the item." });
      }
    });
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('adminItemsTitle')}</CardTitle>
            <CardDescription>{t('adminItemsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('adminItemsSearchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Card className="border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('adminItemsHeaderName')}</TableHead>
                    <TableHead>{t('adminItemsHeaderType')}</TableHead>
                    <TableHead>{t('adminItemsHeaderStatus')}</TableHead>
                    <TableHead>{t('adminItemsHeaderCategory')}</TableHead>
                    <TableHead>{t('adminItemsHeaderDate')}</TableHead>
                    <TableHead className="text-right">{t('adminItemsHeaderActions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'lost' ? 'destructive' : 'default'}>
                            {t(item.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'open' ? 'outline' : 'secondary'}>
                            {t(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.createdAt ? (item.createdAt as Date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                                <span className="sr-only">Open menu</span>
                                 {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t('adminItemsHeaderActions')}</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/edit-item/${item.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t('edit')}
                                </Link>
                              </DropdownMenuItem>
                              {item.status === 'open' && (
                                <DropdownMenuItem onClick={() => handleResolve(item)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {t('adminMarkResolved')}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteRequest(item)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">{t('adminNoItemsFound')}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('adminDeleteItemTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('adminDeleteItemDesc', { name: itemToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
