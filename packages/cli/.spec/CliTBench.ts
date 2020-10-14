import * as sinonLib from 'sinon';
import { Command } from 'commander';
import { ModuleMock } from '../../tbench/src/ModuleMock';
import * as ExecFileSyncModule from '../../node/src/execFileSync';
import { CliPath } from '../../../cli/src/CliPath';

export class CliTBench {
  public readonly sinon: sinonLib.SinonSandbox;

  public readonly mock;
  public readonly action;

  constructor() {
    this.sinon = sinonLib.createSandbox();

    this.mock = {
      childProcess: ModuleMock('child_process', this.sinon),
      execFileSync: ModuleMock(ExecFileSyncModule, this.sinon).execFileSync,
      fs: ModuleMock('fs-extra', this.sinon),
      glob: ModuleMock('glob', this.sinon),
      CliPath: ModuleMock(CliPath, this.sinon),
    };

    this.action = {
      run(command: Command, args: string[] = []) {
        const cli = new Command();
        cli.addCommand(command);
        cli.parse([null, null, command.name(), ...args]);
      },
    };
  }

  reset() { this.sinon.restore(); }
}
