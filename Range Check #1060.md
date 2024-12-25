### **Range Check #1060**

The **Range Check Builtin** in Cairo is a very important feature that keeps the numbers, so-called field elements or felts, within a certain range, usually from 0 to 2¹²⁸. This is essential for maintaining data accuracy and avoiding errors during calculations.

**Purpose**

The main purpose of the Range Check Builtin is to ensure that numbers stay within a specified range. This is crucial when dealing with large numbers or performing operations that require certain limits to guarantee accurate results. By using this builtin, developers can prevent errors caused by numbers exceeding their limits and ensure that calculations remain within expected boundaries.

**Structure and Operation**

The Range Check Builtin occupies a special area of the Cairo Virtual Machine (VM) called a memory segment dedicated to builtins. This setup allows for more efficient operations. When a value is placed into this segment, the builtin performs two checks:

1. **Lower Bound Check**: Ensures that the value is not less than 0.
2. **Upper Bound Check**: Checks if the value is less than 2¹²⁸.

Only if the value passes both checks will it be accepted. If not, the Cairo VM will generate an error, indicating that the value is outside the allowed range.

The following image illustrates how the Range Check Builtin validates values within the memory segment of the Cairo VM:
![Range Check (#1060)](https://github.com/user-attachments/assets/6cadb079-e1dd-47b5-83d0-d61b4f84398d)

**Interaction with Cairo Memory**

In Cairo, memory is divided into segments, each designated for specific purposes. The Range Check Builtin uses a segment reserved for builtins, ensuring that range-checking operations are efficient. When a value is written to this segment, the builtin checks it and updates the memory as necessary. This process guarantees that any future operations on the value can proceed with confidence that it meets the specified range requirements.

**Example Usage**

To use the Range Check Builtin in Cairo, you can write a value to the builtin's memory segment like this:

_**Suppose 'range_check_ptr' is a pointer to the Range Check Builtin's memory segment:**

```cairo
range_check_ptr[0] = value;
```

In this example, `value` is the number you want to validate. The builtin will automatically check to ensure that `value` is within the specified range._

**Conclusion**

The Range Check Builtin in Cairo is an essential tool for developers, offering an easy and efficient way to ensure that numbers stay within a specified range. By utilizing this builtin, developers can enhance the reliability and accuracy of their Cairo programs, ensuring that calculations remain within expected limits and preventing potential errors caused by numbers exceeding their bounds.
