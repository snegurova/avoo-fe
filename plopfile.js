module.exports = function (plop) {
  // Mobile Component Generator
  plop.setGenerator('mobile', {
    description: 'Create a React Native component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: ['screens', 'shared', 'components'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'apps/mobile/src/{{type}}/{{name}}.tsx',
        templateFile: 'plop-templates/mobile/component.tsx.hbs',
      },
    ],
  });

  // Web Component Generator
  plop.setGenerator('web', {
    description: 'Create a React component for web',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: ['components', 'shared'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'apps/web/app/_components/{{name}}/{{name}}.tsx',
        templateFile: 'plop-templates/web/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'apps/web/app/_components/{{name}}/index.ts',
        templateFile: 'plop-templates/web/index.ts.hbs',
      },
    ],
  });
};
