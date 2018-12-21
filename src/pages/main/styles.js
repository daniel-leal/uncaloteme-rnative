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

  modal: {
    justifyContent: "center",
    borderRadius: Platform.OS === "ios" ? 5 : 0,
    shadowRadius: metrics.borderRadius,
    height: 280,
    width: metrics.screenWidth - 80
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40
  },

  buttonSaveModal: {
    margin: metrics.baseMargin,
    backgroundColor: colors.success,
    borderRadius: metrics.baseRadius
  },

  buttonCancelModal: {
    margin: metrics.baseMargin,
    backgroundColor: colors.danger,
    borderRadius: metrics.baseRadius
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },

  actionModalButtons: {
    flex: 1,
    flexDirection: "row"
  },

  fab: {
    backgroundColor: colors.success
  }
});

export default styles;
