import { Ticket } from "lucide-react";
import { store } from "@/db";

export default async function ParentVouchersPage() {
  const vouchers = await store.getVouchers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Promos & Wellness Vouchers</h1>
        <p className="text-xs text-slate-500">Redeem seasonal vaccination and dental care discounts.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Ticket className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Wellness Promo Vouchers</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Active vouchers and senior pet discounts are automatically applied to consultation and vaccination billing.
        </p>
      </div>
    </div>
  );
}
