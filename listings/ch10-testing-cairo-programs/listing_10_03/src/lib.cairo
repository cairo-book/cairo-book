// ANCHOR: trait_impl
#[derive(Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

trait RectangleTrait {
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool;
}

impl RectangleImpl of RectangleTrait {
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool {
        *self.width > *other.width && *self.height > *other.height
    }
}
// ANCHOR_END: trait_impl

// ANCHOR: test1
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn larger_can_hold_smaller() {
        let larger = Rectangle { height: 7, width: 8 };
        let smaller = Rectangle { height: 1, width: 5 };

        assert!(larger.can_hold(@smaller), "rectangle cannot hold");
    }
}
//ANCHOR_END: test1
#[cfg(test)]
mod tests2 {
    use super::*;

    // ANCHOR: test2
    #[test]
    fn smaller_cannot_hold_larger() {
        let larger = Rectangle { height: 7, width: 8 };
        let smaller = Rectangle { height: 1, width: 5 };

        assert!(!smaller.can_hold(@larger), "rectangle cannot hold");
    }
    // ANCHOR_END: test2
}
