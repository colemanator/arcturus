import combineReducers from './combine-reducers';
import combineSelectors from './combine-selectors';
import { has } from 'object-path';

const REDUCER_KEY = 'reducer';
const SELECTOR_KEY = 'selector';

/**
 * Transform a domain object
 * @param  {[type]} domains [description]
 * @return {[type]}        [description]
 */
export default function transformDomains (domains) {
  const domainKeys = Object.keys(domains);

  // Check domains, ensuring they have a reducer and a selector
  domainKeys.forEach(key => {
    if (
      !has(domains, [key, REDUCER_KEY]) ||
      !has(domains, [key, SELECTOR_KEY])
    ) {
      throw new Error(
        `transformDomains: Each domain should have a reducer and a selector please check the domain [${key}]`
      );
    }
  });

  // Collect selectors from domains
  const selectors = domainKeys.reduce(
    (selectors, domain) => [
      ...selectors,
      {
        domain,
        func: domains[domain][SELECTOR_KEY]
      }
    ],
    []
  );

  // Collect Reducers from domains
  const reducers = domainKeys.reduce(
    (reducers, domain) => [
      ...reducers,
      {
        domain,
        func: domains[domain][REDUCER_KEY]
      }
    ],
    []
  );

  return [combineReducers(reducers), combineSelectors(selectors)];
}
