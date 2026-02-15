export default {
  // App
  "appName": "حاسبة المواريث الإسلامية - برو",
  "appTagline": "النظام الاحترافي المتكامل لحساب المواريث",
  "version": "الإصدار 6.0",
  "languageName": "العربية",
  
  // Navigation
  "nav": {
    "calculator": "الحاسبة",
    "results": "النتائج",
    "compare": "مقارنة",
    "tests": "اختبارات",
    "rules": "قواعد",
    "audit": "السجل",
    "settings": "الإعدادات"
  },
  
  // Common Actions
  "actions": {
    "calculate": "احسب المواريث",
    "reset": "إعادة تعيين",
    "save": "حفظ",
    "share": "مشاركة",
    "export": "تصدير PDF",
    "print": "طباعة",
    "delete": "حذف",
    "edit": "تعديل",
    "cancel": "إلغاء",
    "confirm": "تأكيد",
    "close": "إغلاق",
    "back": "رجوع",
    "next": "التالي",
    "done": "تم",
    "increase": "زيادة",
    "decrease": "نقصان",
    "loading": "جاري التحميل...",
    "success": "نجاح",
    "error": "خطأ",
    "warning": "تحذير"
  },
  
  // Heirs Categories
  "categories": {
    "spouses": "الأزواج",
    "parents": "الأصول (الآباء والأجداد)",
    "children": "الفروع (الأبناء والأحفاد)",
    "siblings": "الحواشي (الإخوة والأخوات)",
    "extended": "أبناء الإخوة والأعمام",
    "bloodRelatives": "ذوو الأرحام"
  },
  
  // Heir Names
  "heirs": {
    "husband": "الزوج",
    "wife": "الزوجة",
    "wives": "الزوجات",
    "father": "الأب",
    "mother": "الأم",
    "grandfather": "الجد",
    "grandmother_mother": "الجدة لأم",
    "grandmother_father": "الجدة لأب",
    "son": "الابن",
    "sons": "الأبناء",
    "daughter": "البنت",
    "daughters": "البنات",
    "grandson": "ابن الابن",
    "grandsons": "أبناء الابن",
    "granddaughter": "بنت الابن",
    "granddaughters": "بنات الابن",
    "full_brother": "الأخ الشقيق",
    "full_brothers": "الإخوة الأشقاء",
    "full_sister": "الأخت الشقيقة",
    "full_sisters": "الأخوات الشقيقات",
    "paternal_brother": "الأخ لأب",
    "paternal_brothers": "الإخوة لأب",
    "paternal_sister": "الأخت لأب",
    "paternal_sisters": "الأخوات لأب",
    "maternal_brother": "الأخ لأم",
    "maternal_sister": "الأخت لأم",
    "maternal_siblings": "الإخوة لأم",
    "full_nephew": "ابن الأخ الشقيق",
    "paternal_nephew": "ابن الأخ لأب",
    "full_uncle": "العم الشقيق",
    "paternal_uncle": "العم لأب",
    "full_cousin": "ابن العم الشقيق",
    "paternal_cousin": "ابن العم لأب",
    "maternal_uncle": "الخال",
    "maternal_aunt": "الخالة",
    "paternal_aunt": "العمة",
    "daughter_son": "ابن البنت",
    "daughter_daughter": "بنت البنت",
    "sister_children": "أولاد الأخت",
    "treasury": "بيت المال"
  },
  
  // Share Types
  "shareTypes": {
    "fard": "فرض",
    "asaba": "عصبة",
    "fard_tasib": "فرض + تعصيب",
    "radd": "رد",
    "blood": "ذو رحم",
    "blocked": "محجوب",
    "treasury": "بيت المال"
  },
  
  // Estate Fields
  "estate": {
    "total": "إجمالي التركة",
    "funeral": "تكاليف التجهيز",
    "debts": "الديون المستحقة",
    "will": "الوصية (≤ ⅓)",
    "net": "صافي التركة",
    "currency": "العملة"
  },
  
  // Madhabs
  "madhabs": {
    "shafii": {
      "name": "الشافعي",
      "description": "الرد على أصحاب الفروض عدا الزوجين. الجد يحجب الإخوة."
    },
    "hanafi": {
      "name": "الحنفي",
      "description": "الرد على الزوجين عند عدم وجود غيرهم. لا مشتركة."
    },
    "maliki": {
      "name": "المالكي",
      "description": "الجد يُقاسم الإخوة. لا رد على الزوجين."
    },
    "hanbali": {
      "name": "الحنبلي",
      "description": "الجد يُقاسم الإخوة. يُرد على الزوجين عند الحاجة."
    }
  },
  
  // Special Cases
  "specialCases": {
    "awl": {
      "name": "العول",
      "description": "عندما يزيد مجموع الفروض عن أصل المسألة، يُزاد المقام"
    },
    "radd": {
      "name": "الرد",
      "description": "عندما يبقى فائض ولا يوجد عصبة، يُرد على أصحاب الفروض"
    },
    "umariyyah": {
      "name": "العُمَريَّتان",
      "description": "حالتان خاصتان عند وجود الزوج/الزوجة مع الأب والأم فقط"
    },
    "musharraka": {
      "name": "المشتركة (الحمارية)",
      "description": "الإخوة الأشقاء يشتركون مع الإخوة لأم في الثلث بالتساوي"
    },
    "akdariyya": {
      "name": "الأكدرية (الغرّاء)",
      "description": "مسألة فريدة يُفرض للأخت مع الجد ثم يُجمع نصيباهما ويُقسم"
    }
  },
  
  // Validation Messages
  "validation": {
    "required": "هذا الحقل مطلوب",
    "positive": "يجب أن تكون القيمة موجبة",
    "maxExceeded": "تجاوز الحد الأقصى",
    "husbandWifeConflict": "لا يمكن وجود زوج وزوجة معاً",
    "noHeirs": "يجب إدخال وارث واحد على الأقل",
    "willExceeded": "الوصية لا يمكن أن تتجاوز الثلث",
    "invalidAmount": "مبلغ غير صالح"
  },
  
  // Results
  "results": {
    "title": "نتائج الحساب",
    "base": "أصل المسألة",
    "finalBase": "أصل المسألة النهائي",
    "shares": "الأنصبة",
    "amount": "المبلغ",
    "percentage": "النسبة",
    "confidence": "مستوى الثقة",
    "calculationTime": "وقت الحساب",
    "blockedHeirs": "الورثة المحجوبون",
    "specialCasesApplied": "الحالات الخاصة المطبقة",
    "madhhabNotes": "ملاحظات مذهبية"
  },
  
  // Audit Log
  "audit": {
    "title": "سجل المراجعة",
    "empty": "لا توجد سجلات بعد",
    "timestamp": "التاريخ والوقت",
    "action": "الإجراء",
    "type": "النوع",
    "message": "الرسالة",
    "export": "تصدير السجل",
    "clear": "مسح السجل"
  },
  
  // Settings
  "settings": {
    "title": "الإعدادات",
    "language": "اللغة",
    "theme": "المظهر",
    "darkMode": "الوضع الداكن",
    "lightMode": "الوضع الفاتح",
    "notifications": "الإشعارات",
    "biometric": "القفل البيومتري",
    "cloudSync": "المزامنة السحابية",
    "about": "حول التطبيق",
    "privacy": "سياسة الخصوصية",
    "terms": "شروط الاستخدام"
  },
  
  // Onboarding
  "onboarding": {
    "welcome": "مرحباً بك في حاسبة المواريث",
    "description": "احسب مواريثك بدقة وفقاً للشريعة الإسلامية",
    "step1": "اختر المذهب الفقهي المناسب",
    "step2": "أدخل بيانات التركة والورثة",
    "step3": "احصل على النتائج مع التفاصيل الشرعية",
    "getStarted": "ابدأ الآن",
    "skip": "تخطي"
  },
  
  // Errors
  "errors": {
    "generic": "حدث خطأ ما",
    "calculation": "خطأ في الحساب",
    "network": "خطأ في الاتصال",
    "storage": "خطأ في التخزين",
    "pdf": "فشل إنشاء PDF",
    "share": "فشل المشاركة",
    "retry": "إعادة المحاولة"
  },
  
  // Success Messages
  "success": {
    "saved": "تم الحفظ بنجاح",
    "calculated": "تم الحساب بنجاح",
    "exported": "تم التصدير بنجاح",
    "shared": "تمت المشاركة بنجاح",
    "deleted": "تم الحذف بنجاح"
  }
}
