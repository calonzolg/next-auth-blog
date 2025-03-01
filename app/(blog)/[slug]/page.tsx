import { createClient } from "@/utils/supabase/server";

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*, author:profiles(*)")
    .eq("slug", slug)
    .single();

  console.log({ data, error });

  return (
    <div className="space-y-4">
      <h1 className="text-5xl">{data.title}</h1>
      <section>{data.content}</section>

      <div>
        <p>
          <strong>Author:</strong> {data.author.first_name}{" "}
          {data.author.last_name}
        </p>
        <p>
          <strong>Email:</strong> {data.author.email}
        </p>
      </div>
    </div>
  );
}
