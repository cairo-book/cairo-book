# Bringing Paths into Scope with the `use` Keyword

Writing out paths to call functions can be repetitive and inconvenient. We can create a shortcut to a path with the `use` keyword.


## Full Paths and Shortcuts to Paths
Using the `use` keyword, we can create shortcuts for paths, which can be used throughout the scope. To illustrate this, let's continue with the restaurant example:

<span class="filename">Filename: src/lib.cairo</span>
```rs
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

use front_of_house::hosting;

fn eat_at_restaurant() {
    hosting::add_to_waitlist(); // ✅ Shorter path
}
```

By adding `use front_of_house::hosting` in the crate root, `hosting` is now a valid name in that scope, as if the `hosting` module had been defined in the crate root.

## Idiomatic Paths
While it's possible to bring a function directly into scope with `use`, it is considered more idiomatic to bring the function's parent module into scope instead. This makes it clear that the function is not locally defined while still minimizing the repetition of the full path.

For `Structs`, `Enums`, `Traits` and `Implementations`, it's idiomatic to specify the full path when using the `use` keyword.


## Re-exporting Names in Module Files
Re-exporting is the technique of bringing an item into scope and making it available for others to bring into their scope. You can achieve this using the `use` keyword.

For example, let's re-export the `add_to_waitlist` function in the restaurant example:

<span class="filename">Filename: src/lib.cairo</span>
```rs
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

use front_of_house::hosting::add_to_waitlist;

fn eat_at_restaurant() {
    add_to_waitlist(); // ✅ Re-exported name
}
```

With this change, external code can now use the path `restaurant::add_to_waitlist()` instead of `restaurant::front_of_house::hosting::add_to_waitlist()`.

Re-exporting is useful when the internal structure of your code differs from how programmers calling your code would think about the domain. This allows you to write your code with one structure, but expose a different structure, making your library well-organized for both programmers working on the library and programmers calling the library.

## Using External Packages in Cairo with Scarb
You might need to use external packages to leverage the functionality provided by the community. To use an external package in your project with Scarb, follow these steps:

> The dependencies system is still a work in progress. You can check the official [documentation](https://docs.swmansion.com/scarb/docs/guides/dependencies).
