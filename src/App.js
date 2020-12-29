import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from  './lottery';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Form, Button, Navbar, Jumbotron} from 'react-bootstrap';


class App extends Component {
  state = {
    manager : '',
    players : 0,
    balance : '',
    value : 0,
    message : ''
  }
  async componentDidMount(){
    window.ethereum.enable();
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const numberOfPlayers = players._method.outputs.length;
    this.setState({manager, players: numberOfPlayers, balance});
  }
  onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting for transaction to succeed...'});
    
    await lottery.methods.enter().send({
      from : accounts[0],
      value : web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You have entered successfully'});
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting for transaction to succeed...'});

    await lottery.methods.pickWinner().send({
      from : accounts[0],
    })

    this.setState({message: 'Picked the winner'});
  }
  render() {
    return (
      <div className="App" >
          <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="#home">
              Lottery App
            </Navbar.Brand>
          </Navbar>
        <Container>
          <Row>
            <Col>
            <Jumbotron className="m-2" fluid>
              <p>This contract is managed by {this.state.manager}</p>
              <p>There are currently {this.state.players} entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.</p>
            </Jumbotron>
            <div>
            <h3>Test Your Luck!</h3>
            <Form onSubmit={this.onSubmit}>
            <Row>
              <Col>
              <Form.Group>
                <Form.Label>Enter the amount of ether</Form.Label>
                <Form.Control placeholder="Enter email" value={this.state.value}
                  onChange={event => this.setState({value: event.target.value})} />
              </Form.Group>
              </Col>
            </Row>
            <Button onClick={this.onClick} variant="primary">
              Submit
            </Button>
            </Form>
            </div>

            <h4>Ready to pick a winner?</h4>
            <button onClick={this.onClick}>Pick a winner!</button>
            <hr/>
            <h2>{this.state.message}</h2>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

}

export default App;



