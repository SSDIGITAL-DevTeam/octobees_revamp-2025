import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Lead } from "@/constrant/payload";
import { format } from "date-fns";

type Props = {
  children: React.ReactNode;
  lead: Lead;
  refetch: (refetch: boolean) => void;
};

export default function DialogLead({ children, lead, refetch }: Props) {
  const ListLead = [
    {
      name: "Name",
      value: lead?.name,
    },
    {
      name: "Email",
      value: lead?.email,
    },
    {
      name: "Phone",
      value: lead?.phone,
    },
    {
      name: "Company Name",
      value: lead?.companyName || "-",
    },
    {
      name: "Company Website",
      value: lead?.companyWebsite || "-",
    },
    {
      name: "Business Industry",
      value: lead?.business || "-",
    },
    {
      name: "Message",
      value: lead?.message || "-",
    },
    {
      name: "From Page",
      value: lead?.from || "-",
    },
    {
      name: "Referral Code",
      value: lead?.referralCode || "-",
    },
    {
      name: "Created At",
      value: lead?.createdAt
        ? format(new Date(lead.createdAt), "dd MMMM yyyy HH:mm")
        : "-",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-red-500 hover:text-red-700">{children}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
          <DialogDescription className="hidden">Lead Details</DialogDescription>
        </DialogHeader>
        <Table>
          <TableBody>
            {ListLead.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium w-[150px]">
                    {item.name}
                  </TableCell>
                  <TableCell className="break-all">{item.value}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
