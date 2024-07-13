import { Input } from "react-native-elements";
import { StyleSheet } from "react-native";

interface Props {
  placeholder: string;
  iconName: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const IconInput: React.FC<Props> = ({
  placeholder,
  iconName,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <Input
      placeholder={placeholder}
      leftIcon={{ type: "font-awesome", name: iconName }}
      leftIconContainerStyle={{ marginRight: 10 }}
      secureTextEntry={secureTextEntry}
      containerStyle={styles.input}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
});

export default IconInput;
