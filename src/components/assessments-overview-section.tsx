"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";

import { ArrowUpDown } from "lucide-react";
import { Assessment } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StartNewAssessmentDialog } from "./start-new-assessment-dialog";
import { UpdateAssessmentDialog } from "./update-assessment-dialog";
import { formatStatus } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";
import { useDebounce } from "@/hooks/use-debounce";

type ApiResponse = {
  assessments: Assessment[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    pageCount: number;
  };
};

function prepareColumns(handleUpdate: () => void) {
  const columns: ColumnDef<Assessment>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Assessment Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatStatus(row.getValue("status")),
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => {
        const score = row.getValue("score") as number | null;
        return score !== null ? `${score}%` : "N/A";
      },
    },
    {
      accessorKey: "dateAssigned",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Assigned
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        new Date(row.getValue("dateAssigned")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const assessment = row.original;
        return (
          <UpdateAssessmentDialog
            assessment={assessment}
            onUpdate={handleUpdate}
          />
        );
      },
    },
  ];

  return columns;
}

export function AssessmentsOverviewSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("dateAssigned");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [titleFilter, setTitleFilter] = useState("");
  const debouncedSearch = useDebounce(titleFilter, 700);

  const [{ data, loading, error }, fetchAssessments] =
    useApi<ApiResponse>("/api/assessments");

  useEffect(() => {
    fetchAssessments({
      method: "GET",
      queryParams: {
        page: currentPage,
        perPage,
        sortBy,
        sortOrder,
        search: debouncedSearch,
      },
    });
  }, [
    fetchAssessments,
    currentPage,
    perPage,
    sortBy,
    sortOrder,
    debouncedSearch,
  ]);

  const handlePaginationChange = (newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSortingChange = (columnId: string, desc: boolean) => {
    setSortBy(columnId);
    setSortOrder(desc ? "desc" : "asc");
  };

  const handleTitleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleUpdate = () => {
    fetchAssessments({
      method: "GET",
      queryParams: {
        page: currentPage,
        perPage,
        sortBy,
        sortOrder,
        search: debouncedSearch,
      },
    });
  };

  function renderPagination() {
    return (
      <div className="flex items-center justify-between flex-wrap gap-4 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Per page</span>
          <Select
            value={perPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePaginationChange(currentPage - 2)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {data?.pagination.pageCount || 1}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePaginationChange(currentPage)}
            disabled={currentPage === (data?.pagination.pageCount || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Assessments Overview</h2>
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <Input
          placeholder="Filter by title"
          value={titleFilter}
          onChange={handleTitleFilterChange}
          className="max-w-xs"
        />
        <StartNewAssessmentDialog />
      </div>
      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <DataTable
          columns={prepareColumns(handleUpdate)}
          data={data?.assessments || []}
          pageCount={data?.pagination.pageCount || 0}
          onPaginationChange={handlePaginationChange}
          onSortingChange={handleSortingChange}
          paginationComponent={renderPagination()}
        />
      )}
    </section>
  );
}

function TableSkeleton() {
  const columns = 4;
  const rows = 5;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-6 w-24" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: columns }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
