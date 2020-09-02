#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

/*** Input ***/

const [,, packageName] = process.argv;

if (!packageName) {
  throw new Error('Missing package name arg');
}

/*** Main ***/

const
  REPO_NAME = '@libj',
  DIST_NAME = 'dist';

const P = {
  root(...parts) { return path.join(__dirname, '/../', ...parts); },
  package(name, ...parts) { return this.root('packages', name, ...parts); },
  packageSrc(name, ...parts) { return this.root(name, 'src', ...parts); },
  packageJson(name) { return this.package(name, 'package.json'); },
  packageDist(name, ...parts) { return this.package(name, DIST_NAME, ...parts); },
};

const main = () => {
  const package = new Package(packageName);

  if (package.hasNoDist) {
    warn(`Nothing to repack for package '${package.name}'. Exit now.`);
    return;
  } else if (package.distIsFlat) {
    info(`Package '${package.name}' is flat. Exit now.`);
    return;
  }

  info(`Repacking package: ${package.name}`);

  package.distModules.forEach(m => {
    m.externalDependencies.forEach(d => {
      m.replaceDependency(d);
      package.addDependency(d);
    });
  });

  package.flush();
};

main();

/*** Lib ***/

function Package(name) {
  /*** Constructor ***/

  const TMP_NAME = '.tmp';

  const
    distPath = P.packageDist(name),
    distNestedPath = path.join(distPath, name),
    distNestedSrcPath = path.join(distNestedPath, 'src'),
    distTempPath = path.join(distPath, TMP_NAME),
    distFiles = glob.sync(path.join(distNestedSrcPath, '**/*.js')),
    jsonPath = P.packageJson(name),
    json = require(jsonPath);
  
  /*** Public ***/
  
  this.name = name;
  
  this.hasNoDist = !fs.existsSync(distPath);
  
  this.distIsFlat = !fs.existsSync(distNestedPath);

  this.distModules = distFiles.map(f => new Module(f, distNestedPath));
  
  this.addDependency = d => {
    if (!json.dependencies) {
      json.dependencies = {};
    }

    const dJson = d.packageJson;
    if (!dJson.version) {
      throw new Error(`Missing version in package: ${dJson.name}`);
    }

    json.dependencies[d.npmPath] = dJson.version;
  };
  
  this.flush = () => {
    // Write package json
    fs.writeJsonSync(jsonPath, json, { spaces: 2 });

    // Write and move dependencies out
    this.distModules.forEach(m => {
      m.flush();
    });

    // Copy dist modules to temp
    fs.copySync(distNestedSrcPath, distTempPath);

    // Drop nested structure
    const oldPaths = glob.sync(path.join(distPath, `!(${TMP_NAME})`));
    oldPaths.forEach(p => {
      fs.removeSync(p);
    });

    // Unpack from temp
    fs.copySync(distTempPath, distPath);
    fs.removeSync(distTempPath);
  };

  /*** Private ***/
}

function Module(file, basePath) {
  /*** Constructor ***/

  let content = fs.readFileSync(file).toString();

  const
    imports = Array.from(content.matchAll(/require\(\s*(['"])(.*?)\1\)/g), m => m[2]),
    dependencies = imports.map(importPath => new Dependency({ contextPath: file, importPath, basePath }));
  
  /*** Public ***/
  
  this.file = file;
  this.externalDependencies = dependencies.filter(d => d.isExternal);
  
  this.replaceDependency = d => {
    content = content.replace(
      new RegExp(`require\\(\\s*([\'"])${d.importPath}\\1\\)`),
      `require($1${d.npmPath}$1)`,
    );
  };
  
  this.flush = () => {
    fs.writeFileSync(file, content);
  };
  
  /*** Private ***/
}

function Dependency({ contextPath, importPath, basePath }) {
  /*** Constructor ***/

  const
    ext = importPath.indexOf('.js') === -1 ? '.js' : '',
    absolutePath = path.resolve(path.dirname(contextPath), `${importPath}${ext}`),
    packageName = absolutePath.split(`${DIST_NAME}${path.sep}`)[1].split(path.sep)[0];
  
  let packageJson;
  
  /*** Public ***/

  this.isExternal = absolutePath.indexOf(basePath) === -1;
  this.importPath = importPath;
  this.npmPath = path.join(REPO_NAME, packageName);
  
  Object.defineProperty(this, 'packageJson', {
    get() {
      if (packageJson) {
        return packageJson;
      }

      const packageJsonFile = P.packageJson(packageName);
      if (!fs.existsSync(packageJsonFile)) {
        throw new Error(`Missing package.json for dependency: ${absolutePath}`);
      }

      return (packageJson = require(packageJsonFile));
    }
  });
}

function msg(level, msg, ...args) {
  const message = `[repack] ${level}: ${msg}`;
  console[level](message, ...args);
}

function info(message, ...args) {
  msg('info', message, ...args);
}

function warn(message, ...args) {
  msg('warn', message, ...args);
}
