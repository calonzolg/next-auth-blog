"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

export default function BlogCreateForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formSchema = z.object({
    title: z.string().min(10, {
      message: "Username must be at least 10 characters.",
    }),
    content: z.string().min(140, {
      message: "Username must be at least 140 characters.",
    }),
    slug: z
      .string()
      .min(10, {
        message: "Username must be at least 10 characters.",
      })
      .regex(
        /^[a-z]+(-[a-z]+)*$/,
        "Invalid slug format. Use only lowercase letters and hyphens"
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      slug: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      setMessage("You must be logged in to create a blog.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          slug: values.slug,
          author_id: userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Blog created successfully!");
        form.reset();
      } else {
        setMessage(result.error || "Error creating the blog.");
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        {message && <p className="mb-4 text-green-600">{message}</p>}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My first blog" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="add your content here" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="first-blog-slug" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Blog"}
        </Button>
      </form>
    </Form>
  );
}
