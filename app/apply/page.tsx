import Link from "next/link";

export default function ApplyPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900 px-4">
      <div className="text-center max-w-md">
        <p className="text-2xl sm:text-3xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">
          Application closed
        </p>
        <Link
          href="/"
          className="text-primary hover:underline font-medium"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
