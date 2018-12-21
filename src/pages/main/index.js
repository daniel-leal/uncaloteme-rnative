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
    addModalVisible: false,
    editModalVisible: false,
    debtors: [],
    debtorData: {
      id: 0,
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

  editDebtor = async () => {
    try {
      const {
        debtorData: { id, name, phone, email }
      } = this.state;

      // Update API
      const editDebtorResponse = await api.put(`/debtors/${id}`, {
        debtor: {
          name,
          phone,
          email
        }
      });

      const result = editDebtorResponse.data.data;

      // Copy of Debtors State
      let debtors = [...this.state.debtors];

      // Get index of element I want to update
      let index = debtors.findIndex(el => el.id == id);

      // Update Array
      debtors[index] = {
        ...debtors[index],
        name: name,
        phone: phone,
        email: email,
        avatar: result.avatar,
        key: id
      };

      // Update State
      this.setState({ debtors });

      this.setFlash("Edição realizada com sucesso!");
      this.clearForm();
      this.closeEditModal();
    } catch (err) {
      const result = err.response.data;
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

  //#region Modal Methods
  openAddModal = () => {
    this.refs.myModal.open();
  };

  closeAddModal = () => {
    this.refs.myModal.close();
  };

  openEditModal = debtor => {
    this.setState({
      debtorData: {
        id: debtor.id,
        name: debtor.name,
        email: debtor.email,
        phone: debtor.phone
      }
    });

    this.refs.myEditModal.open();
  };

  closeEditModal = () => {
    this.refs.myEditModal.close();
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

  renderEditModal = () => (
    <Modal
      ref={"myEditModal"}
      isOpen={this.state.editModalVisible}
      style={styles.modal}
      position="center"
      backdrop={true}
      onClosed={() => {
        this.clearForm();
      }}
    >
      <Text style={styles.modalTitle}>Editar Devedor</Text>
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
      <View style={styles.actionModalButtons}>
        <Button
          iconLeft
          style={styles.buttonSaveModal}
          onPress={() => {
            this.editDebtor();
            return;
          }}
        >
          <Icon name="md-create" />
          <Text>Editar</Text>
        </Button>
        <Button
          iconLeft
          style={styles.buttonCancelModal}
          onPress={this.closeEditModal}
        >
          <Icon name="close-circle" />
          <Text>Cancelar</Text>
        </Button>
      </View>
    </Modal>
  );

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
      <View style={styles.actionModalButtons}>
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
          onPress={this.closeAddModal}
        >
          <Icon name="close-circle" />
          <Text>Cancelar</Text>
        </Button>
      </View>
    </Modal>
  );
  //#endregion

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
            <Right style={styles.actionButtons}>
              <Button transparent onPress={() => this.openEditModal(debtor)}>
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
        {this.renderEditModal()}

        {/* Floating Button */}
        <Fab
          active={this.state.active}
          containerStyle={{}}
          style={styles.fab}
          position="bottomRight"
          onPress={() => {
            this.openAddModal();
          }}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}
