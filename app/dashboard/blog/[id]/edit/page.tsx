import { createClient } from "@/utils/supabase/server";
import BlogUpdateForm from "../../create/components/BlogUpdateForm";
import { redirect } from "next/navigation";
import BlogDeleteForm from "./components/BlogDeleteForm";

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const blogId = (await params).id;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: blog, error } = await supabase
    .from("blogs")
    .select(
      "id, title, content, slug, created_at, user_id, user_id, profile:profiles(id, first_name, last_name, email)"
    )
    .eq("user_id", user.id)
    .eq("id", blogId)
    .single();

  if (error) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-w-96 space-y-6">
      <div>Update Blog Entry</div>

      <BlogUpdateForm blog={blog} userId={user.id} />

      <BlogDeleteForm blogId={blog.id} />
    </div>
  );
}
