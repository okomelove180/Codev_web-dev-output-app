import { CallbacksOptions } from "next-auth";


export const callbacks:Partial<CallbacksOptions> = {
  //jwtトークンの作成
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
    }
    return token;
  },
  //セッションの作成
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
    }
    return session;
  },
  //ログイン後のリダイレクト先を指定
  async redirect({ url, baseUrl }) {
    if (url.startsWith(baseUrl)) {
      return `${baseUrl}/home`;
    } else if (url.startsWith("/")) {
      return `${baseUrl}/home`;
    }
    return `${baseUrl}/home`;
  },
};