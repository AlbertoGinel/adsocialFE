"use client";

import React from "react";

type SocialMediaAccount = {
  id: number;
  social_network: string;
  title: string;
  account_url: string;
  followers: number;
  influencer: number;
  username: string; // Already included
};

type SocialMediaAccountElementProps = {
  account: SocialMediaAccount;
  confirmDelete: (accountId: number) => Promise<void>;
};

const SocialMediaAccountElement: React.FC<SocialMediaAccountElementProps> = ({
  account,
  confirmDelete,
}) => {
  return (
    <li
      key={account.id}
      className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow"
    >
      <div>
        <p className="font-medium text-gray-700">
          <span className="capitalize">{account.social_network}:</span>{" "}
          {account.title}
        </p>
        <p className="text-gray-500 text-sm">Followers: {account.followers}</p>
        <p className="text-gray-500 text-sm">
          Username: {account.username}
        </p>{" "}
      </div>
      <div className="flex items-center space-x-4">
        {account.account_url && (
          <a
            href={account.account_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Visit
          </a>
        )}
        <button
          className="text-red-600 hover:underline"
          onClick={() => confirmDelete(account.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default SocialMediaAccountElement;
