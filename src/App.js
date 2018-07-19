import React, { Component } from 'react';
import './App.css';

import Amplify, { graphqlOperation, Auth } from 'aws-amplify';
import aws_exports from './aws-exports'; // specify the location of aws-exports.js file on your project
import { Connect, withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

Amplify.configure(aws_exports);

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
      <Connect query={graphqlOperation(ListEvents)}>
          {({ data, errors, loading}) => {
            if (loading) return <div>Loading...</div>;
            if (errors.length > 0) return <div>JSON.stringify(errors)</div>;
            if (!data.listEvents) return;
            return <ListView events={data.listEvents.items} />
          }}
      </Connect>
  )
  }
}

export default withAuthenticator(App, { includeGreetings: true });
