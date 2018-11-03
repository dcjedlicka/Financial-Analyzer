import React, { Component } from 'react';
import { Container, Header, List, Segment, Grid, Rail, Icon } from 'semantic-ui-react'
import { steps, InputKidInfo, ShowKidCollegeYear, BaseForm } from './Steps.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 0,
      kidInfos: [],
      vehicleType: null,
      vehicles: []
    };
    this._next = this._next.bind(this);
    this._back = this._back.bind(this);
    this._saveVehicle = this._saveVehicle.bind(this);
    this._setKidInfos = this._setKidInfos.bind(this);
    this.getCollegeYear = this.getCollegeYear.bind(this);
  }

  _saveVehicle(vehicle) {
    let vehicles = this.state.vehicles.concat();
    vehicles.push(vehicle);
    this.setState({
      vehicles: vehicles
    });
  }

  _setKidInfos(kidInfos) {
      this.setState({
          kidInfos: kidInfos
      });
  }

  getCollegeYear() {
    let thisYear = (new Date()).getFullYear();
    //return thisYear - this.state.kidAge + 18;
    return 0;
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

  _currentStep() {
    let stepClass = steps[this.state.currentState];
    let props = {};
    if (this.state.currentState > 0) {
        props.back = this._back;
    }
    if (this.state.currentState < steps.length - 1) {
        props.next = this._next;
    }
    let stepType = stepClass.constructor;
    // Pass extra parameters here
    if (stepType === InputKidInfo) {
        props.setKidInfos = this._setKidInfos;
        props.kidInfos = this.state.kidInfos;
    }
    if (stepType === ShowKidCollegeYear) {
        props.kidInfos = this.state.kidInfos;
        props.collegeYear = this.state.collegeYear;
        props.getCollegeYear = this.getCollegeYear;
    }
    return React.createElement(stepType, props);
  }

  render() {
    let stateItems = [];
    for (let i = 0; i < steps.length; ++i) {
        let itemClass = "state-current";
        let icon = <Icon name='circle'/>;
        let active = true;
        let as = '';
        let thisIndex = i;
        let linkFunc = (function() { this.setState({currentState: thisIndex}); }).bind(this);
        if (i < this.state.currentState) {
            itemClass = "state-past";
            icon = <Icon color='green' name='check circle'/>;
            active = false;
            as = 'a';
        }
        else if (i > this.state.currentState) {
            itemClass = "state-future";
            icon = <Icon color='grey' name='circle'/>;
            active = false;
            as = 'a';
        }
        stateItems.push(<List.Item as={as} onClick={linkFunc} active={active} className={itemClass} key={"state" + i}>{icon} {steps[i].name()}</List.Item>);
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
