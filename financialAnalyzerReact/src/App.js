import React, { Component } from 'react';
import { Container, Header, List, Segment, Grid, Rail } from 'semantic-ui-react'
import { Welcome, VehicleChoose, CarForm, BoatForm, BoatDetail, Confirm } from './Steps.js';
import { states } from './States.js';
import { StateMachine } from './StateMachine.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: states.WELCOME,
      currentStatePath: [states.WELCOME],
      vehicleType: null,
      vehicles: []
    };
    this._next = this._next.bind(this);
    this._back = this._back.bind(this);
    this._saveVehicle = this._saveVehicle.bind(this);
    this.stateMachine = new StateMachine();
  }

  _saveVehicle(vehicle) {
    let vehicles = this.state.vehicles.concat();
    vehicles.push(vehicle);
    this.setState({
      vehicles: vehicles
    });
  }

  _next(desiredState) {
    let currentState = this.state.currentState;
    let nextState = this.stateMachine.transitionTo(currentState, desiredState);
    let statePath = this.state.currentStatePath.slice(0);
    statePath.push(nextState);
    this.setState({
      currentState: nextState,
      currentStatePath: statePath
    });
  }

  _back(desiredState) {
    let currentState = this.state.currentState;
    let statePath = this.state.currentStatePath.slice(0, this.state.currentStatePath.length - 1);
    this.setState({
      currentState: this.stateMachine.transitionFrom(currentState, desiredState),
      currentStatePath: statePath
    });
  }

  /*
   * Just a note -- you'll see the _next and _back functions
   * get passed around to child components alot. This is not
   * a very good practice, and in the real-world it would be
   * better to use a library like redux to handle application
   * state.
   */
  _currentStep() {
    switch(this.state.currentState) {
      case states.WELCOME:
        return(<Welcome next={this._next}/>);
      case states.VEHICLE_CHOOSE:
        return(<VehicleChoose 
          back={this._back}
          next={this._next}/>);
      case states.CAR:
        return(<CarForm 
          saveForm={this._saveVehicle}
          back={this._back}
          next={this._next} />);
      case states.BOAT:
        return(<BoatForm 
          saveForm={this._saveVehicle}
          back={this._back}
          next={this._next} />);
      case states.BOAT_DETAIL:
       return(<BoatDetail
         back={this._back}
         next={this._next} />);
      case states.CONFIRM:
        return(<Confirm
          vehicles={this.state.vehicles}
          back={this._back}
          next={this._next} />);
      default:
        return(<Welcome next={this._next}/>);
    }
  }
  render() {
    var stateItems = [];
    for (let i = 0; i < this.state.currentStatePath.length; ++i) {
        stateItems.push(<List.Item key={"state" + i}>{this.state.currentStatePath[i]}</List.Item>);
    }
    return (
      <Grid centered columns={2}>
        <Grid.Column>
            <Container text>
              <Header as='h2'>Acme Insurance Quotes</Header>
              <Rail position='left'>
                  <Segment inverted>
                      <List divided>
                          {stateItems}
                      </List>
                  </Segment>
              </Rail>
              {this._currentStep()}
            </Container>
        </Grid.Column>
      </Grid>
    );
  }
}

export default App;
