import React from "react";
import useAuthStore from "../_lib/stores/authStore";
import { useRouter } from "next/router";

const AdminProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    router.push("/login"); // or replace with a custom redirect logic
    return <div>Loading...</div>;
  }

  // Redirect to unauthorized if the user is not an admin
  if (role !== "admin") {
    router.push("/unauthorized"); // Redirect to an unauthorized page
    return <div>Unauthorized</div>;
  }

  return <>{children}</>; // Render the protected content if the user is an admin
};

export default AdminProtectedLayout;
