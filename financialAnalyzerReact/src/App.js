import React, { Component } from 'react';
import { Container, Header, List, Segment, Grid, Rail } from 'semantic-ui-react'
import { steps, VehicleChoose, BaseForm } from './Steps.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 0,
      vehicleType: null,
      vehicles: []
    };
    this._next = this._next.bind(this);
    this._back = this._back.bind(this);
    this._saveVehicle = this._saveVehicle.bind(this);
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
    let nextState = currentState + 1;
    this.setState({
      currentState: nextState,
    });
  }

  _back(desiredState) {
    let currentState = this.state.currentState;
    this.setState({
      currentState: currentState - 1
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
    let stepClass = steps[this.state.currentState];
    let props = {};
    if (this.state.currentState > 0) {
        props.back = this._back;
    }
    if (this.state.currentState < steps.length - 1) {
        props.next = this._next;
    }
    return React.createElement(stepClass.constructor, props);
    /*switch(this.state.currentState) {
        case 0:
            return <VehicleChoose next={this._next}/>;
        case 1:
            return <BaseForm back={this._back}/>;
    }*/
  }

  render() {
    let stateItems = [];
    for (let i = 0; i < steps.length; ++i) {
        let itemClass = "state-current";
        if (i < this.state.currentState) {
            itemClass = "state-past";
        }
        else if (i > this.state.currentState) {
            itemClass = "state-future";
        }
        //TODO - make clicking on it go to that state
        stateItems.push(<List.Item className={itemClass} key={"state" + i}>{steps[i].name()}</List.Item>);
    }
    return (
      <Grid centered columns={2}>
        <Grid.Column>
            <Container text>
              <Header as='h2'>Financial calculator</Header>
              <Rail position='left'>
                  <Segment>
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
