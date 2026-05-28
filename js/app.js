// ============ CONFIG ============
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxA7xksTRY3E6KNPz0hRqIBSdo2btDY6cQnwmW6YK3focI0UK-KVU5UJyDmQGOgP1VR/exec";

// ============ APP ============
class TechServiceApp {
    constructor() {
        this.state = {
            orders: []
        };

        this.init();
    }

    init() {
        this.loadOrders();
        this.updateStats();
    }

    // ============ SUBMIT ============
    async submitBooking(event) {
        event.preventDefault();

        if (!this.validateForm()) return;

        const formData = this.collectFormData();

        try {
            const res = await this.sendToGoogleSheets(formData);

            if (res.success) {
                const orderNumber = "ORD-" + Date.now();

                this.saveOrder(formData, orderNumber);
                this.showSuccess(orderNumber);

                document.getElementById("bookingForm").reset();
            } else {
                throw new Error();
            }

        } catch (err) {
            this.showError("فشل الإرسال");
            console.error(err);
        }
    }

    // ============ SEND ============
    async sendToGoogleSheets(data) {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(data)
            });

            return { success: true };

        } catch (err) {
            return { success: false };
        }
    }

    // ============ FORM ============
    collectFormData() {
        return {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            service: document.getElementById("service").value,
            device: document.getElementById("device").value,
            problem: document.getElementById("problem").value,
            date: document.getElementById("date").value,
            priority: document.getElementById("priority").value,
            status: "قيد المراجعة",
            timestamp: new Date().toISOString()
        };
    }

    validateForm() {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const service = document.getElementById("service").value;
        const problem = document.getElementById("problem").value;

        if (!name || name.length < 3) {
            alert("اكتب اسم صحيح");
            return false;
        }

        if (!phone || phone.length < 10) {
            alert("رقم الهاتف غير صحيح");
            return false;
        }

        if (!service) {
            alert("اختار الخدمة");
            return false;
        }

        if (!problem || problem.length < 5) {
            alert("اكتب المشكلة");
            return false;
        }

        return true;
    }

    // ============ STORAGE ============
    saveOrder(data, orderNumber) {
        const order = {
            ...data,
            orderNumber
        };

        this.state.orders.unshift(order);

        localStorage.setItem("orders", JSON.stringify(this.state.orders));

        this.updateStats();
    }

    loadOrders() {
        const saved = localStorage.getItem("orders");
        this.state.orders = saved ? JSON.parse(saved) : [];
    }

    // ============ UI ============
    showSuccess(orderNumber) {
        alert(`✅ تم إرسال الطلب\nرقم الطلب: ${orderNumber}`);
    }

    showError(msg) {
        alert("❌ " + msg);
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

    // ============ EXPORT ============
    exportToExcel() {
        if (this.state.orders.length === 0) {
            alert("لا توجد بيانات");
            return;
        }

        let csv = "رقم الطلب,الاسم,الهاتف,الخدمة,الحالة\n";

        this.state.orders.forEach(o => {
            csv += `${o.orderNumber},${o.name},${o.phone},${o.service},${o.status}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "orders.csv";
        link.click();
    }
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
    window.app = new TechServiceApp();
});// ============ CONFIG ============
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxA7xksTRY3E6KNPz0hRqIBSdo2btDY6cQnwmW6YK3focI0UK-KVU5UJyDmQGOgP1VR/exec";

// ============ APP ============
class TechServiceApp {
    constructor() {
        this.state = {
            orders: []
        };

        this.init();
    }

    init() {
        this.loadOrders();
        this.updateStats();
    }

    // ============ SUBMIT ============
    async submitBooking(event) {
        event.preventDefault();

        if (!this.validateForm()) return;

        const formData = this.collectFormData();

        try {
            const res = await this.sendToGoogleSheets(formData);

            if (res.success) {
                const orderNumber = "ORD-" + Date.now();

                this.saveOrder(formData, orderNumber);
                this.showSuccess(orderNumber);

                document.getElementById("bookingForm").reset();
            } else {
                throw new Error();
            }

        } catch (err) {
            this.showError("فشل الإرسال");
            console.error(err);
        }
    }

    // ============ SEND ============
    async sendToGoogleSheets(data) {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(data)
            });

            return { success: true };

        } catch (err) {
            return { success: false };
        }
    }

    // ============ FORM ============
    collectFormData() {
        return {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            service: document.getElementById("service").value,
            device: document.getElementById("device").value,
            problem: document.getElementById("problem").value,
            date: document.getElementById("date").value,
            priority: document.getElementById("priority").value,
            status: "قيد المراجعة",
            timestamp: new Date().toISOString()
        };
    }

    validateForm() {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const service = document.getElementById("service").value;
        const problem = document.getElementById("problem").value;

        if (!name || name.length < 3) {
            alert("اكتب اسم صحيح");
            return false;
        }

        if (!phone || phone.length < 10) {
            alert("رقم الهاتف غير صحيح");
            return false;
        }

        if (!service) {
            alert("اختار الخدمة");
            return false;
        }

        if (!problem || problem.length < 5) {
            alert("اكتب المشكلة");
            return false;
        }

        return true;
    }

    // ============ STORAGE ============
    saveOrder(data, orderNumber) {
        const order = {
            ...data,
            orderNumber
        };

        this.state.orders.unshift(order);

        localStorage.setItem("orders", JSON.stringify(this.state.orders));

        this.updateStats();
    }

    loadOrders() {
        const saved = localStorage.getItem("orders");
        this.state.orders = saved ? JSON.parse(saved) : [];
    }

    // ============ UI ============
    showSuccess(orderNumber) {
        alert(`✅ تم إرسال الطلب\nرقم الطلب: ${orderNumber}`);
    }

    showError(msg) {
        alert("❌ " + msg);
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

    // ============ EXPORT ============
    exportToExcel() {
        if (this.state.orders.length === 0) {
            alert("لا توجد بيانات");
            return;
        }

        let csv = "رقم الطلب,الاسم,الهاتف,الخدمة,الحالة\n";

        this.state.orders.forEach(o => {
            csv += `${o.orderNumber},${o.name},${o.phone},${o.service},${o.status}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "orders.csv";
        link.click();
    }
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
    window.app = new TechServiceApp();
});
