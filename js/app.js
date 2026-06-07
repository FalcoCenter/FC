// ============ CONFIG ============
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxUowH6xWOY6o0cHl3Saq4sUqsiC0AzbI1xsalE3HqNoZeyklF3tYItPCIPGJCbWsx-g/exec";

// ============ APP CLASS ============
class TechServiceApp {
    constructor() {
        this.config = {
            phone: '+201275817812',
            email: 'F3lcoCenter@gmail.com',
            whatsapp: 'https://wa.me/201275817812',
            facebook: 'https://facebook.com',
            location: 'الأقصر البغدادي - بجوار مكتبة التميز',
            address: 'الطريق السياحي، البغدادي، الأقصر'
        };
        
        this.state = {
            userData: null,
            cookiesAccepted: false,
            currentOrder: null,
            chatOpen: false,
            csrfToken: this.generateCSRFToken(),
            portfolioItems: [],
            currentFilter: 'all',
            currentImageIndex: 0,
            sparkInterval: null,
            userRating: null,
            showRatingWidget: false,
            orders: []
        };
        
        this.portfolioData = [
            { id: 1, category: 'computer', image: 'https://i.ibb.co/k6JtcsKy/F-panell-clean.jpg', title: 'صيانة بوردة Dell', description: 'تنظيف مداخل USB و F_panel' },
            { id: 2, category: 'playstation', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231F2937"/><rect x="150" y="150" width="500" height="300" rx="30" fill="%23003791"/><circle cx="300" cy="300" r="40" fill="white"/><circle cx="500" cy="300" r="40" fill="white"/><rect x="280" y="280" width="40" height="40" rx="10" fill="%23003791"/><rect x="480" y="280" width="40" height="40" rx="10" fill="%23003791"/><text x="400" y="500" font-family="Arial" font-size="24" fill="white" text-anchor="middle">صيانة بلايستيشن</text></svg>', title: 'صيانة PS5', description: 'تحديث نظام وتنظيف داخلي كامل' },
            { id: 3, category: 'mobile', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231F2937"/><rect x="200" y="100" width="400" height="500" rx="40" fill="%2310B981"/><rect x="220" y="120" width="360" height="460" rx="30" fill="%230F172A"/><circle cx="400" cy="200" r="20" fill="%2310B981"/><rect x="300" y="300" width="200" height="100" rx="20" fill="%23F59E0B"/><text x="400" y="380" font-family="Arial" font-size="20" fill="white" text-anchor="middle">موبايل</text><text x="400" y="500" font-family="Arial" font-size="24" fill="white" text-anchor="middle">صيانة هواتف</text></svg>', title: 'صيانة هواتف متنوعة', description: 'إصلاح مشاكل السوفتوير لأجهزة iOS و Android' },
            { id: 4, category: 'receiver', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231F2937"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%231E3A8A"/><rect x="200" y="200" width="400" height="200" fill="%230F172A"/><circle cx="400" cy="300" r="30" fill="%23F59E0B"/><rect x="350" y="140" width="100" height="20" rx="10" fill="%231E3A8A"/><text x="400" y="470" font-family="Arial" font-size="24" fill="white" text-anchor="middle">تحديث ريسيفر</text></svg>', title: 'تحديث ريسيفر', description: 'تحديث فيرموير ريسيفر لمشاهدة القنوات' },
            { id: 5, category: 'design', image: 'https://i.ibb.co/S4H5V2tp/Angler-Fish.jpg', title: 'تصميم لوغو', description: 'تصميم شعار مطعم أسماك الصياد' },
            { id: 6, category: 'computer', image: 'https://i.ibb.co/sdGC7LDM/Falco-Win.png', title: 'تثبيت نسخة تشغيل', description: 'تثبيت نسخة تشغيل بصعوبة بعد إصلاح قطاعات هارد تالفة' },
            { id: 7, category: 'design', image: 'https://i.ibb.co/23KjzWfF/Smart-Education-Platform.png', title: 'تصميم لوغو', description: 'تصميم شعار لموقع منصة التعليم الذكية' },
            { id: 8, category: 'design', image: 'https://i.ibb.co/PvcJjBVF/logo-png.png', title: 'تصميم لوغو', description: 'تصميم شعار موقع سنتر الصقر' },
            { id: 9, category: 'design', image: 'https://i.ibb.co/mVYBdvkY/Excellence-Library.jpg', title: 'تصميم لوغو', description: 'تصميم شعار مكتبة التميز' },
            { id: 10, category: 'computer', image: 'https://i.ibb.co/xtJZb49r/Cleaning-all-motherbard.jpg', title: 'كمبيوتر لا يعمل نهائيا', description: 'تفكيك كامل لمكونات الجهاز - تطهير فتحات التهوية والمرشحات' },
            { id: 11, category: 'design', image: 'https://i.ibb.co/3YFWfSqt/Quassim-Font-Foundation.png', title: 'تصميم لوغو', description: 'تصميم لوغو مؤسسة أبو القاسم الحسيني للخط العربي' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupDOM();
        this.loadUserData();
        this.setupEventListeners();
        this.setupServiceWorker();
        this.initPortfolio();
        this.startSparkEffect();
        this.manageConnectionStatus();
        this.updateOrdersStats();
    }
    
    setupDOM() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        document.getElementById('csrfToken').value = this.state.csrfToken;
        
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = new Date().toISOString().split('T')[0];
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }
    }
    
    loadUserData() {
        try {
            const userData = localStorage.getItem('tech_service_user');
            const cookies = localStorage.getItem('tech_service_cookies');
            const orders = localStorage.getItem('tech_service_orders');
            const rating = localStorage.getItem('tech_service_rating');
            
            this.state.userData = userData ? JSON.parse(userData) : {};
            this.state.cookiesAccepted = cookies ? JSON.parse(cookies) : false;
            this.state.orders = orders ? JSON.parse(orders) : [];
            this.state.userRating = rating ? JSON.parse(rating) : null;
            
            if (!this.state.cookiesAccepted) {
                setTimeout(() => this.showCookieConsent(), 2000);
            }
            
            this.loadOrderHistory();
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        document.addEventListener('click', (event) => {
            const navLinks = document.getElementById('navLinks');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (navLinks && navLinks.classList.contains('active') && 
                mobileMenuBtn && !navLinks.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                this.toggleMobileMenu();
            }
        });
        
        window.addEventListener('scroll', () => this.updateActiveNavLink());
        document.addEventListener('keydown', (event) => this.handleKeyboardShortcuts(event));
        window.addEventListener('resize', () => this.handleResize());
        
        const chatbotToggle = document.getElementById('chatbotToggle');
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        }
        
        const chatbotInput = document.getElementById('chatbotInput');
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') this.sendChatMessage();
            });
        }
        
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('input', () => this.autosaveForm());
        }
        
        const logoContainer = document.querySelector('.logo');
        if (logoContainer) {
            logoContainer.addEventListener('mouseenter', () => this.increaseSparkEffect());
            logoContainer.addEventListener('mouseleave', () => this.normalSparkEffect());
        }
        
        this.setupLazyLoading();
        
        document.querySelectorAll('.rating-star').forEach(star => {
            star.addEventListener('click', (e) => this.handleStarClick(e));
            star.addEventListener('mouseover', (e) => this.handleStarHover(e));
        });
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    await navigator.serviceWorker.register('/sw.js');
                    console.log('ServiceWorker registered');
                } catch (error) {
                    console.log('ServiceWorker registration failed:', error);
                }
            });
        }
    }
    
    setupLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px', threshold: 0.1 });
        
        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
    
    generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    startSparkEffect() {
        this.state.sparkInterval = setInterval(() => {
            this.createSpark('logoSparkContainer');
            this.createSpark('heroLogoContainer');
        }, 300);
    }
    
    createSpark(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const spark = document.createElement('div');
        spark.className = containerId === 'heroLogoContainer' ? 'hero-spark' : 'logo-spark';
        const angle = Math.random() * Math.PI * 2;
        const radius = containerId === 'heroLogoContainer' ? 80 : 25;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        spark.style.left = `calc(50% + ${x}px)`;
        spark.style.top = `calc(50% + ${y}px)`;
        container.appendChild(spark);
        
        const targetX = x + (Math.random() - 0.5) * 100;
        const targetY = y + (Math.random() - 0.5) * 100;
        
        spark.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
        ], { duration: 1000 + Math.random() * 1000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
        
        setTimeout(() => { if (spark.parentNode) spark.parentNode.removeChild(spark); }, 2000);
    }
    
    increaseSparkEffect() {
        if (this.state.sparkInterval) clearInterval(this.state.sparkInterval);
        this.state.sparkInterval = setInterval(() => {
            this.createSpark('logoSparkContainer');
            this.createSpark('heroLogoContainer');
        }, 100);
    }
    
    normalSparkEffect() {
        if (this.state.sparkInterval) clearInterval(this.state.sparkInterval);
        this.state.sparkInterval = setInterval(() => {
            this.createSpark('logoSparkContainer');
            this.createSpark('heroLogoContainer');
        }, 300);
    }
    
    handleScroll() {
        const header = document.getElementById('mainHeader');
        const scrollTopBtn = document.getElementById('scrollTop');
        const progressBar = document.getElementById('progressBar');
        const scrollY = window.scrollY;
        
        if (header) header.classList.toggle('scrolled', scrollY > 100);
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollY > 300);
        
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = (winScroll / height) * 100 + '%';
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.getElementById('mainHeader').offsetHeight;
            window.scrollTo({ top: section.offsetTop - headerHeight - 20, behavior: 'smooth' });
            this.updateActiveNavLink();
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('active')) this.toggleMobileMenu();
        }
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        let currentSection = '';
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) link.classList.add('active');
        });
    }
    
    toggleMobileMenu() {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (navLinks && mobileMenuBtn) {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        }
    }
    
    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        this.state.chatOpen = !this.state.chatOpen;
        if (chatbotWindow) {
            chatbotWindow.style.display = this.state.chatOpen ? 'block' : 'none';
            if (this.state.chatOpen) setTimeout(() => document.getElementById('chatbotInput')?.focus(), 100);
        }
    }
    
    closeChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        this.state.chatOpen = false;
        if (chatbotWindow) chatbotWindow.style.display = 'none';
    }
    
    async sendChatMessage() {
        const input = document.getElementById('chatbotInput');
        const messages = document.getElementById('chatbotMessages');
        if (!input || !messages || !input.value.trim()) return;
        
        const message = input.value.trim();
        input.value = '';
        
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<p><strong>أنت:</strong> ${message}</p>`;
        messages.appendChild(userMessage);
        
        setTimeout(() => {
            const response = this.getChatbotResponse(message);
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `<p><strong>المساعد:</strong> ${response}</p>`;
            messages.appendChild(botMessage);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
        
        messages.scrollTop = messages.scrollHeight;
    }
    
    getChatbotResponse(message) {
        message = message.toLowerCase();
        const responses = {
            'سعر|اسعار': 'أسعار خدماتنا تبدأ من 150 جنيه وتختلف حسب نوع الخدمة.',
            'موعد': 'يمكنك حجز موعد عبر نموذج الحجز الموجود في الموقع.',
            'موقع': 'نحن موجودون في الأقصر البغدادي - الطريق السياحي.',
            'هاتف': 'رقم الهاتف: +201275817812',
            'ضمان': 'جميع خدماتنا مضمونة: 30 يوم على الصيانة، 90 يوم على البرمجة.',
            'مرحبا|اهلا': 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟'
        };
        
        for (const [keywords, response] of Object.entries(responses)) {
            if (keywords.includes('|')) {
                if (keywords.split('|').some(k => message.includes(k))) return response;
            } else if (message.includes(keywords)) return response;
        }
        return 'كيف يمكنني مساعدتك؟ يمكنك الاستفسار عن: الأسعار، المواعيد، الموقع، الهاتف، الضمان.';
    }
    
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey && event.key === 'b') { event.preventDefault(); this.scrollToSection('booking'); }
        if (event.ctrlKey && event.key === 'h') { event.preventDefault(); this.scrollToSection('home'); }
        if (event.ctrlKey && event.key === 'p') { event.preventDefault(); this.scrollToSection('portfolio'); }
        if (event.key === 'Escape') {
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('active')) this.toggleMobileMenu();
            if (this.state.chatOpen) this.closeChatbot();
            if (this.state.showRatingWidget) this.closeRating();
            this.closeLightbox();
        }
        if (event.key === 'ArrowRight') this.prevImage();
        if (event.key === 'ArrowLeft') this.nextImage();
    }
    
    handleResize() {
        if (window.innerWidth > 768) {
            const navLinks = document.getElementById('navLinks');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    }
    
    // ============ GOOGLE SHEETS INTEGRATION ============
    async submitBooking(event) {
        event.preventDefault();
        if (!this.validateBookingForm()) return;
        
        this.showLoading();
        try {
            const formData = this.collectFormData();
            const response = await this.sendToGoogleSheets(formData);
            
            if (response.success) {
                this.saveBooking(formData, response.orderNumber);
                this.showSuccessMessage(formData, response.orderNumber);
                document.getElementById('bookingForm').reset();
                this.loadOrderHistory();
                this.updateOrdersStats();
                setTimeout(() => { if (!this.state.userRating) this.openRatingWidget(); }, 5000);
            } else {
                throw new Error(response.error || 'فشل في إرسال الطلب');
            }
        } catch (error) {
            console.error('Booking error:', error);
            const formData = this.collectFormData();
            const orderNumber = 'TS' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            this.saveBooking(formData, orderNumber);
            this.showOfflineSuccess(formData, orderNumber);
            this.updateOrdersStats();
        } finally {
            this.hideLoading();
        }
    }
    
    async sendToGoogleSheets(formData) {
        const dataToSend = {
            apiKey: 'FALCO_SECURE_2026',
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            service: formData.service,
            device: formData.device,
            problem: formData.problem,
            date: formData.date,
            priority: formData.priority,
            notes: formData.notes,
            timestamp: formData.timestamp,
            status: formData.status
        };
        
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            return { success: true, orderNumber: 'TS' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0') };
        } catch (error) {
            return { success: true, orderNumber: 'TS' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0') };
        }
    }
    
    collectFormData() {
        let phone = document.getElementById("phone")?.value.trim() || "";
        if (phone && !phone.startsWith("0") && phone.length === 10) phone = "0" + phone;
        
        return {
            name: document.getElementById("name")?.value.trim() || "",
            phone: phone,
            email: document.getElementById("email")?.value.trim() || "",
            service: document.getElementById("service")?.value || "",
            device: document.getElementById("device")?.value.trim() || "",
            problem: document.getElementById("problem")?.value.trim() || "",
            date: document.getElementById("date")?.value || "",
            priority: document.getElementById("priority")?.value || "normal",
            notes: document.getElementById("notes")?.value.trim() || "",
            status: "قيد المراجعة",
            timestamp: new Date().toISOString()
        };
    }
    
    validateBookingForm() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const problem = document.getElementById('problem').value.trim();
        
        if (!name || name.length < 3) { this.showError('الرجاء إدخال اسم صحيح (3 أحرف على الأقل)'); return false; }
        if (!phone || !this.validateEgyptPhone(phone)) { this.showError('الرجاء إدخال رقم هاتف مصري صحيح'); return false; }
        if (!service) { this.showError('الرجاء اختيار نوع الخدمة'); return false; }
        if (!problem || problem.length < 10) { this.showError('الرجاء وصف المشكلة بالتفصيل (10 أحرف على الأقل)'); return false; }
        return true;
    }
    
    validateEgyptPhone(number) {
        if (!number || typeof number !== 'string') return false;
        let cleaned = number.trim().replace(/[\s\-+()]/g, '').replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632));
        if (cleaned.startsWith('002')) cleaned = '0' + cleaned.substring(3);
        else if (cleaned.startsWith('+2')) cleaned = '0' + cleaned.substring(2);
        else if (cleaned.startsWith('2') && cleaned.length >= 10) cleaned = '0' + cleaned;
        const mobileRegex = /^01[0125][0-9]{8}$/;
        const landlineRegex = /^0(2|3|13|40|45|50|55|57|62|64|65|66|68|69|88|92|93|95|96|97)[0-9]{7,8}$/;
        return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
    }
    
    saveBooking(formData, orderNumber) {
        try {
            if (!this.state.userData.name) {
                this.state.userData = { name: formData.name, phone: formData.phone, email: formData.email, lastVisit: new Date().toISOString() };
                localStorage.setItem('tech_service_user', JSON.stringify(this.state.userData));
            }
            const orderWithNumber = { ...formData, orderNumber: orderNumber, read: false };
            this.state.orders.unshift(orderWithNumber);
            if (this.state.orders.length > 50) this.state.orders = this.state.orders.slice(0, 50);
            localStorage.setItem('tech_service_orders', JSON.stringify(this.state.orders));
            this.state.currentOrder = orderWithNumber;
        } catch (error) { console.error('Error saving booking:', error); }
    }
    
    loadOrderHistory() {
        const ordersList = document.getElementById('ordersList');
        const orderHistory = document.getElementById('orderHistory');
        if (!ordersList) return;
        
        if (this.state.orders.length === 0) {
            ordersList.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class="fas fa-clipboard-list" style="font-size: 3rem;"></i><p>لا توجد طلبات سابقة</p></div>`;
            if (orderHistory) orderHistory.style.display = 'none';
            return;
        }
        if (orderHistory) orderHistory.style.display = 'block';
        
        ordersList.innerHTML = this.state.orders.map(order => `
            <div style="background: white; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid #E5E7EB;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                        <strong style="color: #1E3A8A;">${order.orderNumber}</strong>
                        <span style="background: ${this.getStatusColor(order.status)}; color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; margin-right: 1rem;">${order.status}</span>
                    </div>
                    <span style="color: #6B7280; font-size: 0.875rem;">${this.formatDate(order.timestamp)}</span>
                </div>
                <div style="margin-bottom: 0.5rem;"><strong>الخدمة:</strong> ${order.service}</div>
                <div style="color: #6B7280; font-size: 0.875rem; margin-bottom: 1rem;">${order.problem.substring(0, 100)}${order.problem.length > 100 ? '...' : ''}</div>
                ${order.notes ? `<div style="background: #FEF3C7; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem; border-right: 3px solid #F59E0B;"><strong style="color: #B45309;"><i class="fas fa-pen"></i> ملاحظاتك:</strong><p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #78350F;">${order.notes}</p></div>` : ''}
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; flex-wrap: wrap;">
                    <button onclick="app.viewOrderDetails('${order.orderNumber}')" style="background: #F3F4F6; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;">التفاصيل</button>
                    <button onclick="app.trackOrder('${order.orderNumber}')" style="background: #10B981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;">متابعة</button>
                    <button onclick="app.showStatusUpdateDialog('${order.orderNumber}')" style="background: #8B5CF6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;"><i class="fas fa-sync-alt"></i> تحديث الحالة</button>
                </div>
            </div>
        `).join('');
    }
    
    getStatusColor(status) {
        const colors = { 'قيد المراجعة': '#F59E0B', 'جار العمل على طلبك': '#3B82F6', 'تم': '#10B981' };
        return colors[status] || '#6B7280';
    }
    
    formatDate(isoString) {
        return new Date(isoString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    async updateOrderStatus(orderNumber, newStatus, adminNote = "", clientNote = "") {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'updateStatus', orderNumber: orderNumber, status: newStatus, adminNote: adminNote, clientNote: clientNote, apiKey: 'FALCO_SECURE_2026' })
            });
            const order = this.state.orders.find(o => o.orderNumber === orderNumber);
            if (order) { order.status = newStatus; localStorage.setItem('tech_service_orders', JSON.stringify(this.state.orders)); this.loadOrderHistory(); this.updateOrdersStats(); }
            this.showFormSuccess(`تم تحديث حالة الطلب ${orderNumber} إلى ${newStatus}`);
        } catch (error) { console.error("Error updating status:", error); this.showFormError("حدث خطأ في تحديث الحالة"); }
    }
    
    showStatusUpdateDialog(orderNumber) {
        const order = this.state.orders.find(o => o.orderNumber === orderNumber);
        if (!order) { this.showError("لم يتم العثور على الطلب"); return; }
        
        const modal = document.createElement('div');
        modal.id = 'statusModal';
        modal.style.cssText = `position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:1rem;`;
        modal.innerHTML = `
            <div style="background:white;border-radius:1rem;max-width:500px;width:100%;padding:1.5rem;">
                <h3 style="margin:0 0 1rem 0;">تحديث حالة الطلب</h3>
                <p><strong>رقم الطلب:</strong> ${orderNumber}</p>
                <p><strong>العميل:</strong> ${order.name}</p>
                <div style="margin-bottom:1rem;">
                    <label style="display:block;margin-bottom:0.5rem;">الحالة الجديدة:</label>
                    <select id="newStatus" style="width:100%;padding:0.75rem;border:1px solid #E5E7EB;border-radius:0.5rem;">
                        <option value="قيد المراجعة" ${order.status === 'قيد المراجعة' ? 'selected' : ''}>قيد المراجعة</option>
                        <option value="جار العمل على طلبك" ${order.status === 'جار العمل على طلبك' ? 'selected' : ''}>جار العمل على طلبك</option>
                        <option value="تم" ${order.status === 'تم' ? 'selected' : ''}>تم</option>
                    </select>
                </div>
                <div style="margin-bottom:1rem;">
                    <label style="display:block;margin-bottom:0.5rem;">ملاحظة للإدارة (داخلية):</label>
                    <textarea id="adminNote" rows="2" style="width:100%;padding:0.75rem;border:1px solid #E5E7EB;border-radius:0.5rem;" placeholder="ملاحظة لفريق العمل..."></textarea>
                </div>
                <div style="margin-bottom:1rem;">
                    <label style="display:block;margin-bottom:0.5rem;">إشعار للعميل:</label>
                    <textarea id="clientNote" rows="2" style="width:100%;padding:0.75rem;border:1px solid #E5E7EB;border-radius:0.5rem;" placeholder="سيظهر هذا الإشعار للعميل..."></textarea>
                </div>
                <div style="display:flex;gap:1rem;justify-content:flex-end;">
                    <button onclick="document.getElementById('statusModal').remove()" style="padding:0.5rem 1rem;background:#F3F4F6;border:none;border-radius:0.5rem;cursor:pointer;">إلغاء</button>
                    <button onclick="app.confirmStatusUpdate('${orderNumber}')" style="padding:0.5rem 1rem;background:#10B981;color:white;border:none;border-radius:0.5rem;cursor:pointer;">تحديث</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }
    
    confirmStatusUpdate(orderNumber) {
        const newStatus = document.getElementById('newStatus')?.value;
        const adminNote = document.getElementById('adminNote')?.value;
        const clientNote = document.getElementById('clientNote')?.value;
        if (newStatus) {
            this.updateOrderStatus(orderNumber, newStatus, adminNote, clientNote);
            document.getElementById('statusModal')?.remove();
        }
    }
    
    showOfflineSuccess(formData, orderNumber) {
        alert(`⚠️ تم حفظ طلبك محلياً\n✅ سيتم إرساله تلقائياً عند عودة الاتصال\n📋 رقم طلبك: ${orderNumber}`);
    }
    
    showSuccessMessage(formData, orderNumber) {
        alert(`✅ تم إرسال طلبك بنجاح!\n🎉 شكراً ${formData.name}!\n📋 رقم طلبك: ${orderNumber}\n📞 سنتصل بك قريباً`);
        if (Notification.permission === 'granted') new Notification('تم استلام طلبك!', { body: `رقم الطلب: ${orderNumber}` });
    }
    
    showError(message) { alert(`❌ ${message}`); }
    
    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) { spinner.style.display = 'block'; document.body.style.cursor = 'wait'; }
    }
    
    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) { spinner.style.display = 'none'; document.body.style.cursor = 'default'; }
    }
    
    acceptCookies() {
        this.state.cookiesAccepted = true;
        localStorage.setItem('tech_service_cookies', 'true');
        const cookieConsent = document.getElementById('cookieConsent');
        if (cookieConsent) cookieConsent.classList.remove('show');
    }
    
    showCookieConsent() {
        setTimeout(() => { const cc = document.getElementById('cookieConsent'); if (cc) cc.classList.add('show'); }, 2000);
    }
    
    autosaveForm() {
        const form = document.getElementById('bookingForm');
        if (form) {
            const formData = {};
            ['name', 'phone', 'email', 'service', 'device', 'problem', 'date', 'priority', 'notes'].forEach(id => {
                const el = document.getElementById(id);
                if (el) formData[id] = el.value;
            });
            localStorage.setItem('tech_service_form_autosave', JSON.stringify(formData));
        }
    }
    
    bookService(service) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = service;
            this.scrollToSection('booking');
            setTimeout(() => {
                const problemField = document.getElementById('problem');
                if (problemField) { problemField.focus(); problemField.value = `أرغب في خدمة ${service}، المشكلة هي: `; }
            }, 500);
        }
    }
    
    callUs() { if (confirm(`هل تريد الاتصال بنا الآن على الرقم ${this.config.phone}؟`)) window.location.href = `tel:${this.config.phone}`; }
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    
    toggleFAQ(element) {
        const answer = element.nextElementSibling;
        const icon = element.querySelector('.faq-icon');
        const isExpanded = element.getAttribute('aria-expanded') === 'true';
        if (!isExpanded) {
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== element.parentElement) {
                    item.querySelector('.faq-answer').classList.remove('active');
                    item.querySelector('.faq-icon').textContent = '➕';
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    item.classList.remove('active');
                }
            });
        }
        answer.classList.toggle('active');
        element.setAttribute('aria-expanded', !isExpanded);
        element.parentElement.classList.toggle('active');
        icon.textContent = isExpanded ? '➕' : '➖';
    }
    
    viewOrderDetails(orderNumber) {
        const order = this.state.orders.find(o => o.orderNumber === orderNumber);
        if (order) alert(this.generateOrderDetails(order));
    }
    
    generateOrderDetails(order) {
        return `فاتورة خدمة - مركز الصقر\n=======================\nرقم الطلب: ${order.orderNumber}\nالتاريخ: ${this.formatDate(order.timestamp)}\n\nمعلومات العميل:\nالاسم: ${order.name}\nالهاتف: ${order.phone}\n${order.email ? `البريد: ${order.email}` : ''}\n\nتفاصيل الخدمة:\nنوع الخدمة: ${order.service}\nالجهاز: ${order.device || 'غير محدد'}\nالمشكلة: ${order.problem}\n${order.notes ? `\nملاحظات العميل:\n${order.notes}` : ''}\n\nشكراً لثقتك بنا\nمركز الصقر\n${this.config.phone}`;
    }
    
    trackOrder(orderNumber) { alert(`متابعة الطلب ${orderNumber}\n\nالحالة: ${this.state.orders.find(o => o.orderNumber === orderNumber)?.status || 'قيد المراجعة'}\nسنتواصل معك قريباً.`); }
    showMoreTestimonials() { alert('سيتم تحميل المزيد من التقييمات قريباً...'); }
    
    openRatingWidget() { const w = document.getElementById('ratingWidget'); if (w) { w.style.display = 'block'; this.state.showRatingWidget = true; } }
    closeRating() { const w = document.getElementById('ratingWidget'); if (w) { w.style.display = 'none'; this.state.showRatingWidget = false; } }
    
    handleStarClick(event) {
        const rating = parseInt(event.target.dataset.rating);
        this.state.userRating = rating;
        localStorage.setItem('tech_service_rating', JSON.stringify(rating));
        document.querySelectorAll('.rating-star').forEach((star, index) => { star.style.color = index < rating ? '#F59E0B' : '#E5E7EB'; });
        alert(`شكراً لك على تقييمك ${rating} نجوم!`);
        this.closeRating();
    }
    
    handleStarHover(event) {
        const rating = parseInt(event.target.dataset.rating);
        document.querySelectorAll('.rating-star').forEach((star, index) => { star.style.color = index < rating ? '#F59E0B' : '#E5E7EB'; });
    }
    
    showPrivacyPolicy() { alert("سياسة الخصوصية\n===============\nنحن نحمي خصوصية بياناتك..."); }
    showTerms() { alert("شروط الخدمة\n===========\nباستخدامك لخدماتنا فإنك توافق على هذه الشروط..."); }
    showRefundPolicy() { alert("سياسة الاسترجاع\n===============\nيمكنك طلب استرجاع المبلغ خلال 24 ساعة..."); }
    showContactInfo() { alert(`معلومات الاتصال\n===============\n📍 ${this.config.address}\n📞 ${this.config.phone}\n📧 ${this.config.email}`); }
    showFAQ() { this.scrollToSection('faq'); }
    
    // Portfolio Methods
    initPortfolio() { this.renderPortfolio(); this.setupPortfolioEvents(); }
    
    renderPortfolio() {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;
        const items = this.state.currentFilter === 'all' ? this.portfolioData : this.portfolioData.filter(i => i.category === this.state.currentFilter);
        grid.innerHTML = items.map(item => `
            <div class="portfolio-item" data-id="${item.id}">
                <div class="portfolio-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <div class="portfolio-info"><h3>${item.title}</h3><p>${item.description}</p></div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    setupPortfolioEvents() {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;
        grid.addEventListener('click', (e) => {
            const item = e.target.closest('.portfolio-item');
            if (item) this.openLightbox(parseInt(item.dataset.id));
        });
    }
    
    filterPortfolio(category) {
        this.state.currentFilter = category;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.filter-btn').forEach(btn => { if (btn.textContent.trim() === 'الكل' && category === 'all') btn.classList.add('active'); else if (btn.getAttribute('onclick')?.includes(`'${category}'`)) btn.classList.add('active'); });
        this.renderPortfolio();
    }
    
    openLightbox(id) {
        const item = this.portfolioData.find(i => i.id === id);
        if (!item) return;
        this.state.currentImageIndex = this.portfolioData.findIndex(i => i.id === id);
        const lb = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImage');
        const title = document.getElementById('lightboxTitle');
        const desc = document.getElementById('lightboxDescription');
        img.src = item.image; title.textContent = item.title; desc.textContent = item.description;
        lb.classList.add('show'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
        setTimeout(() => document.querySelector('.lightbox-close').focus(), 100);
    }
    
    closeLightbox() { const lb = document.getElementById('lightbox'); lb.classList.remove('show'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = 'auto'; }
    
    nextImage() {
        const items = this.state.currentFilter === 'all' ? this.portfolioData : this.portfolioData.filter(i => i.category === this.state.currentFilter);
        if (!items.length) return;
        this.state.currentImageIndex = (this.state.currentImageIndex + 1) % items.length;
        const item = items[this.state.currentImageIndex];
        const img = document.getElementById('lightboxImage'), title = document.getElementById('lightboxTitle'), desc = document.getElementById('lightboxDescription');
        img.style.opacity = '0';
        setTimeout(() => { img.src = item.image; title.textContent = item.title; desc.textContent = item.description; img.style.opacity = '1'; }, 200);
    }
    
    prevImage() {
        const items = this.state.currentFilter === 'all' ? this.portfolioData : this.portfolioData.filter(i => i.category === this.state.currentFilter);
        if (!items.length) return;
        this.state.currentImageIndex = (this.state.currentImageIndex - 1 + items.length) % items.length;
        const item = items[this.state.currentImageIndex];
        const img = document.getElementById('lightboxImage'), title = document.getElementById('lightboxTitle'), desc = document.getElementById('lightboxDescription');
        img.style.opacity = '0';
        setTimeout(() => { img.src = item.image; title.textContent = item.title; desc.textContent = item.description; img.style.opacity = '1'; }, 200);
    }
    
    loadMorePortfolio() {
        const newItems = [
            { id: this.portfolioData.length + 1, category: 'receiver', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231F2937"/><rect x="200" y="150" width="400" height="350" rx="20" fill="%238B5CF6"/><rect x="250" y="200" width="300" height="250" fill="%230F172A"/><text x="400" y="350" font-family="Arial" font-size="48" fill="white" text-anchor="middle">IPTV</text></svg>', title: 'تحديث قنوات ريسيفر', description: 'تحديث جميع القنوات ورفع حظر التشفير' },
            { id: this.portfolioData.length + 2, category: 'computer', image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231F2937"/><rect x="150" y="150" width="500" height="300" rx="20" fill="%2310B981"/><rect x="200" y="200" width="400" height="200" fill="%230F172A"/><text x="400" y="320" font-family="Arial" font-size="64" fill="white" text-anchor="middle">RAM</text></svg>', title: 'ترقية ذاكرة RAM', description: 'ترقية ذاكرة الكمبيوتر لتحسين الأداء' }
        ];
        this.portfolioData.push(...newItems);
        this.renderPortfolio();
        this.setupPortfolioEvents();
        alert('تم تحميل المزيد من الأعمال بنجاح!');
    }
    
    // Management Methods
    exportToExcel() {
        if (!this.state.orders.length) { this.showFormWarning('لا توجد حجوزات لتصديرها'); return; }
        const headers = ['رقم الطلب', 'التاريخ', 'الوقت', 'الاسم', 'الهاتف', 'البريد', 'الخدمة', 'الجهاز', 'المشكلة', 'التاريخ المفضل', 'الأولوية', 'الحالة', 'ملاحظات'];
        const csv = [headers.join(',')].concat(this.state.orders.map(o => {
            const d = new Date(o.timestamp);
            return [o.orderNumber, d.toLocaleDateString('ar-EG'), d.toLocaleTimeString('ar-EG'), `"${o.name}"`, o.phone, o.email || '', o.service, `"${o.device || ''}"`, `"${o.problem}"`, o.date || '', o.priority || 'عادية', o.status, `"${o.notes || ''}"`].join(',');
        })).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `حجوزات_مركز_الصقر_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.showFormSuccess(`تم تصدير ${this.state.orders.length} حجز`);
    }
    
    viewAllOrders() {
        if (!this.state.orders.length) { this.showFormWarning('لا توجد حجوزات'); return; }
        let html = `<div style="max-height:500px;overflow-y:auto;"><h3 style="text-align:center">جميع الحجوزات (${this.state.orders.length})</h3>`;
        this.state.orders.forEach(o => { html += `<div style="border:1px solid #E5E7EB;border-radius:0.5rem;padding:1rem;margin-bottom:1rem;"><strong>${o.orderNumber}</strong><br>${o.name} | ${o.phone}<br>${o.service} | ${o.status}</div>`; });
        html += `</div><div style="display:flex;gap:1rem;justify-content:center;margin-top:1rem;"><button onclick="app.exportToExcel()" class="btn btn-primary">تصدير Excel</button><button onclick="this.closest('#customModal')?.remove()" class="btn btn-secondary">إغلاق</button></div>`;
        const modal = document.createElement('div'); modal.id = 'customModal'; modal.style.cssText = `position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:2rem;`;
        modal.innerHTML = `<div style="background:white;border-radius:1rem;max-width:600px;width:100%;max-height:90vh;overflow:auto;padding:1.5rem;">${html}</div>`;
        document.body.appendChild(modal);
    }
    
    clearAllOrders() {
        if (!this.state.orders.length) { this.showFormWarning('لا توجد حجوزات'); return; }
        if (confirm(`مسح ${this.state.orders.length} حجز؟ لا يمكن التراجع.`)) { this.state.orders = []; localStorage.setItem('tech_service_orders', '[]'); this.loadOrderHistory(); this.updateOrdersStats(); this.showFormSuccess('تم مسح جميع الحجوزات'); }
    }
    
    manageConnectionStatus() {
        const el = document.getElementById('connectionStatus');
        if (!el) return;
        const update = () => {
            const online = navigator.onLine;
            el.className = `connection-status ${online ? 'online' : 'offline'}`;
            el.innerHTML = `<i class="fas fa-${online ? 'wifi' : 'exclamation-triangle'}"></i><span>${online ? 'متصل' : 'غير متصل - حفظ محلياً'}</span>`;
            el.style.display = 'flex';
            setTimeout(() => el.style.display = 'none', 5000);
        };
        update();
        window.addEventListener('online', update);
        window.addEventListener('offline', update);
    }
    
    showFormSuccess(msg) { const s = document.getElementById('successStatus'); if (s) { document.getElementById('successMessage').textContent = msg; s.style.display = 'flex'; setTimeout(() => s.style.display = 'none', 5000); } }
    showFormError(msg) { const e = document.getElementById('errorStatus'); if (e) { document.getElementById('errorMessage').textContent = msg; e.style.display = 'flex'; setTimeout(() => e.style.display = 'none', 5000); } }
    showFormWarning(msg) { const w = document.getElementById('warningStatus'); if (w) { document.getElementById('warningMessage').textContent = msg; w.style.display = 'flex'; setTimeout(() => w.style.display = 'none', 5000); } }
    
    updateOrdersStats() {
        const total = this.state.orders.length;
        const pending = this.state.orders.filter(o => o.status === 'قيد المراجعة').length;
        const completed = this.state.orders.filter(o => o.status === 'تم').length;
        ['totalOrders', 'pendingOrders', 'completedOrders'].forEach((id, i) => { const el = document.getElementById(id); if (el) el.textContent = [total, pending, completed][i]; });
    }
    
    syncOfflineData() {
        if (!navigator.onLine) return;
        const offline = JSON.parse(localStorage.getItem('tech_service_offline_orders') || '[]');
        if (!offline.length) return;
        offline.forEach(async (order, i) => {
            try { await this.sendToGoogleSheets(order); offline.splice(i,1); localStorage.setItem('tech_service_offline_orders', JSON.stringify(offline)); } catch(e) {}
        });
    }
}

// Global Functions
function trackOrder() {
    const num = document.getElementById('trackOrderInput')?.value.trim();
    if (num && window.app) window.app.trackOrder(num);
    else if (!num) alert('الرجاء إدخال رقم الطلب');
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TechServiceApp();
    const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fade-in'); }); }, { threshold: 0.1 });
    document.querySelectorAll('.service-card, .testimonial-card, .form-container, .portfolio-item, .contact-method').forEach(el => observer.observe(el));
    if ('Notification' in window && Notification.permission === 'default') setTimeout(() => Notification.requestPermission(), 5000);
    window.addEventListener('online', () => setTimeout(() => window.app.syncOfflineData(), 3000));
    console.log('🚀 مركز الصقر جاهز للعمل مع نظام الحالات والملاحظات!');
});
