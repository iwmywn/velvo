export const authConfig = {
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/user/signin",
  },
  providers: [],
};
