import { redirect } from "next/navigation";
import BlogCreateForm from "./components/BlogCreateForm";
import { createClient } from "@/utils/supabase/server";

export default async function BlogCreatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-w-96 space-y-6">
      <div>Create Blog Entry</div>

      <BlogCreateForm userId={user.id} />
    </div>
  );
}
