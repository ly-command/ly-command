"use client";
import { Viewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import highlightSsr from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import "@/styles/github-markdown.scss";
export default function MarkdownComponent(props: {
  content: string;
  className?: string;
}) {
  const { content, className } = props;
  return (
    <div className={className}>
      <Viewer
        value={content}
        plugins={[gfm(), highlightSsr(), mediumZoom()]}
      ></Viewer>
    </div>
  );
}
