import { use } from "react";
import SiteLayout from "@/components/site-layout";
import DepartmentProfile from "./components/department-profile";

export default function DeptDetailPage({ params }: { params: Promise<{ dept: string }> }) {
  const { dept } = use(params);
  return <SiteLayout><DepartmentProfile slug={dept} /></SiteLayout>;
}
