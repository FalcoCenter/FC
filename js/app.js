// ============ CONFIG ============
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxA7xksTRY3E6KNPz0hRqIBSdo2btDY6cQnwmW6YK3focI0UK-KVU5UJyDmQGOgP1VR/exec";

// ============ APP ============
class TechServiceApp {
    constructor() {
        this.state = {
            orders: JSON.parse(localStorage.getItem("orders")) || []
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
    }

    bindEvents() {
        const form = document.getElementById("bookingForm");
        if (form) {
            form.addEventListener("submit", (e) => this.submitBooking(e));
        }
    }
        // ============ SUBMIT ============
    async submitBooking(event) {
        event.preventDefault();

        if (!this.validateForm()) return;

        const data = this.collectFormData();

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(data)
            });

            this.saveOrder(data);
            this.showSuccess();

            document.getElementById("bookingForm").reset();

        } catch (err) {
            console.error(err);
            this.showError("فشل الإرسال");
        }
    }

    collectFormData() {
        return {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            service: document.getElementById("service").value,
            device: document.getElementById("device").value.trim(),
            problem: document.getElementById("problem").value.trim()
        };
    }

    validateForm() {
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const service = document.getElementById("service").value;
        const problem = document.getElementById("problem").value.trim();

        if (name.length < 3) {
            alert("اكتب اسم صحيح");
            return false;
        }

        if (!/^01[0125][0-9]{8}$/.test(phone)) {
            alert("رقم مصري غير صحيح");
            return false;
        }

        if (!service) {
            alert("اختار الخدمة");
            return false;
        }

        if (problem.length < 5) {
            alert("اكتب المشكلة");
            return false;
        }

        return true;
    }
        // ============ STORAGE ============
    saveOrder(data) {
        this.state.orders.unshift(data);
        localStorage.setItem("orders", JSON.stringify(this.state.orders));
        this.updateStats();
    }

    // ============ STATS ============
    updateStats() {
        const total = this.state.orders.length;

        const totalEl = document.getElementById("totalOrders");
        if (totalEl) totalEl.textContent = total;
    }

    // ============ UI ============
    showSuccess() {
        alert("✅ تم إرسال الطلب بنجاح");
    }

    showError(msg) {
        alert("❌ " + msg);
    }
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
    window.app = new TechServiceApp();
});
