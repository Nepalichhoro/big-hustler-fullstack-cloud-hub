"use client"; // ✅ required for Next.js App Router
/* Done for testing purposse only */
import React, { useEffect, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";

type RowData = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  city: string;
  country: string;
  company: string;
  jobTitle: string;
  salary: number;
  joinDate: string;
};

// Helpers for random mock data
const randomString = (len: number) =>
  Math.random()
    .toString(36)
    .substring(2, 2 + len);

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = () =>
  new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split("T")[0];

const RandomTable: React.FC = () => {
  // Hardcoded 12 resizable columns
  const columns: MRT_ColumnDef<RowData>[] = [
    { accessorKey: "id", header: "ID", size: 50, minSize: 40, maxSize: 120 },
    {
      accessorKey: "firstName",
      header: "First Name",
      size: 90,
      minSize: 60,
      maxSize: 200,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      size: 100,
      minSize: 70,
      maxSize: 220,
    },
    { accessorKey: "age", header: "Age", size: 60, minSize: 50, maxSize: 100 },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
      minSize: 120,
      maxSize: 400,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 150,
      minSize: 100,
      maxSize: 300,
    },
    {
      accessorKey: "city",
      header: "City",
      size: 90,
      minSize: 60,
      maxSize: 200,
    },
    {
      accessorKey: "country",
      header: "Country",
      size: 90,
      minSize: 60,
      maxSize: 200,
    },
    {
      accessorKey: "company",
      header: "Company",
      size: 110,
      minSize: 80,
      maxSize: 250,
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
      size: 140,
      minSize: 100,
      maxSize: 300,
    },
    {
      accessorKey: "salary",
      header: "Salary",
      size: 80,
      minSize: 60,
      maxSize: 150,
    },
    {
      accessorKey: "joinDate",
      header: "Join Date",
      size: 100,
      minSize: 80,
      maxSize: 200,
    },
  ];

  // state for data (empty on SSR, filled after mount)
  const [data, setData] = useState<RowData[]>([]);

  useEffect(() => {
    const rows: RowData[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      firstName: randomString(5),
      lastName: randomString(7),
      age: randomNumber(18, 65),
      email: `${randomString(5)}@example.com`,
      phone: `+1-${randomNumber(100, 999)}-${randomNumber(
        100,
        999
      )}-${randomNumber(1000, 9999)}`,
      city: randomString(6),
      country: randomString(6),
      company: randomString(8),
      jobTitle: randomString(10),
      salary: randomNumber(40000, 120000),
      joinDate: randomDate(),
    }));
    setData(rows);
  }, []);

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      layoutMode="grid" // ✅ required for resizing
      enableColumnResizing // ✅ allow manual resize
      defaultColumn={{
        minSize: 50,
        size: 100,
        maxSize: 600,
      }}
      initialState={{
        density: "compact",
      }}
      muiTablePaperProps={{
        sx: { width: "fit-content", maxWidth: "100%", mx: "auto" },
      }}
      muiTableContainerProps={{
        sx: { width: "fit-content", maxWidth: "100%", overflowX: "auto" },
      }}
    />
  );
};

export default RandomTable;
