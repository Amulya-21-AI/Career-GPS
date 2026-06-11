import { notFound } from "next/navigation";
import { getCareerById, careers } from "@/data/careers";
import CareerDetailClient from "@/components/career/CareerDetailClient";

export async function generateStaticParams() {
  return careers.map((c) => ({ id: c.id }));
}

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const career = getCareerById(id);
  if (!career) notFound();
  return <CareerDetailClient career={career} />;
}
