import { use } from "react";
import BidangContent from "./components/bidang-content";

export default function BidangDetailPage({
  params,
}: {
  params: Promise<{ bidang: string }>;
}) {
  const { bidang } = use(params);

  return <BidangContent slug={bidang} />;
}
