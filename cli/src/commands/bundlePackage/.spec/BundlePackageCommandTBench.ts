import { CliTBench } from '../../../../../packages/cli/.spec/CliTBench';
import { mockBundlePackageCommandPackage } from './bundlePackageCommandMockPackage';

export class BundlePackageCommandTBench extends CliTBench {
  constructor() {
    super();

    this.mock.package = mockBundlePackageCommandPackage(this.mock);
  }
}
