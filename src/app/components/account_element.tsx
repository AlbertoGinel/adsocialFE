"use client";

import React from "react";

type SocialMediaAccount = {
  id: number;
  social_network: string;
  title: string;
  account_url: string;
  followers: number;
  influencer: number;
  username: string;
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
      className="flex justify-between items-center bg-background p-4 rounded-md shadow-md"
    >
      <div>
        <p className="font-medium text-foreground">
          <span className="capitalize">{account.social_network}:</span>{" "}
          {account.title}
        </p>
        <p className="text-foreground text-sm">
          Followers: {account.followers}
        </p>
        <p className="text-foreground text-sm">Username: {account.username}</p>
      </div>
      <div className="flex items-center space-x-4">
        {account.account_url && (
          <a
            href={account.account_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition"
          >
            Visit
          </a>
        )}
        <button
          className="px-4 py-2 bg-errorText text-white font-semibold rounded-md shadow-md hover:bg-errorText-dark transition"
          onClick={() => confirmDelete(account.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default SocialMediaAccountElement;
