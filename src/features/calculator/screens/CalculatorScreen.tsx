import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  Chip,
  IconButton,
  Divider,
  Menu,
  HelperText,
  Surface,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { InheritanceEngine } from '../utils/InheritanceEngine';
import { validateAll } from '../utils/Validation';
import { FIQH_DATABASE, MadhabType, getMadhabConfig, getMadhabGradient } from '../constants/FiqhDatabase';
import { HeirInput } from '../components/HeirInput';
import { theme } from '../themes';

const { width } = Dimensions.get('window');

const heirCategories = [
  {
    title: 'الأزواج',
    icon: 'heart',
    color: '#E91E63',
    heirs: [
      { key: 'husband', label: 'الزوج', max: 1, description: '½ بدون فرع، ¼ مع فرع' },
      { key: 'wife', label: 'الزوجة', max: 4, description: '¼ بدون فرع، ⅛ مع فرع' }
    ]
  },
  {
    title: 'الأصول (الآباء والأجداد)',
    icon: 'account-supervisor',
    color: '#673AB7',
    heirs: [
      { key: 'father', label: 'الأب', max: 1, description: '⅙ + تعصيب أو تعصيب فقط' },
      { key: 'mother', label: 'الأم', max: 1, description: '⅙ أو ⅓ أو ثلث الباقي' },
      { key: 'grandfather', label: 'الجد الصحيح', max: 1, description: 'أبو الأب وإن علا' },
      { key: 'grandmother_mother', label: 'الجدة لأم', max: 1, description: '⅙ عند عدم الأم' },
      { key: 'grandmother_father', label: 'الجدة لأب', max: 1, description: '⅙ عند عدم الأم والأب' }
    ]
  },
  {
    title: 'الفروع (الأبناء والأحفاد)',
    icon: 'account-child',
    color: '#2196F3',
    heirs: [
      { key: 'son', label: 'الابن', max: 50, description: 'عصبة بالنفس' },
      { key: 'daughter', label: 'البنت', max: 50, description: '½ أو ⅔ أو عصبة بالغير' },
      { key: 'grandson', label: 'ابن الابن', max: 50, description: 'عصبة وإن نزل' },
      { key: 'granddaughter', label: 'بنت الابن', max: 50, description: '⅙ تكملة أو ⅔' }
    ]
  },
  {
    title: 'الحواشي (الإخوة والأخوات)',
    icon: 'account-group',
    color: '#009688',
    heirs: [
      { key: 'full_brother', label: 'الأخ الشقيق', max: 50, description: 'عصبة بالنفس' },
      { key: 'full_sister', label: 'الأخت الشقيقة', max: 50, description: '½ أو ⅔ أو عصبة' },
      { key: 'paternal_brother', label: 'الأخ لأب', max: 50, description: 'عصبة' },
      { key: 'paternal_sister', label: 'الأخت لأب', max: 50, description: '⅙ تكملة أو عصبة' },
      { key: 'maternal_brother', label: 'الأخ لأم', max: 50, description: '⅙ أو ⅓ بالتساوي' },
      { key: 'maternal_sister', label: 'الأخت لأم', max: 50, description: '⅙ أو ⅓ بالتساوي' }
    ]
  },
  {
    title: 'أبناء الإخوة والأعمام',
    icon: 'account-network',
    color: '#FF9800',
    heirs: [
      { key: 'full_nephew', label: 'ابن الأخ الشقيق', max: 50, description: 'عصبة' },
      { key: 'paternal_nephew', label: 'ابن الأخ لأب', max: 50, description: 'عصبة' },
      { key: 'full_uncle', label: 'العم الشقيق', max: 50, description: 'عصبة' },
      { key: 'paternal_uncle', label: 'العم لأب', max: 50, description: 'عصبة' },
      { key: 'full_cousin', label: 'ابن العم الشقيق', max: 50, description: 'عصبة' },
      { key: 'paternal_cousin', label: 'ابن العم لأب', max: 50, description: 'عصبة' }
    ]
  },
  {
    title: 'ذوو الأرحام',
    icon: 'account-heart',
    color: '#795548',
    heirs: [
      { key: 'daughter_son', label: 'ابن البنت', max: 50, description: 'ذو رحم - صنف 1' },
      { key: 'daughter_daughter', label: 'بنت البنت', max: 50, description: 'ذو رحم - صنف 1' },
      { key: 'sister_children', label: 'أولاد الأخت', max: 50, description: 'ذو رحم - صنف 2' },
      { key: 'maternal_uncle', label: 'الخال', max: 50, description: 'ذو رحم - صنف 3' },
      { key: 'maternal_aunt', label: 'الخالة', max: 50, description: 'ذو رحم - صنف 3' },
      { key: 'paternal_aunt', label: 'العمة', max: 50, description: 'ذو رحم - صنف 4' }
    ]
  }
];

const quickTests = [
  { key: 'basic', label: 'زوج + بنت', heirs: { husband: 1, daughter: 1 } },
  { key: 'awl', label: 'عول: زوج + أختان + أم', heirs: { husband: 1, full_sister: 2, mother: 1 } },
  { key: 'radd', label: 'رد: أم + بنت', heirs: { mother: 1, daughter: 1 } },
  { key: 'umariyyah1', label: 'العمرية الأولى', heirs: { husband: 1, father: 1, mother: 1 } },
  { key: 'umariyyah2', label: 'العمرية الثانية', heirs: { wife: 1, father: 1, mother: 1 } },
  { key: 'musharraka', label: 'المشتركة', heirs: { husband: 1, mother: 1, maternal_brother: 2, full_brother: 1 } },
  { key: 'akdariyya', label: 'الأكدرية', heirs: { husband: 1, mother: 1, grandfather: 1, full_sister: 1 } }
];

const CalculatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const paperTheme = useTheme();
  const {
    currentMadhab,
    setCurrentMadhab,
    estate,
    updateEstateField,
    heirs,
    updateHeir,
    resetHeirs,
    setLastResult,
    addAuditLog
  } = useApp();

  const [expandedCategories, setExpandedCategories] = useState<string[]>(['الأزواج', 'الأصول (الآباء والأجداد)']);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleCalculate = useCallback(() => {
    const validation = validateAll(estate, heirs);

    if (!validation.isValid) {
      Alert.alert('أخطاء في البيانات', validation.errors.join('\n'));
      addAuditLog('حساب الميراث', 'error', validation.errors.join(', '));
      return;
    }

    if (validation.warnings.length > 0) {
      Alert.alert('تحذيرات', validation.warnings.join('\n') + '\n\nسيتم المتابعة مع التصحيح التلقائي.');
    }

    try {
      const engine = new InheritanceEngine(currentMadhab, estate, heirs);
      const result = engine.calculate();

      if (result.success) {
        setLastResult(result);
        addAuditLog('حساب الميراث', 'success',
          `تم الحساب بنجاح - التركة: ${estate.total.toLocaleString()} - المذهب: ${result.madhhabName}`
        );
        navigation.navigate('Results' as never);
      } else {
        Alert.alert('خطأ في الحساب', result.errors?.join('\n') || 'حدث خطأ غير معروف');
        addAuditLog('حساب الميراث', 'error', result.errors?.join(', ') || 'خطأ غير معروف');
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
      addAuditLog('حساب الميراث', 'error', error.message);
    }
  }, [estate, heirs, currentMadhab, navigation, setLastResult, addAuditLog]);

  const handleValidate = useCallback(() => {
    const validation = validateAll(estate, heirs);

    if (validation.isValid && validation.warnings.length === 0) {
      Alert.alert('✅ التحقق', 'جميع البيانات صحيحة!');
      addAuditLog('التحقق', 'success', 'البيانات صحيحة');
    } else if (validation.isValid) {
      Alert.alert('⚠️ تحذيرات', validation.warnings.join('\n') + '\n\nيمكنك المتابعة مع التصحيح التلقائي.');
      addAuditLog('التحقق', 'warning', validation.warnings.join(', '));
    } else {
      Alert.alert('❌ أخطاء', validation.errors.join('\n'));
      addAuditLog('التحقق', 'error', validation.errors.join(', '));
    }
  }, [estate, heirs, addAuditLog]);

  const handleReset = useCallback(() => {
    Alert.alert(
      'إعادة تعيين',
      'هل أنت متأكد من إعادة تعيين جميع البيانات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد',
          style: 'destructive',
          onPress: () => {
            resetHeirs();
            updateEstateField('total', 100000);
            updateEstateField('funeral', 0);
            updateEstateField('debts', 0);
            updateEstateField('will', 0);
          }
        }
      ]
    );
  }, [resetHeirs, updateEstateField]);

  const loadQuickTest = useCallback((testHeirs: Record<string, number>) => {
    resetHeirs();
    Object.entries(testHeirs).forEach(([key, value]) => {
      updateHeir(key, value);
    });
    addAuditLog('اختبار سريع', 'info', 'تم تحميل حالة اختبار');
  }, [resetHeirs, updateHeir, addAuditLog]);

  const madhabConfig = getMadhabConfig(currentMadhab);
  const madhabGradient = getMadhabGradient(currentMadhab);

  const netEstate = Math.max(0, estate.total - estate.funeral - estate.debts - estate.will);
  const heirsCount = Object.values(heirs).reduce((sum, count) => sum + count, 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={madhabGradient}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Avatar.Icon 
              size={60} 
              icon="scale-balance" 
              style={[styles.headerIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              color="#fff"
            />
            <Text variant="headlineMedium" style={styles.headerTitle}>
              حاسبة المواريث
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
              النظام الاحترافي المتكامل - الإصدار 5.1
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statValue}>{netEstate.toLocaleString()}</Text>
            <Text style={styles.statLabel}>التركة الصافية</Text>
          </Surface>
          <Surface style={styles.statCard} elevation={2}>
            <Text style={styles.statValue}>{heirsCount}</Text>
            <Text style={styles.statLabel}>عدد الورثة</Text>
          </Surface>
          <Surface style={[styles.statCard, { borderColor: madhabConfig.color, borderWidth: 2 }]} elevation={2}>
            <Text style={[styles.statValue, { color: madhabConfig.color }]}>{madhabConfig.name}</Text>
            <Text style={styles.statLabel}>المذهب</Text>
          </Surface>
        </View>

        {/* Madhab Selection */}
        <Card style={styles.card} mode="elevated">
          <Card.Title
            title="المذهب الفقهي"
            subtitle="اختر المذهب المناسب"
            left={props => <Avatar.Icon {...props} icon="mosque" size={40} style={{ backgroundColor: madhabConfig.color }} />}
          />
          <Card.Content>
            <View style={styles.madhabContainer}>
              {(Object.keys(FIQH_DATABASE.madhabs) as MadhabType[]).map(madhab => {
                const config = getMadhabConfig(madhab);
                const isSelected = currentMadhab === madhab;
                return (
                  <Surface
                    key={madhab}
                    style={[
                      styles.madhabCard,
                      isSelected && { backgroundColor: config.color, elevation: 4 }
                    ]}
                    elevation={isSelected ? 4 : 1}
                  >
                    <Button
                      mode={isSelected ? 'contained' : 'outlined'}
                      onPress={() => setCurrentMadhab(madhab)}
                      style={styles.madhabButton}
                      labelStyle={styles.madhabButtonLabel}
                      buttonColor={isSelected ? config.color : 'transparent'}
                      textColor={isSelected ? '#fff' : config.color}
                    >
                      {config.icon} {config.name}
                    </Button>
                  </Surface>
                );
              })}
            </View>
            <Surface style={[styles.madhabInfo, { backgroundColor: `${madhabConfig.color}15` }]}>
              <Text style={[styles.madhabInfoTitle, { color: madhabConfig.color }]}>
                {madhabConfig.icon} المذهب {madhabConfig.name}
              </Text>
              <Text style={styles.madhabInfoDesc}>{madhabConfig.description}</Text>
            </Surface>
          </Card.Content>
        </Card>

        {/* Estate Data */}
        <Card style={styles.card} mode="elevated">
          <Card.Title
            title="بيانات التركة والخصومات"
            subtitle="أدخل قيمة التركة والخصومات"
            left={props => <Avatar.Icon {...props} icon="cash" size={40} style={{ backgroundColor: theme.colors.secondary.main }} />}
          />
          <Card.Content>
            <TextInput
              label="إجمالي التركة *"
              value={estate.total.toString()}
              onChangeText={text => updateEstateField('total', parseFloat(text) || 0)}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              right={<TextInput.Affix text="ر.س" />}
              outlineColor={theme.colors.primary.main}
              activeOutlineColor={theme.colors.primary.dark}
            />
            <HelperText type="info">قيمة جميع الممتلكات</HelperText>

            <View style={styles.rowInputs}>
              <TextInput
                label="تكاليف التجهيز"
                value={estate.funeral.toString()}
                onChangeText={text => updateEstateField('funeral', parseFloat(text) || 0)}
                keyboardType="numeric"
                mode="outlined"
                style={[styles.input, styles.flex1]}
                right={<TextInput.Affix text="ر.س" />}
              />
              <TextInput
                label="الديون المستحقة"
                value={estate.debts.toString()}
                onChangeText={text => updateEstateField('debts', parseFloat(text) || 0)}
                keyboardType="numeric"
                mode="outlined"
                style={[styles.input, styles.flex1]}
                right={<TextInput.Affix text="ر.س" />}
              />
            </View>

            <TextInput
              label="الوصية الشرعية"
              value={estate.will.toString()}
              onChangeText={text => updateEstateField('will', parseFloat(text) || 0)}
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              right={<TextInput.Affix text="≤ ⅓" />}
            />
            <HelperText type="info">≤ ثلث الباقي</HelperText>

            <Surface style={styles.notice}>
              <Text style={styles.noticeText}>
                ⚠️ ترتيب الحقوق الشرعي: ١. تكاليف التجهيز ← ٢. سداد الديون ← ٣. الوصية (≤ ⅓) ← ٤. الإرث
              </Text>
            </Surface>
          </Card.Content>
        </Card>

        {/* Heirs Section */}
        <Card style={styles.card} mode="elevated">
          <Card.Title
            title="تحديد الورثة"
            subtitle="أدخل عدد الورثة في كل فئة"
            left={props => <Avatar.Icon {...props} icon="account-group" size={40} style={{ backgroundColor: theme.colors.accent.teal }} />}
          />
          <Card.Content>
            {/* Quick Tests Menu */}
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  icon="lightning-bolt"
                  style={styles.quickTestButton}
                >
                  حالات اختبار سريعة
                </Button>
              }
            >
              {quickTests.map(test => (
                <Menu.Item
                  key={test.key}
                  onPress={() => {
                    loadQuickTest(test.heirs);
                    setMenuVisible(false);
                  }}
                  title={test.label}
                />
              ))}
            </Menu>

            {/* Heir Categories */}
            {heirCategories.map(category => (
              <View key={category.title} style={styles.categoryContainer}>
                <Button
                  mode="text"
                  onPress={() => toggleCategory(category.title)}
                  icon={expandedCategories.includes(category.title) ? 'chevron-up' : 'chevron-down'}
                  style={styles.categoryButton}
                  textColor={category.color}
                >
                  <Text style={{ color: category.color, fontWeight: 'bold' }}>
                    {category.title}
                  </Text>
                </Button>

                {expandedCategories.includes(category.title) && (
                  <View style={styles.heirsGrid}>
                    {category.heirs.map(heir => (
                      <HeirInput
                        key={heir.key}
                        heirKey={heir.key}
                        label={heir.label}
                        description={heir.description}
                        max={heir.max}
                        value={heirs[heir.key] || 0}
                        onChange={value => updateHeir(heir.key, value)}
                        accentColor={category.color}
                      />
                    ))}
                  </View>
                )}
                <Divider style={styles.divider} />
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleCalculate}
            icon="calculator-variant"
            style={[styles.button, styles.calculateButton]}
            labelStyle={styles.buttonLabel}
            buttonColor={theme.colors.primary.main}
          >
            احسب المواريث
          </Button>

          <View style={styles.secondaryButtons}>
            <Button
              mode="outlined"
              onPress={handleValidate}
              icon="check-circle"
              style={[styles.button, styles.secondaryButton]}
              textColor={theme.colors.status.success}
            >
              تحقق
            </Button>
            <Button
              mode="outlined"
              onPress={handleReset}
              icon="refresh"
              style={[styles.button, styles.secondaryButton]}
              textColor={theme.colors.status.error}
            >
              إعادة
            </Button>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  card: {
    margin: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  madhabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  madhabCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  madhabButton: {
    borderRadius: 12,
  },
  madhabButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  madhabInfo: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  madhabInfoTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  madhabInfoDesc: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  input: {
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  notice: {
    padding: 14,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary.main,
  },
  noticeText: {
    fontSize: 12,
    color: '#7D6608',
    lineHeight: 18,
  },
  quickTestButton: {
    marginBottom: 16,
    borderRadius: 12,
    borderColor: theme.colors.secondary.main,
  },
  categoryContainer: {
    marginVertical: 4,
  },
  categoryButton: {
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  heirsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: theme.colors.border.light,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calculateButton: {
    paddingVertical: 8,
    elevation: 4,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
  },
  bottomPadding: {
    height: 40,
  },
});

export default CalculatorScreen;
