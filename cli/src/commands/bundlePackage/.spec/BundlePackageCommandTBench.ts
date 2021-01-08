import { CliTBench } from '../../../../../packages/cli/.spec/CliTBench';
import { mockBundlePackageCommandPackage } from './bundlePackageCommandMockPackage';
import * as path from "path";

export class BundlePackageCommandTBench extends CliTBench {
  constructor() {
    super();

    this.mock.package = mockBundlePackageCommandPackage(this.mock);
    this.mock.CliPath.root.callsFake((...args) => path.join('/', ...args));
  }
}
