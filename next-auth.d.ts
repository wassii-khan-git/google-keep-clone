import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string;
      /** The user's phone number. */
      phone: string;
      /** The user's ID. */
      id: string;
      /** The user's email. */
      email: string;
      /** The user's name. */
      name: string;
      /** The user's image URL. */
      image: string;
      /** The user's provider (e.g., Google, GitHub). */
      provider: string;
    };
  }
}
