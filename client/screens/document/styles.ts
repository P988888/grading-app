import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing['2xl'],
      paddingBottom: Spacing['5xl'],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing['2xl'],
    },
    backButton: {
      padding: Spacing.sm,
    },
    placeholder: {
      width: 32,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    cardOuter: {
      marginBottom: Spacing.lg,
    },
    cardShadow: {
      shadowColor: '#D1D9E6',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      borderRadius: BorderRadius.xl,
    },
    cardContent: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: -4, height: -4 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
    },
    uploadArea: {
      padding: Spacing['2xl'],
      alignItems: 'center',
    },
    uploadIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    uploadTitle: {
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing['2xl'],
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    scoreCard: {
      alignItems: 'center',
      padding: Spacing['2xl'],
    },
    detailCard: {
      padding: Spacing.lg,
    },
    detailTitle: {
      marginBottom: Spacing.lg,
    },
    scoreRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: Spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    commentCard: {
      padding: Spacing.lg,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    commentTitle: {
      marginLeft: Spacing.sm,
    },
    commentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Spacing.sm,
    },
    bulletPoint: {
      width: 16,
      height: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
      marginTop: 2,
    },
    suggestionNumber: {
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
      marginTop: 1,
    },
    commentText: {
      flex: 1,
      lineHeight: 20,
    },
    resetButton: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing['2xl'],
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
      borderWidth: 1,
      borderColor: theme.primary,
    },
  });
};
