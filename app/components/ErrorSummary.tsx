export interface ErrorSummaryProps {
  dobError?: string | null;
  salaryError?: string | null;
  dateError?: string | null;
}

export default function ErrorSummary({
  dobError,
  salaryError,
  dateError,
}: ErrorSummaryProps) {
  if (!dobError && !salaryError && !dateError) return null;
  return (
    <div className="col-span-full flex space-x-4">
      {dobError && <span className="text-red-600 text-sm">{dobError}</span>}
      {salaryError && (
        <span className="text-red-600 text-sm">{salaryError}</span>
      )}
      {dateError && <span className="text-red-600 text-sm">{dateError}</span>}
    </div>
  );
}
