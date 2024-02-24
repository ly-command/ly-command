"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { Command } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { Key, useCallback } from "react";
import Link from "next/link";
dayjs.extend(relativeTime);
export default function CommandVersionList({ data }: { data: Command[] }) {
  const columns = [
    {
      key: "version",
      label: "版本",
    },
    {
      key: "downloadCount",
      label: "下载量",
    },
    {
      key: "createdAt",
      label: "发布时间",
    },
  ];
  const renderCell = useCallback((command: Command, columnKey: Key) => {
    const value = getKeyValue(command, columnKey);
    if (columnKey === "createdAt") {
      return dayjs(value).locale("zh-cn").fromNow();
    }
    if (columnKey === "version") {
      return (
        <Link
          className="text-blue-700 underline"
          href={`/command/${command.commandName}?version=${command.version}`}
        >
          {value}
        </Link>
      );
    }
    return value;
  }, []);

  return (
    <Table>
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((command) => (
          <TableRow key={command.id}>
            {(columnKey) => (
              <TableCell>{renderCell(command, columnKey)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
