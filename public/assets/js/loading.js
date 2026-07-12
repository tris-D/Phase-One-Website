(function () {
  var form = document.getElementById("contactForm");
  var btn = document.getElementById("contactSubmitBtn");
  if (!form || !btn) return;
  form.addEventListener("submit", function () {
    // Let the browser run built-in validation first; only show feedback on a real submit.
    if (typeof form.checkValidity === "function" && !form.checkValidity()) return;
    var label = btn.querySelector(".contact-submit-label");
    var loading = btn.querySelector(".contact-submit-loading");
    if (label) label.classList.add("d-none");
    if (loading) loading.classList.remove("d-none");
    // Defer disabling so the form still submits, then block duplicate presses.
    setTimeout(function () {
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
    }, 0);
  });
})();
