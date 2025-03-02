function arraysEqual(array1, array2) {
  if (array1.length !== array2.length) return false;
  const set1 = new Set(array1.map(JSON.stringify));
  const set2 = new Set(array2.map(JSON.stringify));
  for (let element of set1) {
    if (!set2.has(element)) return false;
  }
  return true;
}

const getDifferentElementsFromArrays = (arr1, arr2) => {
  // Retrieve elements from arr1 that are not present in arr2
  const diff1 = arr1.filter((item) => !arr2.includes(item));

  // Retrieve elements from arr2 that are not present in arr1
  const diff2 = arr2.filter((item) => !arr1.includes(item));

  // Combine the results of both diff1 and diff2 arrays
  const diff = diff1.concat(diff2);

  return diff;
};

module.exports = { arraysEqual, getDifferentElementsFromArrays };
