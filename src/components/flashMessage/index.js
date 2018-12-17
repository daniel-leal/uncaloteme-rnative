import React, { Component } from "react";
import { Text, View, Button, Icon } from "native-base";

import styles from "./styles";

export default class FlashMessage extends Component {
  render() {
    if (this.props.isVisible) {
      return (
        <View style={styles.flashContainer}>
          <Text style={styles.flashText}>{this.props.message}</Text>
          <Button
            transparent
            light
            style={styles.flashButton}
            onPress={this.props.onCancel}
          >
            <Icon name="ios-close-circle" />
          </Button>
        </View>
      );
    } else {
      return null;
    }
  }
}
