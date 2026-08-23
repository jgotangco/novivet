import { Ticket, Plus } from "lucide-react";
import { store } from "@/db";

export default async function StaffVouchersPage() {
  const vouchers = await store.getVouchers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Promotions & Discount Vouchers</h1>
          <p className="text-xs text-slate-500">Create and distribute promotional promo codes in Philippine Pesos (₱).</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Ticket className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Voucher Manager Online</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Configure seasonal discount codes, percent markdowns, or fixed peso coupons for vaccination drives.
        </p>
      </div>
    </div>
  );
}
