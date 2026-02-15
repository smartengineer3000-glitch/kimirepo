import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  IconButton,
  Surface,
  Chip,
  Divider,
  Avatar,
  FAB,
  useTheme,
} from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { theme } from '../themes';

const AuditScreen: React.FC = () => {
  const { auditLog, clearAuditLog, addAuditLog } = useApp();

  const handleClear = () => {
    Alert.alert('مسح السجل', 'هل أنت متأكد من مسح سجل المراجعة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'مسح',
        style: 'destructive',
        onPress: clearAuditLog,
      },
    ]);
  };

  const handleExport = async () => {
    try {
      const text = auditLog
        .map((e) => `[${e.timestamp}] [${e.type.toUpperCase()}] ${e.action}: ${e.message}`)
        .join('\n');

      const fileUri = FileSystem.documentDirectory + `audit_log_${new Date().toISOString().split('T')[0]}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, '\uFEFF' + text, { encoding: FileSystem.EncodingType.UTF8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      Alert.alert('خطأ', 'فشل تصدير السجل');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#1B5E20';
      case 'error':
        return '#C62828';
      case 'warning':
        return '#F9A825';
      case 'info':
        return '#1565C0';
      default:
        return '#757575';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'success':
        return '#E8F5E9';
      case 'error':
        return '#FFEBEE';
      case 'warning':
        return '#FFF8E1';
      case 'info':
        return '#E3F2FD';
      default:
        return '#F5F5F5';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'alert';
      case 'info':
        return 'information';
      default:
        return 'note-text';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#37474F', '#263238']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            📋 سجل المراجعة
          </Text>
          <View style={styles.headerActions}>
            <IconButton
              icon="delete"
              iconColor="#fff"
              onPress={handleClear}
              disabled={auditLog.length === 0}
              style={styles.headerButton}
            />
            <IconButton
              icon="export"
              iconColor="#fff"
              onPress={handleExport}
              disabled={auditLog.length === 0}
              style={styles.headerButton}
            />
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          {auditLog.length} سجل
        </Text>
      </LinearGradient>

      {auditLog.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Avatar.Icon size={80} icon="clipboard-text-outline" style={{ backgroundColor: theme.colors.border.light }} />
          <Text style={styles.emptyText}>لا توجد سجلات بعد</Text>
          <Text style={styles.emptySubtext}>سيتم تسجيل جميع العمليات هنا</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {auditLog.map((entry, index) => (
              <Surface key={entry.id} style={styles.logCard} elevation={2}>
                <View style={styles.logHeader}>
                  <Avatar.Icon
                    size={40}
                    icon={getTypeIcon(entry.type)}
                    style={{ backgroundColor: getTypeBg(entry.type) }}
                    color={getTypeColor(entry.type)}
                  />
                  <View style={styles.logInfo}>
                    <Text style={styles.logAction}>{entry.action}</Text>
                    <Text style={styles.logTime}>{entry.timestamp}</Text>
                  </View>
                  <Chip
                    style={[styles.typeChip, { backgroundColor: getTypeBg(entry.type) }]}
                    textStyle={{ color: getTypeColor(entry.type), fontSize: 11, fontWeight: '600' }}
                  >
                    {entry.type}
                  </Chip>
                </View>
                <Divider style={styles.divider} />
                <Text style={styles.logMessage}>{entry.message}</Text>
              </Surface>
            ))}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      )}
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
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: 0,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  logCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logInfo: {
    flex: 1,
  },
  logAction: {
    fontWeight: '600',
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  logTime: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  typeChip: {
    borderRadius: 12,
    height: 28,
  },
  divider: {
    marginVertical: 12,
  },
  logMessage: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    color: theme.colors.text.secondary,
    marginTop: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default AuditScreen;
