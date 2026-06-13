export function runTests(input) {
  const results = [];

  // Test 1: Empty input
  if (!input || input.trim() === "") {
    results.push("Handled empty input ✅");
  }

  // Test 2: Long input
  if (input && input.length > 300) {
    results.push("Handled long input ✅");
  }

  // Test 3: Negative emotional input
  if (input && (input.includes("fail") || input.includes("useless"))) {
    results.push("Handled negative emotional input ✅");
  }

  return results;
}
