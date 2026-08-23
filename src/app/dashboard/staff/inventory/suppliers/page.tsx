import { Truck, Phone, Mail, MapPin } from "lucide-react";

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Pharmaceutical & Equipment Suppliers</h1>
        <p className="text-xs text-slate-500">Authorized veterinary distributors, delivery lead times, and contact points.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Authorized Suppliers Active</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Supplier directory configured for Zoetis Philippines, Boehringer Ingelheim Animal Health, and Royal Canin.
        </p>
      </div>
    </div>
  );
}
