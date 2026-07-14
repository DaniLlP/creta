/**
 * OTP Modal Component
 * Handles 6-digit email OTP verification flow
 */

import { signUpWithOTP, verifyOTP } from "./supabase.js";

const OTP_LENGTH = 6;

/**
 * Create and render the OTP modal HTML
 * @returns {HTMLElement} Modal element
 */
function createOTPModal() {
  const modal = document.createElement("div");
  modal.id = "otp-modal";
  modal.className = "otp-modal";
  modal.innerHTML = `
    <div class="otp-modal-overlay"></div>
    <div class="otp-modal-content">
      <div class="otp-modal-head">
        <h3>Inicia sesión con tu email</h3>
        <button class="otp-modal-close" aria-label="Cerrar">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      
      <!-- Step 1: Email Input -->
      <div class="otp-step" id="step-email">
        <p class="otp-step-desc">Introduce tu email para recibir un código de 6 dígitos</p>
        <div class="otp-form-group">
          <input
            type="email"
            id="otp-email-input"
            class="otp-input"
            placeholder="ejemplo@email.com"
            autocomplete="email"
            aria-label="Correo electrónico"
          />
          <button id="otp-send-btn" class="otp-btn otp-btn-primary">
            <i class="fa-solid fa-paper-plane"></i> Enviar código
          </button>
        </div>
        <div id="otp-email-error" class="otp-error" style="display: none;"></div>
      </div>
      
      <!-- Step 2: OTP Code Input -->
      <div class="otp-step" id="step-otp" style="display: none;">
        <p class="otp-step-desc">
          Hemos enviado un código a <strong id="otp-email-display"></strong>
        </p>
        <div class="otp-form-group">
          <div class="otp-code-input-group">
            ${Array.from({ length: OTP_LENGTH })
              .map(
                (_, i) => `
              <input
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="otp-code-input"
                data-index="${i}"
                aria-label="Dígito ${i + 1} del código"
              />
            `
              )
              .join("")}
          </div>
          <button id="otp-verify-btn" class="otp-btn otp-btn-primary">
            <i class="fa-solid fa-check"></i> Verificar código
          </button>
        </div>
        <button id="otp-resend-btn" class="otp-btn otp-btn-secondary">
          ¿No recibiste el código? Reintentar
        </button>
        <div id="otp-verify-error" class="otp-error" style="display: none;"></div>
      </div>
      
      <!-- Step 3: Loading -->
      <div class="otp-step" id="step-loading" style="display: none;">
        <div class="otp-loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Procesando…</p>
        </div>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * Add OTP modal styles
 */
function injectOTPStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* ============ OTP Modal ============ */
    .otp-modal {
      position: fixed;
      inset: 0;
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    
    .otp-modal.open {
      opacity: 1;
      pointer-events: auto;
    }
    
    .otp-modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(10, 8, 5, 0.6);
      backdrop-filter: blur(4px);
    }
    
    .otp-modal-content {
      position: relative;
      z-index: 1;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-l);
      padding: 32px;
      max-width: 400px;
      width: 90vw;
      box-shadow: var(--shadow);
      animation: modalSlideIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .otp-modal-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .otp-modal-head h3 {
      font-size: 20px;
      margin: 0;
    }
    
    .otp-modal-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: var(--bg-alt);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }
    
    .otp-modal-close:hover {
      border-color: var(--border-strong);
      transform: scale(1.05);
    }
    
    .otp-step {
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .otp-step-desc {
      font-size: 13.5px;
      color: var(--text-soft);
      margin-bottom: 20px;
      line-height: 1.5;
    }
    
    .otp-form-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .otp-input {
      padding: 11px 14px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-s);
      background: var(--bg-alt);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 14px;
      transition: border-color 0.2s;
    }
    
    .otp-input:focus {
      outline: none;
      border-color: var(--aegean);
    }
    
    /* ============ OTP Code Input Group ============ */
    .otp-code-input-group {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .otp-code-input {
      width: 100%;
      aspect-ratio: 1;
      padding: 0;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      font-family: var(--font-mono);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-s);
      background: var(--bg-alt);
      color: var(--text);
      transition: all 0.2s;
    }
    
    .otp-code-input:focus {
      outline: none;
      border-color: var(--aegean);
      background: var(--surface);
    }
    
    .otp-code-input.filled {
      border-color: var(--aegean);
    }
    
    /* ============ Buttons ============ */
    .otp-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 11px 16px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-s);
      background: var(--bg-alt);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    
    .otp-btn:hover:not(:disabled) {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }
    
    .otp-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .otp-btn-primary {
      background: var(--oxblood);
      border-color: var(--oxblood);
      color: #fff;
      width: 100%;
    }
    
    .otp-btn-primary:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    .otp-btn-secondary {
      width: 100%;
      background: transparent;
      color: var(--text-soft);
    }
    
    .otp-btn-secondary:hover:not(:disabled) {
      color: var(--text);
    }
    
    /* ============ Error Message ============ */
    .otp-error {
      padding: 10px 12px;
      border-radius: var(--radius-s);
      background: color-mix(in srgb, var(--oxblood) 10%, transparent);
      border: 1px solid var(--oxblood);
      color: var(--oxblood);
      font-size: 12.5px;
      margin-top: 12px;
    }
    
    [data-theme="dark"] .otp-error {
      background: color-mix(in srgb, var(--oxblood-bright) 15%, transparent);
      border-color: var(--oxblood-bright);
      color: var(--oxblood-bright);
    }
    
    /* ============ Loading State ============ */
    .otp-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      gap: 16px;
    }
    
    .otp-loading i {
      font-size: 32px;
      color: var(--oxblood);
    }
    
    .otp-loading p {
      font-size: 14px;
      color: var(--text-soft);
    }
  `;
  document.head.appendChild(style);
}

/**
 * OTP Modal Controller
 */
export class OTPModal {
  constructor() {
    this.modal = null;
    this.emailInput = null;
    this.otpInputs = [];
    this.currentEmail = "";
    this.isOpen = false;
    this.onSuccess = null;
  }

  /**
   * Initialize modal in DOM
   */
  init() {
    injectOTPStyles();
    this.modal = createOTPModal();
    document.body.appendChild(this.modal);
    
    this.emailInput = this.modal.querySelector("#otp-email-input");
    this.otpInputs = Array.from(this.modal.querySelector(".otp-code-input-group")?.querySelectorAll(".otp-code-input") || []);
    
    this.attachEventListeners();
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Close modal
    this.modal.querySelector(".otp-modal-close").addEventListener("click", () => this.close());
    this.modal.querySelector(".otp-modal-overlay").addEventListener("click", () => this.close());

    // Email step
    this.modal.querySelector("#otp-send-btn").addEventListener("click", () => this.handleSendOTP());
    this.emailInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSendOTP();
    });

    // OTP step
    this.modal.querySelector("#otp-verify-btn").addEventListener("click", () => this.handleVerifyOTP());
    this.modal.querySelector("#otp-resend-btn").addEventListener("click", () => this.handleResendOTP());
    
    // OTP input handling
    this.otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => this.handleOTPInput(e, index));
      input.addEventListener("keydown", (e) => this.handleOTPKeydown(e, index));
      input.addEventListener("paste", (e) => this.handleOTPPaste(e));
    });
  }

  /**
   * Handle OTP digit input
   */
  handleOTPInput(e, index) {
    const input = e.target;
    const value = input.value.replace(/\D/g, ""); // Only digits
    
    if (value) {
      input.value = value[0];
      input.classList.add("filled");
      
      // Move to next input
      if (index < this.otpInputs.length - 1) {
        this.otpInputs[index + 1].focus();
      }
    } else {
      input.value = "";
      input.classList.remove("filled");
    }
  }

  /**
   * Handle OTP keydown (backspace, arrow keys)
   */
  handleOTPKeydown(e, index) {
    if (e.key === "Backspace") {
      e.preventDefault();
      this.otpInputs[index].value = "";
      this.otpInputs[index].classList.remove("filled");
      
      if (index > 0) {
        this.otpInputs[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      this.otpInputs[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < this.otpInputs.length - 1) {
      this.otpInputs[index + 1].focus();
    }
  }

  /**
   * Handle paste of full OTP code
   */
  handleOTPPaste(e) {
    e.preventDefault();
    const pastedData = (e.clipboardData || window.clipboardData).getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, OTP_LENGTH);
    
    digits.split("").forEach((digit, i) => {
      if (i < this.otpInputs.length) {
        this.otpInputs[i].value = digit;
        this.otpInputs[i].classList.add("filled");
      }
    });
    
    if (digits.length === OTP_LENGTH) {
      this.otpInputs[OTP_LENGTH - 1].blur();
    }
  }

  /**
   * Get complete OTP code from inputs
   */
  getOTPCode() {
    return this.otpInputs.map((input) => input.value).join("");
  }

  /**
   * Clear OTP inputs
   */
  clearOTPInputs() {
    this.otpInputs.forEach((input) => {
      input.value = "";
      input.classList.remove("filled");
    });
  }

  /**
   * Show error message
   */
  showError(step, message) {
    const errorEl = this.modal.querySelector(`#otp-${step}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
      setTimeout(() => {
        errorEl.style.display = "none";
      }, 5000);
    }
  }

  /**
   * Switch between steps
   */
  switchStep(fromStep, toStep) {
    const fromEl = this.modal.querySelector(`#step-${fromStep}`);
    const toEl = this.modal.querySelector(`#step-${toStep}`);
    
    if (fromEl) fromEl.style.display = "none";
    if (toEl) toEl.style.display = "block";
  }

  /**
   * Handle send OTP button click
   */
  async handleSendOTP() {
    const email = this.emailInput.value.trim();
    
    if (!email) {
      this.showError("email", "Por favor introduce tu email");
      return;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.showError("email", "Email inválido");
      return;
    }
    
    this.switchStep("email", "loading");
    
    const result = await signUpWithOTP(email);
    
    if (result.success) {
      this.currentEmail = email;
      this.modal.querySelector("#otp-email-display").textContent = email;
      this.switchStep("loading", "otp");
      this.otpInputs[0].focus();
    } else {
      this.switchStep("loading", "email");
      this.showError("email", result.error || "Error al enviar el código");
    }
  }

  /**
   * Handle verify OTP button click
   */
  async handleVerifyOTP() {
    const code = this.getOTPCode();
    
    if (code.length !== OTP_LENGTH) {
      this.showError("verify", `Por favor introduce los ${OTP_LENGTH} dígitos`);
      return;
    }
    
    this.switchStep("otp", "loading");
    
    const result = await verifyOTP(this.currentEmail, code);
    
    if (result.success) {
      this.switchStep("loading", "otp");
      this.close();
      
      // Trigger success callback
      if (this.onSuccess) {
        this.onSuccess(result.user);
      }
    } else {
      this.switchStep("loading", "otp");
      this.showError("verify", result.error || "Código inválido");
      this.clearOTPInputs();
      this.otpInputs[0].focus();
    }
  }

  /**
   * Handle resend OTP button click
   */
  async handleResendOTP() {
    this.switchStep("otp", "loading");
    
    const result = await signUpWithOTP(this.currentEmail);
    
    if (result.success) {
      this.switchStep("loading", "otp");
      this.clearOTPInputs();
      this.otpInputs[0].focus();
    } else {
      this.switchStep("loading", "otp");
      this.showError("verify", result.error || "Error al reenviar el código");
    }
  }

  /**
   * Open modal
   */
  open(onSuccess) {
    this.onSuccess = onSuccess;
    this.isOpen = true;
    this.modal.classList.add("open");
    this.switchStep("otp", "email");
    this.emailInput.focus();
  }

  /**
   * Close modal
   */
  close() {
    this.isOpen = false;
    this.modal.classList.remove("open");
    this.clearOTPInputs();
    this.emailInput.value = "";
  }
}
