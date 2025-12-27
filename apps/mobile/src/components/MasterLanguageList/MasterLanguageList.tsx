import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@avoo/design-tokens';

type Props = {
  languages: string[];
};

export const MasterLanguageList = (props: Props) => {
  const { languages } = props;
  if (languages.length === 0) {
    return <Text style={styles.language}>No languages</Text>;
  }

  return (
    <View style={styles.container}>
      {languages.map((lang, index) => (
        <Text key={index} style={styles.language}>
          {lang.toUpperCase()}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  language: {
    fontSize: typography.fontSize.xs,
    color: colors.black,
    fontWeight: typography.fontWeight.medium,
  },
});
