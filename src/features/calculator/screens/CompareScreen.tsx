import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import {
  Text,
  Card,
  Button,
  DataTable,
  Chip,
  Surface,
  Avatar,
  Menu,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { InheritanceEngine } from '../utils/InheritanceEngine';
import { FIQH_DATABASE, MadhabType, getMadhabColor } from '../constants/FiqhDatabase';
import { theme } from '../themes';

const madhabs: MadhabType[] = ['shafii', 'hanafi', 'maliki', 'hanbali'];

const CompareScreen: React.FC = () => {
  const { estate, heirs, addAuditLog } = useApp();
  const paperTheme = useTheme();
  const [selectedMadhab, setSelectedMadhab] = useState<MadhabType>('shafii');
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<MadhabType, ReturnType<InheritanceEngine['calculate']> | null>>({
    shafii: null,
    hanafi: null,
    maliki: null,
    hanbali: null,
  });

  const runComparison = async () => {
    setLoading(true);
    const newResults: Record<MadhabType, ReturnType<InheritanceEngine['calculate']> | null> = {
      shafii: null,
      hanafi: null,
      maliki: null,
      hanbali: null,
    };

    for (const madhab of madhabs) {
      try {
        const engine = new InheritanceEngine(madhab, estate, { ...heirs });
        newResults[madhab] = engine.calculate();
      } catch (e: any) {
        newResults[madhab] = { success: false, errors: [e.message], madhab, madhhabName: madhab };
      }
    }

    setResults(newResults);
    setLoading(false);
    addAuditLog('مقارنة المذاهب', 'success', 'تم إجراء المقارنة');
  };

  // Collect all heirs from all results
  const allHeirs = new Set<string>();
  Object.values(results).forEach((r) => {
    if (r?.success && r.shares) {
      r.shares.forEach((s) => allHeirs.add(s.key));
    }
  });

  const hasData = estate.total > 0 && Object.values(heirs).some((v) => v > 0);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.accent.purple, '#4A148C']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text variant="headlineSmall" style={styles.headerTitle}>
          📊 مقارنة المذاهب
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          قارن النتائج بين المذاهب الفقهية الأربعة
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.infoText}>
              سيتم مقارنة حساب الميراث للبيانات المدخلة في الحاسبة الرئيسية عبر المذاهب الأربعة.
            </Text>

            <Button
              mode="contained"
              onPress={runComparison}
              loading={loading}
              disabled={loading || !hasData}
              icon="compare"
              style={styles.compareButton}
              buttonColor={theme.colors.accent.purple}
            >
              تشغيل المقارنة
            </Button>

            {!hasData && (
              <Text style={styles.warningText}>⚠️ أدخل بيانات التركة والورثة في الحاسبة أولاً</Text>
            )}
          </Card.Content>
        </Card>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.accent.purple} />
            <Text style={styles.loadingText}>جاري المقارنة...</Text>
          </View>
        )}

        {results.shafii && !loading && (
          <Card style={styles.card} mode="elevated">
            <Card.Title
              title="نتائج المقارنة"
              left={(props) => <Avatar.Icon {...props} icon="compare-horizontal" style={{ backgroundColor: theme.colors.accent.purple }} />}
            />
            <Card.Content>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={styles.heirColumn}>الوارث</DataTable.Title>
                    {madhabs.map((madhab) => (
                      <DataTable.Title
                        key={madhab}
                        style={[
                          styles.madhabColumn,
                          { backgroundColor: `${getMadhabColor(madhab)}15` },
                        ]}
                      >
                        <Text style={{ color: getMadhabColor(madhab), fontWeight: 'bold', fontSize: 12 }}>
                          {FIQH_DATABASE.madhabs[madhab].icon} {FIQH_DATABASE.madhabs[madhab].name}
                        </Text>
                      </DataTable.Title>
                    ))}
                  </DataTable.Header>

                  {Array.from(allHeirs).map((heirKey) => (
                    <DataTable.Row key={heirKey}>
                      <DataTable.Cell style={styles.heirColumn}>
                        <Text style={{ fontWeight: '600' }}>{FIQH_DATABASE.heirNames[heirKey] || heirKey}</Text>
                      </DataTable.Cell>
                      {madhabs.map((madhab) => {
                        const result = results[madhab];
                        const share =
                          result?.success && result.shares ? result.shares.find((s) => s.key === heirKey) : null;

                        return (
                          <DataTable.Cell
                            key={madhab}
                            style={[styles.madhabColumn, { backgroundColor: `${getMadhabColor(madhab)}08` }]}
                          >
                            {share ? (
                              <View style={{ alignItems: 'center' }}>
                                <Text style={styles.fraction}>{share.fraction.toArabic()}</Text>
                                <Text style={styles.amount}>{share.amount.toLocaleString('ar-SA')}</Text>
                              </View>
                            ) : (
                              <Text style={styles.dash}>—</Text>
                            )}
                          </DataTable.Cell>
                        );
                      })}
                    </DataTable.Row>
                  ))}
                </DataTable>
              </ScrollView>

              {/* Summary */}
              <View style={styles.summaryContainer}>
                {madhabs.map((madhab) => {
                  const result = results[madhab];
                  if (!result?.success) return null;

                  return (
                    <Surface
                      key={madhab}
                      style={[styles.summaryItem, { borderColor: getMadhabColor(madhab) }]}
                    >
                      <Text style={[styles.summaryTitle, { color: getMadhabColor(madhab) }]}>
                        {FIQH_DATABASE.madhabs[madhab].name}
                      </Text>
                      <View style={styles.chipsRow}>
                        {result.awlApplied && (
                          <Chip style={[styles.summaryChip, { backgroundColor: '#FFF3E0' }]} textStyle={{ fontSize: 10, color: '#E65100' }}>
                            عائلة
                          </Chip>
                        )}
                        {result.raddApplied && (
                          <Chip style={[styles.summaryChip, { backgroundColor: '#E3F2FD' }]} textStyle={{ fontSize: 10, color: '#1565C0' }}>
                            رادّة
                          </Chip>
                        )}
                        {result.bloodRelativesApplied && (
                          <Chip style={[styles.summaryChip, { backgroundColor: '#F3E5F5' }]} textStyle={{ fontSize: 10, color: '#7B1FA2' }}>
                            ذوو أرحام
                          </Chip>
                        )}
                      </View>
                    </Surface>
                  );
                })}
              </View>

              {/* Notes */}
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>ملاحظات:</Text>
                {madhabs.map((madhab) => {
                  const result = results[madhab];
                  if (!result?.success || !result.madhhabNotes?.length) return null;

                  return result.madhhabNotes.map((note, idx) => (
                    <Text key={`${madhab}-${idx}`} style={styles.noteText}>
                      • {note}
                    </Text>
                  ));
                })}
              </View>
            </Card.Content>
          </Card>
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
  infoText: {
    color: theme.colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  compareButton: {
    borderRadius: 16,
    paddingVertical: 6,
  },
  warningText: {
    color: '#F57F17',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: theme.colors.text.secondary,
  },
  heirColumn: {
    minWidth: 120,
  },
  madhabColumn: {
    minWidth: 90,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  fraction: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  amount: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  dash: {
    textAlign: 'center',
    color: theme.colors.border.medium,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  summaryChip: {
    borderRadius: 12,
  },
  notesContainer: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  noteText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    marginVertical: 3,
  },
  bottomPadding: {
    height: 40,
  },
});

export default CompareScreen;
