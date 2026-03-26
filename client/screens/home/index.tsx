import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { createStyles } from './styles';

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const features = [
    {
      id: 'document',
      title: '文档批改',
      description: 'PDF/Word/PPT 文档智能评分与批注',
      icon: 'file-lines',
      color: theme.primary,
      route: '/document',
    },
    {
      id: 'video',
      title: '视频批改',
      description: 'MP4/AVI 视频内容与剪辑评估',
      icon: 'video',
      color: '#FF6584',
      route: '/video',
    },
    {
      id: 'image',
      title: '图片批改',
      description: '图文内容与传播效果分析',
      icon: 'image',
      color: '#00B894',
      route: '/image',
    },
  ];

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <ThemedView level="root" style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="graduation-cap" size={28} color={theme.primary} />
          </View>
          <ThemedText variant="h2" color={theme.textPrimary} style={styles.title}>
            智能批改系统
          </ThemedText>
          <ThemedText variant="body" color={theme.textSecondary} style={styles.subtitle}>
            网络与新媒体专业作业智能评分平台
          </ThemedText>
        </ThemedView>

        {/* Feature Cards */}
        <ThemedView level="root" style={styles.section}>
          <ThemedText variant="h4" color={theme.textPrimary} style={styles.sectionTitle}>
            选择批改类型
          </ThemedText>
          
          {features.map((feature, index) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.cardOuter}
              onPress={() => router.push(feature.route)}
              activeOpacity={0.8}
            >
              <View style={styles.cardShadow}>
                <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.cardInner}>
                    <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}15` }]}>
                      <FontAwesome6 name={feature.icon} size={24} color={feature.color} />
                    </View>
                    <View style={styles.featureTextContainer}>
                      <ThemedText variant="title" color={theme.textPrimary}>
                        {feature.title}
                      </ThemedText>
                      <ThemedText variant="small" color={theme.textSecondary} style={styles.featureDescription}>
                        {feature.description}
                      </ThemedText>
                    </View>
                    <View style={styles.arrowContainer}>
                      <FontAwesome6 name="chevron-right" size={16} color={theme.textMuted} />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Info Section */}
        <ThemedView level="root" style={styles.infoSection}>
          <TouchableOpacity style={styles.cardOuter} activeOpacity={0.8}>
            <View style={styles.cardShadow}>
              <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
                <View style={styles.infoCard}>
                  <View style={styles.infoHeader}>
                    <FontAwesome6 name="lightbulb" size={20} color={theme.primary} />
                    <ThemedText variant="title" color={theme.textPrimary} style={styles.infoTitle}>
                      评分标准
                    </ThemedText>
                  </View>
                  <ThemedText variant="small" color={theme.textSecondary} style={styles.infoText}>
                    依据行业通用指标及院校教学大纲，从内容完整度、理论准确性、格式规范性、创新性等维度进行专业评分
                  </ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </Screen>
  );
}
