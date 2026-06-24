import { cookies } from "next/headers";
import { ApiResponse } from "./type/response.api";
import { User } from "@/context/types/auth";

export async function getCurrentUser(): Promise<ApiResponse<User> | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  console.log("the cookie is ", sessionId);

  if (!sessionId) return null;
  const url = `${process.env.BACKEND_URL}/auth/me`;
  console.log("fetching:", url);

  const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
    headers: { Cookie: `session_id=${sessionId}` },
    cache: "no-store",
  });
  console.log("status", res.status);
  const data: ApiResponse<User> = await res.json();
  console.log("user is ", data.data);
  if (!res.ok) return null;

  console.log("the user is ", data.data);
  return data;
}
