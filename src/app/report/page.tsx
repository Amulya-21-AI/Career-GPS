"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import GPSReport from "@/components/report/GPSReport";

export default function ReportPage() {
  const { report } = useQuizStore();
  const router = useRouter();

  useEffect(() => {
    if (!report) router.push("/quiz");
  }, [report, router]);

  if (!report) return null;

  return <GPSReport report={report} />;
}
