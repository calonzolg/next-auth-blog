import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: blogs, error } = await supabase
    .from("blogs")
    .select(
      "id, title, content, slug, created_at, user_id, user_id, profile:profiles(id, first_name, last_name, email)"
    )
    .eq("user_id", user.id);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>

      <div>
        <Link href="/dashboard/blog/create">
          <Button>Create a new Blog Entry</Button>
        </Link>

        <Table>
          <TableCaption>A list of your recent blog entries.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>content</TableHead>
              <TableHead>slug</TableHead>
              <TableHead className="text-right">created at</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!error &&
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.content}</TableCell>
                  <TableCell>{blog.slug}</TableCell>
                  <TableCell>{blog.created_at}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/dashboard/blog/${blog.id}/edit`}>
                      <Button>Edit</Button>
                    </Link>
                    <Link href={`/${blog.slug}`}>
                      <Button>View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
