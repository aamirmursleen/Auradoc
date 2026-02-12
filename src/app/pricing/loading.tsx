export default function PricingLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-[#0d9488] rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading pricing...</p>
      </div>
    </div>
  )
}
