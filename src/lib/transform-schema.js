import { get } from 'object-path';
import combineReducers from './combine-reducers';
import combineSelectors from './combine-selectors';

const REDUCER_KEY = 'reducer';
const SELECTOR_KEY = 'selector';

/**
 * [transformSchema description]
 * @param  {[type]} schema [description]
 * @return {[type]}        [description]
 */
export default function transformSchema (schema) {
  const domains = Object.keys(schema);

  // Check domains, ensuring they have a reducer and a selector
  domains.forEach(key => {
    if (!get(schema, [key, REDUCER_KEY]) || !get(schema, [key, SELECTOR_KEY])) {
      throw new Error(
        `transformSchema: Each domain should have a reducer and a selector please check the domain [${key}]`
      );
    }
  })

  // Collect selectors from schema
  const selectors = domains.reduce((selectors, domain)) => [
    ...selectors
    {
      domain,
      func: get(schema, [domain, SELECTOR_KEY])
    }
  ], []);

  // Collect Reducers from schema
  const reducers = domains.reduce((reducers, domain) => [
    ...reducers
    {
      domain,
      func: get(schema, [domain, REDUCER_KEY])
    }
  ], []);

  return [combineSelectors(selectors), combineReducers(reducers)];
}
