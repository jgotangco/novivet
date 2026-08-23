import { Mail, Sparkles, Send, Users } from "lucide-react";

export default function ReEngagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Automated Patient Re-Engagement</h1>
        <p className="text-xs text-slate-500">Automated SMS/Email reminders for annual rabies boosters, geriatric exams, and dental care.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Automated Follow-up Engine Active</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The cron trigger checks overdue vaccine dates daily and delivers proactive reminders to registered fur parents.
        </p>
      </div>
    </div>
  );
}
