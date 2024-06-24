// euclidean.js

// Function to generate Euclidean rhythm
export const generator = (n, b) => {
    if (n < b) {
      return [0]; // Handle edge case where more beats than size
    }
  
    let front = Array.from({ length: b }, () => 1); // Array of `b` elements filled with 1
    let back = Array.from({ length: n - b }, () => 0); // Array of `n - b` elements filled with 0
  
    if (b === 0) {
      return [0]; // Handle edge case where no beats
    }
  
    front = euclidRecursive(front, back).flat(20);
  
    function euclidRecursive(front, back) {
      if (back.length < 1) {
        return [...front, ...back];
      }
  
      let newArray = [];
  
      while (front.length > 0 && back.length > 0) {
        newArray.push([front.pop(), back.pop()]);
      }
      return euclidRecursive(newArray, [...front, ...back]);
    }
  
    return front; // Return the final computed array
  };
  
  // Rotate Array for Necklace
  export const rotatearray = (array, steps) => {
    const n = array.length;
    const k = steps % n;
    let start = 0;
    let count = 0;
  
    while (count < n) {
      let current = start;
      let prev = array[start];
  
      do {
        const nextIdx = (current + k) % n;
        [array[nextIdx], prev] = [prev, array[nextIdx]];
        current = nextIdx;
        count += 1;
      } while (start !== current);
  
      start += 1;
    }
  
    return array.slice(); // Return a new array to trigger state update
  };
  