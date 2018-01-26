const updateOccurrence = (hash: any, value: number) => {
    // probably quicker to cache, but would be inconsistent
    if (hash[value] === undefined) {
      hash[value] = 1;
    } else {
      hash[value]++;
    }
    
    return hash[value];
  };

export const findModeHash = (numbers: number[]) => {
    
    var hash = {};
    var greatestOccurrence = 0;
    var mode = undefined; // done to be explicit
    for (var i = 0; i < numbers.length; i++) {
      var value = numbers[i];
      var occurrence = updateOccurrence(hash, value);
      if (greatestOccurrence < occurrence) {
        greatestOccurrence = occurrence;
        mode = value;
      }
    }
    
    return mode;
  }
  