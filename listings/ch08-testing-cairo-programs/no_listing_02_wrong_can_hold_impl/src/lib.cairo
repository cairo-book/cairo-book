//TAG: tests_fail
use debug::PrintTrait;
#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

// ANCHOR: trait_impl
trait RectangleTrait {
    fn area(self: @Rectangle) -> u64;
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool;
}

// ANCHOR: wrong_impl
impl RectangleImpl of RectangleTrait {
    fn area(self: @Rectangle) -> u64 {
        *self.width * *self.height
    }

    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool {
        *self.width < *other.width && *self.height > *other.height
    }
}
//ANCHOR_END: wrong_impl
// ANCHOR_END: trait_impl

// ANCHOR: test
#[cfg(test)]
mod tests {
    use super::Rectangle;
    use super::RectangleTrait;


    // ANCHOR: test1
    #[test]
    fn larger_can_hold_smaller() {
        let larger = Rectangle { height: 7, width: 8, };
        let smaller = Rectangle { height: 1, width: 5, };

        assert(larger.can_hold(@smaller), 'rectangle cannot hold');
    }
    //ANCHOR_END: test1

    // ANCHOR: test2
    #[test]
    fn smaller_cannot_hold_larger() {
        let larger = Rectangle { height: 7, width: 8, };
        let smaller = Rectangle { height: 1, width: 5, };

        assert(!smaller.can_hold(@larger), 'rectangle cannot hold');
    }
// ANCHOR_END: test2
}
// ANCHOR_END: test


