/**
 * Takes an array of selectors and returns a rootSelector function
 * @param  {Array} selectors contains domain selector objects {domain: <string>, func: <function>}
 * @return {function} rootSelector
 */
export default function combineSelectors (selectors) {
  /**
   * Given current state return a selection of that state
   * @param  {Object} state current state
   * @return {Object} selected state
   */
  return function rootSelector (state) {
    return selectors.reduce(
      (selectedState, domainSelector) => ({
        ...selectedState,
        [domainSelector.domain]: domainSelector.func(
          state[domainSelector.domain]
        )
      }),
      state
    );
  };
}
