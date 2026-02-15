import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Share,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  DataTable,
  Divider,
  Surface,
  IconButton,
  Avatar,
  useTheme,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import { useApp } from '../context/AppContext';
import { theme } from '../themes';

const screenWidth = Dimensions.get('window').width;

const colors = [
  '#1B5E20', '#C9A227', '#1565C0', '#7B1FA2', '#E65100',
  '#00897B', '#C62828', '#6A1B9A', '#F9A825', '#2E7D32'
];

const ResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  const paperTheme = useTheme();
  const { lastResult, addAuditLog, saveCalculation } = useApp();
  const viewShotRef = useRef<ViewShot>(null);

  if (!lastResult || !lastResult.success) {
    return (
      <View style={styles.emptyContainer}>
        <Avatar.Icon size={80} icon="calculator-variant" style={{ backgroundColor: theme.colors.border.light }} />
        <Text variant="headlineMedium" style={styles.emptyText}>
          لا توجد نتائج
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          قم بإجراء حساب أولاً من شاشة الحاسبة
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Calculator' as never)}
          style={styles.emptyButton}
          icon="calculator"
        >
          الذهاب للحاسبة
        </Button>
      </View>
    );
  }

  const {
    madhhabName,
    madhhabIcon,
    estate,
    netEstate,
    finalBase,
    asl,
    awlApplied,
    raddApplied,
    shares,
    specialCases,
    blockedHeirs,
    madhhabNotes,
    warnings,
    steps,
    confidence,
  } = lastResult;

  const chartData = shares?.map((share, index) => ({
    name: share.name,
    amount: share.amount,
    color: colors[index % colors.length],
    legendFontColor: paperTheme.colors.onSurfaceVariant,
    legendFontSize: 11,
  })) || [];

  const handleShare = async () => {
    try {
      let text = `📊 نتائج حساب الميراث - المذهب ${madhhabName}\n`;
      text += `📅 التاريخ: ${new Date().toLocaleDateString('ar-SA')}\n`;
      text += `═══════════════════════════════════\n\n`;
      text += `💰 صافي التركة: ${netEstate?.toLocaleString('ar-SA')} ر.س\n`;
      text += `📐 أصل المسألة: ${finalBase}\n`;
      if (awlApplied) text += `⚡ (عالت من ${asl})\n`;
      text += `\n📋 الأنصبة:\n`;

      shares?.forEach((s) => {
        text += `• ${s.name}: ${s.fraction.toArabic()} = ${s.amount.toLocaleString('ar-SA')} ر.س\n`;
        if (s.count > 1) {
          text += `  (لكل فرد: ${s.amountPerPerson.toLocaleString('ar-SA')} ر.س)\n`;
        }
      });

      if (specialCases && specialCases.length > 0) {
        text += `\n⚡ حالات خاصة:\n`;
        specialCases.forEach((c) => {
          text += `• ${c.name}: ${c.description}\n`;
        });
      }

      await Share.share({
        message: text,
        title: 'نتائج حساب الميراث',
      });
      addAuditLog('مشاركة النتائج', 'success', 'تمت مشاركة النتائج');
    } catch (error) {
      addAuditLog('مشاركة النتائج', 'error', 'فشلت المشاركة');
    }
  };

  const handleSave = async () => {
    try {
      await saveCalculation(`حساب ${new Date().toLocaleDateString('ar-SA')}`);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const getStatusText = () => {
    if (awlApplied) return 'عائلة';
    if (raddApplied) return 'رادّة';
    return 'عادية';
  };

  const getStatusColor = () => {
    if (awlApplied) return '#E65100';
    if (raddApplied) return '#1565C0';
    return '#1B5E20';
  };

  const getConfidenceColor = () => {
    if ((confidence || 0) > 0.95) return '#1B5E20';
    if ((confidence || 0) > 0.90) return '#1565C0';
    return '#F9A825';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.primary.main, theme.colors.primary.dark]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerRow}>
            <IconButton
              icon="arrow-right"
              iconColor="#fff"
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            />
            <Text variant="headlineSmall" style={styles.headerTitle}>
              نتائج الحساب
            </Text>
            <IconButton
              icon="share-variant"
              iconColor="#fff"
              onPress={handleShare}
              style={styles.headerButton}
            />
          </View>
          <View style={styles.badgesRow}>
            <Chip style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]} textStyle={{ color: '#fff' }}>
              {madhhabIcon} {madhhabName}
            </Chip>
            <Chip style={[styles.badge, { backgroundColor: getStatusColor() }]} textStyle={{ color: '#fff' }}>
              {getStatusText()}
            </Chip>
            <Chip
              style={[styles.badge, { backgroundColor: getConfidenceColor() }]}
              textStyle={{ color: '#fff' }}
            >
              ثقة {(confidence ? confidence * 100 : 0).toFixed(0)}%
            </Chip>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Estate Summary */}
          <Card style={styles.card} mode="elevated">
            <Card.Title
              title="ملخص التركة"
              left={(props) => <Avatar.Icon {...props} icon="cash-multiple" style={{ backgroundColor: theme.colors.secondary.main }} />}
            />
            <Card.Content>
              <View style={styles.summaryGrid}>
                <Surface style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>إجمالي التركة</Text>
                  <Text style={styles.summaryValue}>{estate?.total.toLocaleString('ar-SA')}</Text>
                </Surface>
                <Surface style={[styles.summaryItem, { backgroundColor: '#FFEBEE' }]}>
                  <Text style={[styles.summaryLabel, { color: '#C62828' }]}>الخصومات</Text>
                  <Text style={[styles.summaryValue, { color: '#C62828' }]}>
                    {((estate?.funeral || 0) + (estate?.debts || 0) + (estate?.will || 0)).toLocaleString('ar-SA')}
                  </Text>
                </Surface>
                <Surface style={[styles.summaryItem, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.summaryLabel, { color: '#1B5E20' }]}>صافي التركة</Text>
                  <Text style={[styles.summaryValue, { color: '#1B5E20' }]}>
                    {netEstate?.toLocaleString('ar-SA')}
                  </Text>
                </Surface>
                <Surface style={[styles.summaryItem, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={[styles.summaryLabel, { color: '#1565C0' }]}>أصل المسألة</Text>
                  <Text style={[styles.summaryValue, { color: '#1565C0' }]}>
                    {finalBase}
                    {awlApplied && <Text style={styles.awlText}> (عالت من {asl})</Text>}
                  </Text>
                </Surface>
              </View>
            </Card.Content>
          </Card>

          {/* Warnings */}
          {warnings && warnings.length > 0 && (
            <Card style={[styles.card, { borderColor: '#F9A825', borderWidth: 2 }]} mode="outlined">
              <Card.Title
                title="⚠️ تحذيرات"
                titleStyle={{ color: '#F57F17' }}
                left={(props) => <Avatar.Icon {...props} icon="alert" style={{ backgroundColor: '#FFF8E1' }} color="#F57F17" />}
              />
              <Card.Content>
                {warnings.map((warning, index) => (
                  <Text key={index} style={styles.warningText}>
                    • {warning}
                  </Text>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Special Cases */}
          {specialCases && specialCases.length > 0 && (
            <Card style={[styles.card, { borderColor: '#1565C0', borderWidth: 2 }]} mode="outlined">
              <Card.Title
                title="⚡ حالات خاصة"
                titleStyle={{ color: '#1565C0' }}
                left={(props) => <Avatar.Icon {...props} icon="lightning-bolt" style={{ backgroundColor: '#E3F2FD' }} color="#1565C0" />}
              />
              <Card.Content>
                {specialCases.map((c, index) => (
                  <Surface key={index} style={styles.specialCase}>
                    <Text style={styles.specialCaseName}>{c.name}</Text>
                    <Text style={styles.specialCaseDesc}>{c.description}</Text>
                  </Surface>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Madhhab Notes */}
          {madhhabNotes && madhhabNotes.length > 0 && (
            <Card style={[styles.card, { borderColor: '#1B5E20', borderWidth: 2 }]} mode="outlined">
              <Card.Title
                title="📚 ملاحظات مذهبية"
                titleStyle={{ color: '#1B5E20' }}
                left={(props) => <Avatar.Icon {...props} icon="book-open" style={{ backgroundColor: '#E8F5E9' }} color="#1B5E20" />}
              />
              <Card.Content>
                {madhhabNotes.map((note, index) => (
                  <Text key={index} style={styles.noteText}>
                    • {note}
                  </Text>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Blocked Heirs */}
          {blockedHeirs && blockedHeirs.length > 0 && (
            <Card style={[styles.card, { borderColor: '#C62828', borderWidth: 2 }]} mode="outlined">
              <Card.Title
                title="🚫 الورثة المحجوبون"
                titleStyle={{ color: '#C62828' }}
                left={(props) => <Avatar.Icon {...props} icon="block-helper" style={{ backgroundColor: '#FFEBEE' }} color="#C62828" />}
              />
              <Card.Content>
                <View style={styles.blockedChips}>
                  {blockedHeirs.map((b, index) => (
                    <Chip key={index} style={styles.blockedChip} textStyle={styles.blockedChipText}>
                      {b.reason}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Chart */}
          {chartData.length > 0 && (
            <Card style={styles.card} mode="elevated">
              <Card.Title
                title="📊 التوزيع المرئي"
                left={(props) => <Avatar.Icon {...props} icon="chart-pie" style={{ backgroundColor: theme.colors.accent.purple }} />}
              />
              <Card.Content>
                <PieChart
                  data={chartData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  absolute
                />
                <View style={styles.legend}>
                  {shares?.map((share, index) => (
                    <View key={share.key} style={styles.legendItem}>
                      <View style={[styles.legendColor, { backgroundColor: colors[index % colors.length] }]} />
                      <Text style={styles.legendText}>
                        {share.name}: {(share.fraction.toDecimal() * 100).toFixed(1)}%
                      </Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Results Table */}
          <Card style={styles.card} mode="elevated">
            <Card.Title
              title="جدول التوزيع"
              left={(props) => <Avatar.Icon {...props} icon="table" style={{ backgroundColor: theme.colors.accent.teal }} />}
            />
            <Card.Content>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>الوارث</DataTable.Title>
                  <DataTable.Title numeric>العدد</DataTable.Title>
                  <DataTable.Title numeric>الحصة</DataTable.Title>
                  <DataTable.Title numeric>المبلغ</DataTable.Title>
                </DataTable.Header>

                {shares?.map((share) => (
                  <DataTable.Row key={share.key}>
                    <DataTable.Cell>
                      <View>
                        <Text style={styles.heirName}>{share.name}</Text>
                        <Text style={styles.heirType}>{share.type}</Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{share.count}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={styles.fraction}>{share.fraction.toArabic()}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={styles.amount}>{share.amount.toLocaleString('ar-SA')}</Text>
                      {share.count > 1 && (
                        <Text style={styles.perPerson}>/{share.amountPerPerson.toLocaleString('ar-SA')}</Text>
                      )}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card.Content>
          </Card>

          {/* Calculation Steps */}
          {steps && steps.length > 0 && (
            <Card style={styles.card} mode="elevated">
              <Card.Title
                title="📝 خطوات الحساب"
                left={(props) => <Avatar.Icon {...props} icon="format-list-numbered" style={{ backgroundColor: theme.colors.accent.blue }} />}
              />
              <Card.Content>
                {steps.map((step, index) => (
                  <View key={index} style={styles.step}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDesc}>{step.description}</Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="content-save"
        style={styles.fab}
        onPress={handleSave}
        color="#fff"
      />
    </View>
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
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  badge: {
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  awlText: {
    fontSize: 11,
    color: '#E65100',
  },
  warningText: {
    color: '#F57F17',
    fontSize: 14,
    marginVertical: 3,
  },
  specialCase: {
    marginVertical: 6,
    padding: 14,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  specialCaseName: {
    fontWeight: 'bold',
    color: '#1565C0',
    fontSize: 14,
  },
  specialCaseDesc: {
    color: '#1976D2',
    fontSize: 12,
    marginTop: 4,
  },
  noteText: {
    color: '#1B5E20',
    fontSize: 13,
    marginVertical: 3,
  },
  blockedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  blockedChip: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
  },
  blockedChipText: {
    color: '#C62828',
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  heirName: {
    fontWeight: '600',
    fontSize: 14,
  },
  heirType: {
    fontSize: 11,
    color: theme.colors.text.secondary,
  },
  fraction: {
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  amount: {
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  perPerson: {
    fontSize: 10,
    color: theme.colors.text.secondary,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 10,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '600',
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  stepDesc: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: theme.colors.primary.main,
  },
  bottomPadding: {
    height: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.background.main,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  emptySubtext: {
    color: theme.colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 32,
    borderRadius: 16,
  },
});

export default ResultsScreen;
