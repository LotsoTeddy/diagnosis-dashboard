import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("Authorize called with:", credentials);

        // Check against environment variables
        const validUsername = process.env.AUTH_USERNAME;
        const validPassword = process.env.AUTH_PASSWORD;

        console.log("Expected credentials:", { validUsername, validPassword });

        if (!validUsername || !validPassword) {
          console.error("Auth credentials not configured!");
          return null;
        }

        if (
          credentials?.username === validUsername &&
          credentials?.password === validPassword
        ) {
          console.log("Login successful!");
          return {
            id: "1",
            name: validUsername,
            email: `${validUsername}@arkclaw.local`,
          };
        }

        console.log("Login failed - credentials don't match");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      // Allow plugin to POST reports
      if (pathname === "/api/reports" && request.method === "POST") {
        return true;
      }

      // Require auth for all other routes
      return !!auth;
    },
  },
});
