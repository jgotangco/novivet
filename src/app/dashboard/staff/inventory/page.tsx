import Link from "next/link";
import { Plus, Package, AlertCircle, ShoppingBag, Truck } from "lucide-react";
import { store } from "@/db";

export default async function InventoryPage() {
  const inventory = await store.getInventory();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Pharmacy & Clinical Inventory</h1>
          <p className="text-xs text-slate-500">Species-specific pharmaceuticals, biologicals, consumables, and emergency stock.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/staff/inventory/suppliers"
            className="py-2 px-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Suppliers</span>
          </Link>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Package className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Species Inventory Managed</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Vaccines, surgical consumables, and prescription items are tracked with real-time stock levels and low-inventory warnings.
        </p>
      </div>
    </div>
  );
}
