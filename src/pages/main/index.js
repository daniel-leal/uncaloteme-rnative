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
import { StatusBar } from "react-native";

import api from "../../services/api";
import styles from "./styles";
import { colors, metrics } from "../../styles";
import Modal from "react-native-modalbox";
import FlashMessage from "../../components/flashMessage";
//#endregion

export default class Main extends Component {
  static navigationOptions = {
    title: "Devedores",
    headerStyle: {
      backgroundColor: colors.darker
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  state = {
    flashVisible: false,
    flashMessage: "",
    modalVisible: false,
    debtors: [],
    debtorData: {
      name: "",
      email: "",
      phone: ""
    },
    nameError: false,
    emailError: false,
    phoneError: false
  };

  //#region API Calls
  async componentDidMount() {
    try {
      const response = await api.get("/debtors");
      this.setState({ debtors: response.data.data });
    } catch (err) {
      console.log(err);
    }
  }

  saveDebtor = async () => {
    try {
      const {
        debtorData: { name, phone, email }
      } = this.state;

      const newDebtorResponse = await api.post("/debtors", {
        debtor: {
          name,
          phone,
          email
        }
      });

      this.setFlash("Cadastro realizado com sucesso!");
      this.clearForm();
      this.setState({
        debtors: [...this.state.debtors, newDebtorResponse.data.data]
      });
    } catch (err) {
      const result = err.response.data;
      console.log(result);

      for (var key in result["errors"]) {
        console.log(key);
        if (key == "name") {
          this.setState({ nameError: true });
        } else if (key == "email") {
          this.setState({ emailError: true });
        } else if (key == "phone") {
          this.setState({ phoneError: true });
        }
      }
    }
  };
  //#endregion

  showAddModal = () => {
    this.refs.myModal.open();
  };

  setFlash = message => {
    this.setState({ flashVisible: true, flashMessage: message });
  };

  clearForm = () => {
    this.setState({
      debtorData: {
        name: "",
        email: "",
        phone: ""
      },
      nameError: false,
      emailError: false,
      phoneError: false
    });
  };

  //#region Event Handles
  handleNameChange = name => {
    const { debtorData } = this.state;
    this.setState({
      debtorData: {
        ...debtorData,
        name
      }
    });
  };

  handlePhoneChange = phone => {
    const { debtorData } = this.state;
    this.setState({
      debtorData: {
        ...debtorData,
        phone
      }
    });
  };

  handleEmailChange = email => {
    const { debtorData } = this.state;
    this.setState({
      debtorData: {
        ...debtorData,
        email
      }
    });
  };
  //#endregion

  renderDebtors = () =>
    this.state.debtors.map(debtor => (
      <Card key={debtor.id} style={styles.item}>
        <CardItem>
          <Left>
            {debtor.avatar ? (
              <Thumbnail source={{ uri: debtor.avatar }} />
            ) : (
              <Thumbnail source={require("../../images/avatar.png")} />
            )}
            <Body>
              <Text style={{ fontWeight: "bold" }}>{debtor.name}</Text>
              {/* <Text note>{debtor.email}</Text> */}
              <Text note>{debtor.phone}</Text>
            </Body>
            <Right style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button transparent onPress={() => alert("Edit pressed")}>
                <Icon
                  style={{
                    marginRight: metrics.baseMargin,
                    color: colors.green
                  }}
                  name="md-create"
                />
              </Button>
              <Button transparent onPress={() => alert("Delete pressed")}>
                <Icon name="ios-trash" style={{ color: colors.danger }} />
              </Button>
            </Right>
          </Left>
        </CardItem>
      </Card>
    ));

  renderAddModal = () => (
    <Modal
      ref={"myModal"}
      isOpen={this.state.modalVisible}
      style={styles.modal}
      position="center"
      backdrop={true}
      onClosed={() => {
        this.clearForm();
      }}
    >
      <Text style={styles.modalTitle}>Incluir Devedor</Text>
      <Form>
        <Item error={this.state.nameError}>
          <Icon active name="contact" />
          <Input
            placeholder="Nome"
            value={this.state.debtorData.name}
            onChangeText={this.handleNameChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Item>
        <Item error={this.state.emailError}>
          <Icon active name="at" />
          <Input
            placeholder="E-mail"
            value={this.state.debtorData.email}
            onChangeText={this.handleEmailChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </Item>
        <Item error={this.state.phoneError}>
          <Icon active name="call" />
          <Input
            placeholder="Telefone"
            value={this.state.debtorData.phone}
            onChangeText={this.handlePhoneChange}
            autoCapitalize="none"
            autoCorrect={false}
            dataDetectorTypes="phoneNumber"
            keyboardType="phone-pad"
          />
        </Item>
      </Form>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Button
          iconLeft
          style={styles.buttonSaveModal}
          onPress={() => {
            this.saveDebtor();
            return;
          }}
        >
          <Icon name="beer" />
          <Text>Salvar</Text>
        </Button>
        <Button
          iconLeft
          style={styles.buttonCancelModal}
          onPress={() => this.refs.myModal.close()}
        >
          <Icon name="close-circle" />
          <Text>Cancelar</Text>
        </Button>
      </View>
    </Modal>
  );

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Content>
          <FlashMessage
            message={this.state.flashMessage}
            onCancel={() => this.setState({ flashVisible: false })}
            isVisible={this.state.flashVisible}
          />
          {this.renderDebtors()}
        </Content>

        {/* Modal */}
        {this.renderAddModal()}

        {/* Floating Button */}
        <Fab
          active={this.state.active}
          containerStyle={{}}
          style={styles.fab}
          position="bottomRight"
          onPress={() => {
            this.showAddModal();
          }}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}
