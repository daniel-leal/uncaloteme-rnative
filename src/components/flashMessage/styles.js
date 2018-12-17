import { StyleSheet } from "react-native";
import { colors, metrics } from "../../styles/index";

const styles = StyleSheet.create({
  flashContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    margin: metrics.baseMargin,
    backgroundColor: colors.darkGreen,
    borderRadius: metrics.baseRadius
  },
  flashText: {
    marginLeft: metrics.baseMargin,
    fontWeight: "bold",
    color: colors.white,
    fontSize: 18
  },
  flashButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  }
});

export default styles;
