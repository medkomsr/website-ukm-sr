import { Suspense } from "react";
import SiteLayout from "@/components/layout/site-layout";
import ContentData from "@/components/content/content-data";
import ContentSkeleton from "@/components/content/content-skeleton";
import DepartmentProfile from "@/features/departments/components/department-profile";

type Props = { params: Promise<{ dept: string }> };

async function Detail({ params }: Props) {
  const { dept: slug } = await params;
  return (
    <ContentData page="department" slug={slug}>
      <DepartmentProfile key={slug} slug={slug} />
    </ContentData>
  );
}

export default function DeptDetailPage({ params }: Props) {
  return (
    <SiteLayout>
      <Suspense fallback={<ContentSkeleton />}>
        <Detail params={params} />
      </Suspense>
    </SiteLayout>
  );
}
