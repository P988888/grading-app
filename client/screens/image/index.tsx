import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { uploadFile, gradeImage, GradingResult } from '@/utils/api';
import { createStyles } from './styles';

export default function ImageScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('提示', '需要相册权限才能选择图片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
        setResult(null);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片时发生错误');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('提示', '请先选择要批改的图片');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 上传图片到对象存储
      const uploadResult = await uploadFile(
        selectedImage.uri,
        selectedImage.fileName || 'image.jpg',
        selectedImage.mimeType || 'image/jpeg'
      );
      
      // 调用批改 API
      const gradingResult = await gradeImage(
        `图片文件：${selectedImage.fileName || 'image.jpg'}`,
        uploadResult.url
      );
      
      setResult(gradingResult);
    } catch (error) {
      Alert.alert('错误', error instanceof Error ? error.message : '批改过程中发生错误');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
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
            图片批改
          </ThemedText>
          <View style={styles.placeholder} />
        </ThemedView>

        {/* Upload Section */}
        {!result && (
          <ThemedView level="root" style={styles.section}>
            <TouchableOpacity style={styles.cardOuter} onPress={handlePickImage} activeOpacity={0.8}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.uploadArea}>
                    {selectedImage ? (
                      <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                    ) : (
                      <>
                        <View style={[styles.uploadIconContainer, { backgroundColor: '#00B89415' }]}>
                          <FontAwesome6 name="image" size={32} color="#00B894" />
                        </View>
                        <ThemedText variant="title" color={theme.textPrimary} style={styles.uploadTitle}>
                          点击上传图片
                        </ThemedText>
                        <ThemedText variant="small" color={theme.textSecondary}>
                          支持 JPG / PNG 等格式
                        </ThemedText>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {selectedImage && (
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: '#00B894' }]} 
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
                    <ThemedText variant="h2" color="#00B894">
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
                        content: '内容点题度',
                        visual: '视觉冲击力',
                        spread: '传播潜力',
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

            {/* Interaction Score */}
            {result.interactionScore && (
              <View style={styles.cardOuter}>
                <View style={styles.cardShadow}>
                  <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                    <View style={styles.detailCard}>
                      <ThemedText variant="title" color={theme.textPrimary} style={styles.detailTitle}>
                        预估传播数据
                      </ThemedText>
                      <View style={styles.interactionRow}>
                        <View style={styles.interactionItem}>
                          <FontAwesome6 name="eye" size={20} color="#00B894" />
                          <ThemedText variant="body" color={theme.textPrimary} style={styles.interactionValue}>
                            {result.interactionScore.views.toLocaleString()}
                          </ThemedText>
                          <ThemedText variant="caption" color={theme.textMuted}>浏览</ThemedText>
                        </View>
                        <View style={styles.interactionItem}>
                          <FontAwesome6 name="heart" size={20} color="#00B894" />
                          <ThemedText variant="body" color={theme.textPrimary} style={styles.interactionValue}>
                            {result.interactionScore.likes}
                          </ThemedText>
                          <ThemedText variant="caption" color={theme.textMuted}>点赞</ThemedText>
                        </View>
                        <View style={styles.interactionItem}>
                          <FontAwesome6 name="comment" size={20} color="#00B894" />
                          <ThemedText variant="body" color={theme.textPrimary} style={styles.interactionValue}>
                            {result.interactionScore.comments}
                          </ThemedText>
                          <ThemedText variant="caption" color={theme.textMuted}>评论</ThemedText>
                        </View>
                        <View style={styles.interactionItem}>
                          <FontAwesome6 name="share" size={20} color="#00B894" />
                          <ThemedText variant="body" color={theme.textPrimary} style={styles.interactionValue}>
                            {result.interactionScore.shares}
                          </ThemedText>
                          <ThemedText variant="caption" color={theme.textMuted}>分享</ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

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
                      <FontAwesome6 name="lightbulb" size={18} color="#00B894" />
                      <ThemedText variant="title" color={theme.textPrimary} style={styles.commentTitle}>
                        优化建议
                      </ThemedText>
                    </View>
                    {result.suggestions.map((item, index) => (
                      <View key={index} style={styles.commentItem}>
                        <View style={[styles.suggestionNumber, { backgroundColor: '#00B89415' }]}>
                          <ThemedText variant="caption" color="#00B894">{index + 1}</ThemedText>
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
            <TouchableOpacity style={[styles.resetButton, { borderColor: '#00B894' }]} onPress={handleReset}>
              <ThemedText variant="bodyMedium" color="#00B894">
                重新批改
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </Screen>
  );
}
