import React, { Component } from 'react';
import { Container, Header, List, Segment, Grid, Rail, Icon } from 'semantic-ui-react'
import { steps, InputKidInfo, ShowKidCollegeYear, BaseForm } from './Steps.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      maxStep: 0,
      kidInfos: [],
      vehicleType: null,
      validationErrors: new Map(),
      vehicles: []
    };
    this._next = this._next.bind(this);
    this._back = this._back.bind(this);
    this._setCurrentStep = this._setCurrentStep.bind(this);
    this._saveVehicle = this._saveVehicle.bind(this);
    this._setKidInfos = this._setKidInfos.bind(this);
    this._getKidInfoValidationErrors = this._getKidInfoValidationErrors.bind(this);
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
      let validationErrors = this._getKidInfoValidationErrors(kidInfos);
      this.setState((state, props) => {
          let newValidationErrors = new Map(state.validationErrors);
          newValidationErrors.set(InputKidInfo, validationErrors);
          return {kidInfos: kidInfos, validationErrors: newValidationErrors};
      });
      //TODO not sure this is working or necessary
      this.forceUpdate();
  }

  _getKidInfoValidationErrors(kidInfos) {
      let errors = new Map();
      for (let i = 0; i < kidInfos.length; ++i) {
          let error = new Map();
          let name = kidInfos[i].name;
          if (name.trim() === '') {
              error.set('name', "Name cannot be empty");
          }
          // TODO Ugh, things like "1e" pass because of scientific notation
          // Also stops parsing after gets an invalid character?
          let age = kidInfos[i].age;
          let kidAge = parseInt(age, 10);
          if (isNaN(kidAge)) {
              error.set('age', "Age must be a number");
          }
          else if (kidAge < 0) {
              error.set('age', "Age cannot be negative");
          }
          if (error.size > 0) {
              errors.set(i, error);
          }
      }
      return errors;
  }

  getCollegeYear(kidInfo) {
    let thisYear = (new Date()).getFullYear();
    return thisYear - kidInfo.age + 18;
  }

  _next() {
    this._setCurrentStep(this.state.currentStep + 1);
  }

  _back() {
    this._setCurrentStep(this.state.currentStep - 1);
  }

  _currentStep() {
    let stepClass = steps[this.state.currentStep];
    let props = {};
    if (this.state.currentStep > 0) {
        props.back = this._back;
    }
    if (this.state.currentStep < steps.length - 1) {
        props.next = this._next;
    }
    let stepType = stepClass.constructor;
    // Pass extra parameters here
    if (stepType === InputKidInfo) {
        props.setKidInfos = this._setKidInfos;
        props.kidInfos = this.state.kidInfos;
        props.validationErrors = this.state.validationErrors.get(InputKidInfo);
    }
    if (stepType === ShowKidCollegeYear) {
        props.kidInfos = this.state.kidInfos;
        props.collegeYear = this.state.collegeYear;
        props.getCollegeYear = this.getCollegeYear;
    }
    return React.createElement(stepType, props);
  }

  _setCurrentStep(step) {
      this.setState((state, props) => {
          let maxStep = Math.max(step, state.maxStep);
          return {maxStep: maxStep, currentStep: step};
      });
  }

  render() {
    let stateItems = [];
    for (let i = 0; i < steps.length; ++i) {
        let itemClass = "state-current";
        let icon = <Icon name='circle'/>;
        let active = true;
        let as = '';
        let thisIndex = i;
        let linkFunc = () => { this._setCurrentStep(thisIndex); };
        //TODO - really tricky to do this right with steps[i].constructor, abstract this maybe?
        let errorsMap = this.state.validationErrors.get(steps[i].constructor);
        let hasErrors = errorsMap && errorsMap.size > 0;
        if (i < this.state.currentStep) {
            itemClass = "state-past";
            let iconName = 'check circle';
            let iconColor = 'green';
            if (hasErrors) {
                iconName = 'exclamation circle';
                iconColor = 'yellow';
            }
            icon = <Icon color={iconColor} name={iconName}/>;
            active = false;
            as = 'a';
        }
        else if (i > this.state.currentStep) {
            itemClass = "state-future";
            let iconName = 'circle';
            if (hasErrors) {
                iconName = 'exclamation circle';
            }
            icon = <Icon color='grey' name={iconName}/>;
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
