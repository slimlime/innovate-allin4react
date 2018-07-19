import React, { Component } from 'react';
import './App.css';

import Amplify, { API, graphqlOperation, Auth } from 'aws-amplify';
import aws_exports from './aws-exports'; // specify the location of aws-exports.js file on your project
import { Connect, withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

Amplify.configure(aws_exports);

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      where: "", 
      when: ""
    }
  }

  handleChange = (event) => {
    let update = {};
    update[event.target.name] = event.target.value;
    this.setState(update);
  }

  addEvent = async () => {
    const CreateEvent = `mutation CreateEvent($name: String!, $when: String!, $where: String!, $description: String!) {
      createEvent(name: $name, when: $when, where: $where, description: $description) {
        id
        name
        where
        when
        description
      }
    }`;
    
    const newEvent = await API.graphql(graphqlOperation(CreateEvent, this.state));
    console.log("Event created", newEvent);
    this.setState({name: "", description: "", where: "", when: ""});
  }

  render = () => {
    return (
      <div>
        <input type="text" name="name" placeholder="Name" onChange={this.handleChange} />
        <input type="text" name="description" placeholder="Description" onChange={this.handleChange} />
        <input type="text" name="where" placeholder="Where" onChange={this.handleChange} />
        <input type="text" name="when" placeholder="When" onChange={this.handleChange} />
        <button onClick={this.addEvent}>Add Event</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    const ListView = ({ events }) => (
      <div>
          <h3>All events</h3>
          <ul>
              {events.map(event => <li key={event.id}>{event.name} ({event.id})</li>)}
          </ul>
      </div>
  );

  const ListEvents = `query ListEvents {
      listEvents {
          items {
            id
            name
            description
          }
      }
  }`;

  return (
      <div>
        <EventForm />

        <Connect query={graphqlOperation(ListEvents)}>
            {({ data, errors, loading}) => {
              if (loading) return <div>Loading...</div>;
              if (errors.length > 0) return <div>JSON.stringify(errors)</div>;
              if (!data.listEvents) return;
              return <ListView events={data.listEvents.items} />
            }}
        </Connect>
      </div>
  )
  }
}

export default withAuthenticator(App, { includeGreetings: true });
