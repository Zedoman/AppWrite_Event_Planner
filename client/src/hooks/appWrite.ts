import { Client, Account, Databases } from 'appwrite';

export const useAppwrite = () => {
  const endpoint = import.meta.env.VITE_APP_APPWRITE_ENDPOINT as string;
  const projectId = import.meta.env.VITE_APP_APPWRITE_PROJECT as string;

  if (!endpoint || !projectId) {
    throw new Error('Missing Appwrite environment variables');
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
};
