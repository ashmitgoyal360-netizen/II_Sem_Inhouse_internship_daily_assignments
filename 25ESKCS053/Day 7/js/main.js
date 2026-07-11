document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Scroll Progress Bar & Running Mascot Tracker (Top of Page)
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

    // 3. Interactive Route Showcase (Observer + Scroll-mascot tracker)
    const milestoneCards = document.querySelectorAll('.milestone-card');
    const routeStickyPanel = document.getElementById('routeStickyPanel');
    const milestoneScroller = document.querySelector('.milestone-scroller');
    const milestoneProgress = document.getElementById('milestoneProgress');
    const milestoneRunner = document.getElementById('milestoneRunner');
    const btnSimulateRoute = document.getElementById('btnSimulateRoute');

    // Dynamic Glow Theme Switcher
    function updateStickyPanel(card) {
        const routeIdx = card.getAttribute('data-route-index');
        const distance = card.getAttribute('data-distance');
        const elevation = card.getAttribute('data-elevation');
        const elevationPct = card.getAttribute('data-elevation-percent');
        const tipTitle = card.getAttribute('data-tip-title');
        const tipText = card.getAttribute('data-tip-text');
        const themeClass = card.getAttribute('data-theme-class');

        // Update active image layer
        document.querySelectorAll('.route-img-layer').forEach((img, index) => {
            if (index == routeIdx) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });

        // Update stats
        document.getElementById('routeStatDistance').innerText = distance;
        document.getElementById('routeStatElevation').innerText = elevation;
        document.getElementById('elevationBar').style.width = elevationPct + '%';
        document.getElementById('routeTipTitle').innerText = tipTitle;
        document.getElementById('routeTipText').innerText = tipText;

        // Switch Active Neon Glow Themes
        if (routeStickyPanel) {
            routeStickyPanel.className = 'route-sticky-panel glow-active ' + themeClass;
        }

        // Toggle active & glow classes on scroller cards
        milestoneCards.forEach(c => {
            if (c === card) {
                c.classList.add('active', 'glow-active');
                c.className = 'milestone-card active glow-active reveal ' + themeClass;
            } else {
                c.classList.remove('active', 'glow-active');
                c.className = 'milestone-card reveal';
            }
        });
    }

    // Scroll Observer for Milestone Cards
    let isSimulating = false; // Flag to prevent observer conflicts during simulation
    const milestoneObserver = new IntersectionObserver((entries) => {
        if (isSimulating) return; // Skip manual scroll updates if simulator is active
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                updateStickyPanel(entry.target);
            }
        });
    }, {
        threshold: [0.1, 0.3, 0.5, 0.7],
        rootMargin: '-10% 0px -40% 0px'
    });

    milestoneCards.forEach(card => {
        milestoneObserver.observe(card);
    });

    // Track scroll specifically inside the Route container to animate the vertical track runner
    window.addEventListener('scroll', () => {
        if (!milestoneScroller || !milestoneProgress || !milestoneRunner) return;

        const rect = milestoneScroller.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const startTrigger = viewportHeight / 2;
        const scrollDistance = startTrigger - rect.top;
        const totalScrollableHeight = rect.height - 150;

        let routeProgress = (scrollDistance / totalScrollableHeight) * 100;
        routeProgress = Math.max(0, Math.min(100, routeProgress));

        milestoneProgress.style.height = routeProgress + '%';
        milestoneRunner.style.top = routeProgress + '%';
    });

    // Virtual Route Simulation Engine
    let simulationTimeouts = [];
    if (btnSimulateRoute) {
        btnSimulateRoute.addEventListener('click', () => {
            if (isSimulating) {
                // Cancel active simulation
                stopRouteSimulation();
                return;
            }

            // Start simulation
            isSimulating = true;
            btnSimulateRoute.innerHTML = '<i class="fa-solid fa-pause me-2"></i>Stop Run';
            btnSimulateRoute.classList.add('running');

            const steps = [
                { id: 'milestoneCard0', delay: 0 },
                { id: 'milestoneCard1', delay: 2500 },
                { id: 'milestoneCard2', delay: 5000 }
            ];

            steps.forEach((step, index) => {
                const timeoutId = setTimeout(() => {
                    const card = document.getElementById(step.id);
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        updateStickyPanel(card);
                    }

                    // On final step, schedule completion UI
                    if (index === steps.length - 1) {
                        const completionTimeout = setTimeout(() => {
                            btnSimulateRoute.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i>Run Finished!';
                            btnSimulateRoute.classList.remove('running');
                            btnSimulateRoute.style.background = '#00F5FF';
                            btnSimulateRoute.style.color = 'var(--text-light)';

                            setTimeout(() => {
                                stopRouteSimulation();
                            }, 2000);
                        }, 2500);
                        simulationTimeouts.push(completionTimeout);
                    }
                }, step.delay);
                simulationTimeouts.push(timeoutId);
            });
        });
    }

    function stopRouteSimulation() {
        isSimulating = false;
        simulationTimeouts.forEach(tId => clearTimeout(tId));
        simulationTimeouts = [];
        if (btnSimulateRoute) {
            btnSimulateRoute.innerHTML = '<i class="fa-solid fa-play me-2"></i>Virtual Route Run';
            btnSimulateRoute.classList.remove('running');
            btnSimulateRoute.style.background = '';
            btnSimulateRoute.style.color = '';
        }
    }

    // 4. Countdown Timer
    const targetDate = new Date('July 25, 2026 06:00:00').getTime();
    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(countdownTimer);
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }, 1000);

    // 5. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        if (!el.classList.contains('milestone-card')) {
            revealObserver.observe(el);
        }
    });

    // 6. Target Pace Calculator
    const calcDistance = document.getElementById('calcDistance');
    const calcHours = document.getElementById('calcHours');
    const calcMinutes = document.getElementById('calcMinutes');
    const calcPaceResult = document.getElementById('calcPaceResult');

    function calculatePace() {
        const dist = parseFloat(calcDistance.value);
        const hours = parseInt(calcHours.value) || 0;
        const mins = parseInt(calcMinutes.value) || 0;

        const totalMinutes = (hours * 60) + mins;
        if (totalMinutes <= 0 || isNaN(dist)) {
            calcPaceResult.innerText = '--:--';
            return;
        }

        const paceDecimal = totalMinutes / dist;
        const paceMins = Math.floor(paceDecimal);
        const paceSecs = Math.round((paceDecimal - paceMins) * 60);

        const formattedSecs = String(paceSecs).padStart(2, '0');
        calcPaceResult.innerText = `${paceMins}:${formattedSecs}`;
    }

    if (calcDistance && calcHours && calcMinutes) {
        [calcDistance, calcHours, calcMinutes].forEach(element => {
            element.addEventListener('input', calculatePace);
        });
        calculatePace();
    }

    // 7. Interactive Gear Checklist (with LocalStorage)
    const checklistItems = document.querySelectorAll('.checklist-item');

    checklistItems.forEach(item => {
        const itemId = item.getAttribute('data-id');
        const isChecked = localStorage.getItem(`gear_${itemId}`) === 'true';
        if (isChecked) {
            item.classList.add('checked');
        }

        item.addEventListener('click', () => {
            item.classList.toggle('checked');
            const state = item.classList.contains('checked');
            localStorage.setItem(`gear_${itemId}`, state);
        });
    });

    // 8. Pre-select Race Category in Registration Modal
    const regModal = document.getElementById('registerModal');
    const categorySelect = document.getElementById('raceCategory');
    const regButtons = document.querySelectorAll('[data-bs-toggle="modal"][data-category]');

    regButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            if (categorySelect && category) {
                categorySelect.value = category;
            }
        });
    });

    // 9. Form Validation & Handling
    const regForm = document.getElementById('registrationForm');
    const formFields = regForm.querySelectorAll('.form-control, .form-select');
    const successMsg = document.getElementById('successMsg');
    const modalFooter = document.querySelector('.modal-footer');

    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) {
                validateField(field);
            }
        });
    });

    function validateField(field) {
        let isValid = true;
        
        if (field.id === 'fullName') {
            if (field.value.trim().length < 3) {
                showError(field, 'Name must be at least 3 characters long.');
                isValid = false;
            } else {
                removeError(field);
            }
        }

        if (field.id === 'emailAddress') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                showError(field, 'Please enter a valid email address.');
                isValid = false;
            } else {
                removeError(field);
            }
        }

        if (field.id === 'phoneNumber') {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(field.value.trim())) {
                showError(field, 'Please enter a valid 10-digit mobile number.');
                isValid = false;
            } else {
                removeError(field);
            }
        }

        if (field.id === 'raceCategory') {
            if (field.value === "") {
                showError(field, 'Please select a race category.');
                isValid = false;
            } else {
                removeError(field);
            }
        }

        if (field.id === 'runnerAge') {
            const age = parseInt(field.value);
            if (isNaN(age) || age < 12 || age > 99) {
                showError(field, 'Runners must be between 12 and 99 years of age.');
                isValid = false;
            } else {
                removeError(field);
            }
        }

        if (field.id === 'runnerGender') {
            if (field.value === "") {
                showError(field, 'Please select your gender.');
                isValid = false;
            } else {
                removeError(field);
            }
        }

        return isValid;
    }

    function showError(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.innerText = message;
        }
    }

    function removeError(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }

    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        formFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            regForm.style.display = 'none';
            if (modalFooter) modalFooter.style.display = 'none';
            successMsg.style.display = 'block';

            const name = document.getElementById('fullName').value;
            const categoryText = categorySelect.options[categorySelect.selectedIndex].text;
            document.getElementById('successRunnerName').innerText = name;
            document.getElementById('successCategory').innerText = categoryText;

            setTimeout(() => {
                regForm.reset();
                formFields.forEach(field => {
                    field.classList.remove('is-valid', 'is-invalid');
                });
            }, 2000);
        }
    });

    if (regModal) {
        regModal.addEventListener('hidden.bs.modal', () => {
            regForm.style.display = 'block';
            if (modalFooter) modalFooter.style.display = 'flex';
            successMsg.style.display = 'none';
            regForm.reset();
            formFields.forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
            });
        });
    }
});
