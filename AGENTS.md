# Initialize new package

Look to `./.package-init` for templates during new package initialization.

Then perform the following steps:
1. Read package name from the prompt

2. Create new package directory
  - under `./packages/{name}`
  - where `{name}` is package name from the prompt

3. Initialize new PNPM package
  - copy `package.json`
  - set name as `@libj/{name}`, where `{name}` is package name from prompt
  - prompt for
    - description
    - keywords
  - init PNPM

4. Initialize Typescript
  - Install `typescript` as dev dependency
  - copy `tsconfig.json` from the template

5. Initialize `index.ts`
  - create `src/index.ts` in the package
  - put some dummy code with `console.log("{name} package code here ...")`, where `{name}` is the package name

6. Initialize README
  - create `README.md` file within the package
  - put dummy content "Stay tuned for {name} package"
  - add reference to this package readme into `package.json` into `homepage` field

