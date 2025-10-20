// ============================
// ✈️ Promo Code System - SkyTrail
// ============================

const promoCodes = [
  {
    code: "XMASFLY25",
    discount: 0.25,
    expires: new Date("2025-12-26T23:59:59"),
    label: "Christmas Flight Sale"
  },
  {
    code: "SPOOKYFLIGHT15",
    discount: 0.15,
    expires: new Date("2025-11-02T23:59:59"),
    label: "November Spooktacular"
  },
  {
    code: "SKYTRAIL25",
    discount: 0.25,
    expires: new Date("2026-12-31T23:59:59"),
    label: "SkyTrail Exclusive Offer"
  }
];

function validatePromoCode(code) {
  const inputCode = code.trim().toUpperCase();
  return promoCodes.find(
    p => p.code === inputCode && new Date() <= p.expires
  ) || null;
}

function calculateDiscountedFare(baseFare, code) {
  const promo = validatePromoCode(code);
  if (!promo) return { total: baseFare, discount: 0, applied: false };

  const discountAmount = baseFare * promo.discount;
  return {
    total: baseFare - discountAmount,
    discount: discountAmount,
    applied: true,
    code: promo.code,
    label: promo.label
  };
}

function validatePromoBeforeNext() {
  const promoInput = document.querySelector(".promo-code input");
  const code = promoInput.value.trim();

  if (code === "") {
    // No code entered, proceed without promo
    localStorage.removeItem("promoCode");
    return true;
  }

  const promo = validatePromoCode(code);
  if (promo) {
    // Valid promo code
    localStorage.setItem("promoCode", promo.code);
    // Optionally show success modal, but for now just proceed
    return true;
  } else {
    // Invalid promo code, show modal
    const modal = document.getElementById("promoModal");
    const message = document.getElementById("promoMessage");
    if (modal && message) {
      message.textContent = "❌ This promo code doesn't work or has expired.";
      modal.style.display = "block";
    }
    return false;
  }
}

function getActivePromo() {
  const code = localStorage.getItem("promoCode");
  return code ? validatePromoCode(code) : null;
}

// Modal handling
document.addEventListener("DOMContentLoaded", () => {
  const closePromoModal = document.getElementById("closePromoModal");
  if (closePromoModal) {
    closePromoModal.addEventListener("click", () => {
      const modal = document.getElementById("promoModal");
      if (modal) modal.style.display = "none";
    });
  }
});
