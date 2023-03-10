import addNumbers  from "../sum";
test('adds 1 + 2 to equal 3', () => {
    expect(addNumbers(1, 2)).toBe(3);
  });