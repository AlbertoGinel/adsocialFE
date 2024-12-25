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
      className="flex flex-row lg:justify-between lg:items-center bg-background p-4 rounded-md shadow-md"
    >
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:items-center text-foreground w-full">
        <p className="font-medium capitalize">
          {account.social_network}: {account.title}
        </p>
        <p className="text-sm">Followers: {account.followers}</p>
        <p className="text-sm">Username: {account.username}</p>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-start gap-4 mt-4 lg:mt-0">
        {account.account_url && (
          <a
            href={account.account_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-primary-dark transition"
          >
            Visit
          </a>
        )}
        <button
          className="w-full px-4 py-2 bg-errorText text-white font-semibold rounded-md shadow-md hover:bg-errorText-dark transition"
          onClick={() => confirmDelete(account.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default SocialMediaAccountElement;
