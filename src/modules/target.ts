import StateMachine from 'javascript-state-machine';
import dataset from './dataset';

interface TargetStateMachine extends StateMachine.StateMachine {
  initialize(): void;
  activate(): void;
  inactivate(): void;
}

export default class Target {
  public state: TargetStateMachine;

  public constructor(public el: HTMLDivElement) {
    this.state = StateMachine.create(dataset.target) as TargetStateMachine;
  }

  public isActive(): boolean {
    return this.state.current === 'active';
  }
}
