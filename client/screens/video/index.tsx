import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { uploadFile, gradeVideo, GradingResult } from '@/utils/api';
import { createStyles } from './styles';

export default function VideoScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);

  const handlePickVideo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('提示', '需要相册权限才能选择视频');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        videoQuality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedVideo(result.assets[0]);
        setResult(null);
      }
    } catch (error) {
      Alert.alert('错误', '选择视频时发生错误');
    }
  };

  const handleSubmit = async () => {
    if (!selectedVideo) {
      Alert.alert('提示', '请先选择要批改的视频');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 上传视频到对象存储
      const uploadResult = await uploadFile(
        selectedVideo.uri,
        selectedVideo.fileName || 'video.mp4',
        selectedVideo.mimeType || 'video/mp4'
      );
      
      // 调用批改 API
      const gradingResult = await gradeVideo(
        `视频文件：${selectedVideo.fileName || 'video.mp4'}`,
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
    setSelectedVideo(null);
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
            视频批改
          </ThemedText>
          <View style={styles.placeholder} />
        </ThemedView>

        {/* Upload Section */}
        {!result && (
          <ThemedView level="root" style={styles.section}>
            <TouchableOpacity style={styles.cardOuter} onPress={handlePickVideo} activeOpacity={0.8}>
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.uploadArea}>
                    <View style={[styles.uploadIconContainer, { backgroundColor: '#FF658415' }]}>
                      <FontAwesome6 
                        name={selectedVideo ? 'video' : 'film'} 
                        size={32} 
                        color="#FF6584" 
                      />
                    </View>
                    <ThemedText variant="title" color={theme.textPrimary} style={styles.uploadTitle}>
                      {selectedVideo ? '已选择视频' : '点击上传视频'}
                    </ThemedText>
                    <ThemedText variant="small" color={theme.textSecondary}>
                      {selectedVideo ? '视频已准备好' : '支持 MP4 / AVI 等格式'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {selectedVideo && (
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: '#FF6584' }]} 
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
                    <ThemedText variant="h2" color="#FF6584">
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
                        content: '内容主题',
                        editing: '剪辑节奏',
                        cameraWork: '镜头语言',
                        duration: '时长适配',
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

            {/* Platform Score */}
            {result.platformScore && (
              <View style={styles.cardOuter}>
                <View style={styles.cardShadow}>
                  <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                    <View style={styles.detailCard}>
                      <ThemedText variant="title" color={theme.textPrimary} style={styles.detailTitle}>
                        平台适配评分
                      </ThemedText>
                      <View style={styles.platformRow}>
                        <View style={styles.platformItem}>
                          <FontAwesome6 name="weibo" size={20} color="#FF6584" />
                          <ThemedText variant="body" color={theme.textPrimary} style={styles.platformScore}>
                            {result.platformScore.weibo}
                          </ThemedText>
                        </View>
                        <View style={styles.platformItem}>
                          <FontAwesome6 name="book" size={20} color="#FF6584" />
                          <ThemedText variant="body" color={theme.textPrimary} style={styles.platformScore}>
                            {result.platformScore.xiaohongshu}
                          </ThemedText>
                        </View>
                        <View style={styles.platformItem}>
                          <FontAwesome6 name="music" size={20} color="#FF6584" />
                          <ThemedText variant="body" color={theme.textPrimary} style={styles.platformScore}>
                            {result.platformScore.douyin}
                          </ThemedText>
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
                      <FontAwesome6 name="lightbulb" size={18} color="#FF6584" />
                      <ThemedText variant="title" color={theme.textPrimary} style={styles.commentTitle}>
                        优化建议
                      </ThemedText>
                    </View>
                    {result.suggestions.map((item, index) => (
                      <View key={index} style={styles.commentItem}>
                        <View style={[styles.suggestionNumber, { backgroundColor: '#FF658415' }]}>
                          <ThemedText variant="caption" color="#FF6584">{index + 1}</ThemedText>
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
            <TouchableOpacity style={[styles.resetButton, { borderColor: '#FF6584' }]} onPress={handleReset}>
              <ThemedText variant="bodyMedium" color="#FF6584">
                重新批改
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ScrollView>
    </Screen>
  );
}
