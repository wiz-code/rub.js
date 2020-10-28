interface Dataset {
  [index: string]: StateMachine.StateMachineConfig;
}

const dataset: Dataset = {
  pointer: {
    initial: 'created',
    events: [
      { name: 'initialize', from: 'created', to: 'idling' },
      { name: 'start', from: 'idling', to: 'running' },
      { name: 'end', from: 'running', to: 'idling' },
    ],
  },

  target: {
    initial: 'created',
    events: [
      { name: 'initialize', from: 'created', to: 'inactive' },
      { name: 'activate', from: 'inactive', to: 'active' },
      { name: 'inactivate', from: 'active', to: 'inactive' },
    ],
  },

  media: {
    initial: 'created',
    events: [
      { name: 'initialize', from: 'created', to: 'initialized' },
      { name: 'ready', from: 'initialized', to: 'idling' },
      { name: 'reset', from: ['idling', 'error'], to: 'initialized' },
      { name: 'start', from: 'idling', to: 'running' },
      { name: 'stop', from: 'running', to: 'idling' },
      { name: 'pause', from: 'running', to: 'pending' },
      { name: 'resume', from: 'pending', to: 'running' },
      { name: 'quit', from: 'pending', to: 'idling' },
      { name: 'abort', from: '*', to: 'error' },
    ],
  },
};

export default dataset;
