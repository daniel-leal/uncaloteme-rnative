import React, { Component } from "react";
import { StatusBar, Alert, Image } from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Form,
  Input,
  Item,
  View
} from "native-base";

import styles from "./styles";
import { colors, metrics } from "../../styles";
import api from "../../services/api";

export default class DebtDetail extends Component {
  static navigationOptions = () => {
    return {
      headerBackTitle: null,
      title: "Detalhes da Dívida",
      headerStyle: {
        backgroundColor: colors.darker
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  state = {
    debtData: {
      value: ""
    },
    valueError: false
  };

  payPartial = async () => {
    try {
      const { navigation } = this.props;
      const debtor_id = navigation.getParam("debtor_id");
      const debt = navigation.getParam("debt");

      if (this.state.debtData.value > this.getOweValue()) {
        this.setState({ valueError: true });
        alert("Você não pode pagar um valor maior que o valor devedor");
        throw new Error('must be less than debt');
      } else if (this.state.debtData.value <= 0) {
        this.setState({ valueError: true });
        alert("Você deve pagar uma certa quantia");
        throw new Error('must be greater than 0');
      }

      await api.put(`/debtors/${debtor_id}/debts/${debt.id}`, {
        debt: {
          is_active: this.state.debtData.value != this.getOweValue(),
          amount_paid: Number(debt.amount_paid) + Number(this.state.debtData.value)
        }
      });

      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } catch (err) {
      console.log(err.response);
    }
  };

  payFull = async () => {
    try {
      const { navigation } = this.props;
      const debtor_id = navigation.getParam("debtor_id");
      const debt = navigation.getParam("debt");

      await api.put(`/debtors/${debtor_id}/debts/${debt.id}`, {
        debt: {
          is_active: false,
          amount_paid: debt.value
        }
      });

      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } catch (err) {
      console.log(err.response);
    }
  };

  getOweValue = () => {
    const { navigation } = this.props;
    const debt = navigation.getParam("debt");

    return (Number(debt.value) - Number(debt.amount_paid)).toFixed(2);
  };

  handleValueChange = value => {
    const { debtData } = this.state;
    this.setState({
      debtData: {
        ...debtData,
        value
      }
    });
  };

  render() {
    const { navigation } = this.props;
    const debt = navigation.getParam("debt");

    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Content scrollEnabled={false}>
          <Card style={styles.item}>
            <CardItem>
              <Left>
                <Thumbnail source={require("../../images/bill.png")} />
                <Body>
                  <Text style={styles.debtDescription}>{debt.description}</Text>
                  <Text note>
                    {new Date(debt.date).toLocaleDateString(
                      "pt-BR",
                      (options = { timeZone: "UTC" })
                    )}
                  </Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <View style={styles.iconContainer}>
                  <Icon
                    type="FontAwesome"
                    name="thumbs-o-up"
                    style={styles.thumbUp}
                  />
                  <Icon
                    type="FontAwesome"
                    name="thumbs-o-down"
                    style={styles.thumbDown}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Já Pagou: </Text>
                    <Text>R${debt.amount_paid}</Text>
                  </Text>
                  <Text style={{ fontWeight: "bold" }}> | </Text>
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Devendo: </Text>
                    <Text>R${this.getOweValue()}</Text>
                  </Text>
                </View>

                <Form style={{ alignSelf: "stretch" }}>
                  <Item error={this.state.valueError}>
                    <Icon
                      type="FontAwesome"
                      name="money"
                      style={styles.iconColor}
                    />
                    <Input
                      placeholder="Valor Pago"
                      value={this.state.debtData.value}
                      onChangeText={this.handleValueChange}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="numbers-and-punctuation"
                    />
                  </Item>
                  <Button
                    block
                    style={styles.submitPartial}
                    onPress={this.payPartial}
                  >
                    <Text>Pagar Parte</Text>
                  </Button>
                  <Button
                    block
                    style={styles.submitTotal}
                    onPress={this.payFull}
                  >
                    <Text>Pagar Valor Total</Text>
                  </Button>
                </Form>
              </Body>
            </CardItem>
            <CardItem>
              <Right style={{ flex: 1 }}>
                <Text>
                  <Text style={styles.totalText}>Valor da Dívida: </Text>
                  <Text style={styles.totalValue}>R${debt.value}</Text>
                </Text>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
