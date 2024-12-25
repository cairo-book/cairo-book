# Range Check Builtin
A specialized tool for confirming that numerical values fall inside predetermined ranges is Cairo's built-in Range Check. It guarantees that a value falls inside a certain range, like [0, 2^128) or more stringent constraints, such [0, 2^96], and is also a valid field element (feeling). By delegating range validations to this builtin, Cairo allows for efficient proof creation while also ensuring calculation accuracy without introducing overhead to the application logic. It is a crucial part of Cairo programs' constraint enforcement.
For example, the Range Check builtin only accepts felts and verify that such a felt is within the range [0, 2**128). A program can write a value to the Range Check builtin only if those two constraints hold. Those two constraints represent the validation property of the Range Check builtin.
![range-check-validation-property](https://github.com/user-attachments/assets/aedb56c1-26ec-4d4d-a688-06bf160a2e7c)
Diagram of the Cairo VM memory using the Range Check builtin

Range checking in Cairo works similarly to a queue, a data structure used for number validation. Here's how it works:

Numbers that need to be validated are stored in the queue. All figures are compared to a threshold limit (2^128 - 1). If a number goes over the predetermined limit, it will be rejected but if it does not and stays in the limit that was set, then it will pass through.

```cairo
fn validate_range(value: felt252) -> bool {
    match value.try_into() {
        Option::Some(_): u128 => true,
        Option::None => false
    }
}

// Example usage
let is_valid = validate_range(123);
assert!(is_valid, 'Value out of range');
```

This entire operation takes place in the Range Check Segment, which acts similar to a specialized validation section of memory. Only valid numbers are used in your software because they pass through this part automatically.

![Range Check (#1060)](https://github.com/user-attachments/assets/6cadb079-e1dd-47b5-83d0-d61b4f84398d)

 In the Cairo VM, the Range Check Segment itself seeks for numerical values as depicted in or the flowchart diagram above.  There are three values depicted: 0x000000000000  (valid, zero), 0xFFFFFFFFFFFF (valid, highest value) and 0x1FFFFFFFFFFFF  (invalid, greater than highest value).  If the value falls outside this range, then it is  considered as an invalid value while any value that falls within the range [0,  2^128-1] is considered of to be valid. 



