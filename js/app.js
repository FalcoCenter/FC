// ================= CONFIG =================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxUowH6xWOY6o0cHl3Saq4sUqsiC0AzbI1xsalE3HqNoZeyklF3tYItPCIPGJCbWsx-g/exec";

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
            const response = await this.sendToGoogleSheets(data);
            
            if (response && response.success) {
                const orderNumber = response.orderNumber;
                this.saveOrder(data, orderNumber);
                this.showSuccess(orderNumber);
                document.getElementById("bookingForm").reset();
            } else {
                throw new Error(response?.error || "فشل الإرسال");
            }
        } catch (err) {
            console.error(err);
            const orderNumber = "ORD-" + Date.now();
            this.saveOrder(data, orderNumber);
            this.saveOffline(data);
            this.showError("تم حفظ الطلب محلياً بسبب مشكلة في الاتصال. سيتم إرساله تلقائياً عند عودة الإنترنت");
        }
        this.showLoading(false);
    }

    // ================= SEND TO GOOGLE SHEETS =================
    async sendToGoogleSheets(data) {
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            console.log("✅ تم إرسال البيانات بنجاح", data);
            return { success: true, orderNumber: this.generateOrderNumber() };

        } catch (error) {
            console.error("❌ Error sending to Google Sheets:", error);
            throw error;
        }
    }

    // ================= توليد رقم طلب مؤقت =================
    generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `SRV-${year}${month}${day}-${random}`;
    }

    // ================= COLLECT FORM DATA =================
    collectFormData() {
        let phone = document.getElementById("phone")?.value.trim() || "";
        
        // إصلاح الرقم لو ناقص 0
        if (phone && !phone.startsWith("0") && phone.length === 10) {
            phone = "0" + phone;
        }

        return {
            name: document.getElementById("name")?.value.trim() || "",
            phone: phone,
            email: document.getElementById("email")?.value.trim() || "",
            service: document.getElementById("service")?.value || "",
            device: document.getElementById("device")?.value.trim() || "",
            problem: document.getElementById("problem")?.value.trim() || "",
            date: document.getElementById("date")?.value || "",
            priority: document.getElementById("priority")?.value || "normal",
            status: "قيد المراجعة"
        };
    }

    // ================= VALIDATION =================
    validateForm() {
        const name = document.getElementById("name")?.value.trim() || "";
        const phone = document.getElementById("phone")?.value.trim() || "";
        const service = document.getElementById("service")?.value || "";
        const problem = document.getElementById("problem")?.value.trim() || "";

        if (name.length < 3) {
            this.showError("اكتب اسم صحيح (3 أحرف على الأقل)");
            return false;
        }

        if (!this.validateEgyptianPhone(phone)) {
            this.showError("رقم الهاتف غير صحيح. أدخل رقم مصري صحيح (مثال: 01012345678)");
            return false;
        }

        if (!service) {
            this.showError("اختر الخدمة المطلوبة");
            return false;
        }

        if (problem.length < 5) {
            this.showError("اكتب وصف المشكلة (5 أحرف على الأقل)");
            return false;
        }

        return true;
    }

    // دالة التحقق من الأرقام المصرية
    validateEgyptianPhone(phone) {
        if (!phone) return false;
        
        let cleaned = phone.toString().trim()
            .replace(/[\s\-+()]/g, '')
            .replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632));
        
        if (cleaned.startsWith('002')) {
            cleaned = '0' + cleaned.substring(3);
        } else if (cleaned.startsWith('+2')) {
            cleaned = '0' + cleaned.substring(2);
        } else if (cleaned.startsWith('2') && cleaned.length >= 10) {
            cleaned = '0' + cleaned;
        }
        
        const mobileRegex = /^01[0125][0-9]{8}$/;
        const landlineRegex = /^0[2-9][0-9]{7,8}$/;
        
        return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
    }

    // ================= STORAGE =================
    saveOrder(data, orderNumber) {
        const order = {
            ...data,
            orderNumber: orderNumber,
            status: "قيد المراجعة",
            timestamp: new Date().toISOString()
        };

        this.state.orders.unshift(order);
        
        if (this.state.orders.length > 50) {
            this.state.orders = this.state.orders.slice(0, 50);
        }
        
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
        alert(`✅ تم إرسال الطلب بنجاح\n📋 رقم الطلب: ${orderNumber}\n📞 سنتصل بك قريباً لتأكيد الموعد`);
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
            alert("لا توجد بيانات لتصديرها");
            return;
        }

        let csv = "رقم الطلب,التاريخ,الاسم,الهاتف,البريد,الخدمة,الجهاز,المشكلة,التاريخ المفضل,الأولوية,الحالة\n";

        this.state.orders.forEach(o => {
            const date = new Date(o.timestamp);
            csv += `"${o.orderNumber}","${date.toLocaleDateString('ar-EG')}","${o.name}","${o.phone}","${o.email || ''}","${o.service}","${o.device || ''}","${o.problem}","${o.date || ''}","${o.priority || 'normal'}","${o.status}"\n`;
        });

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.href = url;
        link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // ================= SYNC OFFLINE =================
    async syncOffline() {
        let offline = JSON.parse(localStorage.getItem("offlineOrders")) || [];

        if (offline.length === 0) return;

        console.log(`🔄 جاري مزامنة ${offline.length} طلب...`);

        for (let i = 0; i < offline.length; i++) {
            try {
                const response = await this.sendToGoogleSheets(offline[i]);
                if (response && response.success) {
                    offline.splice(i, 1);
                    i--;
                    console.log(`✅ تم مزامنة طلب`);
                }
            } catch (err) {
                console.error("فشل مزامنة طلب:", err);
            }
        }

        localStorage.setItem("offlineOrders", JSON.stringify(offline));
        
        if (offline.length === 0) {
            console.log("✅ تمت مزامنة جميع الطلبات");
        }
    }

    // ================= TRACK ORDER =================
    async trackOrder(orderNumber) {
        if (!orderNumber) {
            this.showError("الرجاء إدخال رقم الطلب");
            return;
        }

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getOrder&orderNumber=${encodeURIComponent(orderNumber)}`);
            const result = await response.json();
            
            const statusDiv = document.getElementById("orderStatusResult");
            if (result.success && result.order) {
                statusDiv.innerHTML = `
                    <div style="background: #e8f5e9; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                        <strong>✅ تم العثور على الطلب</strong><br>
                        رقم الطلب: ${result.order.orderNumber}<br>
                        الحالة: ${result.order.status}<br>
                        تاريخ الطلب: ${new Date(result.order.date).toLocaleDateString('ar-EG')}
                    </div>
                `;
            } else {
                statusDiv.innerHTML = `
                    <div style="background: #ffebee; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; color: #c62828;">
                        ❌ ${result.error || "لم يتم العثور على الطلب"}
                    </div>
                `;
            }
        } catch (error) {
            console.error("خطأ في متابعة الطلب:", error);
            document.getElementById("orderStatusResult").innerHTML = `
                <div style="background: #ffebee; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; color: #c62828;">
                    ❌ حدث خطأ في الاتصال بالخادم
                </div>
            `;
        }
    }
}

// ================= دالة عامة لمتابعة الطلب =================
function trackOrder() {
    const orderNumber = document.getElementById("trackOrderInput")?.value.trim();
    if (window.app) {
        window.app.trackOrder(orderNumber);
    }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    window.app = new TechServiceApp();

    window.addEventListener("online", () => {
        console.log("🔄 الاتصال عاد، جاري مزامنة الطلبات...");
        window.app.syncOffline();
    });

    console.log("🚀 App Ready - متوافق مع Google Sheets");
});
