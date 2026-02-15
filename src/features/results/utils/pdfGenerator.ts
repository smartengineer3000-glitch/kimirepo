/**
 * Professional PDF Report Generator
 * Features: Legal formatting, Islamic styling, watermarks, signatures
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import type { CalculationResult, HeirShare } from '@/types/global';

interface PDFOptions {
  includeWatermark?: boolean;
  includeSignature?: boolean;
  includeFiqhReferences?: boolean;
  language?: 'ar' | 'en' | 'ur';
  paperSize?: 'A4' | 'Letter' | 'Legal';
}

class PDFReportGenerator {
  private static instance: PDFReportGenerator;
  private logoBase64: string | null = null;

  static getInstance(): PDFReportGenerator {
    if (!PDFReportGenerator.instance) {
      PDFReportGenerator.instance = new PDFReportGenerator();
    }
    return PDFReportGenerator.instance;
  }

  async initialize(): Promise<void> {
    // Load and convert logo for PDF
    try {
      const asset = await Asset.loadAsync(require('@/shared/assets/images/logo.png'));
      this.logoBase64 = await this.convertImageToBase64(asset[0].localUri!);
    } catch (error) {
      console.warn('Failed to load logo:', error);
    }
  }

  private async convertImageToBase64(uri: string): Promise<string> {
    if (Platform.OS === 'ios') {
      const { base64 } = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { format: ImageManipulator.SaveFormat.PNG, base64: true }
      );
      return `data:image/png;base64,${base64}`;
    }
    return uri;
  }

  async generateReport(
    result: CalculationResult, 
    options: PDFOptions = {}
  ): Promise<string> {
    const {
      includeWatermark = true,
      includeFiqhReferences = true,
      language = 'ar',
      paperSize = 'A4'
    } = options;

    const html = this.generateHTML(result, {
      includeWatermark,
      includeFiqhReferences,
      language,
      paperSize
    });

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
      width: paperSize === 'A4' ? 595 : 612,  // Points (72 per inch)
      height: paperSize === 'A4' ? 842 : 792,
    });

    return uri;
  }

  async shareReport(uri: string, title: string = 'تقرير الميراث'): Promise<void> {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: title,
      UTI: 'com.adobe.pdf',
    });
  }

  async saveToGallery(uri: string): Promise<void> {
    if (Platform.OS === 'android') {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        await MediaLibrary.createAssetAsync(uri);
      }
    } else {
      await this.shareReport(uri);
    }
  }

  private generateHTML(
    result: CalculationResult, 
    options: Required<PDFOptions>
  ): string {
    const { includeWatermark, includeFiqhReferences, language, paperSize } = options;
    
    const isRTL = language === 'ar' || language === 'ur';
    const dir = isRTL ? 'rtl' : 'ltr';
    
    return `
<!DOCTYPE html>
<html dir="${dir}" lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.getText('reportTitle', language)}</title>
  <style>
    @page {
      margin: 20mm;
      size: ${paperSize};
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Naskh Arabic', 'Traditional Arabic', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    
    ${isRTL ? `
    body {
      direction: rtl;
      text-align: right;
    }
    ` : ''}
    
    /* Watermark */
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 80pt;
      color: rgba(27, 94, 32, 0.08);
      font-weight: bold;
      pointer-events: none;
      z-index: -1;
      white-space: nowrap;
    }
    
    /* Header */
    .header {
      text-align: center;
      border-bottom: 3px double #1B5E20;
      padding-bottom: 20px;
      margin-bottom: 25px;
      position: relative;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }
    
    .title {
      font-size: 24pt;
      font-weight: bold;
      color: #1B5E20;
      margin: 0 0 5px 0;
    }
    
    .subtitle {
      font-size: 14pt;
      color: #666;
      margin: 0;
    }
    
    .report-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      font-size: 10pt;
      color: #666;
    }
    
    /* Madhab Badge */
    .madhab-badge {
      display: inline-block;
      background: ${this.getMadhabColor(result.madhab)};
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 12pt;
      margin: 10px 0;
    }
    
    /* Sections */
    .section {
      margin: 20px 0;
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1B5E20;
      margin: 0 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #C9A227;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .section-icon {
      font-size: 18pt;
    }
    
    /* Estate Summary */
    .estate-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    .estate-item {
      background: white;
      padding: 12px;
      border-radius: 6px;
      border-left: 4px solid #1B5E20;
    }
    
    .estate-item.negative {
      border-left-color: #C62828;
    }
    
    .estate-item.positive {
      border-left-color: #2E7D32;
    }
    
    .estate-label {
      font-size: 9pt;
      color: #666;
      margin-bottom: 4px;
    }
    
    .estate-value {
      font-size: 12pt;
      font-weight: bold;
      color: #1a1a1a;
    }
    
    /* Shares Table */
    .shares-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 10pt;
    }
    
    .shares-table th {
      background: #1B5E20;
      color: white;
      padding: 12px 8px;
      text-align: ${isRTL ? 'right' : 'left'};
      font-weight: bold;
    }
    
    .shares-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .shares-table tr:nth-child(even) {
      background: #f5f5f5;
    }
    
    .shares-table tr:hover {
      background: #e8f5e9;
    }
    
    .heir-name {
      font-weight: 600;
    }
    
    .heir-type {
      font-size: 8pt;
      color: #666;
      display: block;
      margin-top: 2px;
    }
    
    .fraction {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      font-weight: bold;
      color: #1565C0;
    }
    
    .amount {
      font-weight: bold;
      color: #1B5E20;
    }
    
    .percentage {
      font-size: 9pt;
      color: #666;
    }
    
    /* Special Cases */
    .special-case {
      background: #e3f2fd;
      border-right: 4px solid #1565C0;
      padding: 12px;
      margin: 8px 0;
      border-radius: 6px;
    }
    
    .special-case-title {
      font-weight: bold;
      color: #1565C0;
      margin-bottom: 4px;
    }
    
    .special-case-desc {
      font-size: 10pt;
      color: #333;
    }
    
    .fiqh-reference {
      font-size: 9pt;
      color: #666;
      margin-top: 6px;
      font-style: italic;
    }
    
    /* Blocked Heirs */
    .blocked-item {
      background: #ffebee;
      border-right: 4px solid #C62828;
      padding: 10px;
      margin: 6px 0;
      border-radius: 6px;
      font-size: 10pt;
    }
    
    /* Steps */
    .step {
      display: flex;
      gap: 12px;
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-radius: 6px;
    }
    
    .step-number {
      width: 28px;
      height: 28px;
      background: #1B5E20;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12pt;
      flex-shrink: 0;
    }
    
    .step-content {
      flex: 1;
    }
    
    .step-title {
      font-weight: 600;
      margin-bottom: 2px;
    }
    
    .step-desc {
      font-size: 10pt;
      color: #666;
    }
    
    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
    
    .disclaimer {
      background: #fff8e1;
      border: 1px solid #f9a825;
      padding: 12px;
      border-radius: 6px;
      margin: 15px 0;
      font-size: 10pt;
    }
    
    .signature-section {
      margin-top: 40px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }
    
    .signature-box {
      border-top: 1px solid #333;
      padding-top: 10px;
      text-align: center;
    }
    
    .signature-label {
      font-size: 10pt;
      color: #666;
    }
    
    /* Print optimizations */
    @media print {
      .section {
        break-inside: avoid;
      }
      
      .shares-table {
        break-inside: auto;
      }
      
      .shares-table tr {
        break-inside: avoid;
      }
    }
    
    /* Status badges */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 9pt;
      font-weight: bold;
      margin: 2px;
    }
    
    .status-success {
      background: #e8f5e9;
      color: #2E7D32;
    }
    
    .status-warning {
      background: #fff8e1;
      color: #F57F17;
    }
    
    .status-info {
      background: #e3f2fd;
      color: #1565C0;
    }
    
    .confidence-score {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: ${result.confidence && result.confidence > 0.95 ? '#e8f5e9' : '#fff8e1'};
      color: ${result.confidence && result.confidence > 0.95 ? '#2E7D32' : '#F57F17'};
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 11pt;
    }
  </style>
</head>
<body>
  ${includeWatermark ? '<div class="watermark">حاسبة المواريث</div>' : ''}
  
  <div class="header">
    ${this.logoBase64 ? `<img src="${this.logoBase64}" class="logo" alt="Logo">` : ''}
    <h1 class="title">${this.getText('reportTitle', language)}</h1>
    <p class="subtitle">${this.getText('professionalSystem', language)}</p>
    
    <div class="madhab-badge">
      ${result.madhhabIcon || '⚖️'} ${result.madhhabName}
    </div>
    
    <div class="report-meta">
      <span>${this.getText('reportDate', language)}: ${new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
      <span>${this.getText('reference', language)}: ${result.shares?.[0]?.key || 'N/A'}-${Date.now().toString(36).substr(-6).toUpperCase()}</span>
    </div>
    
    <div style="margin-top: 10px;">
      <span class="confidence-score">
        ${this.getText('confidence', language)}: ${((result.confidence || 0) * 100).toFixed(0)}%
      </span>
      ${result.awlApplied ? '<span class="status-badge status-warning">العول</span>' : ''}
      ${result.raddApplied ? '<span class="status-badge status-info">الرد</span>' : ''}
      ${result.bloodRelativesApplied ? '<span class="status-badge status-info">ذوو أرحام</span>' : ''}
    </div>
  </div>
  
  <!-- Estate Summary -->
  <div class="section">
    <h2 class="section-title">
      <span class="section-icon">💰</span>
      ${this.getText('estateSummary', language)}
    </h2>
    
    <div class="estate-grid">
      <div class="estate-item">
        <div class="estate-label">${this.getText('totalEstate', language)}</div>
        <div class="estate-value">${result.estate?.total?.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${result.estate?.currency || 'SAR'}</div>
      </div>
      
      <div class="estate-item negative">
        <div class="estate-label">${this.getText('deductions', language)}</div>
        <div class="estate-value">
          ${((result.estate?.funeral || 0) + (result.estate?.debts || 0) + (result.estate?.will || 0)).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
        </div>
      </div>
      
      <div class="estate-item positive">
        <div class="estate-label">${this.getText('netEstate', language)}</div>
        <div class="estate-value" style="color: #2E7D32; font-size: 14pt;">
          ${result.netEstate?.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${result.estate?.currency || 'SAR'}
        </div>
      </div>
      
      <div class="estate-item">
        <div class="estate-label">${this.getText('baseProblem', language)}</div>
        <div class="estate-value">
          ${result.finalBase}
          ${result.awlApplied ? `<span style="color: #E65100; font-size: 10pt;">(${this.getText('increasedFrom', language)} ${result.asl})</span>` : ''}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Shares Distribution -->
  <div class="section">
    <h2 class="section-title">
      <span class="section-icon">📊</span>
      ${this.getText('distributionTable', language)}
    </h2>
    
    <table class="shares-table">
      <thead>
        <tr>
          <th>${this.getText('heir', language)}</th>
          <th>${this.getText('count', language)}</th>
          <th>${this.getText('share', language)}</th>
          <th>${this.getText('amount', language)}</th>
          <th>${this.getText('percentage', language)}</th>
        </tr>
      </thead>
      <tbody>
        ${result.shares?.map(share => `
          <tr>
            <td>
              <div class="heir-name">${share.name}</div>
              <span class="heir-type">${share.type}</span>
            </td>
            <td>${share.count}</td>
            <td><span class="fraction">${share.fraction?.toArabic?.() || share.fraction || '—'}</span></td>
            <td class="amount">${share.amount?.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</td>
            <td class="percentage">${share.percentage || (share.fraction?.toPercentage?.() || '0')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    ${result.shares && result.shares.length > 0 ? `
    <div style="margin-top: 15px; text-align: center; font-size: 10pt; color: #666;">
      ${this.getText('total', language)}: 
      <strong>${result.shares.reduce((sum, s) => sum + (s.fraction?.toDecimal?.() || 0), 0).toFixed(4)}</strong>
      (${result.shares.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')} ${result.estate?.currency || 'SAR'})
    </div>
    ` : ''}
  </div>
  
  <!-- Special Cases -->
  ${result.specialCases && result.specialCases.length > 0 ? `
  <div class="section">
    <h2 class="section-title">
      <span class="section-icon">⚡</span>
      ${this.getText('specialCases', language)}
    </h2>
    
    ${result.specialCases.map(sc => `
      <div class="special-case">
        <div class="special-case-title">${sc.name}</div>
        <div class="special-case-desc">${sc.description}</div>
        ${includeFiqhReferences && sc.fiqhReference ? `
          <div class="fiqh-reference">${this.getText('fiqhReference', language)}: ${sc.fiqhReference}</div>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <!-- Blocked Heirs -->
  ${result.blockedHeirs && result.blockedHeirs.length > 0 ? `
  <div class="section">
    <h2 class="section-title">
      <span class="section-icon">🚫</span>
      ${this.getText('blockedHeirs', language)}
    </h2>
    
    ${result.blockedHeirs.map(bh => `
      <div class="blocked-item">
        <strong>${bh.heir}</strong> ${this.getText('blockedBy', language)} <strong>${bh.by}</strong>
        <div style="font-size: 9pt; color: #666; margin-top: 4px;">${bh.reason}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <!-- Calculation Steps -->
  ${result.steps && result.steps.length > 0 ? `
  <div class="section">
    <h2 class="section-title">
      <span class="section-icon">📝</span>
      ${this.getText('calculationSteps', language)}
    </h2>
    
    ${result.steps.map((step, idx) => `
      <div class="step">
        <div class="step-number">${idx + 1}</div>
        <div class="step-content">
          <div class="step-title">${step.title}</div>
          <div class="step-desc">${step.description}</div>
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <!-- Madhhab Notes -->
  ${result.madhhabNotes && result.madhhabNotes.length > 0 ? `
  <div class="section">
    <h2 class="section-title">
      <span class="section-icon">📚</span>
      ${this.getText('madhhabNotes', language)}
    </h2>
    
    <ul style="margin: 0; padding-${isRTL ? 'right' : 'left'}: 20px;">
      ${result.madhhabNotes.map(note => `
        <li style="margin: 8px 0; font-size: 10pt;">${note}</li>
      `).join('')}
    </ul>
  </div>
  ` : ''}
  
  <!-- Disclaimer -->
  <div class="disclaimer">
    <strong>${this.getText('importantNotice', language)}:</strong>
    ${this.getText('disclaimerText', language)}
  </div>
  
  <!-- Footer -->
  <div class="footer">
    <p>${this.getText('generatedBy', language)}</p>
    <p>${this.getText('notLegalAdvice', language)}</p>
    <p style="font-size: 8pt; color: #999; margin-top: 10px;">
      ${this.getText('calculationTime', language)}: ${(result.calculationTime || 0).toFixed(2)}ms | 
      ${this.getText('version', language)}: 6.0.0
    </p>
  </div>
  
  <!-- Signature Section (Optional) -->
  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-label">${this.getText('calculatorSignature', language)}</div>
    </div>
    <div class="signature-box">
      <div class="signature-label">${this.getText('reviewerSignature', language)}</div>
    </div>
    <div class="signature-box">
      <div class="signature-label">${this.getText('approverSignature', language)}</div>
    </div>
  </div>
</body>
</html>
    `;
  }

  private getText(key: string, language: string): string {
    const texts: Record<string, Record<string, string>> = {
      reportTitle: {
        ar: 'تقرير حساب المواريث الإسلامية',
        en: 'Islamic Inheritance Calculation Report',
        ur: 'اسلامی وراثت کا حساب کتاب رپورٹ'
      },
      professionalSystem: {
        ar: 'النظام الاحترافي المتكامل',
        en: 'Professional Comprehensive System',
        ur: 'پیشہ ورانہ جامع نظام'
      },
      reportDate: {
        ar: 'تاريخ التقرير',
        en: 'Report Date',
        ur: 'رپورٹ کی تاریخ'
      },
      reference: {
        ar: 'الرقم المرجعي',
        en: 'Reference Number',
        ur: 'حوالہ نمبر'
      },
      confidence: {
        ar: 'مستوى الثقة',
        en: 'Confidence Level',
        ur: 'اعتماد کی سطح'
      },
      increasedFrom: {
        ar: 'عالت من',
        en: 'Increased from',
        ur: 'سے بڑھ کر'
      },
      estateSummary: {
        ar: 'ملخص التركة',
        en: 'Estate Summary',
        ur: 'اسٹیٹ کا خلاصہ'
      },
      totalEstate: {
        ar: 'إجمالي التركة',
        en: 'Total Estate',
        ur: 'کل اسٹیٹ'
      },
      deductions: {
        ar: 'الخصومات',
        en: 'Deductions',
        ur: 'کٹوٹیاں'
      },
      netEstate: {
        ar: 'صافي التركة',
        en: 'Net Estate',
        ur: 'صاف اسٹیٹ'
      },
      baseProblem: {
        ar: 'أصل المسألة',
        en: 'Base of Problem',
        ur: 'مسئلے کی بنیاد'
      },
      distributionTable: {
        ar: 'جدول توزيع الميراث',
        en: 'Inheritance Distribution Table',
        ur: 'وراثت تقسیم کا جدول'
      },
      heir: {
        ar: 'الوارث',
        en: 'Heir',
        ur: 'وارث'
      },
      count: {
        ar: 'العدد',
        en: 'Count',
        ur: 'تعداد'
      },
      share: {
        ar: 'الحصة',
        en: 'Share',
        ur: 'حصہ'
      },
      amount: {
        ar: 'المبلغ',
        en: 'Amount',
        ur: 'رقم'
      },
      percentage: {
        ar: 'النسبة',
        en: 'Percentage',
        ur: 'فیصد'
      },
      total: {
        ar: 'المجموع',
        en: 'Total',
        ur: 'کل'
      },
      specialCases: {
        ar: 'الحالات الخاصة',
        en: 'Special Cases',
        ur: 'خصوصی کیس'
      },
      fiqhReference: {
        ar: 'المرجع الفقهي',
        en: 'Fiqh Reference',
        ur: 'فقہی حوالہ'
      },
      blockedHeirs: {
        ar: 'الورثة المحجوبون',
        en: 'Blocked Heirs',
        ur: 'محروم وارث'
      },
      blockedBy: {
        ar: 'محجوب بـ',
        en: 'Blocked by',
        ur: 'کی طرف سے محروم'
      },
      calculationSteps: {
        ar: 'خطوات الحساب',
        en: 'Calculation Steps',
        ur: 'حساب کے مراحل'
      },
      madhhabNotes: {
        ar: 'ملاحظات مذهبية',
        en: 'Madhhab Notes',
        ur: 'مذہبی نوٹس'
      },
      importantNotice: {
        ar: 'تنبيه مهم',
        en: 'Important Notice',
        ur: 'اہم نوٹس'
      },
      disclaimerText: {
        ar: 'هذا التقريرcomputational ويعتمد على البيانات المدخلة. للاستفسارات الشرعية يرجى مراجعة عالم متخصص في الفقه الإسلامي.',
        en: 'This report is computational and based on input data. For religious inquiries, please consult a qualified Islamic scholar.',
        ur: 'یہ رپورٹ کمپیوٹیشنل ہے اور درج کردہ ڈیٹا پر مبنی ہے۔ مذہبی استفسارات کے لیے براہ کرم ایک اہل اسلامی عالم سے رجوع کریں۔'
      },
      generatedBy: {
        ar: 'تم إنشاء هذا التقرير بواسطة حاسبة المواريث الإسلامية - برو',
        en: 'This report was generated by Islamic Inheritance Calculator - Pro',
        ur: 'یہ رپورٹ اسلامی وراثت کیلکولیٹر - پرو کے ذریعے تیار کی گئی'
      },
      notLegalAdvice: {
        ar: 'هذا التقرير لا يعتبر فتوى شرعية أو استشارة قانونية.',
        en: 'This report does not constitute a religious fatwa or legal advice.',
        ur: 'یہ رپورٹ مذہبی فتوٰی یا قانونی مشورہ نہیں ہے۔'
      },
      calculationTime: {
        ar: 'وقت الحساب',
        en: 'Calculation Time',
        ur: 'حساب کا وقت'
      },
      version: {
        ar: 'الإصدار',
        en: 'Version',
        ur: 'ورژن'
      },
      calculatorSignature: {
        ar: 'توقيع المحاسب',
        en: 'Calculator Signature',
        ur: 'کیلکولیٹر کا دستخط'
      },
      reviewerSignature: {
        ar: 'توقيع المراجع',
        en: 'Reviewer Signature',
        ur: 'جائزہ لینے والے کا دستخط'
      },
      approverSignature: {
        ar: 'توقيع المعتمد',
        en: 'Approver Signature',
        ur: 'منظور کنندہ کا دستخط'
      }
    };
    
    return texts[key]?.[language] || texts[key]?.['en'] || key;
  }

  private getMadhabColor(madhab: string): string {
    const colors: Record<string, string> = {
      shafii: '#2E7D32',
      hanafi: '#C62828',
      maliki: '#6A1B9A',
      hanbali: '#1565C0'
    };
    return colors[madhab] || '#1B5E20';
  }
}

export const pdfGenerator = PDFReportGenerator.getInstance();
export default pdfGenerator;
