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
        this.updateStats();
        this.bindEvents();
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

        const formData = this.collectFormData();
        const orderNumber = "ORD-" + Date.now();

        try {
            await this.sendToGoogleSheets({
                ...formData,
                orderNumber
            });

            this.saveOrder(formData, orderNumber);
            this.showSuccess(orderNumber);

            document.getElementById("bookingForm").reset();

        } catch (err) {
            console.error(err);
            this.saveOffline(formData, orderNumber);
            this.showWarning(orderNumber);
        }
    }

    // ============ SEND ============
    async sendToGoogleSheets(data) {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(data)
        });
    }

    // ============ FORM ============
    collectFormData() {
        return {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            service: document.getElementById("service").value,
            device: document.getElementById("device").value.trim(),
            problem: document.getElementById("problem").value.trim(),
            date: document.getElementById("date").value,
            priority: document.getElementById("priority").value || "عادية",
            status: "قيد المراجعة",
            timestamp: new Date().toISOString()
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

        if (!this.validateEgyptPhone(phone)) {
            this.showError("رقم مصري غير صحيح");
            return false;
        }

        if (!service) {
            this.showError("اختار الخدمة");
            return false;
        }

        if (problem.length < 5) {
            this.showError("اكتب المشكلة بالتفصيل");
            return false;
        }

        return true;
    }

    // تحقق رقم مصري
    validateEgyptPhone(number) {
        const cleaned = number.replace(/\D/g, "");
        return /^01[0125][0-9]{8}$/.test(cleaned);
    }

    // ============ STORAGE ============
    saveOrder(data, orderNumber) {
        const order = { ...data, orderNumber };

        this.state.orders.unshift(order);
        localStorage.setItem("orders", JSON.stringify(this.state.orders));

        this.updateStats();
    }

    saveOffline(data, orderNumber) {
        const offline = JSON.parse(localStorage.getItem("offlineOrders")) || [];
        offline.push({ ...data, orderNumber });
        localStorage.setItem("offlineOrders", JSON.stringify(offline));
    }

    // ============ TRACK ============
    async trackOrder() {
        const orderNumber = document.getElementById("trackOrderInput").value;

        if (!orderNumber) {
            alert("اكتب رقم الطلب");
            return;
        }

        try {
            const res = await fetch(GOOGLE_SCRIPT_URL + "?action=getOrder&orderNumber=" + orderNumber);
            const data = await res.json();

            document.getElementById("orderStatusResult").innerText =
                data.found ? "الحالة: " + data.status : "❌ غير موجود";

        } catch {
            document.getElementById("orderStatusResult").innerText = "⚠️ خطأ";
        }
    }

    // ============ EXPORT ============
    exportToExcel() {
        if (this.state.orders.length === 0) {
            this.showError("لا توجد بيانات");
            return;
        }

        let csv = "رقم الطلب,الاسم,الهاتف,الخدمة,الحالة\n";

        this.state.orders.forEach(o => {
            csv += `${o.orderNumber},${o.name},${o.phone},${o.service},${o.status}\n`;
        });

        const blob = new Blob(["\ufeff" + csv], { type: "text/csv" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "orders.csv";
        link.click();
    }

    // ============ STATS ============
    updateStats() {
        const total = this.state.orders.length;
        const pending = this.state.orders.filter(o => o.status === "قيد المراجعة").length;

        const totalEl = document.getElementById("totalOrders");
        const pendingEl = document.getElementById("pendingOrders");

        if (totalEl) totalEl.textContent = total;
        if (pendingEl) pendingEl.textContent = pending;
    }

    // ============ UI ============
    showSuccess(orderNumber) {
        alert(`✅ تم إرسال الطلب\n📋 رقم الطلب: ${orderNumber}`);
    }

    showError(msg) {
        alert("❌ " + msg);
    }

    showWarning(orderNumber) {
        alert(`⚠️ تم حفظ الطلب بدون إنترنت\n📋 رقم الطلب: ${orderNumber}`);
    }
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
    window.app = new TechServiceApp();
});
