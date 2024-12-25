"use client";

import React, { useEffect, useState } from "react";
import { useCreateTransition } from "../_lib/stores/createTransitionStateStore";
import { useRouter } from "next/navigation";

export default function CreateInfluencer() {
  const router = useRouter();
  const { setTransitionPayload, resetTransitionPayload } =
    useCreateTransition();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    resetTransitionPayload(); // Reset the Zustand store on component mount
  }, [resetTransitionPayload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/influencers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(
          `Influencer ${data.first_name} ${data.last_name} created successfully!`
        );
        setTransitionPayload({
          first_name: data.first_name,
          last_name: data.last_name,
        });
        router.push("/listInfluencers");
        setFormData({ first_name: "", last_name: "" }); // Reset form
      } else {
        const errorData = await response.json();
        setMessage(
          `Error: ${errorData.error || "Failed to create influencer"}`
        );
      }
    } catch (error) {
      setMessage("Error: Unable to connect to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start sm:justify-center min-h-screen bg-background p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/listInfluencers")}
            className="px-4 py-2 button hover:bg-secondary"
          >
            List Influencers
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
          Create New Influencer
        </h1>
        {message && (
          <p className="mb-4 text-center text-foreground">{message}</p>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 rounded-lg shadow-md mt-4 sm:mt-8 bg-background"
        >
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:border-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full button hover:bg-secondary focus:ring focus:ring-primary"
          >
            Create Influencer
          </button>
        </form>
      </div>
    </div>
  );
}
