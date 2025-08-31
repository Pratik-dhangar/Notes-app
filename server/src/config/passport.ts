import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from "../models/userModel"

export const configurePassport = () => {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find if a user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, return them
          return done(null, user);
        } else {
          // If not, create a new user with Google profile info
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
          });

          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  ));
};