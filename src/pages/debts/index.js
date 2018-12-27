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
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: null,
      title: `Dívidas ${navigation.getParam("debtor").name.split(" ")[0]}`,
      headerStyle: {
        backgroundColor: colors.darker
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  getCurrentDateString() {
    return `${new Date().getUTCFullYear()}-${new Date().getMonth() +
      1}-${new Date().getDate()}`;
  }

  state = {
    addModalVisible: false,
    flashVisible: false,
    flashMessage: "",
    debts: [],
    debtData: {
      date: this.getCurrentDateString(),
      value: "",
      description: ""
    },
    dateError: false,
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

  saveDebt = async () => {
    try {
      const {
        debtData: { date, value, description }
      } = this.state;

      const { navigation } = this.props;
      const debtor_params = navigation.getParam("debtor");

      const newDebtResponse = await api.post(
        `/debtors/${debtor_params.id}/debts`,
        {
          debt: {
            date: date,
            is_active: true,
            amount_paid: 0.0,
            value: value,
            description: description
          }
        }
      );

      this.setState({
        debts: [newDebtResponse.data.data, ...this.state.debts]
      });

      this.setFlash("Cadastro realizado com sucesso!");
      this.clearForm();
      this.closeModal();
    } catch (err) {
      this.clearError();
      const result = err.response.data;
      console.log(result);

      for (var key in result["errors"]) {
        console.log(key);
        if (key == "date") {
          this.setState({ dateError: true });
        } else if (key == "description") {
          this.setState({ descriptionError: true });
        } else if (key == "value") {
          this.setState({ valueError: true });
        }
      }
    }
  };

  deleteDebt = async id => {
    try {
      const { navigation } = this.props;
      const debtor_params = navigation.getParam("debtor");

      await api.delete(`/debtors/${debtor_params.id}/debts/${id}`);

      // create an array without deleted element and replace in state
      const debts = this.state.debts.filter(debt => debt.id != id);
      this.setState({ debts });
    } catch (err) {
      console.log(err.response);
    }
  };
  //#endregion

  //#region Event Handles
  handleDateChange = date => {
    const { debtData } = this.state;
    this.setState({
      debtData: {
        ...debtData,
        date
      }
    });
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

  handleDescriptionChange = description => {
    const { debtData } = this.state;
    this.setState({
      debtData: {
        ...debtData,
        description
      }
    });
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
        date: this.getCurrentDateString(),
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

  clearError = () => {
    this.setState({
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
            onChangeText={this.handleDescriptionChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Item>
        <Item error={this.state.valueError}>
          <Icon type="FontAwesome" active name="money" />
          <Input
            placeholder="Valor"
            value={this.state.debtData.value}
            onChangeText={this.handleValueChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
          />
        </Item>
        <Item error={this.state.dateError}>
          <Icon type="FontAwesome" active name="calendar" />
          <Input
            placeholder="Data (YYYY-MM-DD)"
            value={this.state.debtData.date}
            onChangeText={this.handleDateChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Item>
      </Form>
      <View style={styles.actionModalButtons}>
        <Button
          iconLeft
          style={styles.buttonSaveModal}
          onPress={() => this.saveDebt()}
        >
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
            <Thumbnail source={require("../../images/bill.png")} />
            <Body>
              <Text style={{ fontWeight: "bold" }}>{debt.description}</Text>
              <Text style={[debt.is_active ? styles.devendo : styles.pago]}>
                R${debt.value.replace(".", ",")}
              </Text>
              <Text note>
                {new Date(debt.date).toLocaleDateString(
                  "pt-BR",
                  (options = { timeZone: "UTC" })
                )}
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
                        onPress: () => this.deleteDebt(debt.id)
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
