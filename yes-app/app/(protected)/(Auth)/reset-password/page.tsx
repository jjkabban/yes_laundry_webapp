import ResetPasswordForm from "@/components/form/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="min-h-screen bg-[#FBFAF7] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-[1.75rem] bg-white border border-black/[0.04] shadow-[0_20px_50px_-24px_rgba(10,25,41,0.15)] overflow-hidden">
          <div className="p-8 md:p-10">
            <ResetPasswordForm token={token ?? null} />
          </div>
        </div>
      </div>
    </main>
  );
}
