import assembleKeyValuePairs from './assemble-key-value-pairs';

const transformDependencyIndex = (
  inputIndex = {},
  transformation = value => Promise.resolve(value)
) =>
  Promise.all(
    Reflect.ownKeys(inputIndex).map(dependencyName => {
      const inputDependency = inputIndex[dependencyName];
      if (Array.isArray(inputDependency)) {
        return Promise.all(
          inputDependency.map(value => transformation(value))
        ).then(transformedValues => [dependencyName, transformedValues]);
      }
      return Promise.all(
        Reflect.ownKeys(inputDependency).map(key =>
          transformation(inputDependency[key]).then(transformedValue => [
            key,
            transformedValue,
          ])
        )
      ).then(transformedKeyValuePairs => [
        dependencyName,
        assembleKeyValuePairs(transformedKeyValuePairs),
      ]);
    })
  ).then(results => assembleKeyValuePairs(results));

export default transformDependencyIndex;
