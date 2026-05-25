// ============ UTILITY FUNCTIONS ============

// التحقق من رقم الهاتف المصري
const PhoneUtils = {
    /**
     * التحقق من رقم هاتف مصري
     * @param {string} phone - رقم الهاتف
     * @returns {boolean} - صحيح إذا كان الرقم صالحاً
     */
    validateEgyptPhone(phone) {
        if (!phone || typeof phone !== 'string') return false;
        
        // تنظيف الرقم
        let cleaned = phone.trim()
            .replace(/[\s\-+()]/g, '')
            .replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632));
        
        // تحويل التنسيقات الدولية
        if (cleaned.startsWith('002')) {
            cleaned = '0' + cleaned.substring(3);
        } else if (cleaned.startsWith('+2')) {
            cleaned = '0' + cleaned.substring(2);
        } else if (cleaned.startsWith('2') && cleaned.length >= 10) {
            cleaned = '0' + cleaned;
        }
        
        // التعبير النمطي الشامل للهواتف المصرية
        const mobileRegex = /^01[0125][0-9]{8}$/;
        const landlineRegex = /^0(2|3|13|40|45|50|55|57|62|64|65|66|68|69|88|92|93|95|96|97)[0-9]{7,8}$/;
        const serviceRegex = /^(0800|19000|19199|19888|19999|16161|15200|15555|122|123|180|120|110)[0-9]*$/;
        
        return mobileRegex.test(cleaned) || 
               landlineRegex.test(cleaned) || 
               serviceRegex.test(cleaned);
    },
    
    /**
     * تنسيق رقم الهاتف للعرض
     * @param {string} phone - رقم الهاتف
     * @returns {string} - الرقم المنسق
     */
    formatPhoneNumber(phone) {
        if (!phone) return '';
        
        // تنظيف الرقم أولاً
        let cleaned = phone.replace(/[^\d]/g, '');
        
        if (cleaned.startsWith('0') && cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
        }
        
        return phone;
    },
    
    /**
     * استخراج رمز البلد
     * @param {string} phone - رقم الهاتف
     * @returns {string} - رمز البلد
     */
    getCountryCode(phone) {
        if (!phone) return '+20';
        
        if (phone.startsWith('+2')) return '+2';
        if (phone.startsWith('002')) return '+2';
        if (phone.startsWith('0')) return '+20';
        
        return '+20';
    }
};

// وظائف التاريخ والوقت
const DateUtils = {
    /**
     * تنسيق التاريخ باللغة العربية
     * @param {Date|string} date - التاريخ
     * @returns {string} - التاريخ المنسق
     */
    formatArabicDate(date) {
        const d = new Date(date);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        
        return d.toLocaleDateString('ar-EG', options);
    },
    
    /**
     * تنسيق الوقت
     * @param {Date|string} date - التاريخ
     * @returns {string} - الوقت المنسق
     */
    formatTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * حساب الفرق بين تاريخين
     * @param {Date} date1 - التاريخ الأول
     * @param {Date} date2 - التاريخ الثاني
     * @returns {Object} - الفرق بالأيام والساعات والدقائق
     */
    getDateDifference(date1, date2) {
        const diff = Math.abs(date2 - date1);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return { days, hours, minutes };
    },
    
    /**
     * التحقق من صحة التاريخ
     * @param {string} dateString - تاريخ كنص
     * @returns {boolean} - صحيح إذا كان التاريخ صالحاً
     */
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    },
    
    /**
     * إضافة أيام إلى تاريخ
     * @param {Date} date - التاريخ الأساسي
     * @param {number} days - عدد الأيام للإضافة
     * @returns {Date} - التاريخ الجديد
     */
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
};

// وظائف التعامل مع المحلية (LocalStorage)
const StorageUtils = {
    /**
     * حفظ بيانات في LocalStorage
     * @param {string} key - المفتاح
     * @param {any} data - البيانات
     * @returns {boolean} - نجاح العملية
     */
    save(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * تحميل بيانات من LocalStorage
     * @param {string} key - المفتاح
     * @returns {any|null} - البيانات أو null
     */
    load(key) {
        try {
            const serialized = localStorage.getItem(key);
            if (serialized === null) {
                return null;
            }
            return JSON.parse(serialized);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },
    
    /**
     * حذف بيانات من LocalStorage
     * @param {string} key - المفتاح
     * @returns {boolean} - نجاح العملية
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    /**
     * مسح جميع البيانات
     * @returns {boolean} - نجاح العملية
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },
    
    /**
     * الحصول على حجم LocalStorage المستخدم
     * @returns {number} - الحجم بالبايت
     */
    getUsedSpace() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2; // UTF-16 uses 2 bytes per character
            }
        }
        return total;
    },
    
    /**
     * التحقق من سعة LocalStorage المتبقية
     * @returns {number} - المساحة المتبقية تقريباً بالميجابايت
     */
    getRemainingSpace() {
        const maxSize = 5 * 1024 * 1024; // 5MB (متوسط سعة LocalStorage)
        const used = this.getUsedSpace();
        return (maxSize - used) / (1024 * 1024); // بالميجابايت
    }
};

// وظائف التعامل مع النماذج (Forms)
const FormUtils = {
    /**
     * تنظيف وإعداد قيمة حقل النموذج
     * @param {string} value - القيمة
     * @returns {string} - القيمة المنظفة
     */
    sanitizeInput(value) {
        if (typeof value !== 'string') return '';
        
        // إزالة المسافات الزائدة
        let cleaned = value.trim();
        
        // إزالة HTML tags لمنع XSS
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        
        // إزالة الأحرف الخاصة الخطيرة
        cleaned = cleaned.replace(/[<>"'`]/g, '');
        
        return cleaned;
    },
    
    /**
     * التحقق من صحة البريد الإلكتروني
     * @param {string} email - البريد الإلكتروني
     * @returns {boolean} - صحيح إذا كان البريد صالحاً
     */
    validateEmail(email) {
        if (!email) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    /**
     * التحقق من صحة الاسم
     * @param {string} name - الاسم
     * @returns {boolean} - صحيح إذا كان الاسم صالحاً
     */
    validateName(name) {
        if (!name) return false;
        return name.trim().length >= 3;
    },
    
    /**
     * إظهار رسالة خطأ في الحقل
     * @param {HTMLElement} element - عنصر الحقل
     * @param {string} message - رسالة الخطأ
     */
    showFieldError(element, message) {
        if (!element) return;
        
        // إزالة رسائل الخطأ السابقة
        this.clearFieldError(element);
        
        // إضافة فئة الخطأ
        element.classList.add('error');
        
        // إنشاء عنصر رسالة الخطأ
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = 'var(--danger-color)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        
        // إضافة رسالة الخطأ بعد الحقل
        element.parentNode.insertBefore(errorElement, element.nextSibling);
        
        // إضافة تأثير اهتزاز
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    },
    
    /**
     * مسح رسالة الخطأ من الحقل
     * @param {HTMLElement} element - عنصر الحقل
     */
    clearFieldError(element) {
        if (!element) return;
        
        // إزالة فئة الخطأ
        element.classList.remove('error');
        
        // إزالة رسالة الخطأ
        const errorElement = element.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    },
    
    /**
     * إظهار رسالة نجاح في الحقل
     * @param {HTMLElement} element - عنصر الحقل
     * @param {string} message - رسالة النجاح
     */
    showFieldSuccess(element, message) {
        if (!element) return;
        
        // إزالة رسائل النجاح السابقة
        this.clearFieldSuccess(element);
        
        // إضافة فئة النجاح
        element.classList.add('success');
        
        // إنشاء عنصر رسالة النجاح
        const successElement = document.createElement('div');
        successElement.className = 'field-success';
        successElement.style.color = 'var(--success-color)';
        successElement.style.fontSize = '0.875rem';
        successElement.style.marginTop = '0.25rem';
        successElement.textContent = message;
        
        // إضافة رسالة النجاح بعد الحقل
        element.parentNode.insertBefore(successElement, element.nextSibling);
    },
    
    /**
     * مسح رسالة النجاح من الحقل
     * @param {HTMLElement} element - عنصر الحقل
     */
    clearFieldSuccess(element) {
        if (!element) return;
        
        // إزالة فئة النجاح
        element.classList.remove('success');
        
        // إزالة رسالة النجاح
        const successElement = element.parentNode.querySelector('.field-success');
        if (successElement) {
            successElement.remove();
        }
    },
    
    /**
     * تعطيل النموذج
     * @param {HTMLFormElement} form - النموذج
     */
    disableForm(form) {
        if (!form) return;
        
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = true;
        }
        
        // تعطيل الأزرار
        const buttons = form.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        });
    },
    
    /**
     * تمكين النموذج
     * @param {HTMLFormElement} form - النموذج
     */
    enableForm(form) {
        if (!form) return;
        
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = false;
        }
        
        // تمكين الأزرار
        const buttons = form.querySelectorAll('button');
        buttons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        });
    }
};

// وظائف التعامل مع DOM
const DOMUtils = {
    /**
     * إضافة تأثير الظهور التدريجي
     * @param {HTMLElement} element - العنصر
     * @param {number} delay - التأخير بالميلي ثانية
     */
    fadeIn(element, delay = 0) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, delay);
    },
    
    /**
     * إضافة تأثير الإخفاء التدريجي
     * @param {HTMLElement} element - العنصر
     * @param {number} delay - التأخير بالميلي ثانية
     */
    fadeOut(element, delay = 0) {
        if (!element) return;
        
        element.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '0';
        }, delay);
    },
    
    /**
     * إضافة تأثير الاهتزاز
     * @param {HTMLElement} element - العنصر
     */
    shake(element) {
        if (!element) return;
        
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    },
    
    /**
     * التحقق من ظهور العنصر في الشاشة
     * @param {HTMLElement} element - العنصر
     * @returns {boolean} - صحيح إذا كان العنصر مرئياً
     */
    isElementInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    /**
     * التمرير إلى عنصر
     * @param {HTMLElement} element - العنصر
     * @param {number} offset - الإزاحة من الأعلى
     */
    scrollToElement(element, offset = 80) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },
    
    /**
     * نسخ النص إلى الحافظة
     * @param {string} text - النص المراد نسخه
     * @returns {Promise<boolean>} - نجاح العملية
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy text:', error);
            
            // طريقة بديلة
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    },
    
    /**
     * إظهار رسالة مؤقتة
     * @param {string} message - الرسالة
     * @param {string} type - النوع (success, error, warning, info)
     * @param {number} duration - المدة بالميلي ثانية
     */
    showToast(message, type = 'info', duration = 3000) {
        // إنشاء عنصر الـ toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.getToastColor(type)};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideDown 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // إزالة الـ toast بعد المدة المحددة
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
        
        // إضافة أنيميشن إذا لم تكن موجودة
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(0); opacity: 1; }
                    to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    /**
     * الحصول على لون الـ toast حسب النوع
     * @param {string} type - نوع الـ toast
     * @returns {string} - اللون
     */
    getToastColor(type) {
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        return colors[type] || colors.info;
    }
};

// وظائف الشبكة والاتصال
const NetworkUtils = {
    /**
     * التحقق من اتصال الإنترنت
     * @returns {Promise<boolean>} - حالة الاتصال
     */
    async checkConnection() {
        try {
            const response = await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    
    /**
     * إرسال طلب HTTP
     * @param {string} url - الرابط
     * @param {Object} options - خيارات الطلب
     * @returns {Promise<Object>} - النتيجة
     */
    async fetchWithTimeout(url, options = {}) {
        const { timeout = 10000, ...fetchOptions } = options;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                return { success: false, error: 'Request timeout' };
            }
            
            return { success: false, error: error.message };
        }
    },
    
    /**
     * تنزيل ملف
     * @param {string} url - رابط الملف
     * @param {string} filename - اسم الملف
     */
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * توليد QR Code
     * @param {string} text - النص
     * @param {number} size - الحجم
     * @returns {string} - رابط الصورة
     */
    generateQRCode(text, size = 200) {
        const encodedText = encodeURIComponent(text);
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
    }
};

// وظائف الحسابات
const MathUtils = {
    /**
     * حساب النسبة المئوية
     * @param {number} value - القيمة
     * @param {number} total - المجموع
     * @returns {number} - النسبة المئوية
     */
    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return (value / total) * 100;
    },
    
    /**
     * تنسيق الأرقام
     * @param {number} number - الرقم
     * @param {number} decimals - عدد الخانات العشرية
     * @returns {string} - الرقم المنسق
     */
    formatNumber(number, decimals = 2) {
        if (isNaN(number)) return '0';
        
        return number.toLocaleString('ar-EG', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    /**
     * توليد رقم عشوائي في نطاق
     * @param {number} min - الحد الأدنى
     * @param {number} max - الحد الأقصى
     * @returns {number} - الرقم العشوائي
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * تقريب الرقم
     * @param {number} num - الرقم
     * @param {number} decimals - عدد الخانات العشرية
     * @returns {number} - الرقم المقرّب
     */
    round(num, decimals = 0) {
        const factor = Math.pow(10, decimals);
        return Math.round(num * factor) / factor;
    }
};

// وظائف التعامل مع السلاسل النصية
const StringUtils = {
    /**
     * اقتطاع النص وإضافة نقاط
     * @param {string} text - النص
     * @param {number} maxLength - الطول الأقصى
     * @returns {string} - النص المقتطع
     */
    truncate(text, maxLength = 100) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    /**
     * تحويل النص إلى حالة العنوان
     * @param {string} text - النص
     * @returns {string} - النص المحول
     */
    toTitleCase(text) {
        if (!text) return '';
        return text.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },
    
    /**
     * تحويل الرقم العربي إلى إنجليزي
     * @param {string} text - النص
     * @returns {string} - النص المحول
     */
    arabicToEnglishNumbers(text) {
        if (!text) return '';
        
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        let result = text;
        for (let i = 0; i < arabicNumbers.length; i++) {
            result = result.replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i]);
        }
        
        return result;
    },
    
    /**
     * تحويل الرقم الإنجليزي إلى عربي
     * @param {string} text - النص
     * @returns {string} - النص المحول
     */
    englishToArabicNumbers(text) {
        if (!text) return '';
        
        const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        
        let result = text;
        for (let i = 0; i < englishNumbers.length; i++) {
            result = result.replace(new RegExp(englishNumbers[i], 'g'), arabicNumbers[i]);
        }
        
        return result;
    },
    
    /**
     * إزالة التشكيل من النص العربي
     * @param {string} text - النص
     * @returns {string} - النص بدون تشكيل
     */
    removeTashkeel(text) {
        if (!text) return '';
        
        const tashkeel = /[\u064B-\u065F\u0670]/g;
        return text.replace(tashkeel, '');
    },
    
    /**
     * التحقق من أن النص يحتوي على أحرف عربية فقط
     * @param {string} text - النص
     * @returns {boolean} - النتيجة
     */
    isArabicText(text) {
        if (!text) return false;
        
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text);
    }
};

// وظائف التحقق من صحة البيانات
const ValidationUtils = {
    /**
     * التحقق من صحة الرقم القومي المصري
     * @param {string} nationalId - الرقم القومي
     * @returns {boolean} - النتيجة
     */
    validateEgyptianNationalId(nationalId) {
        if (!nationalId || nationalId.length !== 14) return false;
        
        // التحقق من أن جميع الأحرف أرقام
        if (!/^\d+$/.test(nationalId)) return false;
        
        // التحقق من الرقم الأخير (رقم التحقق)
        const checkDigit = parseInt(nationalId[13]);
        let sum = 0;
        
        for (let i = 0; i < 13; i++) {
            const digit = parseInt(nationalId[i]);
            if (i % 2 === 0) {
                sum += digit;
            } else {
                const doubled = digit * 2;
                sum += doubled > 9 ? doubled - 9 : doubled;
            }
        }
        
        const calculatedCheckDigit = (10 - (sum % 10)) % 10;
        return checkDigit === calculatedCheckDigit;
    },
    
    /**
     * التحقق من صحة البطاقة البنكية
     * @param {string} cardNumber - رقم البطاقة
     * @returns {boolean} - النتيجة
     */
    validateCreditCard(cardNumber) {
        if (!cardNumber) return false;
        
        // إزالة المسافات والشرطات
        const cleaned = cardNumber.replace(/[\s-]/g, '');
        
        // التحقق من الطول
        if (cleaned.length < 13 || cleaned.length > 19) return false;
        
        // التحقق من خوارزمية Luhn
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    },
    
    /**
     * التحقق من صحة البريد المصري
     * @param {string} email - البريد الإلكتروني
     * @returns {boolean} - النتيجة
     */
    validateEmail(email) {
        if (!email) return false;
        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) return false;
        
        // التحقق من النطاقات المصرية الشائعة
        const egyptianDomains = ['.eg', '.com.eg', '.edu.eg', '.gov.eg', '.org.eg'];
        return egyptianDomains.some(domain => email.toLowerCase().endsWith(domain));
    },
    
    /**
     * التحقق من صحة كلمة المرور
     * @param {string} password - كلمة المرور
     * @returns {Object} - النتيجة والتقييم
     */
    validatePassword(password) {
        if (!password) {
            return {
                valid: false,
                score: 0,
                suggestions: ['كلمة المرور مطلوبة']
            };
        }
        
        let score = 0;
        const suggestions = [];
        
        // التحقق من الطول
        if (password.length >= 8) {
            score += 25;
        } else {
            suggestions.push('يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل');
        }
        
        // التحقق من الأحرف الكبيرة
        if (/[A-Z]/.test(password)) {
            score += 25;
        } else {
            suggestions.push('أضف حرفاً كبيراً على الأقل');
        }
        
        // التحقق من الأحرف الصغيرة
        if (/[a-z]/.test(password)) {
            score += 25;
        } else {
            suggestions.push('أضف حرفاً صغيراً على الأقل');
        }
        
        // التحقق من الأرقام
        if (/\d/.test(password)) {
            score += 15;
        } else {
            suggestions.push('أضف رقماً على الأقل');
        }
        
        // التحقق من الأحرف الخاصة
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            score += 10;
        } else {
            suggestions.push('أضف رمزاً خاصاً على الأقل');
        }
        
        return {
            valid: score >= 70,
            score: score,
            strength: score >= 90 ? 'قوية' : score >= 70 ? 'جيدة' : 'ضعيفة',
            suggestions: suggestions
        };
    }
};

// تصدير جميع الوظائف
window.utils = {
    PhoneUtils,
    DateUtils,
    StorageUtils,
    FormUtils,
    DOMUtils,
    NetworkUtils,
    MathUtils,
    StringUtils,
    ValidationUtils
};

// تهيئة الأنيميشن الاهتزاز إذا لم تكن موجودة
if (!document.querySelector('#shake-animation')) {
    const style = document.createElement('style');
    style.id = 'shake-animation';
    style.textContent = `
        .shake-animation {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .error {
            border-color: var(--danger-color) !important;
            background-color: #FEF2F2 !important;
        }
        
        .success {
            border-color: var(--success-color) !important;
            background-color: #F0FDF4 !important;
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Utils loaded successfully!');
