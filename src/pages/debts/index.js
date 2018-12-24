//#region Imports
import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
  Left,
  Body,
  Thumbnail,
  Fab,
  Button,
  Form,
  Item,
  Input,
  View,
  Right,
  Icon
} from "native-base";
import { StatusBar, Alert } from "react-native";

import api from "../../services/api";
import styles from "./styles";
import { colors, metrics } from "../../styles";
import Modal from "react-native-modalbox";
import FlashMessage from "../../components/flashMessage";
//#endregion

export default class Debts extends Component {
  static navigationOptions = {
    title: "Dívidas",
    headerStyle: {
      backgroundColor: colors.darker
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    addModalVisible: false,
    flashVisible: false,
    flashMessage: "",
    debts: [],
    debtData: {
      date: "",
      amount_paid: "",
      value: "",
      description: ""
    },
    dateError: false,
    amount_paidError: false,
    valueError: false,
    descriptionError: false
  };

  //#region API Calls
  componentDidMount = async () => {
    try {
      const { navigation } = this.props;
      const debtor = navigation.getParam("debtor");

      const response = await api.get(`/debtors/${debtor.id}/debts`);
      console.log(debtor);

      this.setState({ debts: response.data.data });
    } catch (err) {
      console.log(err.response);
    }
  };
  //#endregion

  //#region Modal Methods
  openModal = () => {
    this.refs.myModal.open();
  };

  closeModal = () => {
    this.refs.myModal.close();
  };

  setFlash = message => {
    this.setState({ flashVisible: true, flashMessage: message });
  };

  clearForm = () => {
    this.setState({
      debtData: {
        date: "",
        amount_paid: "",
        value: "",
        description: ""
      },
      dateError: false,
      amount_paidError: false,
      valueError: false,
      descriptionError: false
    });
  };

  renderAddModal = () => (
    <Modal
      ref={"myModal"}
      isOpen={this.state.addModalVisible}
      style={styles.modal}
      position="center"
      backdrop={true}
      onClosed={() => {
        this.clearForm();
      }}
    >
      <Text style={styles.modalTitle}>Incluir Dívida</Text>
      <Form>
        <Item error={this.state.descriptionError}>
          <Icon active name="ios-pricetag" />
          <Input
            placeholder="Descrição"
            value={this.state.debtData.description}
            onChangeText={() => {}}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Item>
        <Item error={this.state.valueError}>
          <Icon type="FontAwesome" active name="money" />
          <Input
            placeholder="Valor"
            value={this.state.debtData.value}
            onChangeText={() => {}}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
          />
        </Item>
      </Form>
      <View style={styles.actionModalButtons}>
        <Button iconLeft style={styles.buttonSaveModal} onPress={() => {}}>
          <Icon name="beer" />
          <Text>Salvar</Text>
        </Button>
        <Button
          iconLeft
          style={styles.buttonCancelModal}
          onPress={this.closeModal}
        >
          <Icon name="close-circle" />
          <Text>Cancelar</Text>
        </Button>
      </View>
    </Modal>
  );
  //#endregion

  renderDebts = () =>
    this.state.debts.map(debt => (
      <Card key={debt.id} style={styles.item}>
        <CardItem>
          <Left>
            <Icon
              style={{ color: colors.darkGreen }}
              type="FontAwesome"
              name="money"
            />
            <Body>
              <Text style={{ fontWeight: "bold" }}>{debt.description}</Text>
              <Text style={[debt.is_active ? styles.devendo : styles.pago]}>
                Valor: R${debt.value.replace(".", ",")}
              </Text>
            </Body>
            <Right style={styles.actionButtons}>
              <Button
                transparent
                onPress={() => {
                  Alert.alert(
                    "Exclusão",
                    "Você tem certeza que deseja excluir esta dívida?",
                    [
                      {
                        text: "OK",
                        onPress: () => alert("Delete pressed")
                      },
                      {
                        text: "Cancel",
                        onPress: () => console.log("cancel pressed"),
                        style: "cancel"
                      }
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <Icon name="ios-trash" style={{ color: colors.danger }} />
              </Button>
            </Right>
          </Left>
        </CardItem>
      </Card>
    ));

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Content>{this.renderDebts()}</Content>

        {/* Modal */}
        {this.renderAddModal()}

        {/* Floating Button */}
        <Fab
          active={this.state.active}
          containerStyle={{}}
          style={styles.fab}
          position="bottomRight"
          onPress={() => {
            this.openModal();
          }}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}
