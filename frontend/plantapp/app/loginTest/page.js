import { cookies } from "next/headers";

export default async function LoginTestPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value; // Get auth token from cookies

  if (!token) {
    return <p>Unauthorized. Please <a href="/login">login</a>.</p>;
  }

  // Verify token by calling your Express server
  const res = await fetch("http://localhost:5000/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store", // Ensure fresh data
  });

  if (!res.ok) {
    return <p>Session expired. Please <a href="/login">login again</a>.</p>;
  }

  const user = await res.json();

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
