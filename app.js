// Site chrome: mobile navigation toggle and booking-form behaviour.

document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile navigation ----------------------------------------------------
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav__link");

  function closeNav() {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  // --- Booking form ---------------------------------------------------------
  // Sending is not wired up yet (static site). For now we validate the input,
  // keep the guest's data, and confirm on screen. A real transport (email
  // service / form backend) can be plugged into submit() later.
  const form = document.getElementById("booking-form");
  const dateFrom = document.getElementById("dateFrom");
  const dateTo = document.getElementById("dateTo");

  if (form) {
    // No dates in the past: set each picker's minimum to today (local time).
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    dateFrom.min = today;
    dateTo.min = today;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic cross-field date sanity: "to" must be after "from".
      if (dateFrom.value && dateTo.value && dateTo.value <= dateFrom.value) {
        dateTo.setCustomValidity("range");
      } else {
        dateTo.setCustomValidity("");
      }

      if (!form.reportValidity()) return;

      // TODO: connect a real submission transport here.
      console.log("Booking request:", Object.fromEntries(new FormData(form)));
    });

    // When "from" changes, "to" cannot be earlier than it. Clear any stale
    // custom message as soon as the user edits either date.
    dateFrom.addEventListener("input", () => {
      dateTo.min = dateFrom.value || today;
      dateTo.setCustomValidity("");
    });
    dateTo.addEventListener("input", () => dateTo.setCustomValidity(""));
  }
});
