export type Maybe<T> = T | null | undefined;

export type UserInfo = {
  user: { id: string; email: string; firstName?: string; lastName?: string };
  memberships?: Array<{
    id: string;
    company: { id: string; name?: string; slug?: string };
    role?: { id: string; name: string } | null;
  }>;
  permissions?: string[];
};

export type AuthContextType = {
  accessToken: string | null;
  login: (
    email: string,
    password: string,
    tenantId?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  user?: UserInfo | null;
};
