import { TASKS } from "@/lib/tasks";
import TaskPageClient from "./TaskPageClient";

export function generateStaticParams() {
  return TASKS.map((t) => ({ id: t.id }));
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TaskPageClient id={id} />;
}
