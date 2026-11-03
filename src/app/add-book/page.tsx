"use client";

import { useState, type FormEvent } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const categories = ["Fiction", "Science", "History", "Kids", "Others"];

function AddBookContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const currentUserName = (user?.name || "").trim();
    const currentUserEmail = (user?.email || "").trim();

    if (!currentUserEmail) {
      setErrorMessage("Your session could not be verified. Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    const bookData = {
      title: formData.get("title"),
      author: formData.get("author"),
      category: formData.get("category"),
      totalCopies: Number(formData.get("totalCopies")),
      image: formData.get("image"),
      description: formData.get("description"),
      userName: currentUserName,
      userEmail: currentUserEmail,
    };

    try {
      const res = await fetch(`${API_URL}/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        throw new Error("Failed to add book to the server. Please try again.");
      }

      setSuccessMessage("Book added successfully to the library!");
      form.reset();
    } catch (err: unknown) {
      console.error("Error adding book:", err);
      const msg =
        err instanceof Error ? err.message : "Could not connect to server.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1510] text-[#edf2ed]">
      <header className="border-b border-white/10 bg-[#142119] px-5 py-9 text-center sm:py-10">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Add a Book
        </h1>
        <p className="mt-2 text-sm text-white/55">
          Put a book from your shelf into the library.
        </p>
      </header>

      <section className="mx-auto w-full max-w-[640px] px-4 py-8 sm:px-6 sm:py-9">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. The Hobbit"
                className="h-9 border-white/15 bg-white/[0.045] text-white"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="author">Author Name</Label>
              <Input
                id="author"
                name="author"
                required
                placeholder="e.g. J.R.R. Tolkien"
                className="h-9 border-white/15 bg-white/[0.045] text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="Fiction">
                <SelectTrigger
                  id="category"
                  className="h-9 w-full border-white/15 bg-white/[0.045] text-white"
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min={1}
                defaultValue={1}
                required
                className="h-9 border-white/15 bg-white/[0.045] text-white"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="image"
              type="url"
              placeholder="https://example.com/cover.jpg"
              required
              className="h-9 border-white/15 bg-white/[0.045] text-white"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Write a brief synopsis of the book..."
              className="min-h-14 border-white/15 bg-white/[0.045] text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="userName">Your Name</Label>
              {/* [FIX]: লগইন করা ইউজারের নাম readOnly হিসেবে বসানো হলো যাতে পরিবর্তন করা না যায় */}
              <Input
                id="userName"
                name="userName"
                readOnly
                value={user?.name || ""}
                className="h-9 cursor-not-allowed border-white/10 bg-white/[0.035] text-white/65"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="userEmail">Your Email</Label>
              {/* [FIX]: লগইন করা ইউজারের ইমেইল readOnly হিসেবে বসানো হলো যাতে পরিবর্তন করা না যায় */}
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                readOnly
                value={user?.email || ""}
                className="h-9 cursor-not-allowed border-white/10 bg-white/[0.035] text-white/65"
              />
            </div>
          </div>

          {successMessage && (
            <p role="status" className="text-sm font-medium text-[#8fd3a7]">
              ✓ {successMessage}
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="text-sm font-medium text-red-400">
              ✕ {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-0.5 h-9 w-full bg-[#8fd3a7] font-medium text-[#102016] hover:bg-[#a4e3b8]"
          >
            {isSubmitting ? "Adding Book..." : "Add Book"}
          </Button>
        </form>
      </section>
    </main>
  );
}

// [PRIVATE ROUTE]: add-book রুটটিকে PrivateRoute দিয়ে সুরক্ষিত করা হলো
// শুধুমাত্র লগইন করা ইউজাররা বই যোগ করতে পারবে
export default function AddBookPage() {
  return (
    <PrivateRoute>
      <AddBookContent />
    </PrivateRoute>
  );
}
