import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing['4xl'],
      paddingBottom: Spacing['5xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing['3xl'],
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${theme.primary}12`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    title: {
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    subtitle: {
      textAlign: 'center',
      paddingHorizontal: Spacing.xl,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      marginBottom: Spacing.lg,
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
    cardInner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.lg,
    },
    featureIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.lg,
    },
    featureTextContainer: {
      flex: 1,
    },
    featureDescription: {
      marginTop: Spacing.xs,
      lineHeight: 20,
    },
    arrowContainer: {
      marginLeft: Spacing.sm,
    },
    infoSection: {
      marginTop: Spacing.sm,
    },
    infoCard: {
      padding: Spacing.lg,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    infoTitle: {
      marginLeft: Spacing.sm,
    },
    infoText: {
      lineHeight: 22,
    },
  });
};
