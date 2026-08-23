"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BadgeDollarSign, 
  Plus, 
  Search, 
  Filter, 
  Dog, 
  Cat, 
  Globe, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  X, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { formatCurrency, SupportedCurrency, CURRENCY_RATES } from "@/lib/utils";

export default function StaffServicesPricingPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>("PHP");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const currencies: SupportedCurrency[] = ["PHP", "USD", "EUR", "GBP", "SGD", "JPY", "AUD"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-1">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Multi-Currency Fee Catalog</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Clinical Service Tariffs & Fees</h1>
          <p className="text-xs text-slate-500">Universal procedure pricing defaulting to Philippine Pesos (₱ / PHP).</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 pl-2">Display:</span>
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCurrency(c)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                selectedCurrency === c ? "bg-amber-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {CURRENCY_RATES[c]?.symbol} {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {s.code}
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {s.category}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">{s.name}</h3>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Base Price:</span>
              <span className="text-base font-black text-slate-900 font-mono">
                {formatCurrency(s.basePricePhp, selectedCurrency)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
