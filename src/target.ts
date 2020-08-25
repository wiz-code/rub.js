import { StateMachine } from 'javascript-state-machine';
import { TargetInterface, TargetStateMachine } from './interface.ts';
import dataset from './dataset.ts';

export default class Target implements TargetInterface {
  public state: TargetStateMachine;

  public constructor(public el: HTMLDivElement) {
    this.state = StateMachine.create(dataset.target) as TargetStateMachine;
  }

  public isActive(): boolean {
    return this.state.current === 'active';
  }
}
