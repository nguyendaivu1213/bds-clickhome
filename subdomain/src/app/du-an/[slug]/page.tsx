import { redirect } from "next/navigation";
import { use } from "react";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  redirect(`/du-an/${slug}/tong-quan`);
}
