import React, { Component } from 'react';
import { Form, Button, Grid, Message, List, Icon } from 'semantic-ui-react';

class Errors extends Component {
    render() {
        return ( <div>{ this.props.errors && this.props.errors.length > 0 &&
            <Message negative>
              <p>{this.props.errors.join('. ')}</p>
            </Message>
            }</div>
        );
    }
}
class BackNextButtons extends Component{
    render() {
        return ( <Grid>
                {this.props.back && <Grid.Column floated='left' width={5}>
            <Button secondary onClick={this.props.back}>Back</Button>
          </Grid.Column> }
          { this.props.next && <Grid.Column floated='right' width={5}>
            <Button primary onClick={this.props.next}>Next</Button>
          </Grid.Column> }
        </Grid>);
    }
}

export class Intro extends Component {
      name() {
          return "Intro";
      }
    
    render() {
        return(
            <Grid>
                <p>Welcome to the financial calculator!  Let's get started!</p>
                <BackNextButtons back={this.props.back} next={this.props.next}/>
            </Grid>
        );
    }
}

class KidInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            age: props.age
        };
        this._onChange = this._onChange.bind(this);
        this._validate = this._validate.bind(this);
    }
    _onChange(e, {name, value}) {
        //TODO - more granular error clearing?
        this.setState({
            [name]: value,
            errors: []
        });
    }
    _validate() {
        let anyErrors = false;
        if (this.state.name.trim() === '') {
            anyErrors = true;
            this.setState((state, props) => {
                let newErrors = state.errors.slice(0);
                newErrors.push('Name cannot be empty');
                return {errors: newErrors};
            });
        }
        // TODO Ugh, things like "1e" pass because of scientific notation
        let kidAge = parseInt(this.state.age, 10);
        if (isNaN(kidAge)) {
            anyErrors = true;
            this.setState((state, props) => {
                let newErrors = state.errors.slice(0);
                newErrors.push('Age must be a number');
                return {errors: newErrors};
            });
        }
        else if (kidAge < 0) {
            anyErrors = true;
            this.setState((state, props) => {
                let newErrors = state.errors.slice(0);
                newErrors.push('Age cannot be negative');
                return {errors: newErrors};
            });
        }
        return anyErrors;
    }
    render() {
        return(
            <Form.Group>
                <Button icon width={2}>
                    <Icon name='delete' color='red'/>
                </Button>
                <Form.Input name='name' value={this.state.name} onChange={this._onChange} label='Name' width={6}/>
                <Form.Input name='age' value={this.state.age} onChange={this._onChange} label='Age' width={6}/>
            </Form.Group>
        );
    }
}

export class InputKidInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kidInfos: props.kidInfos,
      errors: []
    };
    this._validate = this._validate.bind(this);
    //this._onChange = this._onChange.bind(this);
    this._addKid = this._addKid.bind(this);
  }
  name() {
      return "Kid info";
  }
  /*_onChange(e, { value }) {
      this.setState({
          kidInfos: value,
          errors: []
      });
  }*/
  _addKid() {
      this.setState((state, props) => {
          let newKidInfos = state.kidInfos.slice(0);
          newKidInfos.push({name: '', age: 0});
          return {kidInfos: newKidInfos};
      });
  }
  _validate(e) {
    e.preventDefault();
    //TODO - can we ask the subcomponents to validate?
    //use refs - see https://reactjs.org/docs/refs-and-the-dom.html#the-ref-string-attribute
    //TODO - state needs to live above, should always be setting?
 
    // Ugh, things like "1e" pass because of scientific notation
    //let kidAge = parseInt(this.state.kidAge, 10);
    /*if (isNaN(kidAge)) {
      this.setState({
        errors: ['Not a number']
      });
      return;
    }

    this.props.setKidInfos(kidInfos);*/
    this.props.next();
  }
 
  render() {
      return(
        <Form>
            <Errors errors={this.state.errors}/>
            {this.state.kidInfos.map((kidInfo, index) => 
                    <KidInfo key={index} name={kidInfo.name} age={kidInfo.age}/>
                )}
            <Button icon onClick={this._addKid}>
                <Icon name='add' color='green'/>
            </Button>
            <BackNextButtons back={this.props.back} next={this._validate}/>
        </Form>
      );
  }

}

export class ShowKidCollegeYear extends Component {
  name() {
      return "College year";
  }

  render() {
    return(
      <div>
        <p>Your kid is {this.props.kidInfos} years old, and will attend college in <b>{this.props.getCollegeYear()}</b>.</p>
        <BackNextButtons back={this.props.back} next={this.props.next}/>
       </div>
    );
  }
}

export class BaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      make: null,
      model: null,
      value: null,
      length: null,
      errors: []
    }
    this._onChange = this._onChange.bind(this);
    this._validate = this._validate.bind(this);
    this._back = this._back.bind(this);
  }
  name() {
      return "Vehicle details";
  }

  _back(e) {
    e.preventDefault();
    this.props.back();
  }

  _onChange(e, { name, value }) {
    this.setState({
      [name]: value
    });
  }

  _validate(e) {
    e.preventDefault();
    // You can add your validation logic here

    this.props.saveForm({
      type: this.props.type,
      make: this.state.make,
      model: this.state.model,
      year: this.state.year
    });

    this.props.next(this.props.nextState);
  }
    
  render() {
    return(
      <Form>
        { this.state.errors.length > 0 &&
        <Message negative>
          <p>{this.state.errors.join('. ')}</p>
        </Message>
        }
        <h2>{this.props.type} details:</h2>
        <Form.Group widths='equal'>
          <Form.Input 
            name='make'
            value={this.state.make}
            onChange={this._onChange}
            label='Make' 
            placeholder='Make'/>
          <Form.Input 
            name='model'
            value={this.state.model}
            onChange={this._onChange}
            label='Model' 
            placeholder='Model'/>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input 
            name='year'
            value={this.state.year}
            onChange={this._onChange}
            label='Year' 
            placeholder='Year'/>
          {this.props.type === 'Boat' &&
            <Form.Input 
              name='length'
              value={this.state.length}
              onChange={this._onChange}
              label='Length' 
              placeholder='Length'/>
          }
        </Form.Group>
        <Grid>
          <Grid.Column floated='left' width={5}>
            <Button secondary onClick={this._back}>Back</Button>
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Button primary onClick={this._validate}>Next</Button>
          </Grid.Column>
        </Grid>
      </Form>
    );
  }
}

export const BoatForm = (props) => {
  return(
    <BaseForm
      type='Boat'
      next={props.next}
      back={props.back}
      saveForm={props.saveForm}/>
  );
}

export const CarForm = (props) => {
  return(
    <BaseForm
      type='Car'
      next={props.next}
      back={props.back}
      saveForm={props.saveForm}/>
  );
}

export class BoatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._onChange = this._onChange.bind(this);
    this._validate = this._validate.bind(this);
  }
  _onChange(e) {

  }

  _validate(e) {
    // You can add validation logic here
    this.props.next();
  }

  render() {
    let options = [
      {
        text: 'Yes',
        value: 'Yes'
      },
      {
        text: 'No',
        value: 'No'
      },
      {
        text: "Don't Know",
        value: "Don't Know"
      }
    ];

    return(
      <Form>
        <h2>Boat History</h2>
        <Form.Field>
          <label>Has your boat been involved with piracy in the past 12 months?</label>
          <Form.Dropdown placeholder='Select Answer' options={options} />
        </Form.Field>
        <Grid>
          <Grid.Column floated='left' width={5}>
            <Button secondary onClick={() => this.props.back()}>Back</Button>
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Button primary onClick={this._validate}>Next</Button>
          </Grid.Column>
        </Grid>
      </Form>
    );
  }
}

export class Confirm extends React.Component {
  render() {
    /*
     * Here is our final step. In the real world, we would
     * obviously do something more complicated than a javascript
     * alert
     */
    return(
      <Grid>
        <Grid.Row>
          <p>Your Vehicles:</p>
          <List>
            {this.props.vehicles.map((i) => {
              return(
                <List.Item>
                  <List.Icon name={i.type === 'Boat' ? 'ship' : 'car' } />
                  <List.Content>{i.year} {i.make} {i.model}</List.Content>
                </List.Item>
              );
            })}
          </List>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column floated='left' width={5}>
            <Button onClick={() => this.props.next()}>Add Another</Button>
          </Grid.Column>
          <Grid.Column floated='right' width={5}>
            <Button primary onClick={() => alert('Finished!')}>Get quote</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
    
export const steps = [
    new Intro({}),
    new InputKidInfo({}),
    new ShowKidCollegeYear({}),
    new BaseForm({})
];


