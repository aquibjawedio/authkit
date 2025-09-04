import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        const user = {
          id: profile.id,
          fullName: profile.displayName || "",
          email: profile.emails?.[0]?.value || "",
          avatar: profile.photos?.[0]?.value || "",
          role: "USER",
          sessionId: "",
        };
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
