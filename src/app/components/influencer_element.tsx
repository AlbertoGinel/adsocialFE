"use client";

import React from "react";
import SocialMediaAccountElement from "../components/account_element";

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

type InfluencerElementProps = {
  influencer: Influencer;
  openAccountForm: number | null;
  setOpenAccountForm: React.Dispatch<React.SetStateAction<number | null>>;
  newAccount: {
    social_network: string;
    title: string;
    username: string;
    account_url: string;
  };
  setNewAccount: React.Dispatch<
    React.SetStateAction<{
      social_network: string;
      title: string;
      username: string;
      account_url: string;
    }>
  >;
  handleAddAccount: (influencerId: number) => Promise<void>;
  confirmDelete: (accountId: number) => Promise<void>;
  resetNewAccount: () => void;
  managers: Manager[];
  updateManager: (influencerId: number, managerId: number | null) => void;
};

const socialNetworks = [
  "facebook",
  "instagram",
  "twitter",
  "youtube",
  "tiktok",
  "snapchat",
  "pinterest",
  "linkedin",
  "reddit",
  "whatsapp",
  "tumblr",
  "twitch",
  "vimeo",
  "spotify",
  "clubhouse",
  "medium",
  "periscope",
  "wechat",
  "viber",
  "discord",
  "line",
  "telegram",
  "tiktok_lite",
  "triller",
  "dlive",
  "myspace",
  "google_plus",
  "yelp",
  "musical_ly",
  "vine",
];

const InfluencerElement: React.FC<InfluencerElementProps> = ({
  influencer,
  openAccountForm,
  setOpenAccountForm,
  newAccount,
  setNewAccount,
  handleAddAccount,
  confirmDelete,
  resetNewAccount,
  managers,
  updateManager,
}) => {
  const handleManagerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const managerId = event.target.value ? parseInt(event.target.value) : null;
    updateManager(influencer.id, managerId);
  };

  const isValidURL = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return !!parsedUrl.protocol && !!parsedUrl.host;
    } catch {
      return false;
    }
  };

  const isFormValid =
    newAccount.social_network.trim() !== "" &&
    newAccount.title.trim() !== "" &&
    newAccount.username.trim() !== "" &&
    isValidURL(newAccount.account_url);

  return (
    <div
      key={influencer.id}
      className="bg-white p-6 rounded-lg shadow-md"
      style={{
        fontFamily: "var(--font-family-sans)", // Link to the font family defined in globals.css
        backgroundColor: "var(--background)", // Use the background color from globals
        color: "var(--foreground)", // Use the foreground text color from globals
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="sm:w-1/2">
          {" "}
          {/* This makes the first part take up half the row on sm screens and above */}
          <h2
            className="text-xl font-semibold"
            style={{
              color: "var(--foreground)", // Link text color to global foreground
            }}
          >
            {influencer.first_name} {influencer.last_name}
          </h2>
        </div>

        <div className="flex justify-between items-center gap-4 w-full sm:w-1/2">
          {" "}
          {/* This makes the second part take up half of the row on sm screens */}
          <div className="flex-1">
            <label
              htmlFor={`manager-select-${influencer.id}`}
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Manager
            </label>
            <select
              id={`manager-select-${influencer.id}`}
              value={influencer.manager || ""}
              className="mt-1 block w-full rounded-md border-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              onChange={handleManagerChange}
            >
              <option value="">No manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.first_name} {manager.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <button
              className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark"
              onClick={() =>
                setOpenAccountForm(
                  openAccountForm === influencer.id ? null : influencer.id
                )
              }
            >
              Add New Account
            </button>
          </div>
        </div>
      </div>

      {openAccountForm === influencer.id && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <div className="mb-4">
            <select
              value={newAccount.social_network}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  social_network: e.target.value,
                })
              }
              className="border p-2 rounded w-full"
            >
              <option value="">Select Social Network</option>
              {socialNetworks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={newAccount.title}
              onChange={(e) =>
                setNewAccount({ ...newAccount, title: e.target.value })
              }
              placeholder="Title"
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={newAccount.username}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  username: e.target.value,
                })
              }
              placeholder="Username"
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <input
              type="url"
              value={newAccount.account_url}
              onChange={(e) =>
                setNewAccount({ ...newAccount, account_url: e.target.value })
              }
              placeholder="URL"
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              className={`py-2 px-4 rounded ${
                isFormValid
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-gray-800 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
              onClick={() => handleAddAccount(influencer.id)}
            >
              Save Account
            </button>
            <button
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
              onClick={() => {
                resetNewAccount(); // Clear the form
                setOpenAccountForm(null);
              }}
            >
              Close Without Saving
            </button>
          </div>
        </div>
      )}

      {influencer.social_media_accounts.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {influencer.social_media_accounts.map((account) => (
            <SocialMediaAccountElement
              key={account.id}
              account={account}
              confirmDelete={confirmDelete}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-500">
          No social media accounts available.
        </p>
      )}
    </div>
  );
};

export default InfluencerElement;
