/**
 * Main initialization script for Creta
 * Handles OTP authentication modal and Supabase integration
 */

import { getBasePath, logEnvironmentInfo } from "./github-pages.js";
import { OTPModal } from "./otp-modal.js";
import { getSession, onAuthStateChange, signOut } from "./supabase.js";

/**
 * Initialize OTP modal and auth system
 */
async function initializeAuth() {
  // Log environment info for debugging
  logEnvironmentInfo();
  
  // Create and initialize OTP modal
  const otpModal = new OTPModal();
  otpModal.init();
  
  // Attach OTP modal to favorites button
  const favBtn = document.getElementById("favBtn");
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      getSession().then(({ user }) => {
        if (user) {
          // User already logged in - show profile/diary
          handleUserLoggedIn(user);
        } else {
          // Show OTP login modal
          otpModal.open((user) => {
            handleUserLoggedIn(user);
          });
        }
      });
    });
  }
  
  // Listen for auth state changes
  onAuthStateChange(({ event, session }) => {
    console.log("Auth state changed:", event);
    if (event === "SIGNED_IN") {
      handleUserLoggedIn(session.user);
    } else if (event === "SIGNED_OUT") {
      handleUserSignedOut();
    }
  });
  
  // Check if user is already logged in on page load
  getSession().then(({ user }) => {
    if (user) {
      handleUserLoggedIn(user);
    }
  });
}

/**
 * Handle user logged in state
 */
function handleUserLoggedIn(user) {
  console.log("✅ User logged in:", user.email);
  
  // Update UI to show user is logged in
  const favBtn = document.getElementById("favBtn");
  if (favBtn) {
    favBtn.classList.add("authenticated");
    favBtn.title = `Logged in as ${user.email}`;
  }
  
  // TODO: Load user's favorites, reviews, profile from Supabase
  // TODO: Show user's diary drawer with profile info
}

/**
 * Handle user signed out state
 */
function handleUserSignedOut() {
  console.log("👋 User signed out");
  
  // Reset UI
  const favBtn = document.getElementById("favBtn");
  if (favBtn) {
    favBtn.classList.remove("authenticated");
    favBtn.title = "Ver favoritos";
  }
  
  // TODO: Clear user's data from UI
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAuth);
} else {
  initializeAuth();
}
