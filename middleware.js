import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect to login if not authenticated
  },
});

export const config = {
  matcher: ["/"], // Protect the root ("/") path
};

