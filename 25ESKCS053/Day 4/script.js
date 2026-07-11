document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Inject Stylesheet Dynamically ---
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
        /* Transition properties on existing elements */
        body {
            transition: background 0.4s ease, color 0.4s ease;
            flex-direction: column !important;
            padding: 40px 20px !important;
        }
        .container {
            transition: background 0.4s ease, box-shadow 0.4s ease;
        }
        input, select {
            transition: background 0.4s ease, border-color 0.4s ease, color 0.4s ease;
        }
        h1, label, .gender label {
            transition: color 0.4s ease;
        }

        /* Dark Theme Styles (Colors Only, preserves layout/borders/sizes) */
        body.dark-theme {
            background: linear-gradient(to right, #0b0c1e, #13142e) !important;
            color: #ffffff !important;
        }
        body.dark-theme .container {
            background: #1e1e2f !important;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.6) !important;
        }
        body.dark-theme h1 {
            color: #ffffff !important;
        }
        body.dark-theme label {
            color: #ffffff !important;
        }
        body.dark-theme .gender label {
            color: #ffffff !important;
        }
        body.dark-theme input, 
        body.dark-theme select {
            background: #2d2d44 !important;
            border-color: #666688 !important;
            color: #ffffff !important;
        }

        /* Dynamic Theme Button Style */
        .dyn-theme-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid rgba(0,0,0,0.1);
            background: white;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.2s ease, background 0.4s ease, border-color 0.4s ease;
            z-index: 1000;
        }
        body.dark-theme .dyn-theme-btn {
            background: #1e1e2f;
            border-color: rgba(255,255,255,0.1);
            color: white;
        }
        .dyn-theme-btn:hover {
            transform: scale(1.08);
        }
        .dyn-theme-btn:active {
            transform: scale(0.95);
        }
        .dyn-theme-btn svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* Dynamic Click Counter Widget (at bottom of page, matches CSS style) */
        .dyn-stats-container {
            margin-top: 20px;
            width: 100%;
            max-width: 700px;
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
            font-family: Arial, Helvetica, sans-serif;
        }
        .dyn-stat-card {
            background: white;
            border: 1px solid rgba(0,0,0,0.15);
            border-radius: 10px;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,.15);
            transition: background 0.4s ease, border-color 0.4s ease;
        }
        body.dark-theme .dyn-stat-card {
            background: #1e1e2f;
            border-color: rgba(255,255,255,0.1);
        }
        .dyn-stat-label {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            color: #666;
        }
        body.dark-theme .dyn-stat-label {
            color: #aaa;
        }
        .dyn-stat-value {
            font-size: 18px;
            font-weight: 700;
            background: #2d8c88;
            color: white;
            padding: 2px 12px;
            border-radius: 5px;
            min-width: 45px;
            text-align: center;
            transition: transform 0.2s ease, background 0.4s ease, color 0.4s ease;
        }
        body.dark-theme .dyn-stat-value {
            background: #236d69;
            color: white;
        }

        /* Pulse Animation on Counter Badge */
        .dyn-pulse {
            animation: dyn-pulse-anim 0.3s ease-out;
        }
        @keyframes dyn-pulse-anim {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(styleEl);

    // --- 2. Create and Inject Theme Toggle Button ---
    const themeBtn = document.createElement("button");
    themeBtn.className = "dyn-theme-btn";
    themeBtn.setAttribute("aria-label", "Toggle Theme");
    
    const sunIconSvg = `
        <svg class="sun-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    const moonIconSvg = `
        <svg class="moon-icon" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;
    
    const updateThemeIcon = (isDark) => {
        themeBtn.innerHTML = isDark ? sunIconSvg : moonIconSvg;
    };
    
    document.body.appendChild(themeBtn);

    // --- 3. Create and Inject Click Counter at Last of the Page ---
    const statsContainer = document.createElement("div");
    statsContainer.className = "dyn-stats-container";
    statsContainer.innerHTML = `
        <div class="dyn-stat-card">
            <span class="dyn-stat-label">Total Clicks</span>
            <span id="dynClickCount" class="dyn-stat-value">0</span>
        </div>
    `;
    document.body.appendChild(statsContainer);
    
    const clickCountDisplay = document.getElementById("dynClickCount");

    // --- 4. Click Counter Logic ---
    let clickCount = parseInt(localStorage.getItem("globalClickCount") || "0", 10);
    clickCountDisplay.textContent = clickCount;

    window.addEventListener("click", () => {
        clickCount++;
        localStorage.setItem("globalClickCount", clickCount);
        clickCountDisplay.textContent = clickCount;

        clickCountDisplay.classList.remove("dyn-pulse");
        void clickCountDisplay.offsetWidth; // force reflow
        clickCountDisplay.classList.add("dyn-pulse");
    });

    // --- 5. Theme Persistent Setup ---
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    if (initialDark) {
        document.body.classList.add("dark-theme");
    }
    updateThemeIcon(initialDark);

    themeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid double click count triggering
        
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeIcon(isDark);

        clickCount++;
        localStorage.setItem("globalClickCount", clickCount);
        clickCountDisplay.textContent = clickCount;

        clickCountDisplay.classList.remove("dyn-pulse");
        void clickCountDisplay.offsetWidth;
        clickCountDisplay.classList.add("dyn-pulse");
    });

    // --- 6. Registration Form Submission & Validation Logic ---
    const form = document.getElementById("registrationForm");
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let fullName = document.getElementById("fullName").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let dob = document.getElementById("dob").value;
        let address = document.getElementById("address").value.trim();
        let address2 = document.getElementById("address2").value.trim();
        let country = document.getElementById("country").value;
        let city = document.getElementById("city").value.trim();
        let region = document.getElementById("region").value.trim();
        let postal = document.getElementById("postal").value.trim();

        let gender = document.querySelector('input[name="gender"]:checked');

        if (fullName === "") {
            alert("Please enter your Full Name");
            return;
        }

        let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!email.match(emailPattern)) {
            alert("Please enter a valid Email");
            return;
        }

        let phonePattern = /^[0-9]{10}$/;

        if (!phone.match(phonePattern)) {
            alert("Phone number should contain exactly 10 digits");
            return;
        }

        if (dob === "") {
            alert("Please select your Birth Date");
            return;
        }

        if (!gender) {
            alert("Please select Gender");
            return;
        }

        if (address === "") {
            alert("Please enter Address");
            return;
        }

        if (country === "") {
            alert("Please select Country");
            return;
        }

        if (city === "") {
            alert("Please enter City");
            return;
        }

        if (region === "") {
            alert("Please enter Region");
            return;
        }

        if (postal === "") {
            alert("Please enter Postal Code");
            return;
        }

        alert("🎉 Registration Successful!");

        console.log("------ Student Details ------");
        console.log("Name:", fullName);
        console.log("Email:", email);
        console.log("Phone:", phone);
        console.log("DOB:", dob);
        console.log("Gender:", gender.value);
        console.log("Address:", address);
        console.log("Address2:", address2);
        console.log("Country:", country);
        console.log("City:", city);
        console.log("Region:", region);
        console.log("Postal:", postal);

        form.reset();
    });
});
