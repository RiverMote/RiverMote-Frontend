interface StatCardProps {
    label: string;
    value: string;
    // Optional context string shown below the value (e.g. "good" / "elevated")
    note?: string;
    noteColor?: string;
}

export default function StatCard({ label, value, note, noteColor = "text-slate-500" }: StatCardProps) {
    return (
        <div className="panel px-4 py-3 flex flex-col gap-1">
            <span className="text-xs text-slate-600 uppercase tracking-widest">{label}</span>
            <span className="data-value-lg text-slate-500">{value}</span>
            {note && <span className={`text-xs font-mono ${noteColor}`}>{note}</span>}
        </div>
    );
}
