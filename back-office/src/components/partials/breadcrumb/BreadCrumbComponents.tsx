import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadCrumbProps = {
    data: string;
};

const BreadCrumbComponents: React.FC<BreadCrumbProps> = ( { data }) => {
  const splitData = data.split("/");
  const bc  = splitData.map((item : string, index : number) => {
    return (
      <BreadcrumbItem key={index}>
        <BreadcrumbLink className={`${index !== (splitData.length-1) && "text-red-700"}`}href={`/${item}`}>{item}</BreadcrumbLink>
      </BreadcrumbItem>
    );
  })
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {bc}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbComponents;
