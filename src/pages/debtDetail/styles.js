import { StyleSheet } from "react-native";
import { colors, metrics } from "../../styles/index";
import { Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray
  },
  item: {
    marginTop: metrics.baseMargin,
    marginLeft: metrics.baseMargin,
    marginRight: metrics.baseMargin,
    borderRadius: metrics.baseRadius
  },
  debtDescription: {
    fontWeight: "bold"
  },
  totalText: {
    fontWeight: "bold",
    color: colors.danger
  },
  totalValue: {
    color: colors.danger
  },
  iconContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  textContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 45
  },
  thumbUp: {
    marginRight: 100,
    fontSize: 50,
    color: colors.success
  },
  thumbDown: {
    fontSize: 50,
    color: colors.danger
  },
  iconColor: {
    color: colors.gray
  },
  submitPartial: {
    marginTop: 30,
    backgroundColor: colors.gray
  },
  submitTotal: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: colors.roxo
  },
});

export default styles;
