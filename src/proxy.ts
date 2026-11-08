import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

}

export const config = {
  matcher: ["/add-book", "/my-books", "/my-borrows", "/books/:path"],
};
