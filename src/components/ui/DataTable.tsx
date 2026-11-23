import { cn } from "@/lib/utils/cn";

export function DataTable({ headers, rows, className }: { headers: string[]; rows: (string | React.ReactNode)[][]; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-200">
            {headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-semibold text-brand-800">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-brand-100">
              {row.map((cell, j) => <td key={j} className="px-3 py-2 text-brand-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
