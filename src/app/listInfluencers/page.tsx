"use client";

import React, { useEffect, useState } from "react";
import InfluencerElement from "../components/influencer_element";
import { useCreateTransition } from "../_lib/stores/createTransitionStateStore";
import { useRouter } from "next/navigation";

type SocialMediaAccount = {
  id: number;
  social_network: string;
  title: string;
  account_url: string;
  followers: number;
  influencer: number;
  username: string;
};

type Influencer = {
  id: number;
  first_name: string;
  last_name: string;
  social_media_accounts: SocialMediaAccount[];
  manager: string | null;
  manager_name: string | null;
};

type Manager = {
  id: number;
  first_name: string;
  last_name: string;
};

const ListInfluencer = () => {
  const { transitionPayload, resetTransitionPayload } = useCreateTransition();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAccountForm, setOpenAccountForm] = useState<number | null>(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [newAccount, setNewAccount] = useState({
    social_network: "",
    title: "",
    username: "",
    account_url: "",
  });
  const [filters, setFilters] = useState({
    first_name: transitionPayload.first_name || "",
    last_name: transitionPayload.last_name || "",
    manager: null as number | null,
  });

  const router = useRouter();

  useEffect(() => {
    fetchManagers();
    fetchInfluencers(filters);
    resetTransitionPayload();
  }, []); // Remove loadingFilter dependency here

  const fetchManagers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/managers/`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setManagers(data);
      } else {
        setError("Failed to fetch managers.");
      }
    } catch {
      setError("Error fetching managers. Please try again later.");
    }
  };

  const fetchInfluencers = async (filters: {
    first_name: string;
    last_name: string;
    manager: number | null;
  }) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/influencers/filtered/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (response.ok) {
        const data = await response.json();
        setInfluencers(data);
      } else {
        setError("Failed to fetch influencers.");
      }
    } catch {
      setError("Error fetching influencers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchInfluencers(filters);
  };

  const handleClear = () => {
    const defaultFilters = { first_name: "", last_name: "", manager: null };
    setFilters(defaultFilters);
    fetchInfluencers(defaultFilters);
  };

  const handleAddAccount = async (influencerId: number) => {
    const randomFollowers =
      Math.floor(Math.random() * (90000 - 1000 + 1)) + 1000;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/social-media-accounts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        influencer: influencerId,
        social_network: newAccount.social_network,
        title: newAccount.title,
        username: newAccount.username,
        account_url: newAccount.account_url,
        followers: randomFollowers, // Assign random followers
      }),
    });

    if (response.ok) {
      const newSocialAccount = await response.json();
      setInfluencers((prev) =>
        prev.map((influencer) =>
          influencer.id === influencerId
            ? {
                ...influencer,
                social_media_accounts: [
                  ...influencer.social_media_accounts,
                  newSocialAccount,
                ],
              }
            : influencer
        )
      );
      resetNewAccount();
      setOpenAccountForm(null);
    } else {
      setWarningMessage("Failed to add social media account.");
      setTimeout(() => setWarningMessage(""), 4000);
    }
  };

  const updateManager = async (
    influencerId: number,
    managerId: number | null
  ) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/api/influencers/${influencerId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ manager: managerId }),
        }
      );

      if (response.ok) {
        const updatedInfluencer = await response.json();
        setInfluencers((prev) =>
          prev.map((influencer) =>
            influencer.id === influencerId ? updatedInfluencer : influencer
          )
        );
      } else {
        setError("Failed to update manager.");
      }
    } catch (err) {
      setError("Error updating manager. Please try again later.");
    }
  };

  const resetNewAccount = () => {
    setNewAccount({
      social_network: "",
      title: "",
      username: "",
      account_url: "",
    });
  };

  const confirmDelete = async (accountId: number) => {
    const account = influencers
      .flatMap((influencer) => influencer.social_media_accounts)
      .find((acc) => acc.id === accountId);

    if (
      account &&
      window.confirm(
        `Do you want to delete "${account.title}" from "${account.username}"?`
      )
    ) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/api/social-media-accounts/${accountId}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setInfluencers((prev) =>
            prev.map((influencer) => ({
              ...influencer,
              social_media_accounts: influencer.social_media_accounts.filter(
                (socialAccount) => socialAccount.id !== accountId
              ),
            }))
          );
        } else {
          setError("Failed to delete social media account.");
        }
      } catch (err) {
        setError("Error deleting account. Please try again later.");
      }
    }
  };

  return (
    <div
      className="min-h-screen p-4 flex flex-col items-center"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="w-full flex justify-end mb-6">
        <button
          onClick={() => router.push("/createInfluencer")}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark"
        >
          Create Influencer
        </button>
      </div>

      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        List of Influencers
      </h1>

      {warningMessage && (
        <div
          className="w-full p-4 mb-4"
          style={{
            backgroundColor: "var(--alert-bg)",
            borderLeft: "4px solid var(--alert-border)",
            color: "var(--alert-text)",
          }}
        >
          {warningMessage}
        </div>
      )}

      <div
        className="w-full shadow-md rounded-lg p-4 mb-6 flex flex-col gap-4 lg:flex-row"
        style={{
          backgroundColor: "white",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <label
              htmlFor="filter-first-name"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              First Name
            </label>
            <input
              id="filter-first-name"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter first name"
              value={filters.first_name}
              onChange={(e) =>
                setFilters({ ...filters, first_name: e.target.value })
              }
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="filter-last-name"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Last Name
            </label>
            <input
              id="filter-last-name"
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter last name"
              value={filters.last_name}
              onChange={(e) =>
                setFilters({ ...filters, last_name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <label
              htmlFor="filter-manager"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Manager
            </label>
            <select
              id="filter-manager"
              className="mt-1 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={filters.manager ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  manager: e.target.value ? Number(e.target.value) : null,
                })
              }
            >
              <option value="">No manager selected</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.first_name} {manager.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex gap-4">
            <button
              className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleFilter}
              disabled={
                !filters.first_name && !filters.last_name && !filters.manager
              }
            >
              Filter
            </button>
            <button
              className="flex-1 px-4 py-2 bg-secondary text-white font-semibold rounded-md shadow-md hover:bg-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleClear}
              disabled={
                !filters.first_name && !filters.last_name && !filters.manager
              }
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-lg" style={{ color: "var(--foreground)" }}>
          Loading...
        </p>
      ) : error ? (
        <p className="text-lg" style={{ color: "var(--error-text)" }}>
          {error}
        </p>
      ) : influencers.length === 0 ? (
        <p className="text-lg" style={{ color: "var(--foreground)" }}>
          No influencers found.
        </p>
      ) : (
        <div className="w-full space-y-6">
          {influencers.map((influencer) => (
            <InfluencerElement
              key={influencer.id}
              influencer={influencer}
              openAccountForm={openAccountForm}
              setOpenAccountForm={setOpenAccountForm}
              newAccount={newAccount}
              setNewAccount={setNewAccount}
              handleAddAccount={handleAddAccount}
              confirmDelete={confirmDelete}
              resetNewAccount={resetNewAccount}
              managers={managers}
              updateManager={updateManager}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListInfluencer;
