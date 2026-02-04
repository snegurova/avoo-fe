import { Text } from 'react-native-paper';
import { colors, typography } from '@avoo/design-tokens';
import { LANGUAGE_NAMES, LanguageCode } from '@avoo/constants';

type Props = {
  languages: LanguageCode[];
};

export const MasterLanguageList = (props: Props) => {
  const { languages } = props;
  if (languages.length === 0) {
    return null;
  }

  const languageNames = languages.map((lang) => LANGUAGE_NAMES[lang]).join(', ');

  return (
    <Text variant='bodySmall'>
      <Text style={styles.label}>Languages: </Text>
      <Text style={styles.languageText}>{languageNames}</Text>
    </Text>
  );
};

const styles = {
  label: {
    color: colors.gray[500],
  },
  languageText: {
    color: colors.gray[700],
    fontWeight: typography.fontWeight.medium,
  },
};
