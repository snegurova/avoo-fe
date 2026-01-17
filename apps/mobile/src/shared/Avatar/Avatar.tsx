import { Avatar as PaperAvatar } from 'react-native-paper';
import { colors, typography } from '@avoo/design-tokens';

type Props = {
  uri?: string | null;
  name?: string | null;
  size?: number;
  backgroundColor?: string;
};

export const Avatar = (props: Props) => {
  const { uri, name, size = 40, backgroundColor } = props;
  const bgColor = backgroundColor || colors.primary[500];
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return uri ? (
    <PaperAvatar.Image size={size} source={{ uri }} style={{ backgroundColor: bgColor }} />
  ) : (
    <PaperAvatar.Text
      size={size}
      label={initial}
      style={{ backgroundColor: bgColor }}
      labelStyle={{
        color: colors.black,
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.medium,
        fontFamily: typography.fontFamily.sans,
        lineHeight: 30,
      }}
    />
  );
};
