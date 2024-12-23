"use client";

import React, { useEffect, useState } from "react";
import InfluencerElement from "../components/influencer_element";
import { useCreateTransition } from "../_lib/stores/createTransitionStateStore";

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
  const [managers, setManagers] = useState<Manager[]>([]); // Add state for managers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAccountForm, setOpenAccountForm] = useState<number | null>(null);
  const [newAccount, setNewAccount] = useState({
    social_network: "",
    title: "",
    username: "",
    account_url: "",
  });
  const [filters, setFilters] = useState({
    first_name: "",
    last_name: "",
    manager: null as number | null,
  });

  useEffect(() => {
    fetchManagers();

    let initialFilters = {
      first_name: "",
      last_name: "",
      manager: null,
    };

    if (transitionPayload.first_name && transitionPayload.last_name) {
      initialFilters = {
        first_name: transitionPayload.first_name,
        last_name: transitionPayload.last_name,
        manager: null,
      };
    }

    fetchInfluencers(initialFilters);
    resetTransitionPayload();
  }, []);

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
      Math.floor(Math.random() * (90000 - 1000 + 1)) + 1000; // Generate random followers
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
      setError("Failed to add social media account.");
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
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        List of Influencers
      </h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
        {/* Manager Dropdown */}
        <div className="flex-1">
          <label
            htmlFor="filter-manager"
            className="block text-sm font-medium text-gray-700"
          >
            Manager
          </label>
          <select
            id="filter-manager"
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg text-blue-600 font-semibold"
            value={filters.manager ?? ""} // Convert null to an empty string
            onChange={
              (e) =>
                setFilters({
                  ...filters,
                  manager: e.target.value ? Number(e.target.value) : null,
                }) // Convert empty string back to null
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

        {/* First Name Input */}
        <div className="flex-1">
          <label
            htmlFor="filter-first-name"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="filter-first-name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter first name"
            value={filters.first_name}
            onChange={(e) =>
              setFilters({ ...filters, first_name: e.target.value })
            }
          />
        </div>

        {/* Last Name Input */}
        <div className="flex-1">
          <label
            htmlFor="filter-last-name"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="filter-last-name"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter last name"
            value={filters.last_name}
            onChange={(e) =>
              setFilters({ ...filters, last_name: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700"
            onClick={handleFilter}
          >
            Filter
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-lg text-red-600">{error}</p>
      ) : influencers.length === 0 ? (
        <p className="text-lg text-gray-600">No influencers found.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
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
