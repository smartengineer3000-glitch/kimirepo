import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  Surface,
  ActivityIndicator,
  Divider,
  Menu,
  Avatar,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { testSuite, TestResult, TestSuiteResults } from '../utils/TestSuite';
import { MadhabType, FIQH_DATABASE, getMadhabColor } from '../constants/FiqhDatabase';
import { theme } from '../themes';

const categories = [
  { key: 'basic', label: 'الحالات الأساسية', icon: 'calculator' },
  { key: 'umariyyah', label: 'العُمَريَّتان', icon: 'account-group' },
  { key: 'awl', label: 'العول', icon: 'trending-up' },
  { key: 'radd', label: 'الرد', icon: 'undo' },
  { key: 'hijab', label: 'الحجب', icon: 'block-helper' },
  { key: 'asabaWithGhayr', label: 'عصبة مع الغير', icon: 'account-plus' },
  { key: 'musharraka', label: 'المسألة المشتركة', icon: 'account-multiple' },
  { key: 'akdariyya', label: 'الأكدرية', icon: 'star' },
  { key: 'grandfatherWithSiblings', label: 'الجد مع الإخوة', icon: 'account-supervisor' },
  { key: 'complex', label: 'حالات معقدة', icon: 'puzzle' },
  { key: 'bloodRelatives', label: 'ذوو الأرحام', icon: 'account-heart' },
];

const TestsScreen: React.FC = () => {
  const { addAuditLog } = useApp();
  const paperTheme = useTheme();
  const [selectedMadhab, setSelectedMadhab] = useState<MadhabType>('shafii');
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestSuiteResults | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const runAllTests = async () => {
    setLoading(true);
    const testResults = await testSuite.runAllTests(selectedMadhab);
    setResults(testResults);
    setLoading(false);
    addAuditLog(
      'الاختبارات',
      testResults.failed === 0 ? 'success' : 'warning',
      `${testResults.passed}/${testResults.total} ناجح (${testResults.coverage}%)`
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const getStatusColor = (passed: boolean) => (passed ? '#1B5E20' : '#C62828');
  const getStatusBg = (passed: boolean) => (passed ? '#E8F5E9' : '#FFEBEE');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.status.success, '#0D3310']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text variant="headlineSmall" style={styles.headerTitle}>
          ✅ اختبارات النظام
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          اختبار دقة الحسابات عبر 50+ حالة
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.controls}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    icon="mosque"
                    style={styles.madhabButton}
                    textColor={getMadhabColor(selectedMadhab)}
                  >
                    {FIQH_DATABASE.madhabs[selectedMadhab].name}
                  </Button>
                }
              >
                {(Object.keys(FIQH_DATABASE.madhabs) as MadhabType[]).map((madhab) => (
                  <Menu.Item
                    key={madhab}
                    onPress={() => {
                      setSelectedMadhab(madhab);
                      setMenuVisible(false);
                    }}
                    title={FIQH_DATABASE.madhabs[madhab].name}
                  />
                ))}
              </Menu>

              <Button
                mode="contained"
                onPress={runAllTests}
                loading={loading}
                disabled={loading}
                icon="play"
                style={styles.runButton}
                buttonColor={theme.colors.status.success}
              >
                تشغيل الاختبارات
              </Button>
            </View>
          </Card.Content>
        </Card>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.status.success} />
            <Text style={styles.loadingText}>جاري تشغيل الاختبارات...</Text>
          </View>
        )}

        {results && !loading && (
          <>
            {/* Statistics */}
            <Card style={styles.card} mode="elevated">
              <Card.Title
                title="إحصائيات الاختبارات"
                left={(props) => <Avatar.Icon {...props} icon="chart-bar" style={{ backgroundColor: theme.colors.status.success }} />}
              />
              <Card.Content>
                <View style={styles.statsGrid}>
                  <Surface style={[styles.statItem, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.statValue, { color: '#1B5E20' }]}>{results.passed}</Text>
                    <Text style={styles.statLabel}>ناجحة</Text>
                  </Surface>
                  <Surface style={[styles.statItem, { backgroundColor: '#FFEBEE' }]}>
                    <Text style={[styles.statValue, { color: '#C62828' }]}>{results.failed}</Text>
                    <Text style={styles.statLabel}>فاشلة</Text>
                  </Surface>
                  <Surface style={[styles.statItem, { backgroundColor: '#E3F2FD' }]}>
                    <Text style={[styles.statValue, { color: '#1565C0' }]}>{results.total}</Text>
                    <Text style={styles.statLabel}>إجمالي</Text>
                  </Surface>
                  <Surface style={[styles.statItem, { backgroundColor: '#F3E5F5' }]}>
                    <Text style={[styles.statValue, { color: '#7B1FA2' }]}>{results.coverage}%</Text>
                    <Text style={styles.statLabel}>التغطية</Text>
                  </Surface>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(results.passed / results.total) * 100}%`,
                          backgroundColor: results.failed === 0 ? '#1B5E20' : '#F9A825',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{((results.passed / results.total) * 100).toFixed(1)}% نجاح</Text>
                </View>
              </Card.Content>
            </Card>

            {/* Test Results by Category */}
            <Card style={styles.card} mode="elevated">
              <Card.Title
                title="نتائج الاختبارات حسب الفئة"
                left={(props) => <Avatar.Icon {...props} icon="format-list-checks" style={{ backgroundColor: theme.colors.accent.teal }} />}
              />
              <Card.Content>
                {categories.map((category) => {
                  const categoryTests = results.results.filter((r) => r.category === category.key);
                  if (categoryTests.length === 0) return null;

                  const passed = categoryTests.filter((t) => t.passed).length;
                  const total = categoryTests.length;
                  const isExpanded = expandedCategories.includes(category.key);

                  return (
                    <View key={category.key}>
                      <Button
                        mode="text"
                        onPress={() => toggleCategory(category.key)}
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        style={styles.categoryButton}
                        labelStyle={styles.categoryButtonLabel}
                        textColor={passed === total ? '#1B5E20' : '#C62828'}
                      >
                        {category.label}
                        <Text style={[styles.categoryStats, { color: passed === total ? '#1B5E20' : '#C62828' }]}>
                          {' '}
                          ({passed}/{total})
                        </Text>
                      </Button>

                      {isExpanded && (
                        <View style={styles.testsList}>
                          {categoryTests.map((test, idx) => (
                            <Surface
                              key={idx}
                              style={[styles.testItem, { backgroundColor: getStatusBg(test.passed) }]}
                            >
                              <View style={styles.testHeader}>
                                <Text style={styles.testIcon}>{test.passed ? '✅' : '❌'}</Text>
                                <Text style={styles.testName}>{test.name}</Text>
                              </View>
                              {!test.passed && test.discrepancies && (
                                <Text style={styles.testError}>{test.discrepancies.join(' | ')}</Text>
                              )}
                              {!test.passed && test.error && <Text style={styles.testError}>{test.error}</Text>}
                            </Surface>
                          ))}
                        </View>
                      )}
                      <Divider style={styles.divider} />
                    </View>
                  );
                })}
              </Card.Content>
            </Card>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  madhabButton: {
    flex: 1,
    borderRadius: 12,
  },
  runButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    minWidth: '22%',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
    color: theme.colors.text.secondary,
    fontSize: 13,
  },
  categoryButton: {
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  categoryButtonLabel: {
    fontSize: 14,
  },
  categoryStats: {
    fontWeight: 'bold',
  },
  testsList: {
    gap: 8,
    marginVertical: 10,
  },
  testItem: {
    padding: 14,
    borderRadius: 12,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testIcon: {
    fontSize: 18,
  },
  testName: {
    flex: 1,
    fontWeight: '600',
    fontSize: 13,
  },
  testError: {
    color: '#C62828',
    fontSize: 11,
    marginTop: 6,
    marginRight: 28,
  },
  divider: {
    marginVertical: 10,
  },
  bottomPadding: {
    height: 40,
  },
});

export default TestsScreen;
