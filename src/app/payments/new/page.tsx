import { prisma } from "@/lib/prisma";
import PaymentForm from "./PaymentForm";
import Link from "next/link";

export default async function NewPaymentPage({ searchParams }: { searchParams: { packageId?: string } }) {
  const packageId = searchParams.packageId;

  if (!packageId) {
    return <div className="p-8 text-center text-red-600 font-bold">لم يتم تحديد باقة. <Link href="/packages" className="underline">اختر باقة أولاً</Link></div>;
  }

  const paymentSettings = await prisma.paymentSetting.findMany({
    where: { isActive: true }
  });

  const pkg = await prisma.package.findUnique({
    where: { id: packageId }
  });

  if (!pkg) {
    return <div className="p-8 text-center text-red-600 font-bold">الباقة غير موجودة. <Link href="/packages" className="underline">اختر باقة أخرى</Link></div>;
  }

  return <PaymentForm packageId={packageId} packagePrice={pkg.priceETB} settings={paymentSettings} />;
}