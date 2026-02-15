export default {
  "appName": "Islamic Inheritance Calculator - Pro",
  "appTagline": "Professional Comprehensive Inheritance System",
  "version": "Version 6.0",
  "languageName": "English",
  
  "nav": {
    "calculator": "Calculator",
    "results": "Results",
    "compare": "Compare",
    "tests": "Tests",
    "rules": "Rules",
    "audit": "Audit Log",
    "settings": "Settings"
  },
  
  "actions": {
    "calculate": "Calculate Inheritance",
    "reset": "Reset",
    "save": "Save",
    "share": "Share",
    "export": "Export PDF",
    "print": "Print",
    "delete": "Delete",
    "edit": "Edit",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "done": "Done",
    "increase": "Increase",
    "decrease": "Decrease",
    "loading": "Loading...",
    "success": "Success",
    "error": "Error",
    "warning": "Warning"
  },
  
  "categories": {
    "spouses": "Spouses",
    "parents": "Parents & Grandparents",
    "children": "Children & Grandchildren",
    "siblings": "Siblings",
    "extended": "Nephews & Uncles",
    "bloodRelatives": "Blood Relatives"
  },
  
  "heirs": {
    "husband": "Husband",
    "wife": "Wife",
    "wives": "Wives",
    "father": "Father",
    "mother": "Mother",
    "grandfather": "Grandfather",
    "grandmother_mother": "Maternal Grandmother",
    "grandmother_father": "Paternal Grandmother",
    "son": "Son",
    "sons": "Sons",
    "daughter": "Daughter",
    "daughters": "Daughters",
    "grandson": "Grandson",
    "grandsons": "Grandsons",
    "granddaughter": "Granddaughter",
    "granddaughters": "Granddaughters",
    "full_brother": "Full Brother",
    "full_brothers": "Full Brothers",
    "full_sister": "Full Sister",
    "full_sisters": "Full Sisters",
    "paternal_brother": "Paternal Brother",
    "paternal_brothers": "Paternal Brothers",
    "paternal_sister": "Paternal Sister",
    "paternal_sisters": "Paternal Sisters",
    "maternal_brother": "Maternal Brother",
    "maternal_sister": "Maternal Sister",
    "maternal_siblings": "Maternal Siblings",
    "full_nephew": "Full Nephew",
    "paternal_nephew": "Paternal Nephew",
    "full_uncle": "Full Uncle",
    "paternal_uncle": "Paternal Uncle",
    "full_cousin": "Full Cousin",
    "paternal_cousin": "Paternal Cousin",
    "maternal_uncle": "Maternal Uncle",
    "maternal_aunt": "Maternal Aunt",
    "paternal_aunt": "Paternal Aunt",
    "daughter_son": "Daughter's Son",
    "daughter_daughter": "Daughter's Daughter",
    "sister_children": "Sister's Children",
    "treasury": "Public Treasury"
  },
  
  "shareTypes": {
    "fard": "Fixed Share",
    "asaba": "Residuary",
    "fard_tasib": "Fixed + Residuary",
    "radd": "Return",
    "blood": "Blood Relative",
    "blocked": "Blocked",
    "treasury": "Treasury"
  },
  
  "estate": {
    "total": "Total Estate",
    "funeral": "Funeral Expenses",
    "debts": "Outstanding Debts",
    "will": "Bequest (≤ ⅓)",
    "net": "Net Estate",
    "currency": "Currency"
  },
  
  "madhabs": {
    "shafii": {
      "name": "Shafii",
      "description": "Return to fixed heirs except spouses. Grandfather blocks siblings."
    },
    "hanafi": {
      "name": "Hanafi",
      "description": "Return to spouses when needed. No shared problem."
    },
    "maliki": {
      "name": "Maliki",
      "description": "Grandfather shares with siblings. No return to spouses."
    },
    "hanbali": {
      "name": "Hanbali",
      "description": "Grandfather shares with siblings. Return to spouses when needed."
    }
  },
  
  "specialCases": {
    "awl": {
      "name": "Awl (Increase)",
      "description": "When total shares exceed 1, increase the base"
    },
    "radd": {
      "name": "Radd (Return)",
      "description": "Redistribute surplus to fixed shares when no residuary"
    },
    "umariyyah": {
      "name": "Al-Umariyyah",
      "description": "Two special cases with spouse + father + mother only"
    },
    "musharraka": {
      "name": "Al-Musharraka",
      "description": "Full siblings share with maternal siblings equally"
    },
    "akdariyya": {
      "name": "Al-Akdariyyah",
      "description": "Unique case with husband + mother + grandfather + sister"
    }
  },
  
  "validation": {
    "required": "This field is required",
    "positive": "Value must be positive",
    "maxExceeded": "Maximum exceeded",
    "husbandWifeConflict": "Cannot have both husband and wife",
    "noHeirs": "At least one heir required",
    "willExceeded": "Bequest cannot exceed one-third",
    "invalidAmount": "Invalid amount"
  },
  
  "results": {
    "title": "Calculation Results",
    "base": "Base of Problem",
    "finalBase": "Final Base",
    "shares": "Shares",
    "amount": "Amount",
    "percentage": "Percentage",
    "confidence": "Confidence Level",
    "calculationTime": "Calculation Time",
    "blockedHeirs": "Blocked Heirs",
    "specialCasesApplied": "Special Cases Applied",
    "madhhabNotes": "Madhhab Notes"
  },
  
  "audit": {
    "title": "Audit Log",
    "empty": "No records yet",
    "timestamp": "Date & Time",
    "action": "Action",
    "type": "Type",
    "message": "Message",
    "export": "Export Log",
    "clear": "Clear Log"
  },
  
  "settings": {
    "title": "Settings",
    "language": "Language",
    "theme": "Theme",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode",
    "notifications": "Notifications",
    "biometric": "Biometric Lock",
    "cloudSync": "Cloud Sync",
    "about": "About",
    "privacy": "Privacy Policy",
    "terms": "Terms of Use"
  },
  
  "onboarding": {
    "welcome": "Welcome to Inheritance Calculator",
    "description": "Calculate your inheritance accurately according to Islamic law",
    "step1": "Choose your Madhhab",
    "step2": "Enter estate and heirs data",
    "step3": "Get results with fiqh details",
    "getStarted": "Get Started",
    "skip": "Skip"
  },
  
  "errors": {
    "generic": "Something went wrong",
    "calculation": "Calculation error",
    "network": "Network error",
    "storage": "Storage error",
    "pdf": "Failed to create PDF",
    "share": "Failed to share",
    "retry": "Retry"
  },
  
  "success": {
    "saved": "Saved successfully",
    "calculated": "Calculated successfully",
    "exported": "Exported successfully",
    "shared": "Shared successfully",
    "deleted": "Deleted successfully"
  }
}
