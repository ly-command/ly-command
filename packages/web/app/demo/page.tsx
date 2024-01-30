"use client";
const Page = () => {
  return (
    <input
      type="file"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/file", {
            method: "POST",
            body: formData,
          });
          const { name, url } = await res.json();
          const ret = await fetch("/api/command", {
            method: "POST",
            body: JSON.stringify({
              version: "0.0.1",
              commandName: name,
              packageJSON: {},
              zipUrl: url,
            }),
          });
          console.log(await ret.json());
        }
      }}
    />
  );
};

export default Page;
