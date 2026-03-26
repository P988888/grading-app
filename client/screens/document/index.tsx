import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { uploadDocument, gradeDocument, GradingResult } from '@/utils/api';
import { createStyles } from './styles';

export default function DocumentScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setResult(null);
      }
    } catch (error) {
      Alert.alert('错误', '选择文件时发生错误');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      Alert.alert('提示', '请先选择要批改的文档');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 上传文档并获取内容
      const documentContent = await uploadDocument(selectedFile.uri, selectedFile.name);
      
      // 调用批改 API
      const gradingResult = await gradeDocument(documentContent.content, selectedFile.name);
      
      setResult(gradingResult);
    } catch (error) {
      Alert.alert('错误', error instanceof Error ? error.message : '批改过程中发生错误');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView level="root" style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText variant="h3" color={theme.textPrimary}>
            文档批改
          </ThemedText>
          <View style={styles.placeholder} />
        </ThemedView>

        {/* Upload Section */}
        {!result && (
          <ThemedView level="root" style={styles.section}>
            <TouchableOpacity style={styles.cardOuter} onPress={handlePickDocument} activeOpacity={0.8}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.uploadArea}>
                    <View style={[styles.uploadIconContainer, { backgroundColor: `${theme.primary}12` }]}>
                      <FontAwesome6 
                        name={selectedFile ? 'file-circle-check' : 'cloud-arrow-up'} 
                        size={32} 
                        color={theme.primary} 
                      />
                    </View>
                    <ThemedText variant="title" color={theme.textPrimary} style={styles.uploadTitle}>
                      {selectedFile ? selectedFile.name : '点击上传文档'}
                    </ThemedText>
                    <ThemedText variant="small" color={theme.textSecondary}>
                      {selectedFile ? '已选择文件' : '支持 PDF / Word / PPT 格式'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {selectedFile && (
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color={theme.buttonPrimaryText} />
                ) : (
                  <ThemedText variant="bodyMedium" color={theme.buttonPrimaryText}>
                    开始批改
                  </ThemedText>
                )}
              </TouchableOpacity>
            )}
          </ThemedView>
        )}

        {/* Result Section */}
        {result && (
          <ThemedView level="root" style={styles.section}>
            {/* Score Card */}
            <View style={styles.cardOuter}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.scoreCard}>
                    <ThemedText variant="h2" color={theme.primary}>
                      {result.totalScore}
                    </ThemedText>
                    <ThemedText variant="small" color={theme.textSecondary}>
                      / 100 分
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>

            {/* Score Details */}
            <View style={styles.cardOuter}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.detailCard}>
                    <ThemedText variant="title" color={theme.textPrimary} style={styles.detailTitle}>
                      分项得分
                    </ThemedText>
                    {Object.entries(result.scores).map(([key, value]) => {
                      const labels: Record<string, string> = {
                        content: '内容完整度',
                        structure: '结构逻辑',
                        creativity: '创新性',
                        technical: '技术规范',
                      };
                      return (
                        <View key={key} style={styles.scoreRow}>
                          <ThemedText variant="body" color={theme.textSecondary}>
                            {labels[key] || key}
                          </ThemedText>
                          <ThemedText variant="bodyMedium" color={theme.textPrimary}>
                            {value} / {result.maxScores[key]}
                          </ThemedText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>

            {/* Strengths */}
            <View style={styles.cardOuter}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <FontAwesome6 name="circle-check" size={18} color="#10B981" />
                      <ThemedText variant="title" color={theme.textPrimary} style={styles.commentTitle}>
                        优点
                      </ThemedText>
                    </View>
                    {result.strengths.map((item, index) => (
                      <View key={index} style={styles.commentItem}>
                        <View style={styles.bulletPoint}>
                          <FontAwesome6 name="check" size={10} color="#10B981" />
                        </View>
                        <ThemedText variant="small" color={theme.textSecondary} style={styles.commentText}>
                          {item}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Weaknesses */}
            <View style={styles.cardOuter}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <FontAwesome6 name="circle-exclamation" size={18} color="#EF4444" />
                      <ThemedText variant="title" color={theme.textPrimary} style={styles.commentTitle}>
                        不足
                      </ThemedText>
                    </View>
                    {result.weaknesses.map((item, index) => (
                      <View key={index} style={styles.commentItem}>
                        <View style={styles.bulletPoint}>
                          <FontAwesome6 name="xmark" size={10} color="#EF4444" />
                        </View>
                        <ThemedText variant="small" color={theme.textSecondary} style={styles.commentText}>
                          {item}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Suggestions */}
            <View style={styles.cardOuter}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <FontAwesome6 name="lightbulb" size={18} color={theme.primary} />
                      <ThemedText variant="title" color={theme.textPrimary} style={styles.commentTitle}>
                        优化建议
                      </ThemedText>
                    </View>
                    {result.suggestions.map((item, index) => (
                      <View key={index} style={styles.commentItem}>
                        <View style={[styles.suggestionNumber, { backgroundColor: `${theme.primary}15` }]}>
                          <ThemedText variant="caption" color={theme.primary}>{index + 1}</ThemedText>
                        </View>
                        <ThemedText variant="small" color={theme.textSecondary} style={styles.commentText}>
                          {item}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Reset Button */}
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <ThemedText variant="bodyMedium" color={theme.primary}>
                重新批改
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </Screen>
  );
}
