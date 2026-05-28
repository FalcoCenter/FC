// ================= CONFIG =================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyerhrN3qtG8QjNif6YDBjEacNMxTe76Dd0oSuD8fHaS8Dm8G3mH1zZZs-if9rhmwiDVw/exec/exec";
// ================= APP =================
class TechServiceApp {
    constructor() {
        this.state = {
            orders: JSON.parse(localStorage.getItem("orders")) || []
        };

        this.init();
    }

    init() {
        this.updateStats();

        const form = document.getElementById("bookingForm");
        if (form) {
            form.addEventListener("submit", (e) => this.submitBooking(e));
        }
    }

    // ================= SUBMIT =================
    async submitBooking(e) {
        e.preventDefault();

        if (!this.validateForm()) return;

        const data = this.collectFormData();

        this.showLoading(true);

        try {
            await this.sendToGoogleSheets(data);

            const orderNumber = "ORD-" + Date.now();

            this.saveOrder(data, orderNumber);

            this.showSuccess(orderNumber);

            document.getElementById("bookingForm").reset();

        } catch (err) {
            console.error(err);

            this.saveOffline(data);

            this.showError("تم حفظ الطلب مؤقتاً بسبب ضعف الاتصال");
        }

        this.showLoading(false);
    }

    // ================= SEND =================
    async sendToGoogleSheets(data) {
    try {
        const res = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.text(); // مهم
        console.log("Response:", result);

        return true;

    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

    // ================= FORM =================
    collectFormData() {
    let phone = document.getElementById("phone").value.trim();

    // إصلاح الرقم لو ناقص 0
    if (!phone.startsWith("0")) {
        phone = "0" + phone;
    }

    return {
        name: document.getElementById("name").value.trim(),
        phone: phone,
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
            this.showError("اكتب اسم صحيح");
            return false;
        }

        if (!/^01[0125][0-9]{8}$/.test(phone)) {
            this.showError("رقم الهاتف غير صحيح");
            return false;
        }

        if (!service) {
            this.showError("اختار الخدمة");
            return false;
        }

        if (problem.length < 5) {
            this.showError("اكتب المشكلة");
            return false;
        }

        return true;
    }

    // ================= STORAGE =================
    saveOrder(data, orderNumber) {
        const order = {
            ...data,
            orderNumber,
            status: "قيد المراجعة",
            timestamp: new Date().toISOString()
        };

        this.state.orders.unshift(order);

        localStorage.setItem("orders", JSON.stringify(this.state.orders));

        this.updateStats();
    }

    saveOffline(data) {
        let offline = JSON.parse(localStorage.getItem("offlineOrders")) || [];
        offline.push(data);
        localStorage.setItem("offlineOrders", JSON.stringify(offline));
    }

    // ================= UI =================
    showSuccess(orderNumber) {
        alert(`✅ تم إرسال الطلب بنجاح\n📋 رقم الطلب: ${orderNumber}`);
    }

    showError(msg) {
        alert("❌ " + msg);
    }

    showLoading(show) {
        let btn = document.querySelector("#bookingForm button[type=submit]");
        if (!btn) return;

        btn.disabled = show;
        btn.textContent = show ? "جاري الإرسال..." : "احجز الآن";
    }

    // ================= STATS =================
    updateStats() {
        const total = this.state.orders.length;
        const pending = this.state.orders.filter(o => o.status === "قيد المراجعة").length;

        const totalEl = document.getElementById("totalOrders");
        const pendingEl = document.getElementById("pendingOrders");

        if (totalEl) totalEl.textContent = total;
        if (pendingEl) pendingEl.textContent = pending;
    }

    // ================= EXPORT =================
    exportToExcel() {
        if (this.state.orders.length === 0) {
            alert("لا توجد بيانات");
            return;
        }

        let csv = "رقم الطلب,الاسم,الهاتف,الخدمة,الحالة\n";

        this.state.orders.forEach(o => {
            csv += `${o.orderNumber},${o.name},${o.phone},${o.service},${o.status}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "orders.csv";
        link.click();
    }

    // ================= SYNC OFFLINE =================
    async syncOffline() {
        let offline = JSON.parse(localStorage.getItem("offlineOrders")) || [];

        if (offline.length === 0) return;

        for (let i = 0; i < offline.length; i++) {
            try {
                await this.sendToGoogleSheets(offline[i]);
                offline.splice(i, 1);
                i--;
            } catch {}
        }

        localStorage.setItem("offlineOrders", JSON.stringify(offline));
    }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    window.app = new TechServiceApp();

    // إعادة المحاولة عند رجوع الإنترنت
    window.addEventListener("online", () => {
        window.app.syncOffline();
    });

    console.log("🚀 App Ready");
});
