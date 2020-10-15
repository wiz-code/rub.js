import { StateMachine } from 'javascript-state-machine';
import dataset from './dataset';
import * as IRub from './interface';

export default class Target implements IRub.TargetInterface {
  public state: IRub.TargetStateMachine;

  public constructor(public el: HTMLDivElement) {
    this.state = StateMachine.create(dataset.target) as IRub.TargetStateMachine;
  }

  public isActive(): boolean {
    return this.state.current === 'active';
  }
}
