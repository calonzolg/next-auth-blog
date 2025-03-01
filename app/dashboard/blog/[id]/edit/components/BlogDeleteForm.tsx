"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";

export default function BlogDeleteForm({ blogId }: { blogId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onDelete() {
    try {
      const response = await fetch("/api/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: blogId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Blog delete successfully!");

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setMessage(result.error || "Error deleting the blog.");
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={onDelete} variant={"destructive"}>
        {loading ? "Deleting Blog" : "Delete Blog"}
      </Button>

      {message && <div className="text-green-400">{message}</div>}
    </>
  );
}
