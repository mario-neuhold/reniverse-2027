import type { Metadata } from "next";
import { VideoTable } from "@/components/VideoTable";

export const metadata: Metadata = { title: "Reniverse · Table" };

export default function TablePage() {
  return <VideoTable />;
}
