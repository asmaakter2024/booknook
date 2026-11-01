"use client";

import { useState, type FormEvent } from "react";

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

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const bookData = {
      title: formData.get("title"),
      author: formData.get("author"),
      category: formData.get("category"),
      totalCopies: Number(formData.get("totalCopies")),
      image: formData.get("image"),
      description: formData.get("description"),
      userName: formData.get("userName"),
      userEmail: formData.get("userEmail"),
    };

    // Frontend-only: এখন data console-এ দেখা যাবে।
    console.log("Book form data:", bookData);

    setSuccessMessage("Book form submitted successfully!");
    form.reset();

    //data fetch
    const res = await fetch("http://localhost:8000/add-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    const data = await res.json();
    console.log(data);
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
                className="h-9 border-white/15 bg-white/[0.045] text-white"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="author">Author Name</Label>
              <Input
                id="author"
                name="author"
                required
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
            <Label htmlFor="image">Book Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              className="h-9 cursor-pointer border-white/15 bg-white/[0.045] text-white file:mr-3 file:border-0 file:bg-transparent file:text-sm file:text-white"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              className="min-h-14 border-white/15 bg-white/[0.045] text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                name="userName"
                defaultValue=""
                readOnly
                className="h-9 border-white/10 bg-white/[0.035] text-white/65"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="userEmail">User Email</Label>
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                defaultValue=""
                readOnly
                className="h-9 border-white/10 bg-white/[0.035] text-white/65"
              />
            </div>
          </div>

          {successMessage && (
            <p role="status" className="text-sm text-[#8fd3a7]">
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            className="mt-0.5 h-9 w-full bg-[#8fd3a7] font-medium text-[#102016] hover:bg-[#a4e3b8]"
          >
            Add Book
          </Button>
        </form>
      </section>
    </main>
  );
}
