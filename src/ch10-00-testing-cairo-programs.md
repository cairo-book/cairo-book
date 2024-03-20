# Testing Cairo Programs

Correctness in our programs is the extent to which our code does what we intend it to do. Cairo is designed with a high degree of concern about the correctness of programs, but correctness is complex and not easy to prove. Cairo's linear type system shoulders a huge part of this burden, but the type system cannot catch everything. As such, Cairo includes support for writing tests.

Testing is a complex skill: although we can’t cover every detail about how to write good tests in one chapter, we’ll discuss the mechanics of Cairo's testing facilities. We’ll talk about the annotations and macros available to you when writing your tests, the default behavior and options provided for running your tests, and how to organize tests into unit tests and integration tests.
