import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const BlogSchema = z.object({
  title: z.string().min(10, {
    message: "title must be at least 10 characters.",
  }),
  content: z.string().min(140, {
    message: "content must be at least 140 characters.",
  }),
  slug: z.string().min(10, {
    message: "slug must be at least 10 characters.",
  })
    .regex(
      /^[a-z]+(-[a-z]+)*$/,
      "Invalid slug format. Use only lowercase letters and hyphens",
    ),
  author_id: z.string().uuid(),
  blogId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const parsedData = BlogSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, {
        status: 400,
      });
    }

    const { title, content, slug, author_id } = parsedData.data;

    const { data, error } = await supabase
      .from("blogs")
      .insert([{ title, content, user_id: author_id, slug }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Blog created successfully!",
      blog: data,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const parsedData = BlogSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, {
        status: 400,
      });
    }

    const { title, content, slug, author_id, blogId } = parsedData.data;

    const { data, error } = await supabase
      .from("blogs")
      .update({ title, content, user_id: author_id, slug })
      .eq("id", blogId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Blog updated successfully!",
      blog: data,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { blogId } = body;

    const { data, error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", blogId);

    if (error) throw error;

    return NextResponse.json({
      message: "Blog deleted successfully!",
      blog: data,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, {
      status: 500,
    });
  }
}
