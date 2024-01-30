import { Avatar, Button, AvatarIcon } from "@nextui-org/react";
import { signIn, useSession } from "next-auth/react";

import { forwardRef } from "react";

const UserButton = forwardRef((props, ref: any) => {
  const session = useSession();
  if (session.status === "loading") return <Avatar icon={null}></Avatar>;
  const user = session.data?.user;
  if (!user) return <Button onClick={() => signIn()}>登陆</Button>;
  console.log(user);
  return (
    <Avatar
      ref={ref}
      {...props}
      className={"cursor-pointer"}
      name={user.name || ""}
      src={user.image || ""}
    ></Avatar>
  );
});
export default UserButton;
