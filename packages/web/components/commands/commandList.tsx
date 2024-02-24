"use client";
import { CommandData } from "@/app/user/[...name]/page";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link,
} from "@nextui-org/react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { Key, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime);
export default function CommandList(props: {
  commands: CommandData[];
  userId: string;
}) {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { commands = [], userId } = props;
  const session = useSession();
  // 判断当前用户是否有权限
  const hasPermission = useMemo(() => {
    const currentUserId = session.data?.user?.id;
    return currentUserId === userId;
  }, [session.data?.user?.id, userId]);

  const deleteCommand = async (command: CommandData) => {
    setIsDeletePopoverOpen(false);
    try {
      setLoading(true);
      const { success } = await fetch(`/api/command/${command.commandName}`, {
        method: "DELETE",
      }).then((r) => r.json());
      if (success) {
        // 删除成功后刷新页面
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // 定义渲染单元格的函数
  const renderCell = (command: CommandData, columnKey: Key) => {
    // 根据不同的列键进行渲染
    switch (columnKey) {
      case "commandName": {
        return (
          <Link
            className="text-blue-700 underline"
            href={`/command/${command.commandName}`}
          >
            {command.commandName}
          </Link>
        );
      }
      case "downloadCount": {
        return command._sum?.downloadCount;
      }
      case "createdAt": {
        return dayjs(command._max?.createdAt).locale("zh-cn").fromNow();
      }
      case "operate": {
        return (
          <Popover
            isOpen={isDeletePopoverOpen}
            onOpenChange={setIsDeletePopoverOpen}
            placement="top"
            showArrow
            backdrop="opaque"
          >
            <PopoverTrigger>
              <Button color="danger" size="sm">
                删除
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="my-2 text-danger">删除后不可恢复,确认删除？</div>

              <div className="mb-2">
                <Button
                  isLoading={isLoading}
                  color="danger"
                  size="sm"
                  onClick={() => deleteCommand(command)}
                >
                  确认删除
                </Button>
                <Button
                  className="ml-2"
                  size="sm"
                  onClick={() => setIsDeletePopoverOpen(false)}
                >
                  取消
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        );
      }
      default:
        return null;
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableColumn key={"commandName"}>命令</TableColumn>
        <TableColumn key={"downloadCount"}>下载量</TableColumn>
        <TableColumn key={"createdAt"}>发布时间</TableColumn>
        {hasPermission ? (
          <TableColumn key={"operate"}>操作</TableColumn>
        ) : (
          <TableColumn key={"none"}>{""}</TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"无数据"}>
        {commands.map((command) => (
          <TableRow key={command.commandName}>
            {(columnKey) => (
              <TableCell>{renderCell(command, columnKey)}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
