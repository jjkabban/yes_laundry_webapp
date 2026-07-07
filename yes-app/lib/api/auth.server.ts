import { cookies } from "next/headers";
import { ApiResponse } from "./type/response.api";
import { User } from "@/types/shared/user.type";

export async function getCurrentUser(): Promise<ApiResponse<User> | null> {
  const cookieStore = await cookies();

  if (!cookieStore.has("connect.sid")) return null;

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: ApiResponse<User> = await res.json();
    return data;
  } catch {
    return null;
  }
}
