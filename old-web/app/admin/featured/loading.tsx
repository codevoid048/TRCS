import LoadingSpinner from "../components/LoadingSpinner"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-96">
      <LoadingSpinner text="Loading featured cycles..." />
    </div>
  )
}
