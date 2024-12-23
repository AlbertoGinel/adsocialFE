import React from "react";
import useAuthStore from "../_lib/stores/authStore";
import { useRouter } from "next/router";

const UserProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    router.push("/login"); // or replace with a custom redirect logic
    return <div>Loading...</div>; // Show a loading state while redirecting
  }

  return <>{children}</>; // Render the protected content if authenticated
};

export default UserProtectedLayout;
