import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  useSecureCookies: process.env.NODE_ENV === "production",
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "メールアドレス",
          type: "email",
          placeholder: "メールアドレスを入力してください",
        },
        password: {
          label: "パスワード",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("メールアドレスまたはパスワードが間違っています");
        }

        const passwordMatch = comparePassword(
          credentials.password as string,
          user.hashedPassword
        );
        if (!passwordMatch) {
          throw new Error("メールアドレスまたはパスワードが間違っています");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {},
  callbacks: {},
});
