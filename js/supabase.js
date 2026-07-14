import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

/**
 * Supabase client initialization
 * Single source of truth for Supabase configuration
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sign up / send OTP email
 * @param {string} email - User email address
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function signUpWithOTP(email) {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + window.location.pathname,
      },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Verify OTP code (6-digit)
 * @param {string} email - User email address
 * @param {string} token - 6-digit OTP token from email
 * @returns {Promise<{success: boolean, error: string|null, user: object|null}>}
 */
export async function verifyOTP(email, token) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) {
      return { success: false, error: error.message, user: null };
    }
    return { success: true, error: null, user: data.user };
  } catch (err) {
    return { success: false, error: err.message, user: null };
  }
}

/**
 * Sign out current user
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Get current user session
 * @returns {Promise<{user: object|null}>}
 */
export async function getSession() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { user };
  } catch (err) {
    console.error("Error getting session:", err);
    return { user: null };
  }
}

/**
 * Listen for auth state changes
 * @param {Function} callback - Receives {event, session} on change
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback({ event, session });
  });
  return () => subscription?.unsubscribe();
}
