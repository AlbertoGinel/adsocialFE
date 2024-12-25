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
    <div
      className="min-h-screen p-4 flex flex-col items-center justify-start"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="w-full flex justify-end mb-6">
        <button
          onClick={() => router.push("/listInfluencers")}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition"
        >
          List Influencers
        </button>
      </div>

      <h1
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "var(--foreground)" }}
      >
        Create New Influencer
      </h1>

      {message && (
        <div
          className="w-full p-4 mb-4"
          style={{
            backgroundColor: "var(--alert-bg)",
            borderLeft: "4px solid var(--alert-border)",
            color: "var(--alert-text)",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 rounded-lg shadow-md mt-4 sm:mt-8"
        style={{
          backgroundColor: "white",
          borderColor: "var(--border-color)",
        }}
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
          className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition"
        >
          Create Influencer
        </button>
      </form>
    </div>
  );
}
