import * as sinonLib from 'sinon';
import { Command } from 'commander';
import { ModuleMock } from '../../mock/src/ModuleMock';

export class CliTBench {
  public sinon: sinonLib.SinonSandbox;

  public mock;
  public action;

  constructor() {
    this.sinon = sinonLib.createSandbox();
    this.mock = {
      childProcess: ModuleMock('child_process', this.sinon),
    };
    this.action = {
      run(command: Command, args: string[]) {
        const cli = new Command();
        cli.addCommand(command);
        cli.parse([null, null, ...args]);
      },
    };
  }
  
  restore() { this.sinon.restore(); }
}
