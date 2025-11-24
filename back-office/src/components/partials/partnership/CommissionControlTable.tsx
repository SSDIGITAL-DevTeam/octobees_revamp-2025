"use client"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Badge from "@/components/ui/Badge"
import type { CommissionItem } from "@/constrant/partnership"

type CommissionControlTableProps = {
  items: CommissionItem[]
  onEdit?: (item: CommissionItem) => void
  onDelete?: (item: CommissionItem) => void
}

export const CommissionControlTable = ({ items, onEdit, onDelete }: CommissionControlTableProps) => {
  const handleEdit = (item: CommissionItem) => onEdit?.(item)
  const handleDelete = (item: CommissionItem) => onDelete?.(item)

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-white shadow-sm px-5 py-2">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 text-sm text-slate-500">
            <TableHead>Service Name</TableHead>
            <TableHead>Project Value</TableHead>
            <TableHead>Commission %</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-left">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-semibold text-slate-900">{item.serviceName}</TableCell>
              <TableCell>{item.projectValue}</TableCell>
              <TableCell>
                <Badge category="status" variant="closed">
                  {item.commissionPercentage}%
                </Badge>
              </TableCell>
              <TableCell className="text-slate-600">{item.description}</TableCell>
              <TableCell>
                <div className="flex justify-left gap-3 text-slate-500">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-slate-100"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4 text-amber-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-slate-100"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CommissionControlTable
