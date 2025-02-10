# Memory

Memory in Cairo stores traces during program execution and each occupied memory space is divided into segments depending on the purpose of the new entry.

Cairo's memory is designed to provide efficient memory access in AIR for converting operations into a sequence of mathematical equations aka AIR constraints for proof verification.

As a result, Cairo's memory model is different from random access read-write memory model that is widely used in modern high level programming languages.

In this chapter, we will dive deep into Cairo's unique memory model and understand its behavior during program execution.