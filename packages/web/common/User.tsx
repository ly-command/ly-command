"use client";
import { User } from "@nextui-org/react";
import { useRouter } from "next/navigation";
interface IUserComponentProps {
  name?: string | null;
  avatar?: string | null;
}
export default function UserComponent(props: IUserComponentProps) {
  const { name, avatar } = props;
  const router = useRouter();
  return (
    <User
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(`/user/${name}`);
      }}
      name={name}
      avatarProps={{
        src: avatar ?? undefined,
        size: "sm",
      }}
    />
  );
}
